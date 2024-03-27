<script setup lang="ts">
import { reactive, ref } from "vue";
import { useCategoryStore } from "@/store/modules/category.ts";
import { reqGetAttrInfoList } from "@/api/product/attr";
import { reqGetSaleAttrListById, reqGetSpuImgListById } from "@/api/product/spu";
import { reqAddSkuInfo } from "@/api/product/sku";
import { AttrInfo } from "@/api/product/attr/type.ts";
import { SpuImage, SpuSaleAttr } from "@/api/product/spu/type.ts";
import { SkuInfo, skuSaleAttrValue } from "@/api/product/sku/type.ts";
import { ElMessage } from "element-plus";

defineProps(["scene"]); //由于Props只读不可写 只能emit交给父组件
const $emit = defineEmits(["cancel", "save"]);
const categoryStore = useCategoryStore();
const attrInfoList = ref<AttrInfo[]>([]);
const saleAttrList = ref<SpuSaleAttr[]>([]);
const spuImgList = ref<SpuImage[]>([]);
const addSkuForm = reactive<SkuInfo>({
  category3Id: 0,
  price: "",
  skuDefaultImg: "",
  skuDesc: "",
  skuName: "",
  spuId: 0,
  tmId: 0,
  weight: "",
  skuAttrValueList: [],
  skuSaleAttrValueList: [],
});
const imgTableRef = ref();
const hashMap = new Map(); //attrId : attrValId 键值对

// 属性值发生变化时（每个下拉选择器）
const attrValueChange = (attrInfo: AttrInfo, attrValId: number) => {
  hashMap.set(attrInfo.id, attrValId);
};

// 处理设置默认图片逻辑
const setDefaultImgHandler = (row: SpuImage) => {
  imgTableRef.value?.clearSelection(); //预防用户全选操作 先清空选择
  imgTableRef.value?.toggleRowSelection(row, true); //只选中点击那一行的图片信息
  addSkuForm.skuDefaultImg = row.imgUrl!;
};

// 处理保存时候的逻辑
const saveHandler = async () => {
  //收集平台属性 （使用哈希表）
  hashMap.forEach((val: number, key: number) => {
    addSkuForm.skuAttrValueList?.push({
      attrId: key,
      valueId: val,
    });
  });
  // 收集销售属性 （使用分隔符）
  addSkuForm.skuSaleAttrValueList = saleAttrList.value.reduce((pre: skuSaleAttrValue[], cur: SpuSaleAttr) => {
    if (cur.hashMapString) {
      const [saleAttrId, saleAttrValueId] = cur.hashMapString.split(":");
      pre.push({
        saleAttrId,
        saleAttrValueId,
      });
    }
    return pre; // 每次都返回pre
  }, []); // 注意reduce返回的是回调函数中返回的累计结果

  const res = await reqAddSkuInfo(addSkuForm);
  if (res.code === 200) {
    ElMessage({
      type: "success",
      message: "添加成功！",
    });
    $emit("save"); //切换场景
  } else {
    ElMessage({
      type: "error",
      message: "添加失败！",
    });
  }
};

// 初始化sku的form表单需要填写的预数据
const initSkuPresetData = async (spuId: number) => {
  // 先置空addSkuForm的参数 防止上次添加的数据还在内存中
  Object.assign(addSkuForm, {
    category3Id: 0,
    price: "",
    skuDefaultImg: "",
    skuDesc: "",
    skuName: "",
    spuId: 0,
    tmId: 0,
    weight: "",
    skuAttrValueList: [],
    skuSaleAttrValueList: [],
  });
  hashMap.clear();
  try {
    // 初始化的时候可以把可以收集到的数据先收集好
    const [res1, res2, res3] = await Promise.all([
      reqGetAttrInfoList(categoryStore.c1Id, categoryStore.c2Id, categoryStore.c3Id),
      reqGetSaleAttrListById(spuId),
      reqGetSpuImgListById(spuId),
    ]);
    attrInfoList.value = res1.data;
    saleAttrList.value = res2.data;
    spuImgList.value = res3.data;
  } catch (e) {
    console.error(e);
  }
};

