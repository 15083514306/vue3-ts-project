import { createApp } from "vue";
import App from "@/App.vue";
import ElementPlus from "element-plus";
import zhCN from "element-plus/lib/locale/lang/zh-cn"; //此处国际化有坑 引包有问题
import "element-plus/dist/index.css";
import "virtual:svg-icons-register";
// import GlobalComponents from '@/components'
import "@/styles/index.scss";
import router from "./router";
import pinia from "@/store";
import { permissionBtn } from "@/directive/permission-btn.ts";
import { drag } from "@/directive/drag.ts";
import "element-plus/theme-chalk/dark/css-vars.css"; //暗黑模式所需css
import "default-passive-events"; //解决报错问题：[Violation] Added non-passive event listener to a scroll-blocking <某些> 事件. Consider marking event handler as 'passive' to make the page more responsive. See <URL>
import "@/assets/fonts/font.scss"; //数据大屏使用的字体

import emitter from "@plugins/bus.ts";

const app = createApp(App);
// app.use(GlobalComponents) // 全局注册自定义组件
app.use(ElementPlus, {
  locale: zhCN,
});
app.use(router);
app.use(pinia);
permissionBtn(app); // 全局注册自定义指令
drag(app); // 全局注册自定义指令
app.provide("$bus", emitter);

app.config.errorHandler = (err, instance, info) => {
  // 处理错误，例如：报告给一个服务
  const config = {
    err,
    instance,
    info,
  };
  // console.dir(config,'errorHandler---',)
};

app.config.warnHandler = (msg, instance, trace) => {
  // `trace` 是组件层级结构的追踪
  const config = {
    msg,
    instance,
    trace,
  };
  // console.dir(config,'warnHandler---',)
};

// app.config.performance = true
// app.config.compilerOptions.whitespace = 'preserve'

app.mount("#app");
// https://frontend.devrank.cn/traffic-information/7229651844765599805
