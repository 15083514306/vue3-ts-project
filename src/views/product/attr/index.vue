<template>
  <div>
    <!-- 三级分类 -->
    <Category
      :scene="scene"
      @c1-change="attrInfoList = []"
      @c2-change="attrInfoList = []"
    />
    <!-- 属性CURD -->
    <ElCard
      class="attr"
      style="margin-top: 32px"
    >
      <!-- 表格展示场景 -->
      <div
        v-show="scene === 0"
        class="table-scene"
      >
        <ElButton
          v-permission-btn="`btn.Attr.add`"
          type="primary"
          :icon="Plus"
          :disabled="!categoryStore.c3Id"
          @click="addAttrInfoHandler"
        >
          添加平台属性
        </ElButton>
        <!-- 展示场景表格 -->
        <ElTable
          style="margin: 16px 0"
          :data="attrInfoList"
          border
        >
          <ElTableColumn
            type="index"
            label="序号"
            width="80"
            align="center"
          />
          <ElTableColumn
            prop="attrName"
            label="属性名称"
          />
          <ElTableColumn label="属性值名称">
            <template #default="{ row }: { row: AttrInfo }">
              <ElTag
                v-for="attrValue in row.attrValueList"
                :key="attrValue.id"
                style="margin: 3px"
              >
                {{ attrValue.valueName }}
              </ElTag>
            </template>
          </ElTableColumn>
          <ElTableColumn label="属性操作">
            <template #default="{ row }">
              <ElButton
                v-permission-btn="`btn.Attr.update`"
                type="primary"
                size="small"
                icon="Edit"
                @click="editAttrHandler(row)"
              />
              <ElPopconfirm
                :title="`确定要删除“${row.attrName}”吗?`"
                width="250px"
                icon="delete"
                @confirm="deleteAttrInfo(row.id)"
              >
                <template #reference>
                  <ElButton
                    v-permission-btn="`btn.Attr.remove`"
                    type="danger"
                    size="small"
                    icon="Delete"
                  />
                </template>
              </ElPopconfirm>
            </template>
          </ElTableColumn>
        </ElTable>
      </div>
      <!-- 增改场景 -->
      <div
        v-show="scene === 1"
        class="add-update-scene"
      >
        <ElForm
          ref="attrFormRuleRef"
          :model="attrInfoForm"
          :rules="rules"
        >
          <ElFormItem
            prop="attrName"
            label="属性名称"
          >
            <ElInput
              :ref="(el:HTMLInputElement )=> attrNameInputRef = el"
              v-model="attrInfoForm.attrName"
              style="width: 180px"
              placeholder="请输入属性名称"
              clearable
            />
          </ElFormItem>
        </ElForm>
        <ElButton
          type="primary"
          :icon="Plus"
          style="margin: 12px 0"
          @click="addAttrValue"
        >
          添加属性值
        </ElButton>
        <!-- 属性值表格 -->
        <ElTable
          style="margin: 16px 0"
          :data="attrInfoForm.attrValueList"
          border
        >
          <ElTableColumn
            type="index"
            label="序号"
            width="80"
            align="center"
          />
          <ElTableColumn label="属性值名称">
            <template #default="{ row, $index }: { row: AttrValue, $index: number }">
              <ElInput
                v-if="row.isEditMode"
                :ref="(el:HTMLInputElement )=> inputRefArr[$index] = el"
                v-model="row.valueName"
                placeholder="请输入属性值名称"
                clearable
                @blur="toggleToLook(row, $index)"
              />
              <div
                v-else
                @click="toggleToEdit(row, $index)"
              >
                {{ row.valueName }}
              </div>
            </template>
          </ElTableColumn>

          <ElTableColumn label="属性值操作">
            <template #default="{ $index }">
              <ElButton
                type="danger"
                size="small"
                icon="Delete"
                @click="attrInfoForm.attrValueList.splice($index, 1)"
              />
            </template>
          </ElTableColumn>
        </ElTable>
        <ElButton
          type="primary"
          size="default"
          @click="saveAttrInfo"
        >
          {{ attrInfoForm.id ? "修改" : "添加" }}
        </ElButton>
        <ElButton
          size="default"
          @click="scene = 0"
        >
          取消
        </ElButton>
      </div>
    </ElCard>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, reactive, ref, watch } from "vue";
import { Plus } from "@element-plus/icons-vue";
import { useCategoryStore } from "@/store/modules/category";
import { reqAddOrUpdateAttrInfo, reqGetAttrInfoList, reqDeleteAttrInfo } from "@/api/product/attr";
import { ElMessage } from "element-plus";
import { AttrInfo, AttrValue } from "@/api/product/attr/type";
import Category from "@/components/Category/index.vue";

