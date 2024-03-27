/// <reference types="vite/client" />
declare module "lodash/cloneDeep.js";
declare module "default-passive-events";

declare module "*.vue" {
  import type { DefineComponent } from "vue";

  const vueComponent: DefineComponent<{}, {}, any>;

  export default vueComponent;
}
