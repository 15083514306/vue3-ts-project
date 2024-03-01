import mitt from 'mitt';
const init_mitt = mitt()
const emitter:any = {
  _events:{},
  $emit:function(t:any,e:any){
    init_mitt.emit(t,e)
  },
  $on:function(t:any,e:any){
    this._events[t] = true
    init_mitt.on(t,e)
  },
  $off:function(t:any,e:any){
    delete this._events[t]
    init_mitt.off(t,e)
  },
  $offAll:function(){
    this._events = {}
  }
}
export default emitter