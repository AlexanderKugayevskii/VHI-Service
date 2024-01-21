import { defineStore } from "pinia";
import { ref, computed } from "vue";
import ClientService from "src/services/ClientService";
export const useClientsStore = defineStore("clients", () => {
  const clients = ref({});

  const getClients = async (page, perPage) => {
    clients.value = {};
    const response = await ClientService.getClients(page, perPage);
    console.log(response.data)
    clients.value = response.data;
  };

  return { clients, getClients };
});
