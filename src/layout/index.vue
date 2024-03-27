<template>
  <ElContainer class="layout-container">
    <!-- 侧边栏 -->
    <Slider />
    <!-- 顶部导航栏 -->
    <Tabbar />
    <!-- 内容展示区域 -->
    <Main />
  </ElContainer>
</template>

<script lang="ts">
export default {
  name: "Layout",
};
</script>

<script setup lang="ts">
import Slider from "@/layout/slider/index.vue";
import Tabbar from "@/layout/tabbar/index.vue";
import Main from "@/layout/main/index.vue";
</script>

<style lang="scss" scoped>
.layout-container {
  width: 100%;
  height: 100vh;
}
</style>
