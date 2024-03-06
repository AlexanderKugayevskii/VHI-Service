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
    const response = await ClientService.getClientsByCode(code);
    searchClients.value = response.data.data;
    clients.value = searchClients.value.map((item) => {
      return {
        id: item.id,
        clientId: item.client.id,
        firstname: item.client.name,
        lastname: item.client.lastname,
        dmsCode: item.dms_code,
        passportSeria: item.client.seria,
        passportNumber: item.client.number,
        program: item.program.name,
      };

      console.log(clients.value);
      console.log(clients.value.client.name);
      console.log(clients.value.client.lastname);
    });

    console.log(clients.value);
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
  };
});
