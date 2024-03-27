<template>
  <div>
    <!-- 搜索栏 -->
    <ElCard style="height: 80px">
      <ElForm
        class="search-bar"
        inline
      >
        <ElFormItem label="用户搜索">
          <ElInput
            ref="searchInpRef"
            v-model="searchTxt"
            placeholder="请输入要搜索的用户名"
          />
        </ElFormItem>

        <ElFormItem>
          <ElButton
            :disabled="!searchTxt.length"
            type="primary"
            @click="searchUser"
          >
            搜索
          </ElButton>
          <ElButton @click="settingStore.isRefresh = !settingStore.isRefresh">
            重置
          </ElButton>
        </ElFormItem>
      </ElForm>
    </ElCard>

    <!-- 展示区域 -->
    <ElCard style="margin: 32px 0">
      <ElButton
        v-permission-btn="`btn.User.add`"
        type="primary"
        @click="addOrEditUserBtHandler"
      >
        添加用户
      </ElButton>
      <ElButton
        v-permission-btn="`btn.User.remove`"
        :disabled="selectedIdList.length === 0"
        type="danger"
        @click="batchDelete"
      >
        批量删除
      </ElButton>
      <!-- 表格 -->
      <ElTable
        style="margin: 10px 0"
        border
        :data="userInfoList"
        @selection-change="selectChange"
      >
        <ElTableColumn
          type="selection"
          align="center"
        />
        <ElTableColumn
          label="#"
          align="center"
          type="index"
        />
        <ElTableColumn
          label="id"
          align="center"
          prop="id"
        />
        <ElTableColumn
          label="用户名字"
          align="center"
          prop="username"
          show-overflow-tooltip
        />
        <ElTableColumn
          label="用户昵称"
          align="center"
          prop="name"
          show-overflow-tooltip
        />
        <ElTableColumn
          label="用户角色"
          align="center"
          prop="roleName"
          show-overflow-tooltip
        />
        <ElTableColumn
          label="创建时间"
          align="center"
          prop="createTime"
          show-overflow-tooltip
        />
        <ElTableColumn
          label="更新时间"
          align="center"
          prop="updateTime"
          show-overflow-tooltip
        />
        <ElTableColumn
          label="操作"
          width="300px"
          align="center"
        >
          <template #default="{ row }">
            <ElButton
              v-permission-btn="`btn.User.assgin`"
              size="small"
              icon="User"
              @click="assignRoleBtHandler(row)"
            >
              分配角色
            </ElButton>
            <ElButton
              v-permission-btn="`btn.User.update`"
              type="primary"
              size="small"
              icon="Edit"
              @click="addOrEditUserBtHandler(row)"
            >
              编辑
            </ElButton>
            <ElPopconfirm
              :title="`你确定删除${row.username}`"
              width="260px"
              @confirm="deleteUser(row.id)"
            >
              <template #reference>
                <ElButton
                  v-permission-btn="`btn.User.remove`"
                  type="danger"
                  size="small"
                  icon="Delete"
                >
                  删除
                </ElButton>
              </template>
            </ElPopconfirm>
          </template>
        </ElTableColumn>
      </ElTable>
      <!-- 分页器 -->
      <ElPagination
        v-model:current-page="curPage"
        v-model:page-size="pageSize"
        :page-sizes="[5, 7, 9, 11]"
        background
        layout="prev, pager, next, jumper, ->, sizes, total"
        :total="total"
        @size-change="sizeChange"
        @current-change="refreshUserInfo"
      />
    </ElCard>

    <!-- 增加/编辑用户的抽屉 -->
    <ElDrawer
      v-model="isAddEditDrawer"
      @close="addOrEditDrawerClose"
    >
      <template #header>
        <h1>{{ userForm.id ? "编辑用户" : "添加用户" }}</h1>
      </template>

      <template #default>
        <ElForm
          ref="userFormRef"
          :model="userForm"
          :rules="rules"
        >
          <ElFormItem
            prop="username"
            label="用户姓名"
          >
            <ElInput
              v-model="userForm.username"
              placeholder="请输入用户姓名"
            />
          </ElFormItem>
          <ElFormItem
            prop="name"
            label="用户昵称"
          >
            <ElInput
              v-model="userForm.name"
              placeholder="请输入用户昵称"
            />
          </ElFormItem>
          <ElFormItem
            v-if="!userForm.id"
            prop="password"
            label="用户密码"
          >
            <ElInput
              v-model="userForm.password"
              placeholder="请输入用户密码"
            />
          </ElFormItem>
        </ElForm>
      </template>

      <template #footer>
        <ElButton @click="isAddEditDrawer = false">
          取消
        </ElButton>
        <ElButton
          type="primary"
          @click="addOrEditUser"
        >
          确定
        </ElButton>
      </template>
    </ElDrawer>

    <!-- 分配角色的抽屉  -->
    <ElDrawer v-model="isAssignDrawer">
      <template #header>
        <h1>分配角色</h1>
      </template>

      <template #default>
        <ElForm v-model="assignRoleForm">
          <ElFormItem label="用户姓名">
            <ElInput
              v-model="assignRoleForm.username"
              placeholder="请输入用户姓名"
              disabled
            />
          </ElFormItem>
          <ElFormItem label="职位列表">
            <ElCheckbox
              v-model="isCheckAll"
              :indeterminate="isIndeterminate"
              style="margin-right: 32px"
              @change="handleCheckAllChange"
            >
              全选
            </ElCheckbox>
            <ElCheckboxGroup
              v-model="assignRoleForm.selectedRoleIdList"
              @change="handleCheckedRolesChange"
            >
              <ElCheckbox
                v-for="item in assignRoleForm.allRoleInfoList"
                :key="item.id"
                :label="item.id"
              >
                {{ item.roleName }}
              </ElCheckbox>
            </ElCheckboxGroup>
          </ElFormItem>
        </ElForm>
      </template>

      <template #footer>
        <ElButton @click="isAssignDrawer = false">
          取消
        </ElButton>
        <ElButton
          type="primary"
          @click="assignRoleConfirm"
        >
          确定
        </ElButton>
      </template>
    </ElDrawer>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import {
  reqAddOrUpdateUser,
  reqAllRoleById,
  reqDeleteSelectedUser,
  reqRemoveUser,
  reqSetUserRole,
  reqUserInfo,
} from "@/api/acl/user/idnex.ts";
import { RoleData, User } from "@/api/acl/user/type.ts";
import useSettingStore from "@/store/modules/setting.ts";
import { ElMessage, FormInstance, FormRules } from "element-plus";

