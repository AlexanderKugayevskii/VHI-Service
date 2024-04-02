import Echo from "laravel-echo";

import Pusher from "pusher-js";

window.Pusher = Pusher;

export default function boot({ app }) {
  const echo = new Echo({
    broadcaster: "pusher",
    key: "f1cfa5a35507dfae21ca",
    cluster: "ap2",
    encrypted: true,
  });

  app.globalProperties.$echo = echo;
}


