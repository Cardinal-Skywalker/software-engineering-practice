<template>
  <div>
    <el-form :rules="rules" ref="registerForm" :model="registerForm" class="registerContainer" label-width="80px">
      <h3 class="registerTitle">
        系统注册
      </h3>
      <el-form-item prop="username" label="账号">
        <el-input type="text" v-model="registerForm.username" placeholder="请输入账号"></el-input>
      </el-form-item>
      <el-form-item prop="password" label="密码">
        <el-input type="password" v-model="registerForm.password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item prop="passwordRP" label="确认密码">
        <el-input type="password" v-model="registerForm.passwordRP" placeholder="请再次输入密码"></el-input>
      </el-form-item>
      <el-form-item prop="code" label="验证码">
        <el-input type="text" auto-complete="false" v-model="registerForm.code" placeholder="点击图片更换验证码" style="width: 250px; margin-right: 5px"></el-input>
        <img :src="captchaUrl">
      </el-form-item>
      <el-button type="primary" style="width: 100%" @click="submitRegister">注册</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "Register",
  data() {
    return {
      captchaUrl: "",
      registerForm: {
        username: "",
        password: "",
        passwordRP: "",
        code: "123"
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 5, max: 14, message: "长度在 5 到 14 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 5, message: "密码长度要大于5", trigger: "blur" }
        ],
        passwordRP: [
          { required: true, message: "请再次输入密码", trigger: "blur" },
          { min: 5, message: "密码长度要大于5", trigger: "blur" },
          { validator: this.validatePassword, trigger: "blur" }
        ],
        code: [
          { required: true, message: "请输入验证码", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    validatePassword(rule, value, callback) {
      if (value !== this.registerForm.password) {
        callback(new Error("两次输入的密码不一致"));
      } else {
        callback();
      }
    },
    submitRegister() {
      this.$refs.registerForm.validate((valid) => {
        if (valid) {
          let _this = this;
          this.axios({
            url: "/api/user/register",
            method: "post",
            headers: {
              "Content-Type": "application/json"
            },
            params: {
              username: _this.registerForm.username,
              password: _this.registerForm.password,
              code: _this.registerForm.code
            }
          }).then((res) => {
            if (res.data.code === "0") {
              this.$message.success({
                message: res.data.msg,
                type: "success",
              });
              this.$router.push("/user/login");
            } else {
              this.$message({
                message: res.data.msg,
                type: "warning"
              });
            }
          });
        } else {
          this.$message.error("注册出错请重新输入");
          return false;
        }
      });
    }
  }
};
</script>

<style>
.registerContainer {
  border-radius: 15px;
  background-clip: padding-box;
  margin: 180px auto;
  width: 350px;
  padding: 15px 35px 15px 35px;
  background: aliceblue;
  border: 1px solid blueviolet;
  box-shadow: 0 0 25px #f885ff;
}
.registerTitle {
  margin: 0px auto 48px auto;
  text-align: center;
  font-size: 40px;
}
</style>