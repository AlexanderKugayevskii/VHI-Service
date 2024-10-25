import { ref, computed, reactive } from "vue";
import dayjs from "dayjs";

export function useHistory() {
  const actions = reactive({
    application_created: "history.application_created",
    application_updated: "history.application_updated",
    application_deleted: "history.application_deleted",
    application_closed: "history.application_closed",
    application_service_created: "history.application_service_created",
    application_service_updated: "history.application_service_updated",
    application_service_deleted: "history.application_service_deleted",
    application_doctor_created: "history.application_doctor_created",
    application_doctor_updated: "history.application_doctor_updated",
    application_doctor_deleted: "history.application_doctor_deleted",
    application_drug_created: "history.application_drug_created",
    application_drug_updated: "history.application_drug_updated",
    application_drug_deleted: "history.application_drug_deleted",
    application_comment_updated: "history.application_comment_updated",
    application_diagnosis_updated: "history.application_diagnosis_updated",
    application_limit_updated: "history.application_limit_updated",
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
        type: "history.service",
        name: item.changes.service_names.name,
      };
    }
    if (item.changes.hasOwnProperty("doctor_name")) {
      whatChanged = {
        type: "history.doctor",
        name: item.changes.doctor_name,
      };
    }
    if (
      item.changes.hasOwnProperty("diagnosis") &&
      item.action !== "application_created"
    ) {
      whatChanged = {
        type: "history.diagnosis",
        name: item.changes.diagnosis,
      };
    }
    if (item.changes.hasOwnProperty("drug_name")) {
      whatChanged = {
        type: "history.medicine",
        name: item.changes.drug_name,
      };
    }

    if (item.changes.hasOwnProperty("comment")) {
      whatChanged = {
        type: "history.comment",
        name: item.changes.comment,
      };
    }

    switch (lastStatus) {
      case "created": {
        action = "history.added";
        break;
      }
      case "updated": {
        action = "history.changed";
        break;
      }
      case "deleted": {
        action = "history.deleted";
        break;
      }
      case "closed": {
        action = "history.finished";
        break;
      }
    }

    if (item.action === "application_created") {
      action = "history.created";
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
