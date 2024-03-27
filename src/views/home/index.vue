<template>
  <Search
    title="首页查询"
    :data="formData"
    :config="searchConfig"
    @success="onSuccess"
    @clear="onClear"
  >
    <!-- <template #serch>
    <el-button >测试</el-button>
  </template> -->
  </Search>

  <ElButton @click="clearFilter">
    清除
  </ElButton>
  <ElButton @click="handleAdd">
    新增
  </ElButton>
  <ElButton @click="handleUpdate">
    修改
  </ElButton>
  <ElButton @click="handleDel">
    删除
  </ElButton>

  <Table
    ref="tableRef"
    :table-header="tableHeader"
    :table-data="tableData"
    @select="handleSelect"
  />
</template>

<script lang="ts" setup>
// import { ref, inject, defineAsyncComponent } from "vue";
import { useConfig } from "./config";
import { Icommon, Home } from "@/interfaces";
const $bus: any = inject("$bus");
import items from "./homeItem/index.vue";
console.log("items", items);
//----------------form-----------------
let formData = ref<Icommon.IAny>({ name: "张三niubi" });
//查询
const onSuccess = () => {
  console.log("查询", formData);
};
const onClear = () => {
  console.log("重置", formData);
};

//---------------table------------------
const tableRef = ref();
let selections = ref<Home.Idata[]>([]);
const tableData = ref<Home.Idata[]>([
  {
    date: "2016-05-03",
    name: "Tom",
    address: "2",
    tag: false,
    id: "123",
  },
  {
    date: "2016-05-04",
    name: "noy",
    address: "1",
    tag: false,
    id: "124",
  },
]);

//清除
const clearFilter = () => {
  tableRef.value.eltable!.clearSort();
};
//新增
const handleAdd = () => {
  $bus.$emit("openDialog", {
    title: "新增",
    component: defineAsyncComponent(() => import("./homeItem/index.vue")),
    dialogAttr: {
      isCustomFooter: true,
    },
    dialogEvent: {},
    componentAttr: {
      id: null,
    },
    componentEvent: {
      success: (val: any) => {
        tableData.value.push(val);
      },
    },
  });
};
//修改
const handleUpdate = () => {
  if (selections.value.length === 0) {
    return alert("选一点");
  }
  $bus.$emit("openDialog", {
    title: "修改",
    component: defineAsyncComponent(() => import("./homeItem/index.vue")),
    dialogAttr: {},
    dialogEvent: {},
    componentAttr: {
      id: selections.value[0].id,
    },
    componentEvent: {},
  });
};
//删除
const handleDel = () => {
  if (selections.value.length !== 1) {
    return alert("只能选一点");
  }
  tableData.value = tableData.value.filter((item) => {
    return item !== selections.value[0];
  });
};
//多选
const handleSelect = (selection: any, row: any) => {
  selections.value = selection;
  console.log("selection, row", selections.value, row);
};
let { searchConfig, tableHeader } = useConfig(handleAdd);

// onMounted(() => {
//   console.log('j')
// });
</script>
