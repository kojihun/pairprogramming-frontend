<template>
  <!-- menu -->
  <el-menu mode="horizontal" :ellipsis="false">
    <!-- logo -->
    <el-menu-item >
      <img style="width: 130px" src="../../assets/element-plus-logo.svg" alt="Element logo"/>
    </el-menu-item>

    <!-- divider -->
    <div class="flex-grow" />
    
    <!-- avatar-container -->
    
    <div class="avatar-container">
      <el-dropdown>
      <span class="el-dropdown-link">
        <el-avatar :icon="UserFilled"></el-avatar>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="handleShowLoginForm()">Sign In</el-dropdown-item>
          <el-dropdown-item @click="handleShowSignupForm()">Sign Up</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    </div>
  </el-menu>

  <!-- login-dialog -->
  <el-dialog v-model="loginFormVisible" title="Login form" width="600" align-center>
    <el-form :model="loginForm">
      <el-form-item label="Email" :label-width="loginFormLabelWidth">
        <el-input v-model="loginForm.email" autocomplete="off" placeholder="Please input your email" />
      </el-form-item>
      <el-form-item label="Password" :label-width="loginFormLabelWidth">
        <el-input v-model="loginForm.password" autocomplete="off" placeholder="Please input your password" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleSignUpView()">Sign Up</el-button>
        <el-button type="primary" @click="handleLogin()">Sign In</el-button>
      </div>
    </template>
  </el-dialog>

  <!-- signup-dialog -->
  <el-dialog v-model="signupFormVisible" title="SignUp form" width="600" align-center>
    <el-form :model="signupForm">
      <el-form-item label="Email" :label-width="signupFormLabelWidth">
        <div class="email-input">
          <el-input v-model="signupForm.email" autocomplete="off" placeholder="Please input your email" />
          <el-button type="success" @click="handleValidateEmailField()">Confirm</el-button>
        </div>
      </el-form-item>
      <el-form-item label="Password" :label-width="signupFormLabelWidth">
        <el-input v-model="signupForm.password" autocomplete="off" placeholder="Please input your password" />
      </el-form-item>
      <el-form-item label="Confirm Password" :label-width="signupFormLabelWidth">
        <el-input v-model="signupForm.password" autocomplete="off" placeholder="Please input your password" />
      </el-form-item>
      <el-form-item label="name" :label-width="signupFormLabelWidth">
        <el-input v-model="signupForm.name" autocomplete="off" placeholder="Please input your name" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancelSignUp()">Cancel</el-button>
        <el-button type="primary" @click="handleSignUp()">Sign Up</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
// Import - Axios
import axios from 'axios'

// Import - Icon
import { UserFilled, GoodsFilled } from '@element-plus/icons-vue'

// Import - Variables
import { reactive, ref } from 'vue'

// Variables - Search
const searchInput = ref('')

// Variables - Login
const loginFormVisible = ref(false)
const loginFormLabelWidth = ref('140px')
const loginForm = reactive({
  email: '',
  password: ''
})

// Variables - Sign Up
const signupFormVisible = ref(false)
const signupFormLabelWidth = ref('140px')
const signupForm = reactive({
  email: '',
  password: '',
  name: '',
  city: '',
  street: '',
  zipcode: ''
})

// Methods
const handleMyPage = () => {
  console.log("Hello new world");
}

// Methods - Login
const handleShowLoginForm = () => {
  loginFormVisible.value = true
  loginForm.email = ''
  loginForm.password = ''
}
const handleLogin = async () => {
  const isValidField = handleValidateLoginField()
  if(isValidField) {
    try {
      const response = await axios.post('/api/signin', {
        email: loginForm.email,
        password: loginForm.password
      })

      console.log(response)
    } catch (e) {
      console.error(e)
    }
  }
}
const handleValidateLoginField = () => {
  const email = loginForm.email
  const password = loginForm.password

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const isEmailValid = emailRegex.test(email);

  if(!isEmailValid) {
    console.log("Invalid email format")
    return false
  }

  if(password.length < 8) {
    console.log("Password must be 8 characters long")
    return false
  }

  return true
}

// Method - Sign Up
const handleShowSignupForm = () => {
  loginFormVisible.value = false
  signupFormVisible.value = true
  signupForm.email = ''
  signupForm.password = ''
  signupForm.name = ''
}
const handleSignUpView = () => {
  loginFormVisible.value = false
  signupFormVisible.value = true
  signupForm.email = ''
  signupForm.password = ''
  signupForm.name = ''
}
const handleSignUp = async () => {
  const isValidField = handleValidateSignUpField()
  if(isValidField) {
    try {
      const response = await axios.post('/api/signup', {
        email: signupForm.email,
        password: signupForm.password,
        name: signupForm.name,
        city: signupForm.city,
        street: signupForm.street,
        zipCode: signupForm.zipcode
      })

      console.log("회원가입결과", response)
    } catch (e) {
      console.error("에러결과", e)
    }
  }
}
const handleCancelSignUp = () => {
  signupFormVisible.value = false
}
const handleValidateEmailField = () => {

}
const handleValidatePasswordField = () => {

}

const handleValidateSignUpField = () => {
  const email = signupForm.email
  const password = signupForm.password

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const isEmailValid = emailRegex.test(email);

  if(!isEmailValid) {
    console.log("Invalid email format")
    return false
  }

  if(password.length < 8) {
    console.log("Password must be 8 characters long")
    return false
  }

  return true
}

const handleShoppingBag = () => {
  console.log("Hello newnew world");
}

</script>

<style>
/* divider */
.flex-grow {
  flex-grow: 1;
}

/* avatar */
.avatar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.avatar-container > * {
  margin: 0 5px;
}

/* form-email */
.email-input {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}
.email-input > button {
  margin-left: 5px;
}
</style>