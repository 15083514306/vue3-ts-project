

export interface IAny {
  [s:string]:any
}

//form下拉的optiop配置
export interface IFromChildOption {
  label:string,
  value:string,
  disabled?:boolean,
}

export interface IFromConfig {
  label:string,
  key:string,
  type:string,
  formOption?:any,
  formItemOption?:IAny,
  childOptions?:IFromChildOption[]
}
