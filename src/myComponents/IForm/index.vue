<template>
  <div class="iform">
    <ElForm
      ref="iForm"
      :label-width="labelWidth"
      :model="dataForm"
      v-bind="$attrs"
    >
      <ElRow :gutter="10">
        <template
          v-for="item in dictConfig"
          :key="item.key"
        >
          <ElCol
            v-show="!item.layoutAttrs.hide ? true : false"
            :span="item.layoutAttrs.columnSize || columnSize"
            style="height: 100%"
            v-bind="item.layoutAttrs"
          >
            <ElFormItem
              :label="item.label"
              :prop="item.key"
              v-bind="item.formItemAttrs"
              v-on="item.formItemListeners"
            >
              <template v-if="item.type === 'cascader'">
                <ElCascader
                  v-model="dataForm[item.key]"
                  :class="item.class"
                  :options="item.formItemAttrs?.options"
                  style="width: 100%"
                  v-bind="item.formItemAttrs"
                  v-on="item.formItemListeners"
                />
              </template>
              <template v-else-if="item.type === 'select'">
                <div class="layout_flex">
                  <ElSelect
                    v-model="dataForm[item.key]"
                    :class="item.class"
                    style="width: 100%"
                    clearable
                    v-bind="item.formItemAttrs"
                    v-on="item.formItemListeners"
                  >
                    <template
                      v-for="dt in item.formItemAttrs?.options"
                      :key="dt.value"
                    >
                      <ElOption
                        :label="dt.label"
                        :value="dt.value"
                      />
                    </template>
                  </ElSelect>
                  <slot
                    v-if="item.slot"
                    :data="item"
                    :name="item.slot"
                  />
                </div>
              </template>
              <template v-else-if="item.type === 'radio'">
                <template
                  v-for="dt in item.formItemAttrs?.options"
                  :key="dt.value"
                >
                  <ElRadio
                    v-model="dataForm[item.key]"
                    :label="dt.label"
                    :class="item.class"
                    v-bind="item.formItemAttrs"
                    v-on="item.formItemListeners"
                  >
                    {{ dt.label }}
                  </ElRadio>
                </template>
              </template>
              <template v-else-if="item.type === 'checkbox'">
                <ElCheckbox
                  v-model="dataForm[item.key]"
                  :class="item.class"
                  style="width: 100%; margin: 1px 0"
                  v-bind="item.formItemAttrs"
                  v-on="item.formItemListeners"
                />
              </template>
              <template v-else-if="['date', 'datetime'].includes(item.type)">
                <ElDatePicker
                  v-model="dataForm[item.key]"
                  :class="item.class"
                  :type="item.type"
                  :format="item.formItemAttrs?.format || 'yyyy-MM-dd'"
                  :value-format="item.formItemAttrs?.valueFormat || 'yyyy-MM-dd'"
                  v-bind="item.formItemAttrs"
                  v-on="item.formItemListeners"
                />
              </template>
              <template v-else-if="item.type === 'textarea'">
                <ElInput
                  v-model="dataForm[item.key]"
                  v-replaceval
                  :autosize="{ minRows: item.minRows || 2, maxRows: item.maxRows || 6 }"
                  :class="item.class"
                  type="textarea"
                  v-bind="item.formItemAttrs"
                  v-on="item.formItemListeners"
                />
              </template>
              <template v-else>
                <div class="layout_flex">
                  <ElInput
                    v-model="dataForm[item.key]"
                    :class="item.class"
                    clearable
                    v-bind="item.formItemAttrs"
                    v-on="item.formItemListeners"
                  />
                  <slot
                    v-if="item.slot"
                    :data="item"
                    :name="item.slot"
                  />
                </div>
              </template>
            </ElFormItem>
          </ElCol>
        </template>
      </ElRow>
    </ElForm>
  </div>
</template>

<script lang="ts" setup>
import { toRefs } from "vue";
import { IFromConfig } from "./type";
interface IProps {
  dataForm: IAny;
  dictConfig: IFromConfig[];
  labelWidth: string;
  columnSize: string;
}
const props = withDefaults(defineProps<IProps>(), {
  dataForm: () => {
    return {};
  },
  labelWidth: "100px",
});
let { dataForm, dictConfig, labelWidth, columnSize } = toRefs(props);

// const $emit = defineEmits<{
//   success: [data: IAny],
//   clear: [data: IAny],
// }>()
</script>

<style lang="scss" scoped>
.iform {
  width: 100%;
  // height: 100%;
}
.layout_flex {
  display: flex;
}
</style>
