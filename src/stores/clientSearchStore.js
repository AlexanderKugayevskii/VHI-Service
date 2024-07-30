import { defineStore } from "pinia";
import { ref } from "vue";
import ClientService from "src/services/ClientService";
export const useSearchClientsStore = defineStore("clients", () => {
  const clients = ref([]);
  const searchClients = ref([]);
  const loading = ref(false);

  const getClients = async (page, perPage) => {
    clients.value = [];
    const response = await ClientService.getClients(page, perPage);
    clients.value = response.data;
  };

  const clearClients = () => {
    searchClients.value = [];
  };
  const getClientByCode = async (code) => {
    searchClients.value = [];
    clients.value = [];
    loading.value = true;

    const response = await ClientService.getClientsByCode(code);
    clients.value = response.data.data;

    clients.value.forEach((item) => {
      searchClients.value.push({
        id: item.id,
        clientId: item.client_id,
        clientFirstname: item.client.name,
        clientLastname: item.client.lastname,
        birthday: item.client.birthday,
        dmsCode: item.dms_code,
        applicant: item.contract.applicant,
        passportSeria: item.client.seria,
        passportNumber: item.client.number,
        program: item.program ? item.program.name : "no program",
        type: "Клиент",
        type_id: 0,
        hasSubClient: item.sub_clients.length > 0,
      });

      if (item.sub_clients.length > 0) {
        item.sub_clients.forEach((subClient) => {
          searchClients.value.push({
            id: subClient.pivot.contract_client_id,
            clientId: subClient.id,
            clientFirstname: subClient.name,
            clientLastname: subClient.lastname,
            birthday: item.client.birthday,
            dmsCode: item.dms_code,
            applicant: item.contract.applicant,
            passportSeria: subClient.seria,
            passportNumber: subClient.number,
            program: item.program ? item.program.name : "no program",
            type: "Родственник",
            type_id: 1,
            last: index === item.sub_clients.length - 1,
          });
        });
      }
    });

    loading.value = false;
  };
  const getClientByName = async (name) => {
    searchClients.value = [];

    clients.value = [];
    loading.value = true;

    const response = await ClientService.getClientsByName(name);
    clients.value = response.data.data;
    clients.value.forEach((item) => {
      searchClients.value.push({
        id: item.id,
        clientId: item.client_id,
        clientFirstname: item.client.name,
        clientLastname: item.client.lastname,
        birthday: item.client.birthday,
        dmsCode: item.dms_code,
        applicant: item.contract.applicant,
        passportSeria: item.client.seria,
        passportNumber: item.client.number,
        program: item.program ? item.program.name : "no program",
        type: "Клиент",
        type_id: 0,
        hasSubClient: item.sub_clients.length > 0,
      });

      if (item.sub_clients.length > 0) {
        item.sub_clients.forEach((subClient) => {
          searchClients.value.push({
            id: subClient.pivot.contract_client_id,
            clientId: subClient.id,
            clientFirstname: subClient.name,
            clientLastname: subClient.lastname,
            birthday: item.client.birthday,
            dmsCode: item.dms_code,
            applicant: item.contract.applicant,
            passportSeria: subClient.seria,
            passportNumber: subClient.number,
            program: item.program ? item.program.name : "no program",
            type: "Родственник",
            type_id: 1,
            last: index === item.sub_clients.length - 1,
          });
        });
      }
    });

    loading.value = false;
  };

  const getClientByPassport = async (passport) => {
    searchClients.value = [];
    clients.value = [];
    loading.value = true;

    const response = await ClientService.getClientsByPassport(passport);
    clients.value = response.data.data;
    clients.value.forEach((item) => {
      searchClients.value.push({
        id: item.id,
        clientId: item.client_id,
        clientFirstname: item.client.name,
        clientLastname: item.client.lastname,
        birthday: item.client.birthday,
        dmsCode: item.dms_code,
        applicant: item.contract.applicant,
        passportSeria: item.client.seria,
        passportNumber: item.client.number,
        program: item.program ? item.program.name : "no program",
        type: "Клиент",
        type_id: 0,
        hasSubClient: item.sub_clients.length > 0,
      });

      if (item.sub_clients.length > 0) {
        item.sub_clients.forEach((subClient, index) => {
          searchClients.value.push({
            id: subClient.pivot.contract_client_id,
            clientId: subClient.id,
            clientFirstname: subClient.name,
            clientLastname: subClient.lastname,
            birthday: item.client.birthday,
            dmsCode: item.dms_code,
            applicant: item.contract.applicant,
            passportSeria: subClient.seria,
            passportNumber: subClient.number,
            program: item.program ? item.program.name : "no program",
            type: "Родственник",
            type_id: 1,
            last: index === item.sub_clients.length - 1,
          });
        });
      }
    });
    loading.value = false;
  };

  function $resetSearchClients() {
    searchClients.value = [];
  }

  return {
    clients,
    searchClients,
    loading,
    getClients,
    $resetSearchClients,
    getClientByCode,
    getClientByName,
    getClientByPassport,
    clearClients,
  };
});
