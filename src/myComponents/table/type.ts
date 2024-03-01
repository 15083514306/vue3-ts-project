
export interface IAny {
  [s:string]:any
}

export interface IattarAndEvent {
  typeAttrs?:any,
  typeEvents?:any,
}

export interface ItypeOption extends IattarAndEvent{
  buttons?:IbutAttrs[]
}

export interface IbutAttrs {
  type:string,
  text:string,
  [t:string]:any
}

export interface ITableConfig {
  label:string,
  key:string,
  type?:string,
  columnAttrs?:IAny,
  typeOption?:ItypeOption,
  [t:string]:any
}
