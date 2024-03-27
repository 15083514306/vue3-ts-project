<script setup lang="ts">
import { Plus } from "@element-plus/icons-vue";
import { computed, nextTick, reactive, ref } from "vue";
import { ElMessage, UploadFile, UploadProps } from "element-plus";
import {
  reqAddOrUpdateSpuInfo,
  reqGetAllTradeMark,
  reqGetSaleAttrInfo,
  reqGetSaleAttrListById,
  reqGetSpuImgListById,
} from "@/api/product/spu";
import { baseSaleAttr, SpuImage, SpuInfo, SpuSaleAttr } from "@/api/product/spu/type.ts";
import { TradeMark } from "@/api/product/trademark/type.ts";
import { useCategoryStore } from "@/store/modules/category.ts";

defineProps(["scene"]);
const emit = defineEmits(["cancel", "save"]);
const categoryStore = useCategoryStore();
const dialogImageUrl = ref("");
const dialogVisible = ref(false);
const tradeMarkList = ref<TradeMark[]>([]); //商标列表
const spuImgList = ref<SpuImage[]>([]); // 图片墙spu图片列表
const baseSaleAttrList = ref<baseSaleAttr[]>([]); // 销售属性列表（可选范围）
const saleAttrTable = ref<SpuSaleAttr[]>([]); // 销售属性列表（表格）
const selectedAttrMap = ref<string>(""); //已选择销售属性Map {id:name}
const inputRefArr = ref<any>([]);
const spuInfoForm = reactive<SpuInfo>({
  tmId: "",
  spuName: "",
  description: "",
  category3Id: 0,
  spuImageList: [],
  spuSaleAttrList: [],
});

// 图片上传成功的回调
const handleUploadSuccess = (res: any, uploadFile: UploadFile) => {
  if (res.code === 200) {
    uploadFile.url = res.data; //把服务器返回的http格式把blob对象的url替换掉
  }
};

// 处理取消按钮
const cancelHandler = () => {
  resetPreData(); //增加用户体验感 不await
  emit("cancel");
};

// 点击添加按钮转到输入模式
const toInputHandler = (row: SpuSaleAttr, index: number) => {
  row.saleAttrValue = "";
  row.isInput = true;
  nextTick(() => {
    inputRefArr.value[index]?.focus();
  });
};

// 输入框丧失焦点转到查看模式 (添加到数组中)
const toLookHandler = (row: SpuSaleAttr) => {
  if (row.saleAttrValue!.trim() === "") {
    ElMessage({
      type: "warning",
      message: "属性值不能为空！",
    });
  } else {
    row.spuSaleAttrValueList?.push({
      baseSaleAttrId: row.baseSaleAttrId!,
      saleAttrValueName: row.saleAttrValue!,
    });
  }
  row.isInput = false;
};

// 处理添加属性按钮
const addAttrBtHandler = () => {
  const [baseSaleAttrId, saleAttrName] = selectedAttrMap.value.split(":");
  saleAttrTable.value.push({
    baseSaleAttrId,
    saleAttrName,
    spuSaleAttrValueList: [],
  });
  selectedAttrMap.value = "";
};

// 已选的销售属性列表（剩余可选项）此项需运算量使用computed 减少不必要的计算
// 注意: computed会在依赖属性变化的时候触发
let selectableList = computed(() => {
  return baseSaleAttrList.value.filter((baseSaleAttr) => {
    const isFind = saleAttrTable.value.find((saleAttr) => Number(saleAttr.baseSaleAttrId) === Number(baseSaleAttr.id));
    return !isFind;
  });
});

// 处理保存逻辑
const saveHandler = async () => {
  // 请求预处理spuInfoForm表单
  spuInfoForm.spuImageList = spuImgList.value.map((spuImg) => {
    return {
      //修改“键”的名字 修改成服务器需要的字段形式
      imgName: spuImg.name,
      imgUrl: spuImg.url,
    };
  });
  spuInfoForm.spuSaleAttrList = saleAttrTable.value;
  const res = await reqAddOrUpdateSpuInfo(spuInfoForm);
  if (res.code === 200) {
    await resetPreData();
    ElMessage.success({
      message: spuInfoForm.id ? "修改成功!" : "添加成功!",
    });
    emit("save"); //切换场景
  } else {
    ElMessage.error({
      message: spuInfoForm.id ? "修改失败!" : "添加失败!",
    });
  }
};

// 重置预设数据 （主要为添加数据做准备）
const resetPreData = async () => {
  spuImgList.value = [];
  saleAttrTable.value = [];
  selectedAttrMap.value = "";
  dialogImageUrl.value = "";
  Object.assign(spuInfoForm, {
    id: 0,
    tmId: "",
    spuName: "",
    description: "",
    category3Id: categoryStore.c3Id,
    spuImageList: [],
    spuSaleAttrList: [],
  });
  try {
    const [res1, res2] = await Promise.all([reqGetAllTradeMark(), reqGetSaleAttrInfo()]);
    tradeMarkList.value = res1.data; //商标列表
    baseSaleAttrList.value = res2.data; //销售属性选择器列表
  } catch (e) {
    console.error(e);
  }
};

