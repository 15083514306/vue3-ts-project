<template>
  <el-form 
    :model="data" 
  >
    <h1>{{ title }}</h1>
    <el-row :gutter="10">
      <template
        v-for="item in config" 
        :key="item.key" 
      >
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
          <el-form-item 
            :label="item.label"
            v-bind="item?.formOption"
          >
            <el-select 
              v-if="item.type === 'el-select'" 
              v-model="data[item.key]"
              :placeholder="placeholder"
              v-bind="item?.formItemOption"
            >
              <el-option
                v-for="sl in item.childOptions" 
                :key="sl.value" 
                :label="sl.label" 
                :value="sl.value"
              />
            </el-select>

            <el-date-picker
              v-else-if="item.type === 'el-date-picker'"
              type="date-picker"
              v-model="data[item.key]"
              :placeholder="placeholder"
              v-bind="item?.formItemOption"
            />
    
            <el-time-picker
              v-else-if="item.type === 'el-time-picker'"
              v-model="data[item.key]"
              :placeholder="placeholder"
              v-bind="item?.formItemOption"
            />
    
            <el-switch
              v-else-if="item.type === 'el-switch'"
              v-model="data[item.key]"
              :placeholder="placeholder"
              v-bind="item?.formItemOption"
            />
    
            <el-checkbox-group
              v-else-if="item.type === 'el-checkbox-group'"
              v-model="data[item.key]"
              :placeholder="placeholder"
              v-bind="item?.formItemOption"
            >
              <el-checkbox label="Online activities" name="type" />
              <el-checkbox label="Promotion activities" name="type" />
              <el-checkbox label="Offline activities" name="type" />
              <el-checkbox label="Simple brand exposure" name="type" />
            </el-checkbox-group>
    
            <el-radio-group
              v-else-if="item.type === 'el-radio-group'"
              v-model="data[item.key]"
              :placeholder="placeholder"
              v-bind="item?.formItemOption"
            >
              <el-radio label="Sponsor" />
              <el-radio label="Venue" />
            </el-radio-group>
    
            <el-input 
              v-else-if="item.type === 'el-input'" 
              v-model="data[item.key]"
              :placeholder="placeholder"
              v-bind="item?.formItemOption"
            />

            <div v-else >请检查form配置</div>
    
          </el-form-item>
        </el-col>

      </template>
      
      <el-col :span="6">
        <slot name="serch">
          <el-button type="danger" @click="onClear">重置</el-button>
          <el-dropdown 
            split-button 
            type="primary"
            style="margin-left:10px"
            @click="onSubmit"
          >
            查询
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>
                  <el-button @click="onClear">Action 1</el-button>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button @click="onClear">Action 2</el-button>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button @click="onClear">Action 3</el-button>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </slot>
      </el-col>
    </el-row>
  </el-form>
</template>

<script lang="ts" setup>
import { toRefs } from 'vue'
import { IAny, IFromConfig } from './type'

const placeholder:string = '请输入...'

interface IProps{
  data:IAny,
  config:IFromConfig[],
  title:string
}

const props = withDefaults(defineProps<IProps>(), {
  title:'标题....',
})
let { data, config} = toRefs(props)
const $emit = defineEmits<{
  success:[data:IAny],
  clear:[data:IAny],
}>()

const onSubmit = () => {
  $emit('success',props.data)
}
const onClear = () => {
  data.value = {}
}
</script>
<style scoped>
    .el-select{
      width: 100%;
    }
</style>