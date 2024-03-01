export {}
 
declare module 'vue' {
  interface ComponentCustomProperties {
    $listeners: any
  }
}
