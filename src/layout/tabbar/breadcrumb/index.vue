<template>
  <!-- 折叠侧边栏图标 -->
  <ElIcon
    class="fold-icon"
    @click="foldHandler"
  >
    <Component :is="settingStore.isFold ? 'Expand' : 'Fold'" />
  </ElIcon>
  <!-- 面包屑 -->
  <ElBreadcrumb
    class="breadcrumb"
    separator-icon="ArrowRight"
    separator="/"
  >
    <ElBreadcrumbItem
      v-for="(item, index) in $route.matched"
      v-show="item.meta.title"
      :key="index"
      :to="item.path"
    >
      <!-- 首页是二级路由中只有一个，要用v-show特殊处理 不能用v-if 优先级比v-for高 -->
      <ElIcon class="breadcrumb-icon">
        <Component :is="item.meta.icon" />
      </ElIcon>
      <span class="breadcrumb-title">{{ item.meta.title }}</span>
    </ElBreadcrumbItem>
  </ElBreadcrumb>
</template>

<script setup lang="ts">
import useSettingStore from "@/store/modules/setting";
let settingStore = useSettingStore();
const foldHandler = () => {
  settingStore.isFold = !settingStore.isFold;
  // localStorage.setItem('isFold', settingStore.isFold.toString())
};
</script>

<script lang="ts">
export default {
  name: "Breadcrumb",
};
</script>

<style lang="scss" scoped>
.fold-icon {
  cursor: pointer;
}

.breadcrumb {
  margin-left: 16px;

  .breadcrumb-icon {
    vertical-align: middle;
  }

  .breadcrumb-title {
    margin: 0 5px;
    vertical-align: middle;
  }
}
</style>
