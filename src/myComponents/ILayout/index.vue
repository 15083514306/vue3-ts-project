<template>
  <div class="layout">
    <div class="header" v-if="header">
      <slot name="header"></slot>
    </div>
    <div class="content" >
      <slot ></slot>
    </div>
    <div class="footer" v-if="footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import {useSlots} from 'vue'
  const { header, footer} = useSlots()

  
</script>
<style scoped lang="scss" >
   .layout {
      height: 100%;
      width: 100%;
      display: flex;
      flex-direction: column;
      .header {
        height: 40px;
      }
      .content {
        flex:1;
      }
      .footer{
        height: 40px;
      }
   }
</style>