import {IFromConfig} from '@/myComponents/search/type.ts'
import {ITableConfig} from '@/myComponents/table/type.ts'

export const useConfig=(fn:any)=>{
  const searchConfig:IFromConfig[] = [
    {
      label:'姓名姓名',
      key:"name",
      type:"el-input",
    },
    {
      label:'年年龄',
      key:'age',
      type:"el-input",
    },
    {
      label:'特别的爱好',
      key:'like',
      type:"el-input",
    },
    {
      label:'性别',
      key:'sex',
      type:"el-select",
      formOption:{
  
      },
      formItemOption:{
        
      },
      childOptions:[
        {label:'1',value:'1'},
        {label:'2',value:'2'},
      ]
    },
    {
      label:'地址',
      key:'district',
      type:"el-input",
    },
  ]
  
  const tableHeader:ITableConfig[] = [
    {
      label:'时间',
      key:'date'
    },
    {
      label:'名称',
      key:'name',
    },
    {
      label:'地址',
      key:'address',
      type:'switch',
      typeOption:{
        typeEvents:{
          change:(row:any)=>{
            // fn && fn()
          }
        }
      }
    },
    {
      label:'操作',
      key:'tag',
      type:'button',
      typeOption:{
        buttons:[
          {
            type:"success",
            text:"测试",
            typeAttrs:{
  
            },
            typeEvents:{
              click:(row:any)=>{
                console.log('测试222',row)
              }
            },
          }
        ]
      }
    },
  ]

  return {
    searchConfig,
    tableHeader
  }
} 