import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";
import AppealService from "src/services/AppealService";
import ClientService from "src/services/ClientService";
import { useAuthStore } from "./authStore";
import { storeToRefs } from "pinia";
import { SessionStorage, Notify } from "quasar";
import dayjs from "dayjs";

const appendFormData = (formData, data, parentKey = "") => {
  for (const [key, value] of Object.entries(data)) {
    const newKey = parentKey ? `${parentKey}[${key}]` : key;

    if (typeof value === "object" && value !== null) {
      appendFormData(formData, value, newKey); // Рекурсивный вызов для вложенных объектов
    } else {
      formData.append(newKey, value);
    }
  }
};

const TYPE_OF_APPEALS = {
  NEW: 0,
  CHANGE: 1,
};

function filterItems(data, suggestedArr, selectedArr, isOther) {
  data.forEach((item) => {
    const checkCreated =
      item.pivot?.created_by_clinic ?? item.pivot?.created_by_drugstore;

    const createdByOther = checkCreated === 0;

    if (isOther) {
      if (createdByOther) {
        suggestedArr.push(item);
      } else {
        selectedArr.push(item);
      }
    } else {
      if (createdByOther) {
        selectedArr.push(item);
      } else {
        suggestedArr.push(item);
      }
    }
  });
}

export const useAppealStore = defineStore("appeal", () => {
  const todayDate = dayjs().format("DD-MM-YYYY");
  const authStore = useAuthStore();
  const { user } = storeToRefs(authStore);
  const isClinic = computed(() => user.value?.role.id === 8);
  const isDrugstore = computed(() => user.value?.role.id === 8);
  const isAgent = computed(() => user.value?.role.id !== 8); //temp

  const loading = ref(null);
  const successAppeal = ref(false);
  const client = ref(null);
  const typeOfAppeal = ref(0);
  const setSuccessAppeal = (flag) => {
    successAppeal.value = flag;
  };

  const setTypeOfAppeal = (type) => {
    typeOfAppeal.value = TYPE_OF_APPEALS[type];
  };

  const setClient = (item) => {
    client.value = item;
    SessionStorage.set("client", item);
  };

  const diagnosis = ref("");
  const appealDate = ref(todayDate);
  const medicalProgram = ref(null);
  const medicalLimits = ref([]);

  const calculateLimits = computed(() => {
    return medicalLimits.value.map((limit) => {
      const allData = [
        ...selectedDoctors.value,
        ...suggestedDoctors.value,
        ...selectedServices.value,
        ...suggestedServices.value,
      ];

      const findItemsSumm = allData.reduce((acc, curr) => {
        if (curr.pivot.limit?.id === limit.id) {
          return acc + Number(curr.pivot.price) * curr.pivot.quantity;
        }
        return acc;
      }, 0);

      return {
        ...limit,
        spent: limit.spent + findItemsSumm,
      };
    });
  });

  const setDiagnosis = (value) => {
    diagnosis.value = value;
  };

  const setAppealDate = (value) => {
    appealDate.value = value;
  };
  const clinics = ref([]);
  const selectedClinic = ref(null);

  const doctors = ref([]);
  const selectedDoctors = ref([]);
  const suggestedDoctors = ref([]);
  const allDoctorsStatus = computed(() =>
    selectedDoctors.value.concat(suggestedDoctors.value).map((doctor) => {
      return {
        id: doctor.id,
        status: doctor.pivot.status ?? 0,
        progress: doctor.pivot.progress ?? 0,
        quantity: doctor.pivot.quantity ?? 1,
        program_item_id: doctor.pivot.program_item_id ?? 0,
      };
    })
  );

  const services = ref([]);
  const selectedServices = ref([]);
  const suggestedServices = ref([]);
  const allServicesStatus = computed(() =>
    selectedServices.value.concat(suggestedServices.value).map((service) => {
      return {
        id: service.id,
        status: service.pivot.status ?? 0,
        progress: service.pivot.progress ?? 0,
        quantity: service.pivot.quantity ?? 1,
        program_item_id: service.pivot.program_item_id ?? 0,
      };
    })
  );

  const drugAppealImage = ref({});
  const drugs = ref([]);
  const selectedDrugs = ref([]);
  const suggestedDrugs = ref([]);

  const drugstores = ref([]);
  const selectedDrugstore = ref(null);

  const allDrugsStatus = computed(() =>
    selectedDrugs.value.concat(suggestedDrugs.value).map((drug) => {
      return {
        id: drug.id,
        name: drug.name,
        price: drug.pivot.price,
        quantity: drug.quantity ?? drug.pivot.quantity,
        status: drug.pivot.status ?? 0,
        progress: drug.pivot.progress ?? 0,
      };
    })
  );

  const appealTotalConsumption = computed(() => {
    const allData = [
      ...selectedDoctors.value,
      ...suggestedDoctors.value,
      ...selectedServices.value,
      ...suggestedServices.value,
    ];

    return allData.reduce((acc, curr) => {
      if (curr.pivot.status === 1) {
        return acc + Number(curr.pivot.price) * Number(curr.pivot.quantity);
      }
      return acc;
    }, 0);
  });

  const appealTotalDrugConsumption = computed(() => {
    const allData = [...selectedDrugs.value, ...suggestedDrugs.value];

    return allData.reduce((acc, curr) => {
      if (curr.pivot.status === 1) {
        return acc + Number(curr.pivot.price);
      }
      return acc;
    }, 0);
  });

  const setDrugAppealImage = (file) => {
    drugAppealImage.value = file;
  };
  const selectClinic = (clinic) => {
    selectedClinic.value = clinic;
    clearAppealData();
  };

  const setClinic = async () => {
    if (user.value.role.id === 8) {
      selectedClinic.value = user.value.hospital;
      await fetchHospitalData();
    }
  };

  const selectDrugstore = (drugstore) => {
    selectedDrugstore.value = drugstore;
  };
  //setDrugstore for drugstore account

  const checkSuggestedDoctors = (doctor) => {
    return suggestedDoctors.value.some((item) => doctor.id === item.id);
  };

  const cantRemoveFromSelectedDoctors = (doctor) => {
    return selectedDoctors.value.some((item) => {
      if (doctor.id === item.id) {
        return (
          (item.pivot.progress >= 1 && isAgent.value) ||
          (item.pivot.status !== 0 && !isAgent.value)
        );
      }
    });
  };

  //если статус не 0 и если это клиника => не даем удалить доктора в дропдауне
  //если прогресс >= 1 и если это агент => не даем удалить доктора в дропдауне и не даем отменить доктора

  //если прогресс 1 и если это агент => не даем удалить доктора в дропдауне и не даем отменить доктора
  const selectDoctors = (doctor) => {
    if (checkSuggestedDoctors(doctor)) {
      return;
    }
    if (cantRemoveFromSelectedDoctors(doctor)) {
      return;
    }

    const index = selectedDoctors.value.findIndex(
      (item) => item?.id === doctor.id
    );
    if (index > -1) {
      selectedDoctors.value.splice(index, 1);
    } else {
      selectedDoctors.value.push({
        ...doctor,
        pivot: {
          ...doctor.pivot,
          status: 0,
          progress: 0,
          quantity: 1,
          program_item_id: 0,
        },
        isNew: true,
      });
    }
  };

  const checkSuggestedServices = (service) => {
    return suggestedServices.value.some((item) => service.id === item.id);
  };

  // нельзя убрать выбранный сервис в дропдауне если прогресс больше 1 и это агент или если это клиника и статус не 0
  const cantRemoveFromSelectedServices = (service) => {
    return selectedServices.value.some((item) => {
      if (service.id === item.id) {
        return (
          (item.pivot.progress >= 1 && isAgent.value) ||
          (item.pivot.status !== 0 && !isAgent.value)
        );
      }
    });
  };

  const selectServices = (service) => {
    if (checkSuggestedServices(service)) {
      return;
    }
    if (cantRemoveFromSelectedServices(service)) {
      return;
    }

    const index = selectedServices.value.findIndex(
      (item) => item.id === service.id
    );
    if (index > -1) {
      selectedServices.value.splice(index, 1);
    } else {
      selectedServices.value.push({
        ...service,
        pivot: {
          ...service.pivot,
          status: 0,
          progress: 0,
          quantity: 1,
          program_item_id: 0,
        },
        isNew: true,
      });
    }
  };

  const selectDrugs = (drug) => {
    selectedDrugs.value.push({
      ...drug,
      pivot: {
        ...drug?.pivot,
        quantity: drug.quantity,
        price: drug.price,
        status: 0,
        progress: 0,
      },
      isNew: true,
    });
  };

  const removeDrug = (drug) => {
    selectedDrugs.value = selectedDrugs.value.filter(
      (item) => item.id !== drug.id
    );
  };
  const clearAppealData = () => {
    diagnosis.value = "";
    appealDate.value = todayDate;
    doctors.value = [];
    services.value = [];
    selectedDoctors.value = [];
    selectedServices.value = [];
    suggestedDoctors.value = [];
    suggestedServices.value = [];

    copyDoctors.value = [];
    copyServices.value = [];

    selectedDrugs.value = [];
    suggestedDrugs.value = [];
    drugAppealImage.value = {};

    hasWatched.value = false;

    // client.value = null;
  };
  const clearClinicData = () => {
    selectedClinic.value = null;
  };
  const clearDrugstoreData = () => {
    selectedDrugstore.value = null;
  };

  const fetchClinics = async () => {
    loading.value = true;
    try {
      const response = await AppealService.getClinics();
      clinics.value = response.data.data;
    } catch (e) {
      console.error(e);
    } finally {
      loading.value = false;
    }
  };

  const fetchDrugs = async (name) => {
    loading.value = true;
    try {
      const response = await AppealService.getDrugs(name);
      drugs.value = response.data.data;

      console.log(drugs.value);
    } catch (e) {
      console.error(e);
    } finally {
      loading.value = false;
    }
  };

  const fetchDrugstores = async () => {
    loading.value = true;
    try {
      const response = await AppealService.getDrugstores();
      drugstores.value = response.data.data;
    } catch (e) {
      console.error(e);
    } finally {
      loading.value = false;
    }
  };

  const fetchHospitalData = async () => {
    loading.value = true;
    try {
      const response = await AppealService.getHospitalDataById(
        selectedClinic.value.id
      );
      const data = response.data.data;
      doctors.value = data.doctors;
      services.value = data.med_services;
    } catch (e) {
      console.error(e);
    } finally {
      loading.value = false;
    }
  };
  const fetchDoctors = async () => {
    loading.value = true;
    try {
      const response = await AppealService.getDoctors(selectedClinic.value.id);
      doctors.value = response.data.data;
    } catch (e) {
      console.error(e);
    } finally {
      loading.value = false;
    }
  };
  const fetchServices = async () => {
    loading.value = true;
    try {
      const response = await AppealService.getServices(selectedClinic.value.id);
      services.value = response.data.data;
    } catch (e) {
      console.error(e);
    } finally {
      loading.value = false;
    }
  };

  const postAppealDrugData = async () => {
    loading.value = true;

    const formData = new FormData();

    const drugsData = selectedDrugs.value.map((drug) => {
      const { pivot, isNew, ...other } = drug;
      return other;
    });

    const payload = {
      contract_client_id: client.value.id,
      client_type: 0,
      client_id: client.value.clientId,
      is_hospital: false,
      drugstore_id: selectedDrugstore.value.id,
      drugs: drugsData,
    };

    appendFormData(formData, payload);

    if (drugAppealImage.value?.file) {
      formData.append("file", drugAppealImage.value.file);
    }

    try {
      const response = await AppealService.saveDrugAppeal(formData);
      const data = response.data.data;
      if (
        response.status === 200 &&
        response.data.message === "created successfully"
      ) {
        client.value.appealId = data.id;
        client.value.appealStatus = data.status;
        setSuccessAppeal(true);
        // clearAppealData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      loading.value = false;
    }
  };

  const changeAppealDrugData = async () => {
    loading.value = true;
    const formData = new FormData();

    const payload = {
      contract_client_id: client.value.id,
      client_id: client.value.clientId,
      drugstore_id: selectedDrugstore.value.id,
      drugs: allDrugsStatus.value,
    };

    // appendFormData(formData, payload);
    formData.append("drugs", JSON.stringify(payload.drugs));
    if (drugAppealImage.value?.file) {
      formData.append("file", drugAppealImage.value.file);
    }

    try {
      const response = await AppealService.changeAppealDrugData(
        client.value.appealId,
        formData
      );

      const data = response.data.data;

      if (response.status === 200 && response.data.message === "success") {
        setSuccessAppeal(true);
        client.value.appealStatus = data.status;
      }
    } catch (e) {
      console.error(e);
    } finally {
      loading.value = false;
    }
  };

  const postAppealData = async () => {
    loading.value = true;

    const services = selectedServices.value.map((service) => {
      return {
        quantity: service.pivot.quantity,
        status: service.pivot.status,
        progress: service.pivot.progress,
        id: service.id,
      };
    });
    const doctors = selectedDoctors.value.map((doctor) => {
      return {
        quantity: doctor.pivot.quantity,
        status: doctor.pivot.status,
        progress: doctor.pivot.progress,
        id: doctor.id,
      };
    });
    const payload = {
      hospital_id: selectedClinic.value.id,
      contract_client_id: client.value.id,
      client_type: 0,
      is_hospital: true,
      client_id: client.value.clientId,
      services,
      doctors,
      diagnosis: diagnosis.value,
      applied_date: appealDate.value,
      finished: finishedAppeal.value,
    };
    try {
      const response = await AppealService.saveAppealByAgent(payload);
      const data = response.data.data;
      console.log(data);
      if (
        response.status === 200 &&
        response.data.message === "created successfully"
      ) {
        client.value.appealId = data.id;
        client.value.appealStatus = data.status;
        SessionStorage.set("client", client.value);
        setSuccessAppeal(true);
        Notify.create({
          type: "success",
          message: "Обращение успешно создано!",
          position: "bottom-left",
        });
        // clearAppealData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      loading.value = false;
    }
  };

  const changeAppealData = async () => {
    loading.value = true;
    const payload = {
      hospital_id: selectedClinic.value.id,
      contract_client_id: client.value.id,
      client_type: 0,
      client_id: client.value.clientId,
      services: allServicesStatus.value,
      doctors: allDoctorsStatus.value,
      diagnosis: diagnosis.value,
      applied_date: appealDate.value,
    };

    try {
      const response = await AppealService.changeAppealData(
        client.value.appealId,
        payload
      );

      const data = response.data.data;

      if (response.status === 200 && response.data.message === "success") {
        setSuccessAppeal(true);
        client.value.appealStatus = data.status;
        SessionStorage.set("client", client.value);

        // clearAppealData();
        Notify.create({
          type: "success",
          message: "Обращение успешно изменено!",
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      loading.value = false;
    }
  };

  const fetchMedicalPrograms = async () => {
    loading.value = true;
    const localClient = SessionStorage.getItem("client");
    client.value = localClient;

    const currentClient = localClient ? localClient : client.value;
    try {
      const response = await ClientService.getMedicalPrograms(
        currentClient.contractClientId
      );
      const data = response.data;
      medicalLimits.value = data.data;

      medicalLimits.value = medicalLimits.value.map((limit) => {
        return {
          ...limit,
          spent: Number(limit.spent),
        };
      });

      loading.value = false;
      console.log(`MEDICAL PROGRAMS`, medicalLimits.value);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchApplicantData = async () => {
    setTypeOfAppeal("CHANGE");
    loading.value = true;
    const localClient = SessionStorage.getItem("client");
    client.value = localClient;

    const currentClient = localClient ? localClient : client.value;

    try {
      const response = await ClientService.getClientByAppealId(
        currentClient.appealId
      );
      const data = response.data.data;
      console.log(currentClient);
      console.log(data);
      // client.value.id = data.contract_client.id;
      // client.value.clientId = data.contract_client.client_id;
      // client.value.appealStatus = data.status;
      selectedClinic.value = data.hospital;
      diagnosis.value = data.diagnosis;

      const [ad1, ad2, ad3] = data.applied_date.split(" ")[0].split("-");
      appealDate.value = `${ad3}-${ad2}-${ad1}`;

      filterItems(
        data.doctors,
        suggestedDoctors.value,
        selectedDoctors.value,
        isClinic.value
      );

      filterItems(
        data.services,
        suggestedServices.value,
        selectedServices.value,
        isClinic.value
      );

      selectedDoctors.value = selectedDoctors.value.map((doctor) => {
        const medicalLimit = medicalLimits.value.find(
          (limit) => limit.id === doctor.pivot.program_item_id
        );
        const equalId = medicalLimit?.id === doctor.pivot.program_item_id;

        return {
          ...doctor,
          pivot: {
            ...doctor.pivot,
            limit: !equalId
              ? null
              : {
                  name: medicalLimit.name,
                  id: medicalLimit.id,
                },
          },
        };
      });

      selectedServices.value = selectedServices.value.map((service) => {
        const medicalLimit = medicalLimits.value.find(
          (limit) => limit.id === service.pivot.program_item_id
        );
        const equalId = medicalLimit?.id === service.pivot.program_item_id;

        return {
          ...service,
          pivot: {
            ...service.pivot,
            limit: !equalId
              ? null
              : {
                  name: medicalLimit.name,
                  id: medicalLimit.id,
                },
          },
        };
      });

      // filterItems(
      //   data.drugs,
      // )
      // console.log(`Suggested by other`, suggestedDoctors.value);
      // console.log(`Selected by owner`, selectedDoctors.value);
      // console.log("-------------------------------------");
      // console.log(`Suggested by other`, suggestedServices.value);
      // console.log(`Selected by owner`, selectedServices.value);
    } catch (e) {
      console.error(e);
    } finally {
      loading.value = false;
    }
  };

  const fetchApplicantDrugData = async () => {
    setTypeOfAppeal("CHANGE");
    loading.value = true;
    const localClient = SessionStorage.getItem("client");
    client.value = localClient;
    const currentClient = localClient ? localClient : client.value;

    try {
      const response = await ClientService.getClientByAppealId(
        currentClient.appealId
      );
      const data = response.data.data;

      client.value.id = data.contract_client.id;
      client.value.clientId = data.contract_client.client_id;
      client.value.appealStatus = data.status;

      selectedDrugstore.value = data.drugstore;

      filterItems(
        data.drugs,
        suggestedDrugs.value,
        selectedDrugs.value,
        isDrugstore.value
      );

      selectedDrugs.value = selectedDrugs.value.map((drug) => {
        return {
          ...drug,
          pivot: {
            ...drug.pivot,
            price: Number(drug.pivot.price.match(/\d+/)[0]),
          },
        };
      });
      suggestedDrugs.value = suggestedDrugs.value.map((drug) => {
        return {
          ...drug,
          pivot: {
            ...drug.pivot,
            price: Number(drug.pivot.price.match(/\d+/)[0]),
          },
        };
      });

      if (data.file) {
        drugAppealImage.value.readerPhoto = `https://api.neoinsurance.uz/${data.file}`;
      }

      console.log(drugAppealImage.value);
      console.log(`Suggested by other`, suggestedDrugs.value);
      console.log(`Selected by owner`, selectedDrugs.value);
    } catch (e) {
      console.error(e);
    } finally {
      loading.value = false;
    }
  };

  const checkSelectedClinic = (option) =>
    selectedClinic.value?.id === option.id;
  const checkSelectedDoctors = (option) => {
    return selectedDoctors.value.some((doctor) => doctor?.id === option.id);
  };
  const checkSelectedServices = (option) => {
    return selectedServices.value.some((service) => service?.id === option.id);
  };
  const checkSelectedDrugstore = (option) =>
    selectedDrugstore.value?.id === option.id;

  const changeStatusDoctor = (selectedItem, isSuggested = true) => {
    let doctors = isSuggested ? suggestedDoctors.value : selectedDoctors.value;
    doctors = doctors.map((doctor) => {
      if (selectedItem.item.id === doctor.id) {
        const limit = {
          name: selectedItem.medical_program.name,
          id: selectedItem.medical_program.id,
        };
        return {
          ...doctor,
          pivot: {
            ...doctor.pivot,
            status: selectedItem.status ?? doctor.pivot.status,
            progress: selectedItem.progress ?? doctor.pivot.progress,
            quantity: selectedItem.quantity ?? doctor.pivot.quantity,
            program_item_id:
              selectedItem.medical_program.id ?? doctor.pivot.program_item_id,
            limit: limit.id === doctor.pivot.limit?.id ? null : limit,
          },
          status: selectedItem.status,
        };
      }
      return doctor;
    });

    if (isSuggested) {
      suggestedDoctors.value = doctors;
    } else {
      selectedDoctors.value = doctors;
    }
  };

  const changeStatusService = (selectedItem, isSuggested = true) => {
    let services = isSuggested
      ? suggestedServices.value
      : selectedServices.value;
    services = services.map((service) => {
      if (selectedItem.item.id === service.id) {
        const limit = {
          name: selectedItem.medical_program.name,
          id: selectedItem.medical_program.id,
        };

        return {
          ...service,
          pivot: {
            ...service.pivot,
            status: selectedItem.status ?? service.pivot.status,
            progress: selectedItem.progress ?? service.pivot.progress,
            quantity: selectedItem.quantity ?? service.pivot.quantity,
            program_item_id:
              selectedItem.medical_program.id ?? service.pivot.program_item_id,
            limit: limit.id === service.pivot.limit?.id ? null : limit,
          },
          status: selectedItem.status,
        };
      }
      return service;
    });

    if (isSuggested) {
      suggestedServices.value = services;
    } else {
      selectedServices.value = services;
    }
  };

  const changeStatusDrugs = (selectedItem, isSuggested = true) => {
    let drugs = isSuggested ? suggestedDrugs.value : selectedDrugs.value;

    drugs = drugs.map((drug) => {
      if (selectedItem.item.id === drug.id) {
        return {
          ...drug,
          pivot: {
            ...drug.pivot,
            status: selectedItem.status ?? drug.pivot.status,
            progress: selectedItem.progress ?? drug.pivot.progress,
          },
          status: selectedItem.status,
        };
      }
      return drug;
    });

    if (isSuggested) {
      suggestedDrugs.value = drugs;
    } else {
      selectedDrugs.value = drugs;
    }
  };

  const clearDrugs = (drug) => {
    drugsData.drugs = drugsData.drugs.filter((item) => {
      return drug.id !== item.id;
    });
  };

  //temporary logic for create old appeal
  const copyDoctors = ref([]);
  const copyServices = ref([]);
  const finishedAppeal = ref(false);
  const hasWatched = ref(false);

  const unwatch = watch(
    () => [selectedDoctors.value, selectedServices.value],
    ([newDoctors, newServices], [oldDoctors, oldServices]) => {
      if (!hasWatched.value) {
        copyDoctors.value = oldDoctors;
        copyServices.value = oldServices;
        hasWatched.value = true;
        unwatch();
      }
    }
  );

  const makeAppealDone = (done) => {
    if (done) {
      selectedDoctors.value = selectedDoctors.value.map((doctor) => {
        return {
          ...doctor,
          pivot: {
            ...doctor.pivot,
            progress: 2,
            status: 1,
          },
          status: 1,
        };
      });

      selectedServices.value = selectedServices.value.map((service) => {
        return {
          ...service,
          pivot: {
            ...service.pivot,
            progress: 2,
            status: 1,
          },
          status: 1,
        };
      });
      finishedAppeal.value = true;
    } else {
      selectedDoctors.value = [...copyDoctors.value];
      selectedServices.value = [...copyServices.value];
      finishedAppeal.value = false;
    }
  };

  return {
    loading,
    isClinic,
    isDrugstore,
    isAgent,
    appealTotalConsumption,
    successAppeal,
    setSuccessAppeal,
    typeOfAppeal,
    setTypeOfAppeal,
    client,
    setClient,
    diagnosis,
    setDiagnosis,
    appealDate,
    setAppealDate,
    clinics,
    selectedClinic,
    doctors,
    selectedDoctors,
    suggestedDoctors,
    services,
    selectedServices,
    suggestedServices,
    fetchClinics,
    fetchDoctors,
    fetchServices,
    fetchDrugstores,
    fetchHospitalData,
    fetchApplicantData,
    fetchMedicalPrograms,
    selectClinic,
    selectDoctors,
    selectServices,
    checkSelectedClinic,
    checkSelectedDoctors,
    checkSelectedServices,
    postAppealData,
    changeAppealData,
    clearAppealData,
    clearClinicData,
    setClinic,
    changeStatusDoctor,
    changeStatusService,
    checkSuggestedDoctors,
    checkSuggestedServices,
    cantRemoveFromSelectedDoctors,
    cantRemoveFromSelectedServices,

    drugs,
    drugstores,
    drugAppealImage,
    selectedDrugs,
    suggestedDrugs,
    selectedDrugstore,
    checkSelectedDrugstore,
    selectDrugstore,
    fetchDrugs,
    selectDrugs,
    postAppealDrugData,
    changeAppealDrugData,
    setDrugAppealImage,
    fetchApplicantDrugData,
    changeStatusDrugs,
    appealTotalDrugConsumption,
    clearDrugstoreData,
    removeDrug,

    medicalProgram,
    medicalLimits,

    makeAppealDone,
    finishedAppeal,
    calculateLimits,
  };
});