// 初始化预设数据（如品牌、spu图标..）
const initSpuPresetData = async (spu?: SpuInfo) => {
  await resetPreData(); // 重置公共预设数据
  // 有传入spu这个对象说明是修改
  if (spu) {
    // 修改SPU  修改预设数据
    Object.assign(spuInfoForm, {
      id: spu.id,
      tmId: spu.tmId,
      spuName: spu.spuName,
      description: spu.description,
      category3Id: categoryStore.c3Id,
      spuImageList: [],
      spuSaleAttrList: [],
    });
    try {
      const [res1, res2] = await Promise.all([reqGetSpuImgListById(spu.id!), reqGetSaleAttrListById(spu.id!)]);
      for (const spuImg of res1.data) {
        spuImgList.value.push({
          name: spuImg.imgName,
          url: spuImg.imgUrl,
        });
      }
      saleAttrTable.value = res2.data; //销售属性表格
    } catch (e) {
      console.error(e);
    }
  }
};

// 浏览图片
const handlePictureCardPreview: UploadProps["onPreview"] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!;
  dialogVisible.value = true;
};

// 上传前限制图片判断
const handlerUpload = (file: any) => {
  if (file.type === "images/png" || file.type === "images/jpeg" || file.type === "images/gif") {
    if (file.size / 1024 / 1024 < 5) {
      return true;
    } else {
      ElMessage({
        type: "error",
        message: "上传图片必须小于5M",
      });
      return false;
    }
  } else {
    ElMessage({
      type: "error",
      message: "上传图片格式必须为PNG|JPG|GIF",
    });
    return false;
  }
};

//调用时机应该在父组件点击添加或修改时，需对外暴露
defineExpose({
  initSpuPresetData,
});
</script>

<template>
  <ElCard v-show="scene === 2">
    <ElForm label-width="100px">
      <ElFormItem label="SPU名称">
        <ElInput
          v-model="spuInfoForm.spuName"
          placeholder="请输入SPU名称"
        />
      </ElFormItem>
      <ElFormItem label="SPU品牌">
        <ElSelect
          v-model="spuInfoForm.tmId"
          placeholder="请选择"
        >
          <ElOption
            v-for="tm in tradeMarkList"
            :key="tm.id"
            :label="tm.tmName"
            :value="tm.id"
          />
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="SPU描述">
        <ElInput
          v-model="spuInfoForm.description"
          type="textarea"
          placeholder="请输入SPU描述"
        />
      </ElFormItem>
      <ElFormItem label="SPU图标">
        <template #default>
          <ElUpload
            v-model:file-list="spuImgList"
            action="api/admin/product/fileUpload"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-success="handleUploadSuccess"
            :before-upload="handlerUpload"
          >
            <ElIcon><Plus /></ElIcon>
          </ElUpload>

          <ElDialog v-model="dialogVisible">
            <img
              :src="dialogImageUrl"
              style="width: 100%; height: 100%"
              alt="图片已丢失"
            >
          </ElDialog>
        </template>
      </ElFormItem>
      <ElFormItem label="SPU销售属性">
        <ElSelect
          v-model="selectedAttrMap"
          :placeholder="selectableList.length ? `${selectableList.length}个属性可选` : '暂无销售属性可选'"
        >
          <ElOption
            v-for="item in selectableList"
            :key="item.id"
            :label="item.name"
            :value="`${item.id}:${item.name}`"
          />
        </ElSelect>
        <ElButton
          type="primary"
          icon="Plus"
          style="margin-left: 16px"
          :disabled="!selectedAttrMap"
          @click="addAttrBtHandler"
        >
          添加属性
        </ElButton>
        <ElTable
          :data="saleAttrTable"
          style="margin: 16px 0"
          border
        >
          <ElTableColumn
            type="index"
            width="55"
          />
          <ElTableColumn
            prop="saleAttrName"
            label="SPU销售属性名称"
            width="140"
          />
          <ElTableColumn label="SPU销售属性值">
            <template #default="{ row, $index }">
              <span
                v-for="(item, index) in row.spuSaleAttrValueList"
                :key="item.id"
              >
                <ElTag
                  style="margin: 0 6px 6px 0"
                  closable
                  @close="row.spuSaleAttrValueList.splice(index, 1)"
                >
                  {{ item.saleAttrValueName }}
                </ElTag>
              </span>
              <ElButton
                v-if="!row.isInput"
                size="small"
                icon="Plus"
                @click="toInputHandler(row, $index)"
              />
              <ElInput
                v-else
                :ref="(el: HTMLInputElement) => (inputRefArr[$index] = el)"
                v-model="row.saleAttrValue"
                size="small"
                style="width: 100px"
                placeholder="请输入属性值"
                @blur="toLookHandler(row)"
              />
            </template>
          </ElTableColumn>

          <ElTableColumn label="操作">
            <template #default="{ $index }">
              <ElButton
                type="danger"
                size="small"
                icon="Delete"
                @click="saleAttrTable.splice($index, 1)"
              />
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
      @click="cancelHandler"
    >
      取消
    </ElButton>
  </ElCard>
</template>

<script lang="ts">
export default {
  name: "SpuForm",
};
</script>

<style scoped lang="scss"></style>
