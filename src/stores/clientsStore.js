import { defineStore } from "pinia";
import { ref } from "vue";
import ClientService from "src/services/ClientService";
export const useClientsStore = defineStore("clients", () => {
  const clients = ref({});
  const searchClients = ref([]);

  const getClients = async (page, perPage) => {
    clients.value = {};
    const response = await ClientService.getClients(page, perPage);
    console.log(response.data);
    clients.value = response.data;
  };

  const getClientsForAppealByPassport = async (passport) => {
    const response = await ClientService.getClientByUserID(passport);
    console.log(response);
    searchClients.value = response.data;
  };

  return { clients, searchClients, getClients, getClientsForAppealByPassport };
});
