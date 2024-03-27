<template>
  <template
    v-for="item in menuList"
    :key="item.path"
  >
    <!-- 无子路由 -->
    <template v-if="!item.children && !item.meta.hidden">
      <ElMenuItem :index="item.path">
        <ElIcon>
          <Component :is="item.meta.icon" />
        </ElIcon>
        <template #title>
          <span>{{ item.meta.title }}</span>
        </template>
      </ElMenuItem>
    </template>
    <!-- 有子路由且只有一个 注意此处渲染的是子路由别渲染父路由 -->
    <template v-if="item.children && item.children.length === 1">
      <ElMenuItem
        v-if="!item.children[0].meta.hidden"
        :index="item.children[0].path"
      >
        <ElIcon>
          <Component :is="item.children[0].meta.icon" />
        </ElIcon>
        <template #title>
          <span>{{ item.children[0].meta.title }}</span>
        </template>
      </ElMenuItem>
    </template>
    <!-- 有子路由且超过一个 -->
    <template v-if="item.children && item.children.length > 1">
      <ElSubMenu :index="item.path">
        <template #title>
          <ElIcon>
            <Component :is="item.meta.icon" />
          </ElIcon>
          <span>{{ item.meta.title }}</span>
        </template>
        <Menu :menu-list="item.children" />
      </ElSubMenu>
    </template>
  </template>
</template>

<script setup lang="ts">
import Menu from "@/layout/menu/index.vue";
defineProps(["menuList"]);

// 在el-menu添加router属性这里可以不用添加点击事件
// const goRoute = (path: string) => {
//   router.push(path)
// }
</script>
<script lang="ts">
export default {
  name: "SliderMenu",
};
</script>

<style lang="scss" scoped></style>
