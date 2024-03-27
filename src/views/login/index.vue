<template>
  <div class="container">
    <ElRow>
      <ElCol
        :span="12"
        :xs="0"
      />
      <ElCol
        :span="12"
        :xs="24"
      >
        <!-- 巨坑的地方model是element plus自定义的props名字 -->
        <ElForm
          ref="loginFormRef"
          class="loginForm"
          :model="userForm"
          :rules="rules"
        >
          <h1>Hello</h1>
          <h2>欢迎来到管理系统!</h2>
          <ElFormItem prop="username">
            <ElInput
              v-model="userForm.username"
              :prefix-icon="User"
              clearable
            />
          </ElFormItem>
          <ElFormItem prop="password">
            <ElInput
              v-model="userForm.password"
              type="password"
              :prefix-icon="Lock"
              show-password
              clearable
            />
          </ElFormItem>
          <ElFormItem>
            <ElButton
              :loading="isLoading"
              type="primary"
              class="login_btn"
              @click="loginHandler()"
            >
              登录
            </ElButton>
          </ElFormItem>
        </ElForm>
        <Loading />
      </ElCol>
    </ElRow>
  </div>
</template>

<script lang="ts" setup>
import { User, Lock } from "@element-plus/icons-vue";
import useUserStore from "@/store/modules/user";

import { useRouter, useRoute } from "vue-router";
// import { getTime } from "@/utils/getTime";

let userForm = reactive({
  username: "admin",
  password: "atguigu123",
});

let isLoading = ref(false);
const loginFormRef = ref();

let userStore = useUserStore();
let router = useRouter();
const route = useRoute();

userStore.age++;

console.log("userStore", userStore.secret);

const loginHandler = async () => {
  try {
    isLoading.value = true;
    await loginFormRef.value.validate(); //如果没验证过直接抛出错误 如果没有try catch后续代码将不会执行
    await userStore.user_login(userForm);
    const redirect = route.query.redirect as string;
    await router.push({ path: redirect || "/" });
    // ElNotification({
    //   type: "success",
    //   message: "登录成功!",
    //   title: `HI,${getTime()}好`,
    // });
  } catch (error) {
    // ElNotification({
    //   type: "error",
    //   message: (error as Error).message || "登录失败!",
    // });
  }
  isLoading.value = false;
};

// rule是表单中对应的规则 value是输入框中的值  callback是放行回调函数
const validatorUsername = (_rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("请输入账户信息!"));
  } else if (value.length < 5) {
    callback(new Error("账户名称长度不得小于5位!"));
  } else {
    callback();
  }
};

const validatorPassword = (_rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("请输入密码!"));
  } else if (value.length < 6 || value.length > 18) {
    callback(new Error("账户密码的长度范围必须在6-18位之间!"));
  } else {
    callback();
  }
};

const rules = reactive({
  username: [
    {
      trigger: "change",
      validator: validatorUsername,
    },
  ],
  password: [
    {
      trigger: "change",
      validator: validatorPassword,
    },
  ],
});
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100vh;
  background: url("@/assets/images/background.jpg") no-repeat;
  background-size: cover;

  .loginForm {
    position: relative;
    width: 55%;
    top: 25vh;
    left: 10vw;
    padding: 10px;
    background: url("@/assets/images/login_form.png") no-repeat;
    background-size: cover;
    h1 {
      color: white;
      font-size: 40px;
    }

    h2 {
      font-size: 20px;
      color: white;
      margin: 20px 0;
    }
    .login_btn {
      width: 100%;
    }
  }
}
</style>