const scene = ref(0); // 场景值 0：表格场景 1：增改场景
const categoryStore = useCategoryStore();
const inputRefArr = reactive<HTMLInputElement[]>([]); // 输入框实例数组
const attrNameInputRef = ref<HTMLInputElement>();
const attrInfoForm = reactive<AttrInfo>({
  attrName: "",
  attrValueList: [],
  categoryId: 0,
  categoryLevel: 3,
});
let attrInfoList = ref<AttrInfo[]>([]);

// 此处不用watchEffect 因为refreshAttrInfoList内部属性过多，容易造成不必要的请求
watch(
  () => categoryStore.c3Id,
  async () => {
    try {
      await refreshAttrInfoList();
    } catch (error: any) {
      categoryStore.c3Id = ""; // 此处服务器对某些分类会超时 做特别处理
    }
  }
);

const refreshAttrInfoList = async () => {
  console.log("refreshAttrInfoList");
  if (!categoryStore.c1Id || !categoryStore.c2Id || !categoryStore.c3Id) return;
  const res = await reqGetAttrInfoList(categoryStore.c1Id, categoryStore.c2Id, categoryStore.c3Id);
  if (res.code === 200) {
    attrInfoList.value = res.data;
  }
};

// 处理点击添加属性信息按钮
const addAttrInfoHandler = () => {
  Object.assign(attrInfoForm, {
    attrName: "",
    attrValueList: [],
    categoryId: categoryStore.c3Id,
    categoryLevel: 3,
  });
  scene.value = 1;
};

// 保存属性信息
const saveAttrInfo = async () => {
  try {
    await attrFormRuleRef.value.validate();
    let res = await reqAddOrUpdateAttrInfo(attrInfoForm);
    if (res.code === 200) {
      await refreshAttrInfoList();
      ElMessage({
        type: "success",
        message: attrInfoForm.id ? "修改成功！" : "添加成功！",
      });
      scene.value = 0;
    } else {
      ElMessage({
        type: "error",
        message: attrInfoForm.id ? "修改失败！" : "添加失败！",
      });
    }
  } catch (error: any) {
    ElMessage({
      type: "error",
      message: error.attrName[0].message,
    });
  }
};

// 按下修改属性按钮
const editAttrHandler = (attrInfo: AttrInfo) => {
  // assign是浅拷贝 要合并的目标对象是复杂类型嵌套，需要深拷贝
  // 注意Object.assign不会改变attrInfoForm的地址，而直接赋值JSON.parse会改变指针指向
  Object.assign(attrInfoForm, JSON.parse(JSON.stringify(attrInfo)));
  scene.value = 1;
  nextTick(() => {
    attrNameInputRef.value?.focus();
  });
};

// 切换到修改模式
const toggleToEdit = (row: AttrValue, index: number) => {
  row.isEditMode = true;
  nextTick(() => {
    inputRefArr[index]?.focus();
  });
  /* 如果没有nextTick，代码会直接运行下去，此时还没渲染另一个组件可见度
     因为使用的是v-if输入框是销毁状态 此时输入框元素还没造出来
  */
};

// 切换到展示模式(在丧失焦点的时候)
const toggleToLook = (row: AttrValue, index: number) => {
  let inputContent = row.valueName;
  if (inputContent.trim() === "") {
    ElMessage({
      type: "error",
      message: "属性值不能为空!",
    });
    attrInfoForm.attrValueList.splice(index, 1);
  }

  // find方法遍历数组中元素是否满足条件 不满足条件返回undefined
  let isRepeat = attrInfoForm.attrValueList.find((item) => {
    //去重先剔除自己
    if (item !== row) {
      // 一旦找到了相同说明除了本身之外有重复的元素 返回对应的值
      return item.valueName === inputContent;
    }
  });

  if (isRepeat) {
    ElMessage({
      type: "error",
      message: "属性值不能重复!",
    });
    attrInfoForm.attrValueList.splice(index, 1);
  }
  row.isEditMode = false;
};

// 添加属性值
const addAttrValue = () => {
  attrInfoForm.attrValueList.push({
    valueName: "",
    isEditMode: true,
  });
  nextTick(() => {
    inputRefArr[inputRefArr.length - 1]?.focus();
  });
};

// 删除属性信息
const deleteAttrInfo = async (attrId: number) => {
  const res = await reqDeleteAttrInfo(attrId);
  if (res.code === 200) {
    await refreshAttrInfoList();
    ElMessage({
      type: "success",
      message: "删除成功",
    });
  } else {
    ElMessage({
      type: "error",
      message: "删除失败",
    });
  }
};

// 表单验证
const attrFormRuleRef = ref();
const rules = reactive({
  attrName: [
    {
      required: true,
      message: "属性名称不能为空！",
      trigger: "blur",
    },
  ],
});

onBeforeUnmount(() => {
  // category是公共组件，卸载前重置仓库数据
  categoryStore.$reset();
});
</script>

<script lang="ts">
export default {
  name: "Attribute",
};
</script>

<style lang="scss" scoped></style>