const curPage = ref(1);
const pageSize = ref(5);
const total = ref(0);
const searchTxt = ref("");
const isAddEditDrawer = ref(false);
const isAssignDrawer = ref(false);
const searchInpRef = ref();
const settingStore = useSettingStore();

const isCheckAll = ref(false);
const isIndeterminate = ref(false);

const userInfoList = ref<User[]>([]);
const selectedIdList = ref<number[]>([]);
const userFormRef = ref<FormInstance>();

// 用户表单数据
const userForm = reactive({
  id: 0,
  username: "",
  name: "",
  password: "",
});

interface assignRole {
  userId: number;
  username: string;
  allRoleInfoList: RoleData[];
  selectedRoleIdList: number[];
}

const assignRoleForm = reactive<assignRole>({
  userId: 0,
  username: "",
  allRoleInfoList: [],
  selectedRoleIdList: [],
});

// 分配角色 确定 按钮
const assignRoleConfirm = async () => {
  const res = await reqSetUserRole({
    userId: assignRoleForm.userId,
    roleIdList: assignRoleForm.selectedRoleIdList,
  });
  if (res.code === 200) {
    await refreshUserInfo();
    ElMessage.success({
      message: "分配角色成功！",
    });
    isAssignDrawer.value = false;
    window.location.reload();
  }
};

// 处理点击分配角色按钮
const assignRoleBtHandler = async (row: User) => {
  const res = await reqAllRoleById(row.id!);
  if (res.code === 200) {
    assignRoleForm.userId = row.id!;
    assignRoleForm.selectedRoleIdList = [];
    res.data.assignRoles.forEach((item: RoleData, index: number) => {
      assignRoleForm.selectedRoleIdList[index] = item.id!;
    });
    assignRoleForm.allRoleInfoList = res.data.allRolesList;
    assignRoleForm.username = row.name!;
    isAssignDrawer.value = true;
  }
};

