import DefaultTheme from "vitepress/theme-without-fonts";
import "./billmora.css";
import HomeContent from "./components/HomeContent.vue";
import type { Theme } from "vitepress";

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component("HomeContent", HomeContent);
  },
} satisfies Theme;
