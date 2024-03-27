<!-- Child.vue -->
<script lang="ts" setup name="homeItem">
import { Home } from "@/interfaces";
// import Category from '@/components/Category/index.vue'
import { IFromConfig } from "@/myComponents/IForm/type.ts";
const props = withDefaults(
  defineProps<{
    id: string;
  }>(),
  {
    id: "000",
  }
);

console.log("props", props);
const $emit = defineEmits<{
  success: [data: Iempty];
  close: any;
}>();

let data = ref<Home.Idata>({
  date: "2016-05-03",
  name: "Tom",
  address: "Home",
  tag: "1",
  id: "123",
});

const handleAdd = () => {
  console.log("jj");
  $emit("success", data.value);
  $emit("close");
};

let dictConfig = ref<IFromConfig[]>([
  {
    label: "时间",
    key: "date",
    type: "input",
    layoutAttrs: {
      columnSize: 12,
    },
  },
  {
    label: "名称",
    key: "name",
    type: "input",
    layoutAttrs: {
      columnSize: 12,
    },
  },
  {
    label: "地址",
    key: "address",
    type: "input",
    layoutAttrs: {
      columnSize: 12,
    },
  },
  {
    label: "标签",
    key: "tag",
    type: "radio",
    layoutAttrs: {
      columnSize: 12,
    },
    formItemAttrs: {
      options: [
        {
          label: "1",
          value: "1",
        },
        {
          label: "2",
          value: "2",
        },
      ],
    },
  },
  {
    label: "id",
    key: "id",
    type: "input",
    layoutAttrs: {
      columnSize: 12,
    },
  },
]);
</script>

<template>
  <ILayout>
    <!-- <template #header>
      <h1>牛逼里</h1>
   </template> -->
    <IForm
      :data-form="data"
      :dict-config="dictConfig"
    />
    <template #footer>
      <div class="footer">
        <ElButton @click="handleAdd">
          关闭
        </ElButton>
        <ElButton
          type="primary"
          @click="handleAdd"
        >
          确认
        </ElButton>
      </div>
    </template>
  </ILayout>
</template>

<style lang="scss" scoped>
.footer {
  text-align: right;
  margin-right: 10px;
}
</style>
