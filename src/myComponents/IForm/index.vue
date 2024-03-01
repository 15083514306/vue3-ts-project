<template>
  <div class="iform">
    <el-form 
      ref="iForm" 
      :label-width="labelWidth" 
      :model="dataForm" 
      v-bind="$attrs"
    >
      <el-row :gutter="10">
        <template v-for="item in dictConfig">
          <el-col 
            v-show="!item.layoutAttrs.hide? true : false" 
            :span="item.layoutAttrs.columnSize || columnSize"
            style="height: 100%" 
            v-bind="item.layoutAttrs"
          >
            <el-form-item :key="item.key" :label="item.label" :prop="item.key"
              v-bind="item.formItemAttrs" v-on="item.formItemListeners">
              <template v-if="item.type === 'cascader'">
                <el-cascader 
                  v-model="dataForm[item.key]"
                  :class="item.class" 
                  :options="item.formItemAttrs?.options"
                  style="width: 100%" 
                  v-bind="item.formItemAttrs" 
                  v-on="item.formItemListeners" />
              </template>
              <template v-else-if="item.type === 'select'">
                <div class="layout_flex">
                  <el-select 
                    v-model="dataForm[item.key]" 
                    :class="item.class" 
                    style="width: 100%"
                    clearable
                    v-bind="item.formItemAttrs" 
                    v-on="item.formItemListeners"
                  >
                    <template v-for="dt in item.formItemAttrs?.options" :key="dt.value">
                      <el-option :label="dt.label" :value="dt.value" />
                    </template>
                  </el-select>
                  <slot v-if="item.slot" :data="item" :name="item.slot" />
                </div>
              </template>
              <template v-else-if="item.type === 'radio'">
                <template v-for="dt in item.formItemAttrs?.options" :key="dt.value">
                  <el-radio 
                    :label="dt.label"
                    v-model="dataForm[item.key]" 
                    :class="item.class"
                    v-bind="item.formItemAttrs"
                    v-on="item.formItemListeners"
                  >{{ dt.label }}
                  </el-radio>
                </template>
              </template>
              <template v-else-if="item.type === 'checkbox'">
                <el-checkbox v-model="dataForm[item.key]" :class="item.class"
                  style="width: 100%;margin: 1px 0" 
                  v-bind="item.formItemAttrs"
                  v-on="item.formItemListeners" />
              </template>
              <template v-else-if="['date','datetime'].includes(item.type) ">
                <el-date-picker v-model="dataForm[item.key]" :class="item.class"
                  :type="item.type"
                  :format="item.formItemAttrs?.format || 'yyyy-MM-dd'"
                  :value-format="item.formItemAttrs?.valueFormat || 'yyyy-MM-dd'" 
                  v-bind="item.formItemAttrs"
                  v-on="item.formItemListeners" />
              </template>
              <template v-else-if="item.type === 'textarea'">
                <el-input 
                  v-model="dataForm[item.key]" 
                  v-replaceval
                  :autosize="{ minRows: item.minRows || 2, maxRows: item.maxRows || 6 }" 
                  :class="item.class" 
                  type="textarea"
                  v-bind="item.formItemAttrs" 
                  v-on="item.formItemListeners" />
              </template>
              <template v-else-if="item.type === 'html'">
                <el-input 
                  v-html="dataForm[item.key]" 
                  :autosize="{ minRows: item.minRows || 2, maxRows: item.maxRows || 6 }" 
                  :class="item.class"
                  type="textarea"
                  v-bind="item.formItemAttrs" 
                  v-on="item.formItemListeners"
                />
              </template>
              <template v-else>
                <div class="layout_flex">
                  <el-input   
                    v-model="dataForm[item.key]" 
                    :class="item.class" 
                    clearable 
                    v-bind="item.formItemAttrs"
                    v-on="item.formItemListeners" />
                  <slot v-if="item.slot" :data="item" :name="item.slot" />
                </div>
              </template>
            </el-form-item>
          </el-col>
        </template>
      </el-row>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { toRefs, defineComponent } from 'vue'
import {IProps } from './type'

defineComponent({
  name: 'IForm'
})

const props = withDefaults(defineProps<IProps>(), {
  dataForm: () => {
    return {}
  },
  labelWidth:"100px"
})
let {
  dataForm,
  dictConfig,
  labelWidth,
  columnSize
 } = toRefs(props)

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
