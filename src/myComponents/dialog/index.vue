<template>
  <ElDialog
    v-for="(item, index) in dialogList"
    :key="index"
    :model-value="item.visable"
    draggable
    :modal="false"
    :close-on-click-modal="false"
    append-to-body
    class="dialog"
    modal-class="dialog"
    :title="item.title"
    :width="item.dialogAttr.width || '30%'"
    v-bind="item.dialogAttr"
    @close="handleClose(item)"
    v-on="item.dialogEvent"
  >
    <Component
      :is="item.component"
      v-bind="item.componentAttr"
      v-model="item.componentAttr.value"
      v-on="item.componentEvent"
      @close="item.handleClose"
    />
    <template
      v-if="footer"
      #footer
    >
      <span
        v-if="!item.dialogAttr?.isCustomFooter"
        class="dialog-footer"
      >
        <ElButton @click="closeDialog(item)">关闭</ElButton>
        <ElButton
          type="primary"
          @click="closeDialog(item, true)"
        >确认</ElButton>
      </span>
    </template>
  </ElDialog>
</template>

<script lang="ts" setup>
import { inject, ref, useSlots } from "vue";
import { ElMessageBox } from "element-plus";
import { Mdialog } from "./type";

const $bus: any = inject("$bus");
const { footer } = useSlots();
let dialogList = ref<Mdialog[]>([]);

const handleClose = async (it: any) => {
  dialogList.value = dialogList.value.filter((d) => d.title !== it.title);
};

const closeDialog = (item: any, confirm = false) => {
  if (confirm) {
    ElMessageBox.confirm("确定操作?")
      .then(() => {
        handleClose(item);
      })
      .catch(() => {
        // 取消操作
      });
  } else {
    handleClose(item);
  }
};

$bus.$on(
  "openDialog",
  ({ title, component, dialogAttr = {}, dialogEvent = {}, componentAttr = {}, componentEvent = {} }: Mdialog): void => {
    let it = {
      title,
      component,
      dialogAttr,
      dialogEvent,
      componentAttr,
      componentEvent,
      visable: true,
      handleClose: () => {
        handleClose(it);
      },
    };
    dialogList.value.push(it);
  }
);
</script>

<style scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}
.dialog {
  pointer-events: auto;
  z-index: 1000 !important;
}
.el-dialog__mask {
  z-index: 1000; /* 尝试设置一个适当的较小值 */
  opacity: 0.5; /* 尝试设置透明度 */
}
</style>
