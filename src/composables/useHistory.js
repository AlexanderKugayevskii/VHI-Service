import { ref, computed, reactive } from "vue";
import dayjs from "dayjs";

export function useHistory() {
  const actions = reactive({
    application_created: "Обращение создано",
    application_updated: "Обращение изменено",
    application_deleted: "Обращение удалено",
    application_closed: "Обращение завершено",
    application_service_created: "Добавлен сервис",
    application_service_updated: "Изменен сервис",
    application_service_deleted: "Удален сервис",
    application_doctor_created: "Добавлен врач",
    application_doctor_updated: "Изменен врач",
    application_doctor_deleted: "Удален врач",
    application_drug_created: "Добавлено лекарство",
    application_drug_updated: "Изменено лекарство",
    application_drug_deleted: "Удалено лекарство",
    application_comment_updated: "Изменен комментарий",
    application_diagnosis_updated: "Изменен диагноз",
    application_limit_updated: "Назначен лимит",
  });

  const getStatus = (item) => {
    if (item.action !== "application_created") {
      if (item.changes.hasOwnProperty("comment")) {
        return actions.application_comment_updated;
      }
      if (item.changes.hasOwnProperty("diagnosis")) {
        return actions.application_diagnosis_updated;
      }
      if (item.changes.hasOwnProperty("status") && item.changes.status === 2) {
        return actions.application_closed;
      }
      if (item.changes.hasOwnProperty("program_item_id")) {
        return actions.application_limit_updated;
      }
    }
    return actions[item.action] || "unknown action";
  };

  const getFormatDate = (date) => {
    return dayjs(date).format("DD.MM.YYYY - HH:mm");
  };

  const getActionMessage = (item) => {
    const lastStatus =
      item.changes.hasOwnProperty("status") && item.changes.status === 2
        ? "closed"
        : item.action.split("_").pop();

    let action = "";
    let whatChanged = null;

    if (item.changes.hasOwnProperty("service_names")) {
      whatChanged = {
        type: "Сервис",
        name: item.changes.service_names.name,
      };
    }
    if (item.changes.hasOwnProperty("doctor_name")) {
      whatChanged = {
        type: "Врач",
        name: item.changes.doctor_name,
      };
    }
    if (
      item.changes.hasOwnProperty("diagnosis") &&
      item.action !== "application_created"
    ) {
      whatChanged = {
        type: "Диагноз",
        name: item.changes.diagnosis,
      };
    }
    if (item.changes.hasOwnProperty("drug_name")) {
      whatChanged = {
        type: "Лекарство",
        name: item.changes.drug_name,
      };
    }

    if (item.changes.hasOwnProperty("comment")) {
      whatChanged = {
        type: "Комментарий",
        name: item.changes.comment,
      };
    }

    switch (lastStatus) {
      case "created": {
        action = "Добавил";
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
      case "closed": {
        action = "Завершил";
        break;
      }
    }

    if (item.action === "application_created") {
      action = "Создал";
    }

    return {
      username: item.user.name,
      action,
      initStatus: lastStatus,
      whatChanged,
    };
  };

  return { actions, getStatus, getFormatDate, getActionMessage };
}
