<template>
  <ElCard style="margin: 16px 0">
    <!-- 表格 -->
    <ElTable
      style="width: 100%"
      :data="skuInfoList"
      border
    >
      <ElTableColumn
        label="序号"
        type="index"
        align="center"
        width="80px"
        fixed
      />
      <ElTableColumn
        label="名称"
        show-overflow-tooltip
        width="180px"
        prop="skuName"
      />
      <ElTableColumn
        label="描述"
        show-overflow-tooltip
        width="300px"
        prop="skuDesc"
      />
      <ElTableColumn
        align="center"
        label="图片"
        width="180"
      >
        <template #default="{ row }">
          <img
            :src="row.skuDefaultImg"
            alt="图片丢失了"
            style="width: 100px; height: 100px; object-fit: contain"
          >
        </template>
      </ElTableColumn>
      <ElTableColumn
        label="重量(g)"
        width="150px"
        prop="weight"
      />
      <ElTableColumn
        label="价格(元)"
        width="150px"
        prop="price"
      />
      <ElTableColumn
        label="操作"
        fixed="right"
        width="450px"
      >
        <template #default="{ row }">
          <ElButton
            v-permission-btn="`btn.Sku.updown`"
            size="small"
            :icon="row.isSale ? 'Bottom' : 'Top'"
            :title="row.isSale ? '下架商品' : '上架商品'"
            @click="shelvesBtHandler(row)"
          />
          <ElButton
            v-permission-btn="`btn.Sku.update`"
            type="primary"
            size="small"
            icon="Edit"
            title="修改sku"
            @click="editBtHandler"
          />
          <ElButton
            v-permission-btn="`btn.Sku.detail`"
            type="info"
            size="small"
            icon="InfoFilled"
            title="信息详情"
            @click="viewSkuInfoDetail(row)"
          />
          <ElPopconfirm
            :title="`你确定要删除${row.skuName}`"
            width="200px"
            @confirm="deleteBtHandler(row)"
          >
            <template #reference>
              <ElButton
                v-permission-btn="`btn.Sku.remove`"
                type="danger"
                title="删除sku"
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
      :page-sizes="[5, 10, 20, 30, 40]"
      background
      layout="prev, pager, next, jumper, ->, sizes, total"
      style="margin-top: 16px"
      :total="total"
      @current-change="currentChangeHandler"
      @size-change="sizeChangeHandler"
    />
    <!-- 商品详情抽屉 -->
    <ElDrawer v-model="isShowDrawer">
      <template #header>
        <span>商品详情</span>
      </template>
      <template #default>
        <ElRow style="margin: 10px 0">
          <ElCol :span="6">
            名称
          </ElCol>
          <ElCol :span="18">
            {{ skuInfoDetail.skuName }}
          </ElCol>
        </ElRow>
        <ElRow style="margin: 10px 0">
          <ElCol :span="6">
            描述
          </ElCol>
          <ElCol :span="18">
            {{ skuInfoDetail.skuDesc }}
          </ElCol>
        </ElRow>
        <ElRow style="margin: 10px 0">
          <ElCol :span="6">
            价格
          </ElCol>
          <ElCol :span="18">
            {{ skuInfoDetail.price }}
          </ElCol>
        </ElRow>
        <ElRow style="margin: 10px 0">
          <ElCol :span="6">
            平台属性
          </ElCol>
          <ElCol :span="18">
            <ElTag
              v-for="skuAttrVal in skuInfoDetail.skuAttrValueList"
              :key="skuAttrVal.id"
              style="margin: 0 8px 8px 0"
            >
              {{ skuAttrVal.valueName }}
            </ElTag>
          </ElCol>
        </ElRow>
        <ElRow style="margin: 10px 0">
          <ElCol :span="6">
            销售属性
          </ElCol>
          <ElCol :span="18">
            <ElTag
              v-for="skuSaleAttrVal in skuInfoDetail.skuSaleAttrValueList"
              :key="skuSaleAttrVal.id"
              style="margin: 0 8px 8px 0"
            >
              {{ skuSaleAttrVal.saleAttrValueName }}
            </ElTag>
          </ElCol>
        </ElRow>
        <ElRow style="margin: 10px 0">
          <ElCol :span="6">
            商品图片
          </ElCol>
          <ElCol :span="18">
            <ElCarousel
              :interval="4000"
              type="card"
              height="200px"
            >
              <ElCarouselItem
                v-for="skuImg in skuInfoDetail.skuImageList"
                :key="skuImg.id"
              >
                <img
                  :src="skuImg.imgUrl"
                  alt="图片已丢失"
                  style="width: 100%; height: 100%"
                >
              </ElCarouselItem>
            </ElCarousel>
          </ElCol>
        </ElRow>
      </template>
    </ElDrawer>
  </ElCard>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import {
  reqCancelSale,
  reqDeleteSkuInfo,
  reqGetSkuDetailById,
  reqGetSkuListByPage,
  reqOnSale,
} from "@/api/product/sku";
import { SkuInfo } from "@/api/product/sku/type.ts";
import { ElMessage } from "element-plus";

const curPage = ref(1);
const pageSize = ref(5);
const total = ref(0);
const isShowDrawer = ref(false);
let skuInfoList = ref<SkuInfo[]>([]);
let skuInfoDetail = ref<SkuInfo>({
  category3Id: 0,
  price: 0,
  skuDefaultImg: "",
  skuDesc: "",
  skuName: "",
  spuId: 0,
  tmId: 0,
  weight: "",
});

// 处理查看信息详情
async function viewSkuInfoDetail(row: SkuInfo) {
  const res = await reqGetSkuDetailById(row.id!);
  if (res.code === 200) {
    skuInfoDetail.value = res.data;
  }

  isShowDrawer.value = true;
}

// 处理删除
async function deleteBtHandler(row: SkuInfo) {
  const res = await reqDeleteSkuInfo(row.id!);
  if (res.code === 200) {
    await refreshSkuListData();
    ElMessage.success({
      message: "删除成功",
    });
    row.isSale = Number(!row.isSale);
  }
}

// 处理上下架按钮
async function shelvesBtHandler(row: SkuInfo) {
  const res = row.isSale ? await reqCancelSale(row.id!) : await reqOnSale(row.id!);
  if (res.code === 200) {
    ElMessage.success({
      message: row.isSale ? "下架成功！" : "上架成功！",
    });
    row.isSale = Number(!row.isSale);
  }
}

// 处理编辑按钮
function editBtHandler() {
  ElMessage({
    type: "warning",
    message: "敬请期待！",
  });
}

// 页码改变处理
const currentChangeHandler = async () => {
  await refreshSkuListData();
};

// 页数限制改变处理
const sizeChangeHandler = async () => {
  await refreshSkuListData();
};

onMounted(() => {
  refreshSkuListData();
});

// 刷新SKU列表数据
const refreshSkuListData = async () => {
  const res = await reqGetSkuListByPage(curPage.value, pageSize.value);
  if (res.code === 200) {
    skuInfoList.value = res.data.records;
    total.value = res.data.total;
  }
};
</script>

<script lang="ts">
export default {
  name: "Sku",
};
</script>

<style lang="scss" scoped>
.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
