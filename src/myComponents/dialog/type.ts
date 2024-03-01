export interface Mattr{
  width?:string,
}

export interface Mdialog {
  title:string,
  component:any, //组件s
  dialogAttr?:any,
  dialogEvent?:any,
  componentAttr?:any, //element
  componentEvent?:any, //element
  visable:boolean,
  handleClose?(a:Mdialog):void,
  [t:string]:any,
}