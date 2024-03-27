<template>
  <ElCard class="category">
    <ElForm inline>
      <ElFormItem label="一级分类">
        <ElSelect
          v-model="categoryStore.c1Id"
          placeholder="请选择"
          :disabled="scene !== 0"
          @change="changeHandler(1)"
        >
          <ElOption
            v-for="c1 in categoryStore.c1ResArr"
            :key="c1.id"
            :label="c1.name"
            :value="c1.id"
          />
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="二级分类">
        <ElSelect
          v-model="categoryStore.c2Id"
          placeholder="请选择"
          :disabled="scene !== 0"
          @change="changeHandler(2)"
        >
          <ElOption
            v-for="c2 in categoryStore.c2ResArr"
            :key="c2.id"
            :label="c2.name"
            :value="c2.id"
          />
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="三级分类">
        <ElSelect
          v-model="categoryStore.c3Id"
          placeholder="请选择"
          :disabled="scene !== 0"
          @change="changeHandler(3)"
        >
          <ElOption
            v-for="c3 in categoryStore.c3ResArr"
            :key="c3.id"
            :label="c3.name"
            :value="c3.id"
          />
        </ElSelect>
      </ElFormItem>
    </ElForm>
  </ElCard>
</template>

<script setup lang="ts">
import { useCategoryStore } from "@/store/modules/category";
import { onMounted } from "vue";

const categoryStore = useCategoryStore();

onMounted(() => {
  categoryStore.getC1();
});

const changeHandler = async (cLevel: number) => {
  switch (cLevel) {
    case 1:
      emit("c1Change");
      categoryStore.c2Id = "";
      categoryStore.c3Id = "";
      categoryStore.c3ResArr = [];
      await categoryStore.getC2();
      break;
    case 2:
      emit("c1Change");
      categoryStore.c3Id = "";
      await categoryStore.getC3();
      break;
    case 3:
      emit("c3Change");
      // 由于这是一个公共组件，不同页面可能会根据c3id发送不同的请求
      // 因此不能在这里做统一处理 应在每个使用的页面发送各自的请求
      break;
  }
};
defineProps(["scene"]);
const emit = defineEmits(["c1Change", "c2Change", "c3Change"]);
</script>

<script lang="ts">
export default {
  name: "Category",
};
</script>

<style lang="scss" scoped>
.category {
  margin-bottom: 28px;
}
</style>
