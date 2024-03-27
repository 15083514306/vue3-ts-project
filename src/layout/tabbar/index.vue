<template>
  <ElHeader
    class="layout_tabbar"
    :class="{ isFold: settingStore.isFold }"
  >
    <div class="left">
      <Breadcrumb />
    </div>
    <div class="right">
      <Setting />
    </div>
  </ElHeader>
</template>

<script lang="ts" setup>
import breadcrumb from "./breadcrumb/index.vue";
import setting from "./setting/index.vue";
import useSettingStore from "@/store/modules/setting";

const settingStore = useSettingStore();
</script>

<script lang="ts">
export default {
  name: "Tabbar",
};
</script>

<style lang="scss" scoped>
.layout_tabbar {
  display: flex;
  justify-content: space-between;
  position: fixed;
  width: calc(100% - $base-menu-width);
  height: $base-tabbar-height;
  top: 0;
  left: $base-menu-width;
  transition: all 0.5s;
  box-shadow: #00000026 0 3px 3px;
  z-index: 999;

  &.isFold {
    width: calc(100% - $base-menu-min-width);
    left: $base-menu-min-width;
  }
  .left {
    display: flex;
    align-items: center;
  }

  .right {
    display: flex;
    align-items: center;
  }
}
</style>
