import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import "@fontsource/pt-sans/400.css";
import "@fontsource/pt-sans/700.css";
import "./assets/theme.css";

const app = createApp(App);
app.use(createPinia());
app.mount("#app");