// 由于组件用的是v-show并且数据依赖用户操作
// 所以组件一开始就挂载无法直接通过挂载钩子来初始化，需要对其方法进行暴露
defineExpose({
  initSkuFormData: initSkuPresetData,
});
</script>

<template>
  <ElCard v-show="scene === 1">
    <!-- 设置label-width可以保证标签对齐 -->
    <ElForm label-width="100px">
      <ElFormItem label="SKU名称">
        <ElInput
          v-model="addSkuForm.skuName"
          placeholder="请输入SKU名称"
        />
      </ElFormItem>
      <ElFormItem label="价格(元)">
        <ElInput
          v-model="addSkuForm.price"
          placeholder="请输入价格"
        />
      </ElFormItem>
      <ElFormItem label="重量(g)">
        <ElInput
          v-model="addSkuForm.weight"
          placeholder="请输入重量"
        />
      </ElFormItem>
      <ElFormItem label="SKU描述">
        <ElInput
          v-model="addSkuForm.skuDesc"
          type="textarea"
          placeholder="请输入SKU描述"
        />
      </ElFormItem>
      <!-- 法一 使用Map数据结构存键值对 -->
      <ElFormItem label="平台属性">
        <ElForm
          inline
          label-width="80px"
          label-position="right"
        >
          <ElFormItem
            v-for="attr in attrInfoList"
            :key="attr.id"
            :label="attr.attrName"
            style="margin-bottom: 12px"
          >
            <ElSelect
              v-model="attr.valueNameId"
              placeholder="请选择"
              @change="attrValueChange(attr, $event)"
            >
              <ElOption
                v-for="attrValue in attr.attrValueList"
                :key="attrValue.id"
                :label="attrValue.valueName"
                :value="attrValue.id"
              />
            </ElSelect>
          </ElFormItem>
        </ElForm>
      </ElFormItem>
      <!-- 法二 用分隔符收集键值对 -->
      <ElFormItem label="销售属性">
        <ElForm
          inline
          label-width="80px"
          label-position="right"
        >
          <ElFormItem
            v-for="saleAttr in saleAttrList"
            :key="saleAttr.id"
            :label="saleAttr.saleAttrName"
            style="margin-bottom: 12px"
          >
            <ElSelect
              v-model="saleAttr.hashMapString"
              placeholder="请选择"
            >
              <ElOption
                v-for="saleAttrValue in saleAttr.spuSaleAttrValueList"
                :key="saleAttrValue.id"
                :label="saleAttrValue.saleAttrValueName"
                :value="`${saleAttr.id}:${saleAttrValue.id}`"
              />
            </ElSelect>
          </ElFormItem>
        </ElForm>
      </ElFormItem>
      <ElFormItem label="图片名称">
        <ElTable
          ref="imgTableRef"
          :data="spuImgList"
          style="width: 100%"
          border
        >
          <ElTableColumn
            type="selection"
            width="55"
          />
          <ElTableColumn
            label="图片"
            width="180"
          >
            <template #default="{ row }">
              <img
                :src="row.imgUrl"
                alt="图片丢失了"
                style="width: 100px; height: 100px; object-fit: contain"
              >
            </template>
          </ElTableColumn>
          <ElTableColumn
            prop="imgName"
            label="名称"
          />
          <ElTableColumn label="操作">
            <template #default="{ row }">
              <ElButton
                type="primary"
                size="small"
                @click="setDefaultImgHandler(row)"
              >
                设置默认
              </ElButton>
            </template>
          </ElTableColumn>
        </ElTable>
      </ElFormItem>
    </ElForm>
    <ElButton
      type="primary"
      size="default"
      @click="saveHandler"
    >
      保存
    </ElButton>
    <ElButton
      size="default"
      @click="$emit('cancel')"
    >
      取消
    </ElButton>
  </ElCard>
</template>

<script lang="ts">
export default {
  name: "SkuForm",
};
</script>

<style scoped lang="scss"></style>
