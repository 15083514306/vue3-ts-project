<template>
  <div class="layout">
    <div
      v-if="header"
      class="header"
    >
      <slot name="header" />
    </div>
    <div class="content">
      <slot />
    </div>
    <div
      v-if="footer"
      class="footer"
    >
      <slot name="footer" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useSlots } from "vue";
const { header, footer } = useSlots();
</script>
<style scoped lang="scss">
.layout {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  .header {
    height: 40px;
  }
  .content {
    flex: 1;
  }
  .footer {
    height: 40px;
  }
}
</style>
