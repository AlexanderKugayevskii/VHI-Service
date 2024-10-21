import { ref, computed } from "vue";
import dayjs from "dayjs";

export function useHistory() {
  const actions = {
    application_created: "Обращение создано",
    application_updated: "Обращение изменено",
    application_deleted: "Обращение удалено",
    application_service_created: "Добавлен сервис",
    application_service_updated: "Изменен сервис",
    application_service_deleted: "Удален сервис",
    application_doctor_created: "Добавлен врач",
    application_doctor_updated: "Изменен врач",
    application_doctor_deleted: "Удален врач",
    application_drug_created: "Добавлено лекарство",
    application_drug_updated: "Изменено лекарство",
    application_drug_deleted: "Удалено лекарство",
  };

  const getStatus = (message) => {
    return actions[message] || "uknown action";
  };

  const getFormatDate = (date) => {
    return dayjs(date).format("DD.MM.YYYY - HH:mm");
  };

  const getActionMessage = (item) => {
    const lastStatus = item.action.split("_").pop();

    let action = "";

    switch (lastStatus) {
      case "created": {
        action = "Создал";
        break;
      }
      case "updated": {
        action = "Изменил";
        break;
      }
      case "deleted": {
        action = "Удалил";
        break;
      }
    }

    return {
      username: item.user.name,
      action,
      initStatus: lastStatus,
    };
  };

  return { actions, getStatus, getFormatDate, getActionMessage };
}