// 关闭 添加/编辑 用户抽屉时触发
const addOrEditDrawerClose = () => {
  userFormRef.value?.clearValidate();
  Object.assign(userForm, {
    id: 0,
    username: "",
    name: "",
    password: "",
  });
};

// 处理 添加/编辑 用户按钮
const addOrEditUserBtHandler = (row?: User) => {
  if (row) {
    Object.assign(userForm, {
      id: row.id,
      username: row.username,
      name: row.name,
    });
  }
  isAddEditDrawer.value = true;
};

// 确认 添加/修改 用户按钮
const addOrEditUser = async () => {
  try {
    await userFormRef.value?.validate();
    const res = await reqAddOrUpdateUser(userForm);
    if (res.code === 200) {
      await refreshUserInfo();
      ElMessage.success({
        message: userForm.id ? "修改成功！" : "添加成功！",
      });
      isAddEditDrawer.value = false;
    }
  } catch (e) {
    console.error(e);
  }
};

// 用户名验证
const validateUserName = (_rule: any, value: any, callback: any) => {
  if (!value) {
    return callback(new Error("此项为必填项！"));
  } else if (/^\d+$/.test(value)) {
    return callback(new Error("用户名称不能使用纯数字！"));
  } else if (value?.length < 5) {
    return callback(new Error("名字必须大于5个字符！"));
  } else {
    callback();
  }
};

// 昵称验证
const validateName = (_rule: any, value: any, callback: any) => {
  if (!value) {
    return callback(new Error("此项为必填项！"));
  } else if (value?.length < 5) {
    return callback(new Error("名字必须大于5个字符！"));
  } else {
    callback();
  }
};

// 密码验证
const validatePassword = (_rule: any, value: any, callback: any) => {
  if (!value) {
    return callback(new Error("此项为必填项！"));
  } else if (value.length < 6) {
    return callback(new Error("密码必须大于6个字符！"));
  } else {
    callback();
  }
};

// 添加/修改用户表单验证规则
const rules = reactive<FormRules>({
  username: [{ required: true, validator: validateUserName, trigger: "blur" }],
  name: [{ required: true, validator: validateName, trigger: "blur" }],
  password: [{ required: true, validator: validatePassword, trigger: "blur" }],
});

// 批量删除用户
const batchDelete = async () => {
  const res = await reqDeleteSelectedUser(selectedIdList.value!);
  if (res.code === 200) {
    await refreshUserInfo();
    ElMessage.success({
      message: "删除成功！",
    });
  }
};

// 勾选用户
const selectChange = (selectedList: User[]) => {
  if (selectedList.length === 0) selectedIdList.value = [];
  selectedList.forEach((item: User) => {
    selectedIdList.value.push(item.id!);
  });
};

// 删除用户
const deleteUser = async (id: number) => {
  const res = await reqRemoveUser(id);
  if (res.code === 200) {
    await refreshUserInfo();
    ElMessage.success({
      message: "删除成功！",
    });
  }
};
// 挂载刷新数据
onMounted(() => {
  refreshUserInfo();
});

// 刷新用户信息
async function refreshUserInfo() {
  const res = await reqUserInfo(curPage.value, pageSize.value, searchTxt.value);
  if (res.code === 200) {
    userInfoList.value = res.data.records;
    total.value = res.data.total;
  }
}

// 搜索用户名
const searchUser = () => {
  refreshUserInfo();
  searchInpRef.value.clear();
};

// 页数限制改变
const sizeChange = () => {
  curPage.value = 1;
  refreshUserInfo();
};

// 全选
const handleCheckAllChange = (isCheckAll: boolean) => {
  if (isCheckAll) {
    assignRoleForm.allRoleInfoList.forEach((item, index) => {
      assignRoleForm.selectedRoleIdList[index] = item.id!;
    });
  } else {
    assignRoleForm.selectedRoleIdList = [];
  }
  isIndeterminate.value = false;
};

// 部分勾选改变事件
const handleCheckedRolesChange = (value: string[]) => {
  const checkedCount = value.length;
  isCheckAll.value = checkedCount === assignRoleForm.allRoleInfoList.length;
  isIndeterminate.value = checkedCount > 0 && checkedCount < assignRoleForm.allRoleInfoList.length;
};
</script>

<script lang="ts">
export default {
  name: "User",
};
</script>

<style lang="scss" scoped>
.search-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
