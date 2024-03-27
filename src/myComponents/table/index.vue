<template>
  <div>
    <ElTable
      ref="eltable"
      :data="tableData"
      style="text-align: center; width: 100%"
      v-bind="$attrs"
    >
      <!-- 复选框 -->
      <ElTableColumn
        v-if="isTypeSelection"
        type="selection"
        width="55"
      />
      <!-- 表格内容 -->
      <ElTableColumn
        v-for="item in tableHeader"
        :key="item.key"
        style="white-space: pre-wrap"
        :label="item.label"
        :property="item.key"
        width="auto"
        :show-overflow-tooltip="tooltip"
        sortable
        v-bind="item.columnAttrs"
      >
        <template #default="scope">
          <ElSwitch
            v-if="item.type === 'switch'"
            v-model="scope.row[item.key!]"
            v-bind="item.typeOption.typeAttrs"
            v-on="item.typeOption.typeEvents"
          />
          <!-- 按钮组件的单个按钮 -->

          <div v-else-if="item.type === 'button'">
            <span
              v-for="(btn, index) in item.typeOption.buttons"
              :key="index"
            >
              <ElButton
                link
                :type="btn.type"
                size="small"
                v-bind="btn.typeAttrs"
                @click="btn.typeEvents.click(scope.row)"
              >{{ btn.text }}</ElButton>
              <span v-if="index !== 2 && item.typeOption.length > 3 && index !== 5">|</span>
            </span>
          </div>
          <span v-else>
            {{ item.formatter ? item.formatter(scope.row) : scope.row[item.key!] }}
          </span>
        </template>
      </ElTableColumn>
    </ElTable>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ElTable } from "element-plus";
import { ITableConfig } from "./type";
interface IAny {
  [t: string]: any;
}
const $emit = defineEmits([]);
const props = withDefaults(
  defineProps<{
    isTypeSelection?: boolean;
    tooltip?: boolean;
    tableHeader: ITableConfig[];
    tableData: IAny[];
  }>(),
  {
    isTypeSelection: true,
    tooltip: false,
    tableHeader: () => [],
    tableData: () => [],
  }
);
const eltable = ref<InstanceType<typeof ElTable>>();

defineExpose({
  eltable,
});
</script>

<style scoped>
.el-button {
  margin: 0 5px;
}
</style>
