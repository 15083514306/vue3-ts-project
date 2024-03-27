<template>
  <ElForm :model="data">
    <h1>{{ title }}</h1>
    <ElRow :gutter="10">
      <template
        v-for="item in config"
        :key="item.key"
      >
        <ElCol
          :xs="24"
          :sm="12"
          :md="8"
          :lg="6"
          :xl="4"
        >
          <ElFormItem
            :label="item.label"
            v-bind="item?.formOption"
          >
            <ElSelect
              v-if="item.type === 'el-select'"
              v-model="data[item.key]"
              :placeholder="placeholder"
              v-bind="item?.formItemOption"
            >
              <ElOption
                v-for="sl in item.childOptions"
                :key="sl.value"
                :label="sl.label"
                :value="sl.value"
              />
            </ElSelect>

            <ElDatePicker
              v-else-if="item.type === 'el-date-picker'"
              v-model="data[item.key]"
              type="date-picker"
              :placeholder="placeholder"
              v-bind="item?.formItemOption"
            />

            <ElTimePicker
              v-else-if="item.type === 'el-time-picker'"
              v-model="data[item.key]"
              :placeholder="placeholder"
              v-bind="item?.formItemOption"
            />

            <ElSwitch
              v-else-if="item.type === 'el-switch'"
              v-model="data[item.key]"
              :placeholder="placeholder"
              v-bind="item?.formItemOption"
            />

            <ElCheckboxGroup
              v-else-if="item.type === 'el-checkbox-group'"
              v-model="data[item.key]"
              :placeholder="placeholder"
              v-bind="item?.formItemOption"
            >
              <ElCheckbox
                label="Online activities"
                name="type"
              />
              <ElCheckbox
                label="Promotion activities"
                name="type"
              />
              <ElCheckbox
                label="Offline activities"
                name="type"
              />
              <ElCheckbox
                label="Simple brand exposure"
                name="type"
              />
            </ElCheckboxGroup>

            <ElRadioGroup
              v-else-if="item.type === 'el-radio-group'"
              v-model="data[item.key]"
              :placeholder="placeholder"
              v-bind="item?.formItemOption"
            >
              <ElRadio label="Sponsor" />
              <ElRadio label="Venue" />
            </ElRadioGroup>

            <ElInput
              v-else-if="item.type === 'el-input'"
              v-model="data[item.key]"
              :placeholder="placeholder"
              v-bind="item?.formItemOption"
            />

            <div v-else>
              请检查form配置
            </div>
          </ElFormItem>
        </ElCol>
      </template>

      <ElCol :span="6">
        <slot name="serch">
          <ElButton
            type="danger"
            @click="onClear"
          >
            重置
          </ElButton>
          <ElDropdown
            split-button
            type="primary"
            style="margin-left: 10px"
            @click="onSubmit"
          >
            查询
            <template #dropdown>
              <ElDropdownMenu>
                <ElDropdownItem>
                  <ElButton @click="onClear">
                    Action 1
                  </ElButton>
                </ElDropdownItem>
                <ElDropdownItem>
                  <ElButton @click="onClear">
                    Action 2
                  </ElButton>
                </ElDropdownItem>
                <ElDropdownItem>
                  <ElButton @click="onClear">
                    Action 3
                  </ElButton>
                </ElDropdownItem>
              </ElDropdownMenu>
            </template>
          </ElDropdown>
        </slot>
      </ElCol>
    </ElRow>
  </ElForm>
</template>

<script lang="ts" setup>
import { toRefs } from "vue";
import { IAny, IFromConfig } from "./type";

const placeholder = "请输入...";

interface IProps {
  data: IAny;
  config: IFromConfig[];
  title: string;
}

const props = withDefaults(defineProps<IProps>(), {
  title: "标题....",
});
let { data, config } = toRefs(props);
const $emit = defineEmits<{
  success: [data: IAny];
  clear: [data: IAny];
}>();

const onSubmit = () => {
  $emit("success", props.data);
};
const onClear = () => {
  data.value = {};
};
</script>
<style scoped>
.el-select {
  width: 100%;
}
</style>
