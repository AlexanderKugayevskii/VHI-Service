import Echo from "laravel-echo";
import Pusher from "pusher-js";

window.Pusher = Pusher;

// window.Echo = new Echo({
//   broadcaster: "pusher",
//   key: "bdeb05fa9627713cacd8",
//   cluster: "ap2",
//   encrypted: true,
// });
const echo = new Echo({
  broadcaster: "pusher",
  key: "bdeb05fa9627713cacd8",
  cluster: "ap1",
  encrypted: true,
});

// 1a90f936db865826ebdc

echo.connector.pusher.connection.bind("error", (error) => {
  console.error("Socket error:", error);
});

echo.connector.pusher.connection.bind("connecting", () => {
  console.log("Connecting to Pusher...");
});

echo.connector.pusher.connection.bind("connected", () => {
  console.log("Connected to Pusher!");
});

echo.connector.pusher.connection.bind("disconnected", () => {
  console.warn("Disconnected from Pusher.");
});

export default echo;
