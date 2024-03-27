<template>
  <div>
    <!-- 搜索栏 -->
    <ElCard style="height: 80px">
      <ElForm
        class="search-bar"
        inline
      >
        <ElFormItem label="职位搜索">
          <ElInput
            ref="searchInpRef"
            v-model="searchTxt"
            placeholder="请输入要搜索的职位"
          />
        </ElFormItem>

        <ElFormItem>
          <ElButton
            :disabled="!searchTxt.length"
            type="primary"
            @click="searchRole"
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
        v-permission-btn="`btn.Role.add`"
        type="primary"
        @click="addOrUpdateRoleBtHandler"
      >
        添加职位
      </ElButton>
      <!-- 表格 -->
      <ElTable
        style="margin: 32px 0"
        border
        :data="roleList"
      >
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
          label="职位名称"
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
              v-permission-btn="`btn.Role.assgin`"
              size="small"
              icon="User"
              @click="assignPermissionHandler(row)"
            >
              分配权限
            </ElButton>
            <ElButton
              v-permission-btn="`btn.Role.update`"
              type="primary"
              size="small"
              icon="Edit"
              @click="addOrUpdateRoleBtHandler(row)"
            >
              编辑
            </ElButton>
            <ElPopconfirm
              :title="`你确定删除${row.roleName}`"
              width="260px"
              @confirm="deleteRole(row.id)"
            >
              <template #reference>
                <ElButton
                  v-permission-btn="`btn.Role.remove`"
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
        :page-sizes="[10, 20, 30, 40]"
        background
        layout="prev, pager, next, jumper, ->, sizes, total"
        :total="total"
        @size-change="sizeChange"
        @current-change="refreshRoleData"
      />
    </ElCard>

    <!-- 增加/编辑角色的对话框 -->
    <ElDialog
      v-model="isAddOrEditDialog"
      :title="roleForm.id ? '编辑职位' : '增加职位'"
      @close="addOrUpdateRoleClose"
    >
      <ElForm
        :model="roleForm"
        :rules="rules"
      >
        <ElFormItem
          prop="roleName"
          label="职位名称"
          :label-width="140"
        >
          <ElInput
            v-model="roleForm.roleName"
            placeholder="请输入职位名称"
          />
        </ElFormItem>
      </ElForm>
      <template #footer>
        <span class="dialog-footer">
          <ElButton @click="isAddOrEditDialog = false">取消</ElButton>
          <ElButton
            type="primary"
            @click="addOrEditRoleConfirm"
          > 确定 </ElButton>
        </span>
      </template>
    </ElDialog>

    <!-- 分配权限  -->
    <ElDrawer v-model="isAssignDrawer">
      <template #header>
        <h1>分配权限</h1>
      </template>

      <template #default>
        <ElTree
          ref="treeRef"
          :data="permissionList"
          show-checkbox
          node-key="id"
          :props="defaultProps"
          :default-checked-keys="selectedPermissionIds"
          default-expand-all
        />
      </template>

      <template #footer>
        <ElButton @click="isAssignDrawer = false">
          取消
        </ElButton>
        <ElButton
          type="primary"
          @click="assignPermissionConfirm"
        >
          确定
        </ElButton>
      </template>
    </ElDrawer>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, reactive, ref } from "vue";
import useSettingStore from "@/store/modules/setting.ts";
import {
  reqAddOrUpdateRole,
  reqAllPermissionList,
  reqAllRoleList,
  reqRemoveRole,
  reqSetPermission,
} from "@/api/acl/role/idnex.ts";
import { RoleData } from "@/api/acl/role/type.ts";
import { ElMessage, FormRules } from "element-plus";
import { PermissionList } from "@/api/acl/permission/type.ts";

const curPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
const searchTxt = ref("");
const isAddOrEditDialog = ref(false);
const isAssignDrawer = ref(false);
const settingStore = useSettingStore();
const searchInpRef = ref();
const roleForm = reactive({
  id: 0,
  roleName: "",
});
const permissionList = ref<PermissionList>([]);

