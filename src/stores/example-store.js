import { defineStore } from "pinia";

export const useCounterStore = defineStore("counter", {
  state: () => ({
    testOptions: [
      {
        id: "CL0001",
        clinicName: "Клиника Здоровье",
      },
      {
        id: "CL0002",
        clinicName: "Медцентр Созвездие",
      },
      {
        id: "CL0003",
        clinicName: "Госпиталь Надежда",
      },
      {
        id: "CL0004",
        clinicName: "Клиника Аврора",
      },
      {
        id: "CL0005",
        clinicName: "Медикал Сити",
      },
      {
        id: "CL0006",
        clinicName: "Клиника Мира",
      },
      {
        id: "CL0007",
        clinicName: "Городская клиника",
      },
      {
        id: "CL0008",
        clinicName: "Клиника Здоровье",
      },
      {
        id: "CL0009",
        clinicName: "Медцентр Созвездие",
      },
      {
        id: "CL0010",
        clinicName: "Госпиталь Надежда",
      },
      {
        id: "CL0011",
        clinicName: "Клиника Аврора",
      },
      {
        id: "CL0012",
        clinicName: "Медикал Сити",
      },
      {
        id: "CL0013",
        clinicName: "Клиника Мира",
      },
      {
        id: "CL0014",
        clinicName: "Городская клиника",
      },
    ],
    selectedOption: null,
    selectedOptions: [],
  }),
  actions: {
    selectOption(option) {
      this.selectedOption = option;
    },
    selectOptions(option) {
      const index = this.selectedOptions.findIndex(
        (testOption) => testOption.id === option.id
      );
      if (index > -1) {
        this.selectedOptions.splice(index, 1);
      } else {
        this.selectedOptions.push(option);
      }
    },
  },
  getters: {
    checkSelectOption(state) {
      return (option) => state.selectedOption?.id === option.id;
    },
    checkSelectOptions(state) {
      return (option) =>
        state.selectedOptions.some(
          (selectedOption) => selectedOption.id === option.id
        );
    },
  },
});
