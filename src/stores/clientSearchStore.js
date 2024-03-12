import { defineStore } from "pinia";
import { ref } from "vue";
import ClientService from "src/services/ClientService";
export const useSearchClientsStore = defineStore("clients", () => {
  const clients = ref([]);
  const searchClients = ref([]);

  const getClients = async (page, perPage) => {
    clients.value = [];
    const response = await ClientService.getClients(page, perPage);
    clients.value = response.data;
  };

  const getClientByCode = async (code) => {
    searchClients.value = [];
    clients.value = [];
    const response = await ClientService.getClientsByCode(code);
    clients.value = response.data.data;

    searchClients.value = clients.value.map((item) => {
      return {
        id: item.id, //contract_client_id
        clientId: item.client.id, //client_id
        firstname: item.client.name,
        lastname: item.client.lastname,
        dmsCode: item.dms_code,
        passportSeria: item.client.seria,
        passportNumber: item.client.number,
        program: item.program.name,
        type: "Клиент",
      };
    });
    console.log(response);
  };
  const getClientByName = async (name) => {
    searchClients.value = [];
    clients.value = [];
    const response = await ClientService.getClientsByName(name);
    console.log(response);
    clients.value = response.data.data;
    searchClients.value = clients.value.map((item) => {
      return {
        id: item.id,
        clientId: item.client.id,
        firstname: item.client.name,
        lastname: item.client.lastname,
        dmsCode: item.dms_code,
        passportSeria: item.client.seria,
        passportNumber: item.client.number,
        program: item.program.name ? item.program.name : "no program",
        type: "Клиент",
      };
    });
    console.log("searchClients", searchClients);
  };

  const getClientByPassport = async (passport) => {
    searchClients.value = [];
    clients.value = [];
    const response = await ClientService.getClientsByPassport(passport);
    console.log(response);
    clients.value = response.data.data;
    searchClients.value = clients.value.map((item) => {
      return {
        id: item.id,
        clientId: item.client.id,
        firstname: item.client.name,
        lastname: item.client.lastname,
        dmsCode: item.dms_code,
        passportSeria: item.client.seria,
        passportNumber: item.client.number,
        program: item.program.name ? item.program.name : "no program",
        type: "Клиент",
      };
    });
    console.log("searchClients", searchClients);
  };

  function $resetSearchClients() {
    searchClients.value = [];
  }

  return {
    clients,
    searchClients,
    getClients,
    $resetSearchClients,
    getClientByCode,
    getClientByName,
    getClientByPassport,
  };
});
