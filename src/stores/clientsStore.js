import { defineStore } from "pinia";
import { ref } from "vue";
import ClientService from "src/services/ClientService";
export const useClientsStore = defineStore("clients", () => {
  const clients = ref({});
  const searchClients = ref([]);

  const getClients = async (page, perPage) => {
    clients.value = {};
    const response = await ClientService.getClients(page, perPage);
    clients.value = response.data;
  };

  const getClientsForAppealByPassport = async (passport) => {
    const response = await ClientService.getClientsBySearch(passport);
    searchClients.value = response.data;
  };

  function $resetSearchClients() {
    searchClients.value = [];
  }

  return {
    clients,
    searchClients,
    getClients,
    getClientsForAppealByPassport,
    $resetSearchClients,
  };
});
