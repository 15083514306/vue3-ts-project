<template>
  <ElAside
    class="slider-container"
    :class="{ isFold: settingStore.isFold }"
  >
    <ElScrollbar>
      <Logo />
      <ElMenu
        class="menu-container"
        background-color="#001529"
        text-color="white"
        :default-active="$route.path"
        :collapse="settingStore.isFold"
        router
      >
        <!-- 以上的router表示启用该模式会在激活导航时以 index 作为 path 进行路由跳转 -->
        <Menu :menu-list="menuRoutesList" />
      </ElMenu>
    </ElScrollbar>
  </ElAside>
</template>

<script setup lang="ts">
import Logo from "@/layout/logo/index.vue";
import Menu from "@/layout/menu/index.vue";

import useUserStore from "@/store/modules/user";
import useSettingStore from "@/store/modules/setting";

let userStore = useUserStore();
let settingStore = useSettingStore();
let menuRoutesList = userStore.menuRoutes;
</script>

<script lang="ts">
export default {
  name: "Slider",
};
</script>

<style lang="scss" scoped>
.slider-container {
  width: $base-menu-width;
  height: 100vh;
  background-color: $base-menu-background;
  transition: all 0.5s;

  &.isFold {
    width: $base-menu-min-width;
  }
  .menu-container {
    border-right: 0;
  }
}
</style>
