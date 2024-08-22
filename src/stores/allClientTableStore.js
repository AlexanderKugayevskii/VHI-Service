import dayjs from "dayjs";
import { defineStore } from "pinia";
import { ref, computed, onMounted, watch } from "vue";
import ClientService from "src/services/ClientService";
import formatNumber from "src/helpers/formatNumber";
import formatDate from "src/helpers/formatDate";
import { useI18n } from "vue-i18n";
import { useAppealStore } from "./appealStore";
import ClinicService from "src/services/ClinicService";
export const useFullClientTableStore = defineStore("allClientTable", () => {
  const { t } = useI18n();
  const appealStore = useAppealStore();

  // allClientsTable
  const columns = computed(() => [
    {
      name: "index",
      label: "№",
      field: "index",
      align: "left",
      sortable: true,
    },
    {
      name: "clientName",
      align: "left",
      label: t("client_table.clients"),
      field: "clientName",
    },
    {
      name: "residentType",
      align: "left",
      label: "Тип",
      field: "residentType",
    },
    {
      name: "passport",
      align: "left",
      label: "Паспорт",
      field: "passport",
    },
    {
      name: "pinfl",
      align: "left",
      label: "ПИНФЛ",
      field: "passport",
    },
    {
      name: "phone",
      align: "left",
      label: "Телефон",
      field: "phone",
    },
    {
      name: "dmsId",
      align: "left",
      label: "ID",
      field: "dmsId",
      sortable: true,
    },
    {
      name: "program",
      align: "left",
      label: "Программа",
      field: "program",
    },
    {
      name: "startInsurancePeriod",
      align: "left",
      label: "Дата начала страхования",
      field: "startInsurancePeriod",
      sortable: true,
    },
    {
      name: "endInsurancePeriod",
      align: "left",
      label: "Дата конца страхования",
      field: "endInsurancePeriod",
      sortable: true,
    },
    {
      name: "organizationName",
      align: "left",
      label: "Организация",
      field: "organizationName",
      sortable: true,
    },
    {
      name: "change",
      align: "left",
      label: "",
      field: "change",
    },
  ]);
  const pagination = ref({
    sortBy: "index",
    descending: true,
    rowsPerPage: 10,
    rowsNumber: 0,
    page: 1,
  });
  const loading = ref(true);
  const users = ref([]);

  function fetchClients(page = 1, limit = 10, search, sortBy, orderBy) {
    loading.value = true;
    ClientService.getFullClients(page, limit, search, {}, sortBy, orderBy)
      .then((response) => {
        users.value = response.data.data.data;

        pagination.value.page = page;
        pagination.value.rowsPerPage = limit;
        pagination.value.rowsNumber = response.data.data.total;
      })
      .catch(() => {})
      .finally(() => {
        loading.value = false;
      });
  }

  const handleRequest = (props) => {
    const propsSortBy = props.pagination.sortBy;
    let orderBy = props.pagination.descending ? "desc" : "asc";
    let sortBy;

    if (propsSortBy === "index") {
      sortBy = "id";
    } else if (propsSortBy === "startInsurancePeriod") {
      sortBy = "contract.start_date";
    } else if (propsSortBy === "endInsurancePeriod") {
      sortBy = "contract.end_date";
    } else if (propsSortBy === "organizationName") {
      sortBy = "applicant";
    } else if (propsSortBy === "dmsId") {
      sortBy = "dms_code";
    }

    fetchClients(
      props.pagination.page,
      props.pagination.rowsPerPage,
      props.filter,
      sortBy,
      orderBy
    );

    pagination.value.descending = props.pagination.descending;
    pagination.value.sortBy = propsSortBy;

    console.log(pagination.value);
  };

  const currentDate = dayjs();

  const rows = computed(() => {
    return users.value.map((row, index) => {
      const startInsurancePeriod = row.contract.start_date
        .split("-")
        .reverse()
        .join("-");
      const endInsurancePeriod = row.contract.end_date
        .split("-")
        .reverse()
        .join("-");

      // const targetDate = dayjs(row.contract.end_date);
      const targetDate = dayjs(row.contract.end_date);
      const daysDifference = targetDate.diff(currentDate, "day");

      const expire = {
        status: 0,
      };
      if (daysDifference < 0) {
        expire.status = 2;
      } else if (daysDifference < 30) {
        expire.status = 1;
      } else {
        expire.status = 0;
      }
      return {
        clientId: row.client.id,
        contractClientId: row.id,
        clientFirstname: row.client.name,
        clientLastname: row.client.lastname,

        residentType: row.client.residentType,
        passport: `${row.client.seria} ${row.client.number}`,
        pinfl: row.client.pinfl,
        phone: formatNumber(row.client.phone),
        // clientType: "Клиент",
        dmsId: row.dms_code,
        program: row.program?.name ?? "",
        startInsurancePeriod: startInsurancePeriod,
        // endInsurancePeriod: endInsurancePeriod,
        endInsurancePeriod: endInsurancePeriod,
        organizationName: row.contract?.applicant ?? "no applicant",
        expireStatus: expire,
        index: row.id,
      };
    });
  });

  // selected client info
  const clientInfo = ref(null);
  const clientDataForAppeal = ref(null);
  const setClientInfo = (item) => {
    clientInfo.value = item;
  };
  const getClientInfo = async (id) => {
    loading.value = true;
    try {
      const response = await ClientService.getClientInfo(id);
      const data = response.data.data;

      setClientInfo(data);

      const birthday = data.client.birthday.split("-").reverse().join("-");

      clientDataForAppeal.value = {
        clientFirstname: data.client.name,
        clientLastname: data.client.lastname,
        clientId: data.client_id,
        id: data.id,
        dmsCode: data.dms_code,
        passportNumber: data.client.number,
        passportSeria: data.client.seria,
        program: data?.program.name,
        birthday: birthday,
        applicant: data.contract.applicant,
        type_id: 0,
        type: "Клиент",
      };

      appealStore.setClient(clientDataForAppeal.value);
    } catch (e) {
      console.error(e);
    } finally {
      loading.value = false;
    }
  };

  const setClientDataForAppeal = (client) => {
    const birthday = client.birthday.split("-").reverse().join("-");

    clientDataForAppeal.value = {
      clientFirstname: client.name,
      clientLastname: client.lastname,
      clientId: client?.id ?? client.pivot.client_id,
      id: clientInfo.value.id,
      dmsCode: clientInfo.value.dms_code,
      passportNumber: client.number,
      passportSeria: client.seria,
      program: clientInfo.value?.program.name,
      birthday: birthday,
      applicant: clientInfo.value.contract.applicant,
      type_id: 1,
      type: "Родственник",
    };

    appealStore.setClient(clientDataForAppeal.value);
  };

  // medical limits for client
  const medicalLimits = ref([]);
  const fetchMedicalPrograms = async (id) => {
    try {
      const response = await ClientService.getMedicalPrograms(id);
      const data = response.data;
      medicalLimits.value = data.data;

      medicalLimits.value = medicalLimits.value.map((limit) => {
        return {
          ...limit,
          spent: Number(limit.spent),
        };
      });
    } catch (e) {
      console.error(e);
    }
  };

  // applications clinic for client
  const clinicClientApplications = ref([]);
  const fetchClinicApplications = async (id) => {
    try {
      const response = await ClientService.getClinicApplications(id);
      const data = response.data.data;

      clinicClientApplications.value = data;
    } catch (e) {
      console.error(e);
    }
  };

  const drugstoreClientApplications = ref([]);
  const fetchDrugstoreApplications = async (id) => {
    try {
      const response = await ClientService.getDrugstoreApplications(id);
      const data = response.data.data;

      drugstoreClientApplications.value = data;
    } catch (e) {
      console.error(e);
    }
  };

  const applicationsClinicRows = computed(() => {
    return clinicClientApplications.value.map((row, index) => {
      const doctors = row.doctors.map((doctor) => doctor.name).join(", ");
      const services = row.services.map((service) => service.name).join(", ");

      return {
        contractClientId: row.contract_client_id,
        appealId: row.id,
        clientFirstname: clientInfo.value.client.name,
        clientLastname: clientInfo.value.client.lastname,
        birthday: clientInfo.value.client.birthday,
        type_id: row.client_type,
        appealDate: formatDate(row.created_at),
        appealStatus: row.status,
        clinicName: row.hospital?.name,
        doctorName: doctors,
        serviceName: services,
        diagnosisName: row.diagnosis ?? "",
        expenseAmount: row.total_amount ?? "",
        dmsCode: clientInfo.value.dms_code,
        program: clientInfo.value.program?.name,

        userSettings: "",
        index: row.id,
      };
    });
  });

  const applicationsDrugstoreRows = computed(() => {
    return drugstoreClientApplications.value.map((row, index) => {
      const medicines = row.drugs.map((drug) => drug.name).join(", ");
      return {
        contractClientId: row.contract_client_id,
        appealId: row.id,
        clientFirstname: clientInfo.value.client.name,
        clientLastname: clientInfo.value.client,
        birthday: clientInfo.value.client.birthday,
        type_id: row.client_type,
        appealDate: formatDate(row.created_at),
        appealStatus: row.status,
        drugstore: row.drugstore.name ?? "",
        medicines: medicines,
        expenseAmount: row.total_amount ?? "",
        dmsCode: clientInfo.value.dms_code,
        program: clientInfo.value.program.name,
        userSettings: "",
        index: row.id,
      };
    });
  });
  return {
    pagination,
    loading,
    rows,
    columns,
    handleRequest,
    clientInfo,
    getClientInfo,
    fetchMedicalPrograms,
    applicationsClinicRows,
    applicationsDrugstoreRows,
    medicalLimits,
    fetchClinicApplications,
    fetchDrugstoreApplications,

    clientDataForAppeal,
    setClientDataForAppeal,
  };
});
