import { boot } from "quasar/wrappers";
import { Notify } from "quasar";

export default boot(() => {
  Notify.registerType("success", {
    classes: "notify notify-success",
    timeout: 1000,
    position: "bottom-left",
    icon: "img:/public/icons/success-icon.svg",
    group: false,
  });

  Notify.registerType("error", {
    classes: "notify notify-error",
    timeout: 1000,
    position: "bottom-left",
    icon: "img:/public/icons/reject-icon.svg",
    group: false,
  });
});
