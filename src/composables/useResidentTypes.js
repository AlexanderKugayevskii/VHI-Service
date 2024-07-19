import { ref } from "vue";

export default function useResidentTypes() {
  return ref([
    {
      id: 1,
      name: "Гражданин",
    },
    {
      id: 2,
      name: "Иностранец",
    },
    {
      id: 3,
      name: "ЛБГ",
    },
    {
      id: 4,
      name: "Военный",
    },
    {
      id: 5,
      name: "Иностранный резидент",
    },
    {
      id: 6,
      name: "Ребёнок",
    },
  ]);
}
