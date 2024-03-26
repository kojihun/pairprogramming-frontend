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
        <el-button @click="handleShowSignupForm()">Sign Up</el-button>
        <el-button type="primary" @click="handleLogin()">Sign In</el-button>
      </div>
    </template>
  </el-dialog>

  <!-- signup-dialog -->
  <el-dialog v-model="signupFormVisible" title="SignUp form" width="600" align-center>
    <el-form :model="signupForm">
      <el-form-item label="Email" :label-width="signupFormLabelWidth">
        <div class="email-input">
          <el-input v-model="signupForm.email" placeholder="Please input your email" />
          <el-button type="success" @click="handleValidateEmailField()">Confirm</el-button>
        </div>
      </el-form-item>
      <el-form-item label="Password" :label-width="signupFormLabelWidth">
        <el-input 
          @focusout="handleValidatePasswordField()" 
          v-model="signupForm.password" 
          type="password" 
          show-password="true" 
          placeholder="Please input your password" 
        />
      </el-form-item>
      <el-form-item label="Confirm Password" :label-width="signupFormLabelWidth">
        <el-input 
          @focusout="handleValidatePasswordField()" 
          v-model="signupForm.passwordCheck" 
          type="password" 
          show-password="true" 
          placeholder="Please input your password again" 
        />
      </el-form-item>
      <el-form-item label="name" :label-width="signupFormLabelWidth">
        <el-input v-model="signupForm.name" placeholder="Please input your name" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCloseSignupForm()">Cancel</el-button>
        <el-button @click="handleSignUp()" type="primary">Sign Up</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
// Import - Axios
import axios from 'axios'

// Import - element-plus
import { UserFilled, GoodsFilled } from '@element-plus/icons-vue'
import { ElNotification } from 'element-plus'

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



// Methods
const handleMyPage = () => {
  console.log("Hello new world");
}

// Methods - Login
const handleShowLoginForm = () => {
  loginFormVisible.value = true
  signupFormVisible.value = false
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

/**
 * 회원가입시 필요한 변수
 */
const signupFormVisible = ref(false)
const signupFormLabelWidth = ref('140px')
const signupForm = reactive({
  email: '',
  password: '',
  name: '',
  validateEmail: false,
  validatePassword: false
})

/**
 * 회원가입시 필요한 변수를 초기화하기 위한 함수
 */
const handleInitSignupVariable = () => {
  signupForm.email = '',
  signupForm.password = '',
  signupForm.passwordCheck = '',
  signupForm.name = '',
  signupForm.validateEmail = false,
  signupForm.validatePassword = false
}

/**
 * 회원가입 폼을 열기 위한 함수
 */
const handleShowSignupForm = () => {
  loginFormVisible.value = false
  signupFormVisible.value = true
  handleInitSignupVariable()
}

/**
 * 회원가입 폼을 닫기 위한 함수
 */
 const handleCloseSignupForm = () => {
  signupFormVisible.value = false
}

/**
 * 이메일 유효성 검증 함수
 */
const handleValidateEmailField = async () => {
  const email = signupForm.email;

  // 이메일 공백 확인
  if(email == null || email.trim() === '') {
    errorNotification('이메일을 입력해주세요.')
    signupForm.validateEmail = false
    return
  }

  // 이메일 형식 확인
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const isValidEmailRegex = emailRegex.test(email);
  if(!isValidEmailRegex) {
    errorNotification('올바른 이메일 형식을 작성해주세요.')
    signupForm.validateEmail = false
    return
  }

  // 이메일 중복 확인
  try {
    const response = await axios.post('/api/members/validation', {
      email: email
    })
    
    const data = response.data;
    if(data.status == 'SUCCESS') {
      successNotification('이메일 중복확인이 완료되었습니다.')
      signupForm.validateEmail = true
      return
    }else {
      errorNotification(data.message)
      signupForm.validateEmail = false
      return
    }
  }catch (error) {
    errorNotification(error.message)
    signupForm.validateEmail = false
    return
  }
}

/**
 * 비밀번호 유효성 검증 검증 함수
 */
const handleValidatePasswordField = () => {
  const password = signupForm.password
  const passwordCheck = signupForm.passwordCheck

  // 비밀번호 공백 확인
  if(password == null || password.trim() === '') {
    signupForm.validatePassword = false
    return
  }

  // 비밀번호 체크 공백 확인
  if(passwordCheck == null || passwordCheck.trim() === '') {
    signupForm.validatePassword = false
    return
  }

  // 비밀번호 일치 여부 확인
  if(password === passwordCheck) {
    signupForm.validatePassword = true
    return
  }else {
    signupForm.validatePassword = false
    return
  }
}

/**
 * 회원가입 함수
 */
const handleSignUp = async () => {
  // 이메일 유효성 검증 여부 확인
  const isValidEmail = signupForm.validateEmail
  if(!isValidEmail) {
    errorNotification('이메일 인증버튼을 클릭 해주세요.')
    return
  }

  // 비밀번호 유효성 검증 여부 확인
  const isValidPassword = signupForm.validatePassword
  if(!isValidPassword) {
    errorNotification('비밀번호를 동일하게 작성해주세요.')
    return
  }

  // 회원가입
  try {
    const response = await axios.post('/api/members/signup', {
      email: signupForm.email,
      password: signupForm.password,
      name: signupForm.name
    })
    
    const data = response.data;
    if(data.status == 'SUCCESS') {
      successNotification('회원가입이 완료되었습니다.')
      handleShowLoginForm()
      return
    }
  }catch (error) {
    errorNotification(error.message)
    return
  }
}

/**
 * 성공시 호출되는 알림창
 * @param message 
 */
const successNotification = (message: string) => {
  ElNotification({
    title: 'Success',
    message: message,
    type: 'success',
  })
}

/**
 * 실패시 호출되는 알림창
 * @param message 
 */
const errorNotification = (message: string) => {
  ElNotification({
    title: 'ERROR',
    message: message,
    type: 'error',
  })
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