import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";
import AppealService from "src/services/AppealService";
import ClientService from "src/services/ClientService";
import { useAuthStore } from "./authStore";
import { storeToRefs } from "pinia";
import { SessionStorage, Notify } from "quasar";
import dayjs from "dayjs";
import { all } from "axios";

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
    SessionStorage.set("typeOfAppeal", typeOfAppeal.value);
  };

  const setClient = (item) => {
    client.value = item;
    if (item !== null) {
      SessionStorage.set("client", item);
    }
  };

  const diagnosis = ref("");
  const comment = ref("");
  const appealDate = ref(todayDate);
  const medicalProgram = ref(null);
  const medicalLimits = ref([]);

  const allData = computed(() => {
    return [
      ...selectedDoctors.value,
      ...suggestedDoctors.value,
      ...selectedServices.value,
      ...suggestedServices.value,
      ...selectedDrugs.value,
      ...suggestedDrugs.value,
    ];
  });
  const calculateLimits = computed(() => {
    return medicalLimits.value.map((limit) => {
      const findItemsSumm = allData.value.reduce((acc, curr) => {
        if (curr.pivot.program_item_id === limit.id) {
          return acc + parseFloat(curr.pivot.price) * curr.pivot.quantity;
        }
        return acc;
      }, 0);

      return {
        ...limit,
        spent:
          limit.spent - allMedicalLimitsSumm.value[limit.name] + findItemsSumm,
      };
    });
  });

  const checkSelectedLimits = computed(() => {
    // program_item_id
    return allData.value.some((item) => {
      return item.pivot.program_item_id === 0 && item.pivot.status !== 2;
    });
  });

  const checkRemaindMedicalLimits = computed(() => {
    return calculateLimits.value.some((item) => {
      const remaind = parseFloat(item.limit) - parseFloat(item.spent);

      return remaind < 0;
    });
  });

  const setDiagnosis = (value) => {
    diagnosis.value = value;
  };
  const setComment = (value) => {
    comment.value = value;
  };

  const setAppealDate = (value) => {
    appealDate.value = value;
  };
  const setFinishedDate = (value) => {
    client.value.finishedDate = value;
  };
  const clinics = ref([]);
  const selectedClinic = ref(null);

  const doctors = ref([]);
  const selectedDoctors = ref([]);
  const suggestedDoctors = ref([]);
  const allDoctorsStatus = computed(() =>
    selectedDoctors.value.concat(suggestedDoctors.value).map((doctor) => {
      const doctorData = {
        id: doctor.id,
        status: doctor.pivot.status ?? 0,
        progress: doctor.pivot.progress ?? 0,
        quantity: doctor.pivot.quantity ?? 1,
        program_item_id: doctor.pivot.program_item_id ?? 0,
        price: doctor.pivot.price,
      };
      if (doctorData.id === null) {
        doctorData.name = doctor.name;
        doctorData.price = doctor.pivot.price;
      }

      return doctorData;
    })
  );

  const services = ref([]);
  const selectedServices = ref([]);
  const suggestedServices = ref([]);
  const allServicesStatus = computed(() =>
    selectedServices.value.concat(suggestedServices.value).map((service) => {
      const serviceData = {
        id: service.id,
        status: service.pivot.status ?? 0,
        progress: service.pivot.progress ?? 0,
        quantity: service.pivot.quantity ?? 1,
        program_item_id: service.pivot.program_item_id ?? 0,
        price: service.pivot.price,
      };

      if (serviceData.id === null) {
        serviceData.name = service.name;
        serviceData.price = service.pivot.price;
      }
      return serviceData;
    })
  );

  const allMedicalLimitsSumm = ref(null);

  const drugAppealImage = ref({});
  const drugs = ref([]);
  const selectedDrugs = ref([]);
  ``;
  const suggestedDrugs = ref([]);

  const drugstores = ref([]);
  const selectedDrugstore = ref(null);

  const allDrugsStatus = computed(() =>
    selectedDrugs.value.concat(suggestedDrugs.value).map((drug) => {
      const drugData = {
        id: drug.id,
        name: drug.name,
        price: drug.pivot.price,
        status: drug.pivot.status ?? 0,
        quantity: drug.quantity ?? drug.pivot.quantity,
        progress: drug.pivot.progress ?? 0,
        program_item_id: drug.pivot.program_item_id ?? 0,
      };

      if (drugData.id === null) {
        drugData.name = drug.name;
        drugData.price = drug.pivot.price;
      }

      return drugData;
    })
  );

  const medicalLimitsRemaind = computed(() => {
    return (
      parseFloat(client.value.liability) -
      medicalLimits.value.reduce((acc, curr) => {
        return acc + parseFloat(curr.spent);
      }, 0)
    );
  });

  const appealTotalConsumption = computed(() => {
    const allData = [
      ...selectedDoctors.value,
      ...suggestedDoctors.value,
      ...selectedServices.value,
      ...suggestedServices.value,
    ];

    return allData.reduce((acc, curr) => {
      if (curr.pivot.status === 1) {
        return (
          acc + parseFloat(curr.pivot.price) * parseFloat(curr.pivot.quantity)
        );
      }
      return acc;
    }, 0);
  });

  const appealTotalDrugConsumption = computed(() => {
    const allData = [...selectedDrugs.value, ...suggestedDrugs.value];

    return allData.reduce((acc, curr) => {
      if (curr.pivot.status === 1) {
        return (
          acc + parseFloat(curr.pivot.price) * parseFloat(curr.pivot.quantity)
        );
      }
      return acc;
    }, 0);
  });

  const actionDoctorStatusCount = computed(() => {
    let count = 0;
    if (isAgent.value) {
      count = suggestedDoctors.value
        .concat(selectedDoctors.value)
        .filter(
          (doctor) =>
            doctor.pivot.progress === 1 ||
            (doctor.pivot.created_by_clinic === 1 && doctor.pivot.status === 0)
        ).length;
    }

    if (isClinic.value) {
      count = suggestedDoctors.value
        .concat(selectedDoctors.value)
        .filter(
          (doctor) =>
            (doctor.pivot.created_by_clinic === 0 &&
              (doctor.pivot.status === 0 || doctor.pivot.status === 1) &&
              doctor.pivot.progress !== 1) ||
            (doctor.pivot.created_by_clinic === 1 &&
              doctor.pivot.status === 1 &&
              doctor.pivot.progress === 0)
        ).length;
    }

    return count;
  });

  const actionServiceStatusCount = computed(() => {
    let count = 0;
    if (isAgent.value) {
      count = suggestedServices.value
        .concat(selectedServices.value)
        .filter(
          (service) =>
            service.pivot.progress === 1 ||
            (service.pivot.created_by_clinic === 1 &&
              service.pivot.status === 0)
        ).length;
    }

    if (isClinic.value) {
      count = suggestedServices.value
        .concat(selectedServices.value)
        .filter(
          (service) =>
            (service.pivot.created_by_clinic === 0 &&
              (service.pivot.status === 0 || service.pivot.status === 1) &&
              service.pivot.progress !== 1) ||
            (service.pivot.created_by_clinic === 1 &&
              service.pivot.status === 1 &&
              service.pivot.progress === 0)
        ).length;
    }
    return count;
  });

  const checkStatusIfRejected = computed(() => {
    return suggestedDoctors.value
      .concat(
        selectedDoctors.value,
        suggestedServices.value,
        selectedServices.value
      )
      .some((item) => item.pivot.status === 2);
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
          (item.pivot.progress >= 1 &&
            isAgent.value &&
            !finishedAppeal.value) ||
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
    if (index > -1 && doctor.id !== null) {
      selectedDoctors.value.splice(index, 1);
    } else {
      if (finishedAppeal.value) {
        selectedDoctors.value.push({
          ...doctor,
          pivot: {
            ...doctor.pivot,
            status: 1,
            progress: 2,
            quantity: 1,
            program_item_id: 0,
          },
          isNew: true,
        });
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

      copyDoctors.value.push({
        ...doctor,
        pivot: {
          ...doctor.pivot,
          status: 0,
          progress: 0,
          quantity: 1,
          program_item_id: 0,
        },
      });
    }
  };
  const changeDoctorPrice = async (changedData) => {
    doctors.value = doctors.value.map((doctor) => {
      if (doctor.id !== changedData.id) {
        return doctor;
      } else {
        return {
          ...doctor,
          pivot: {
            ...doctor.pivot,
            price: changedData.price,
          },
        };
      }
    });

    selectedDoctors.value = selectedDoctors.value.map((doctor) => {
      if (doctor.id !== changedData.id) {
        return doctor;
      } else {
        return {
          ...doctor,
          pivot: {
            ...doctor.pivot,
            price: changedData.price,
          },
        };
      }
    });

    try {
      const response = await AppealService.changePriceDoctor({
        hospital_id: selectedClinic.value.id,
        doctor_id: changedData.id,
        price: changedData.price,
      });
    } catch (e) {
      console.error(e);
    }
  };

  const changeServicePrice = async (changedData) => {
    services.value = services.value.map((service) => {
      if (service.id !== changedData.id) {
        return service;
      } else {
        return {
          ...service,
          pivot: {
            ...service.pivot,
            price: changedData.price,
          },
        };
      }
    });

    selectedServices.value = selectedServices.value.map((service) => {
      if (service.id !== changedData.id) {
        return service;
      } else {
        return {
          ...service,
          pivot: {
            ...service.pivot,
            price: changedData.price,
          },
        };
      }
    });

    try {
      const response = await AppealService.changePriceService({
        hospital_id: selectedClinic.value.id,
        service_id: changedData.id,
        price: changedData.price,
      });
    } catch (e) {
      console.error(e);
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
          (item.pivot.progress >= 1 &&
            isAgent.value &&
            !finishedAppeal.value) ||
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
    if (index > -1 && service.id !== null) {
      selectedServices.value.splice(index, 1);
    } else {
      if (finishedAppeal.value) {
        selectedServices.value.push({
          ...service,
          pivot: {
            ...service.pivot,
            status: 1,
            progress: 2,
            quantity: 1,
            program_item_id: 0,
          },
          isNew: true,
        });
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
      copyServices.value.push({
        ...service,
        pivot: {
          ...service.pivot,
          status: 0,
          progress: 0,
          quantity: 1,
          program_item_id: 0,
        },
      });
    }
  };

  const checkSuggestedDrugs = (drug) => {
    return suggestedDrugs.value.some((item) => drug.id === item.id);
  };
  const cantRemoveFromSelectedDrugs = (drug) => {
    return selectedDrugs.value.some((item) => {
      if (drug.id === item.id) {
        return (
          (item.pivot.progress >= 1 &&
            isAgent.value &&
            !finishedAppeal.value) ||
          (item.pivot.status !== 0 && !isAgent.value)
        );
      }
    });
  };
  const selectDrugs = (drug) => {
    if (checkSuggestedDrugs(drug)) {
      return;
    }
    if (cantRemoveFromSelectedDrugs(drug)) {
      return;
    }

    if (finishedAppeal.value) {
      selectedDrugs.value.push({
        ...drug,
        pivot: {
          ...drug?.pivot,
          quantity: drug.quantity,
          price: drug.price,
          status: 1,
          progress: 2,
        },
        isNew: true,
      });
    } else {
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
    }

    copyDrugs.value.push({
      ...drug,
      pivot: {
        ...drug.pivot,
        status: 0,
        progress: 0,
      },
    });
  };

  const removeDoctor = (doctor) => {
    selectedDoctors.value = selectedDoctors.value.filter(
      (item) => item.id !== doctor.id
    );
  };

  const removeService = (service) => {
    selectedServices.value = selectedServices.value.filter(
      (item) => item.id !== service.id
    );
  };

  const removeDrug = (drug) => {
    selectedDrugs.value = selectedDrugs.value.filter(
      (item) => item.id !== drug.id
    );
  };
  const clearAppealData = () => {
    diagnosis.value = "";
    comment.value = "";
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

    finishedAppeal.value = false;
    // hasWatched.value = false;

    // client.value = null;
  };
  const clearClinicData = () => {
    selectedClinic.value = null;
  };
  const clearDrugstoreData = () => {
    selectedDrugstore.value = null;
  };

  const clearSelectedItemsData = () => {
    selectedDoctors.value = [];
    selectedServices.value = [];
    suggestedDoctors.value = [];
    suggestedServices.value = [];
  };

  const clearSelectedDrugsData = () => {
    selectedDrugs.value = [];
    suggestedDrugs.value = [];
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
      other.status = pivot.status;
      other.progress = pivot.progress;

      return other;
    });

    const payload = {
      contract_client_id: client.value.id,
      client_type: client.value.type_id,
      client_id: client.value.clientId,
      is_hospital: false,
      drugstore_id: selectedDrugstore.value.id,
      drugs: drugsData,
      applied_date: appealDate.value,
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

  const changeAppealDrugData = async () => {
    loading.value = true;
    const formData = new FormData();

    const payload = {
      contract_client_id: client.value.id,
      client_id: client.value.clientId,
      client_type: client.value.type_id,
      drugstore_id: selectedDrugstore.value.id,
      drugs: allDrugsStatus.value,
      applied_date: appealDate.value,
    };

    if (client.value.appealStatus === 2) {
      payload.finished_date = client.value.finishedDate
        .split("-")
        .reverse()
        .join("-");

      formData.append("finished_date", payload.finished_date);
    }

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
        SessionStorage.set("client", client.value);
        Notify.create({
          type: "success",
          message: "Обращение успешно изменено!",
        });

        return { success: true };
      }
    } catch (e) {
      console.error(e);

      return { success: false };
    } finally {
      loading.value = false;
    }
  };

  const postAppealData = async () => {
    loading.value = true;

    const services = selectedServices.value.map((service) => {
      const serviceData = {
        quantity: service.pivot.quantity,
        status: service.pivot.status,
        progress: service.pivot.progress,
        id: service.id,
        price: service.pivot.price,
      };

      if (serviceData.id === null) {
        serviceData.name = service.name;
        serviceData.price = service.pivot.price;
      }
      return serviceData;
    });

    const doctors = selectedDoctors.value.map((doctor) => {
      const doctorData = {
        quantity: doctor.pivot.quantity,
        status: doctor.pivot.status,
        progress: doctor.pivot.progress,
        id: doctor.id,
        price: doctor.pivot.price,
      };
      if (doctorData.id === null) {
        doctorData.name = doctor.name;
        doctorData.price = doctor.pivot.price;
      }

      return doctorData;
    });

    const payload = {
      client_id: client.value.clientId,
      contract_client_id: client.value.id,
      hospital_id: selectedClinic.value.id,
      client_type: client.value.type_id,
      is_hospital: true,
      comment: comment.value,
      services,
      doctors,
      diagnosis: diagnosis.value,
      applied_date: appealDate.value,
      finished: finishedAppeal.value,
    };

    try {
      const response = await AppealService.saveAppealByAgent(payload);
      const data = response.data.data;

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

        return { success: true };
        // clearAppealData();
      }
    } catch (e) {
      console.error(e);

      return { success: false };
    } finally {
      loading.value = false;
    }
  };

  const changeAppealData = async () => {
    loading.value = true;
    const payload = {
      hospital_id: selectedClinic.value.id,
      contract_client_id: client.value.id,
      client_type: client.value.type_id,
      client_id: client.value.clientId,
      services: allServicesStatus.value,
      doctors: allDoctorsStatus.value,
      diagnosis: diagnosis.value,
      applied_date: appealDate.value,
      comment: comment.value,
    };
    if (client.value.appealStatus === 2) {
      payload.finished_date = client.value.finishedDate
        .split("-")
        .reverse()
        .join("-");
    }

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

  const deleteAppealData = async (appealId) => {
    loading.value = true;
    try {
      const response = await AppealService.deleteAppeal(appealId);
      Notify.create({
        type: "success",
        message: "Обращение успешно удалено!",
        position: "bottom",
      });
    } catch (e) {
      console.error(e);
      Notify.create({
        type: "error",
        message: "Произошла ошибка при удалении обращения!",
        position: "bottom",
      });
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
        currentClient.contractClientId ?? currentClient.id
      );
      const data = response.data;
      medicalLimits.value = data.data;

      medicalLimits.value = medicalLimits.value.map((limit) => {
        return {
          ...limit,
          spent: parseFloat(limit.spent),
          originalSpent: parseFloat(limit.spent),
        };
      });

      loading.value = false;
    } catch (e) {
      console.error(e);
    }
  };

  const fetchApplicantData = async (id) => {
    setTypeOfAppeal("CHANGE");
    loading.value = true;
    // const localClient = SessionStorage.getItem("client");
    // client.value = localClient;
    // const currentClient = localClient ? localClient : client.value;
    // console.log(`current client`, currentClient);
    try {
      const response = await ClientService.getClientByAppealId(id);
      const data = response.data.data;

      console.log(data);
      const clientData = {
        contractClientId: data.contract_client_id,
        appealId: data.id,
        clientFirstname: data.client.name,
        clientLastname: data.client.lastname,
        birthday: data.client.birthday,
        appealDate: data.applied_date
          ? data.applied_date.split("-").reverse().join("-")
          : "",
        finishedDate: data.finished_date
          ? data.finished_date.split("-").reverse().join("-")
          : "",
        appealStatus: data.status,
        clinicName: data.hospital.name,
        diagnosisName: data.diagnosis ?? "",
        expenseAmount: data.total_amount ?? "",
        dmsCode: data.contract_client.dms_code,
        program: data.contract_client.program.name,
        type_id: data.client_type,
        applicant: data.contract_client.contract.applicant,
        liability: parseFloat(data.contract_client.program.liability),
      };
      setClient(clientData);

      // client.value.id = data.contract_client.id;
      // client.value.clientId = data.contract_client.client_id;
      // client.value.appealStatus = data.status;
      selectedClinic.value = data.hospital;
      diagnosis.value = data.diagnosis;
      comment.value = data.comment ?? "";

      const [ad1, ad2, ad3] = data.applied_date.split(" ")[0].split("-");
      appealDate.value = `${ad3}-${ad2}-${ad1}`;

      clearSelectedItemsData();

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

      suggestedDoctors.value = suggestedDoctors.value.map((doctor) => {
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

      suggestedServices.value = suggestedServices.value.map((service) => {
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

      const all = [
        ...selectedDoctors.value,
        ...suggestedDoctors.value,
        ...selectedServices.value,
        ...suggestedServices.value,
      ];

      allMedicalLimitsSumm.value = medicalLimits.value.reduce((acc, curr) => {
        const summ = all.reduce((a, c) => {
          if (curr.id === c.pivot.program_item_id) {
            return a + parseFloat(c.pivot.price) * c.pivot.quantity;
          }
          return a;
        }, 0);

        if (acc[curr.name]) {
          acc[curr.name] += summ;
        } else {
          acc[curr.name] = summ;
        }

        return acc;
      }, {});

      copyDoctors.value = [...selectedDoctors.value];
      copyServices.value = [...selectedServices.value];
    } catch (e) {
      console.error(e);
    } finally {
      loading.value = false;
    }
  };

  const fetchApplicantDrugData = async (id) => {
    setTypeOfAppeal("CHANGE");
    loading.value = true;
    // const localClient = SessionStorage.getItem("client");
    // client.value = localClient;
    // const currentClient = localClient ? localClient : client.value;

    try {
      const response = await ClientService.getClientByAppealId(id);
      const data = response.data.data;
      const clientData = {
        contractClientId: data.contract_client_id,
        appealId: data.id,
        clientFirstname: data.client.name,
        clientLastname: data.client.lastname,
        birthday: data.client.birthday,
        appealDate: data.applied_date
          ? data.applied_date.split("-").reverse().join("-")
          : "",
        finishedDate: data.finished_date
          ? data.finished_date.split("-").reverse().join("-")
          : "",
        appealStatus: data.status,
        clinicName: data.drugstore.name,
        diagnosisName: data.diagnosis ?? "",
        expenseAmount: data.total_amount ?? "",
        dmsCode: data.contract_client.dms_code,
        program: data.contract_client.program.name,
        type_id: data.client_type,
        applicant: data.contract_client.contract.applicant,
        liability: parseFloat(data.contract_client.program.liability),
      };

      clientData.id = data.contract_client.id;
      clientData.clientId = data.contract_client.client_id;
      selectedDrugstore.value = data.drugstore;
      setClient(clientData);
      

      const [ad1, ad2, ad3] = data.applied_date.split(" ")[0].split("-");
      appealDate.value = `${ad3}-${ad2}-${ad1}`;

      clearSelectedDrugsData();

      filterItems(
        data.drugs,
        suggestedDrugs.value,
        selectedDrugs.value,
        isDrugstore.value
      );

      selectedDrugs.value = selectedDrugs.value.map((drug) => {
        const medicalLimit = medicalLimits.value.find(
          (limit) => limit.id === drug.pivot.program_item_id
        );

        const equalId =
          medicalLimit !== undefined &&
          medicalLimit?.id === drug.pivot.program_item_id;
        return {
          ...drug,
          pivot: {
            ...drug.pivot,
            price: parseFloat(drug.pivot.price),
            limit: !equalId
              ? null
              : {
                  name: medicalLimit.name,
                  id: medicalLimit.id,
                },
          },
        };
      });

      suggestedDrugs.value = suggestedDrugs.value.map((drug) => {
        const medicalLimit = medicalLimits.value.find(
          (limit) => limit.id === drug.pivot.program_item_id
        );
        const equalId =
          medicalLimit !== undefined &&
          medicalLimit?.id === drug.pivot.program_item_id;
        return {
          ...drug,
          pivot: {
            ...drug.pivot,
            price: parseFloat(drug.pivot.price),
            limit: !equalId
              ? null
              : {
                  name: medicalLimit.name,
                  id: medicalLimit.id,
                },
          },
        };
      });

      const all = [...selectedDrugs.value, ...suggestedDrugs.value];
      allMedicalLimitsSumm.value = medicalLimits.value.reduce((acc, curr) => {
        const summ = all.reduce((a, c) => {
          if (curr.id === c.pivot.program_item_id) {
            return a + parseFloat(c.pivot.price) * c.pivot.quantity;
          }
          return a;
        }, 0);

        if (acc[curr.name]) {
          acc[curr.name] += summ;
        } else {
          acc[curr.name] = summ;
        }

        return acc;
      }, {});

      copyDrugs.value = [...selectedDrugs.value];
      if (data.file) {
        drugAppealImage.value.readerPhoto = `https://api.neoinsurance.uz/${data.file}`;
      }
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

  const changeStatusDoctor = (selectedItem, isSuggested = true, actionType) => {
    let doctors = isSuggested ? suggestedDoctors.value : selectedDoctors.value;
    doctors = doctors.map((doctor) => {
      const condition =
        selectedItem.item.id === null
          ? selectedItem.item.name === doctor.name
          : selectedItem.item.id === doctor.id;

      if (condition) {
        const limit = {
          id: selectedItem.medical_program?.id || doctor.pivot.program_item_id,
        };
        if (selectedItem.medical_program?.name) {
          limit.name = selectedItem.medical_program?.name;
        }
        return {
          ...doctor,
          pivot: {
            ...doctor.pivot,
            status: selectedItem.status ?? doctor.pivot.status,
            progress: selectedItem.progress ?? doctor.pivot.progress,
            quantity: selectedItem.quantity ?? doctor.pivot.quantity,
            program_item_id:
              actionType?.type === "limit"
                ? limit.id === doctor.pivot.limit?.id
                  ? 0
                  : limit.id
                : limit.id,
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

  const changeStatusService = (
    selectedItem,
    isSuggested = true,
    actionType
  ) => {
    let services = isSuggested
      ? suggestedServices.value
      : selectedServices.value;
    services = services.map((service) => {
      const condition =
        selectedItem.item.id === null
          ? selectedItem.item.name === service.name
          : selectedItem.item.id === service.id;

      if (condition) {
        const limit = {
          id: selectedItem.medical_program?.id ?? service.pivot.program_item_id,
        };
        if (selectedItem.medical_program?.name) {
          limit.name = selectedItem.medical_program?.name;
        }

        return {
          ...service,
          pivot: {
            ...service.pivot,
            status: selectedItem.status ?? service.pivot.status,
            progress: selectedItem.progress ?? service.pivot.progress,
            quantity: selectedItem.quantity ?? service.pivot.quantity,
            program_item_id:
              actionType?.type === "limit"
                ? limit.id === service.pivot.limit?.id
                  ? 0
                  : limit.id
                : limit.id,
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

  const changeStatusDrugs = (selectedItem, isSuggested = true, actionType) => {
    let drugs = isSuggested ? suggestedDrugs.value : selectedDrugs.value;

    drugs = drugs.map((drug) => {
      if (selectedItem.item.id === drug.id) {
        const limit = {
          id: selectedItem.medical_program?.id ?? drug.pivot.program_item_id,
        };
        if (selectedItem.medical_program?.name) {
          limit.name = selectedItem.medical_program?.name;
        }

        return {
          ...drug,
          pivot: {
            ...drug.pivot,
            status: selectedItem.status ?? drug.pivot.status,
            progress: selectedItem.progress ?? drug.pivot.progress,
            quantity: selectedItem.quantity ?? drug.pivot.quantity,
            program_item_id:
              actionType?.type === "limit"
                ? limit.id === drug.pivot.limit?.id
                  ? 0
                  : limit.id
                : limit.id,
            limit: limit.id === drug.pivot.limit?.id ? null : limit,
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

  const copyDrugs = ref([]);
  const makeAppealDrugDone = (done) => {
    if (done) {
      selectedDrugs.value = selectedDrugs.value.map((drug) => {
        return {
          ...drug,
          pivot: {
            ...drug.pivot,
            progress: 2,
            status: 1,
          },
          status: 1,
          progress: 2,
        };
      });
      finishedAppeal.value = true;
    } else {
      selectedDrugs.value = [...copyDrugs.value];
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
    comment,
    setDiagnosis,
    setComment,
    appealDate,
    setAppealDate,
    setFinishedDate,
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
    deleteAppealData,
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
    removeDoctor,
    removeService,

    medicalProgram,
    medicalLimits,

    makeAppealDone,
    makeAppealDrugDone,
    finishedAppeal,
    calculateLimits,
    checkSelectedLimits,
    checkRemaindMedicalLimits,

    allDoctorsStatus,
    allServicesStatus,
    allDrugsStatus,
    actionDoctorStatusCount,
    actionServiceStatusCount,
    checkStatusIfRejected,

    changeDoctorPrice,
    changeServicePrice,

    medicalLimitsRemaind,
  };
});
