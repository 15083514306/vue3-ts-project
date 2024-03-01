<!-- Child.vue -->
<script lang="ts" setup>
import {ref} from 'vue'
import { Home } from '@/interfaces'
// import Category from '@/components/Category/index.vue'
import { IFromConfig } from '@/myComponents/IForm/type.ts'
interface props {
  id:string
}

const props = withDefaults(defineProps<props>(),{
  id:'000'
})
const $emit = defineEmits<{
  success: [data: IAny],
  close:any,
}>()

let data = ref<Home.Idata>(
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'Home',
    tag: '1',
    id:'123'
  },
)

const handleAdd =()=>{
  $emit('success',data.value)
  $emit('close')
}

let dictConfig = ref<IFromConfig[]>([
  {
    label: '时间',
    key: 'date',
    type: 'input',
    layoutAttrs: {
      columnSize:12,
    },
  },
  {
    label: '名称',
    key: 'name',
    type: 'input',
    layoutAttrs: {
      columnSize: 12,
    },
  },
  {
    label: '地址',
    key: 'address',
    type: 'input',
    layoutAttrs: {
      columnSize: 12,
    },
  },
  {
    label: '标签',
    key: 'tag',
    type: 'radio',
    layoutAttrs: {
      columnSize: 12,
    },
    formItemAttrs:{
      options:[
        {
          label:'1',
          value:'1'
        },
        {
          label:'2',
          value:'2'
        }
      ]
    }
  },
  {
    label: 'id',
    key: 'id',
    type: 'input',
    layoutAttrs: {
      columnSize: 12,
    },
  },
])

</script>

<template>
  <ILayout>
   <!-- <template #header>
      <h1>牛逼里</h1>
   </template> -->
    <IForm  
      :dataForm="data"
      :dictConfig="dictConfig"
    >
    </IForm>
   <template #footer>
    <div class="footer">
      <el-button @click="handleAdd">关闭</el-button>
      <el-button type="primary" @click="handleAdd">确认</el-button>
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