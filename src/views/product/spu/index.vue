<template>
  <div>
    <!-- 分类组件 -->
    <Category :scene="scene" />

    <!-- 场景0：展示面板 -->
    <ElCard v-show="scene === 0">
      <!-- 添加SPU按钮 -->
      <ElButton
        v-permission-btn="`btn.Spu.add`"
        :disabled="!categoryStore.c3Id"
        type="primary"
        size="default"
        icon="Plus"
        @click="addSpuBtHandler"
      >
        添加SPU
      </ElButton>
      <!-- 表格 -->
      <ElTable
        style="margin: 16px 0"
        :data="spuInfoList"
        border
      >
        <ElTableColumn
          type="index"
          label="序号"
          width="80"
          align="center"
        />
        <ElTableColumn
          prop="spuName"
          label="SPU名称"
        />
        <ElTableColumn
          prop="description"
          label="SPU描述"
        />
        <ElTableColumn label="SPU操作">
          <template #default="{ row }">
            <ElButton
              v-permission-btn="`btn.Spu.addsku`"
              size="small"
              title="添加SKU"
              icon="Plus"
              @click="addSkuBtHandler(row.id)"
            />
            <ElButton
              v-permission-btn="`btn.Spu.update`"
              type="primary"
              size="small"
              title="修改SPU"
              icon="Edit"
              @click="editSpuBtHandler(row)"
            />
            <ElButton
              v-permission-btn="`btn.Spu.skus`"
              type="info"
              icon="View"
              title="查看SKU列表"
              size="small"
              @click="viewSpuBtHandler(row.id)"
            />
            <ElPopconfirm
              :title="`确定要删除“${row.spuName}”吗?`"
              width="250px"
              icon="delete"
              @confirm="deleteSpuBtHandler(row.id)"
            >
              <template #reference>
                <ElButton
                  v-permission-btn="`btn.Spu.delete`"
                  type="danger"
                  size="small"
                  icon="Delete"
                />
              </template>
            </ElPopconfirm>
          </template>
        </ElTableColumn>
      </ElTable>
      <!-- 分页器 -->
      <ElPagination
        v-model:current-page="curPage"
        v-model:page-size="pageSize"
        :page-sizes="[3, 5, 7, 9]"
        background
        layout="prev, pager, next, jumper, ->, sizes, total"
        :total="total"
      />
      <!--
        @size-change="sizeChange"
        @current-change="currentChange"-->
    </ElCard>

    <!-- sku列表对话框 -->
    <ElDialog
      v-model="dialogTableVisible"
      title="SKU列表"
    >
      <ElTable
        :data="skuInfoList"
        border
      >
        <ElTableColumn
          property="skuName"
          label="SKU名字"
        />
        <ElTableColumn
          property="price"
          label="SKU价格"
        />
        <ElTableColumn
          property="weight"
          label="SKU重量"
        />
        <ElTableColumn label="SKU图片">
          <template #default="{ row }">
            <img
              :src="row.skuDefaultImg"
              alt="图片丢失了"
              style="width: 100px; height: 100px; object-fit: contain"
            >
          </template>
        </ElTableColumn>
      </ElTable>
    </ElDialog>

    <!-- 场景1：添加SKU面板 -->
    <SkuForm
      ref="skuFormRef"
      :scene="scene"
      @cancel="scene = 0"
      @save="scene = 0"
    />

    <!-- 场景2：添加/编辑SPU面板 -->
    <SpuForm
      ref="spuFormRef"
      :scene="scene"
      @cancel="scene = 0"
      @save="saveSpuHandler"
    />
  </div>
</template>

<script setup lang="ts">
import { useCategoryStore } from "@/store/modules/category";
import { onBeforeUnmount, ref, watchEffect } from "vue";
import { reqDeleteSpuInfo, reqGetSpuInfo } from "@/api/product/spu";
import Category from "@/components/Category/index.vue";
import { SpuInfo } from "@/api/product/spu/type.ts";
import SkuForm from "@/views/product/spu/components/SkuForm.vue";
import SpuForm from "@/views/product/spu/components/SpuForm.vue";
import { SkuInfo } from "@/api/product/sku/type.ts";
import { ElMessage } from "element-plus";
import { reqGetSkuListById } from "@/api/product/sku";

const categoryStore = useCategoryStore();
const curPage = ref(1);
const pageSize = ref(3);
const total = ref(0);
const scene = ref(0); // 0:展示面板 1:添加sku面板 2:添加/修改spu面板
const dialogTableVisible = ref(false);
const spuInfoList = ref<SpuInfo[]>([]);
const skuInfoList = ref<SkuInfo[]>([]);
const skuFormRef = ref(); //skuForm组件实例
const spuFormRef = ref();

// 在保存spu的时候 切换场景并且更新数据
const saveSpuHandler = async () => {
  scene.value = 0;
  await refreshSpuInfo();
};

// 处理删除spu信息
const deleteSpuBtHandler = async (spuId: number) => {
  let res = await reqDeleteSpuInfo(spuId);
  if (res.code === 200) {
    await refreshSpuInfo();
    ElMessage({
      type: "success",
      message: "删除成功！",
    });
  }
};

// 处理查看spu列表
const viewSpuBtHandler = async (spuId: number) => {
  let res = await reqGetSkuListById(spuId);
  if (res.code === 200) {
    skuInfoList.value = res.data;
  }
  dialogTableVisible.value = true;
};

// 处理添加sku
const addSkuBtHandler = (spuId: number) => {
  skuFormRef.value.initSkuFormData(spuId); //通过ref拿到引用实例调用初始化函数
  scene.value = 1;
};

// 处理修改spu
const editSpuBtHandler = (spu: SpuInfo) => {
  spuFormRef.value.initSpuPresetData(spu);
  scene.value = 2;
};

// 处理添加spu
const addSpuBtHandler = () => {
  spuFormRef.value.initSpuPresetData();
  scene.value = 2;
};

// 网络请求进行刷新spuInfo数据
const refreshSpuInfo = async () => {
  let res = await reqGetSpuInfo(curPage.value, pageSize.value, categoryStore.c3Id);
  if (res.code === 200) {
    spuInfoList.value = res.data.records;
    total.value = res.data.total;
  }
};

/* 使用vue3新特性watchEffect
   refreshSpuInfo方法中使用了哪些属性
   一旦属性发生变更 该回调就会执行 */
watchEffect(async () => {
  // 使用watchEffect好处：在刷新分页请求时，会用到页码等属性
  // 一旦发生边恒 数据也跟着改变再驱动响应式 可以不用写分页器的点击事件 减少重复代码
  await refreshSpuInfo();
});

// 监听c3Id刷新spuInfo数据
/*watch(
  () => categoryStore.c3Id,
  async () => {
    await refreshSpuInfo()
  },
)*/

/*// 分页器页限制值改变
const sizeChange = async () => {
  await refreshSpuInfo()
}

// 页码改变
const currentChange = async () => {
  await refreshSpuInfo()
}*/

// 销毁前重置分类残仓库数据 防止切换路由上一次的数据还在
onBeforeUnmount(() => {
  categoryStore.$reset();
});

/*// 测试代码 （用于自动选取分级选择器，不用自己点）
onMounted(async () => {
  categoryStore.c1Id = 2
  await categoryStore.getC2()
  categoryStore.c2Id = 13
  await categoryStore.getC3()
  categoryStore.c3Id = 61
})*/
</script>

<script lang="ts">
export default {
  name: "Spu",
};
</script>

<style lang="scss" scoped></style>