const roleList = ref<RoleData[]>([]);

const selectedPermissionIds = ref<number[]>([]); //存放默认选择权限结点
const curRoleId = ref(0);
const treeRef = ref();

// 分配权限 确定按钮
const assignPermissionConfirm = async () => {
  const allCheckedKeys: Array<number> = treeRef.value.getCheckedKeys(); //已选最后一层级的Id
  const allHalfCheckedKeys: Array<number> = treeRef.value.getHalfCheckedKeys(); //半选层级的Id
  const permissionId = allCheckedKeys.concat(allHalfCheckedKeys);
  const res = await reqSetPermission(curRoleId.value, permissionId);
  if (res.code === 200) {
    isAssignDrawer.value = false;
    await nextTick(() => {
      ElMessage({
        type: "success",
        message: "分配成功！",
      });
    });
    window.location.reload(); //分配权限后 浏览器刷新 如果用户分配自己的权限可见效果
  }
};

// 处理 分配权限 按钮
const assignPermissionHandler = async (row: RoleData) => {
  const res = await reqAllPermissionList(row.id!);
  if (res.code === 200) {
    curRoleId.value = row.id!;
    permissionList.value = res.data;
    selectedPermissionIds.value = [];
    filterSelectedNode(permissionList.value, selectedPermissionIds.value);
    isAssignDrawer.value = true;
  }
};

// 递归过滤出已选的权限结点
const filterSelectedNode = (permissionList: PermissionList, selectedTreeKeys: number[]) => {
  permissionList.forEach((permission) => {
    if (permission.select && permission.level === 4) {
      selectedTreeKeys.push(permission.id!);
    }
    if (permission.children && permission.children.length) {
      filterSelectedNode(permission.children, selectedTreeKeys);
    }
  });
};

// 增加/编辑角色 对话框关闭 重置数据
const addOrUpdateRoleClose = () => {
  Object.assign(roleForm, {
    id: 0,
    roleName: "",
  });
};

// 处理 增加/编辑角色 按钮
const addOrUpdateRoleBtHandler = (row: RoleData) => {
  if (row) {
    Object.assign(roleForm, row);
  }
  isAddOrEditDialog.value = true;
};

// 增加/编辑角色 确定按钮
const addOrEditRoleConfirm = async () => {
  const res = await reqAddOrUpdateRole(roleForm);
  if (res.code === 200) {
    await refreshRoleData();
    isAddOrEditDialog.value = false;
    ElMessage.success({
      message: roleForm.id ? "编辑成功" : "添加成功",
    });
  }
};

// 表单验证角色名字
const validateRoleName = (_rule: any, value: any, callback: any) => {
  if (!value) {
    callback(new Error("此项为必填项"));
  } else if (value.length < 2) {
    callback(new Error("角色名称不得低于2个字符"));
  } else {
    callback();
  }
};

// 增加/编辑角色 表单验证规则
const rules = reactive<FormRules>({
  roleName: [{ required: true, validator: validateRoleName, trigger: "blur" }],
});

// 删除角色
const deleteRole = async (id: number) => {
  const res = await reqRemoveRole(id);
  if (res.code === 200) {
    await refreshRoleData();
    ElMessage.success({
      message: "删除成功！",
    });
  }
};

// 每页大小改变
const sizeChange = () => {
  curPage.value = 1;
  refreshRoleData();
};

// 搜索用户名
const searchRole = () => {
  refreshRoleData();
  searchInpRef.value.clear();
};

// 挂载更新数据
onMounted(() => {
  refreshRoleData();
});

async function refreshRoleData() {
  const res = await reqAllRoleList(curPage.value, pageSize.value, searchTxt.value);
  if (res.code === 200) {
    roleList.value = res.data.records;
    total.value = res.data.total;
  }
}

const defaultProps = {
  children: "children",
  label: "name",
};
</script>

<script lang="ts">
export default {
  name: "Role",
};
</script>

<style lang="scss" scoped>
.search-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
