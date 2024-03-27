<template>
  <!-- menu -->
  <el-menu mode="horizontal" :ellipsis="false">
    <!-- logo -->
    <el-menu-item >
      <img style="width: 130px" src="../../assets/element-plus-logo.svg" alt="Element logo"/>
      <el-button @click="test()">Sign Up</el-button>
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
        <el-dropdown-menu v-if="!loginedMember.isLogined">
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
        <el-input 
          v-model="loginForm.email" 
          placeholder="Please input your email" 
        />
      </el-form-item>
      <el-form-item label="Password" :label-width="loginFormLabelWidth">
        <el-input 
          v-model="loginForm.password" 
          type="password" 
          :show-password=true 
          placeholder="Please input your password" 
        />
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
          :show-password=true 
          placeholder="Please input your password" 
        />
      </el-form-item>
      <el-form-item label="Confirm Password" :label-width="signupFormLabelWidth">
        <el-input 
          @focusout="handleValidatePasswordField()" 
          v-model="signupForm.passwordCheck" 
          type="password" 
          :show-password=true
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
import { onMounted } from 'vue'

// Variables - Search
const searchInput = ref('')

/**
 * 로그인시 필요한 변수
 */
const loginFormVisible = ref(false)
const loginFormLabelWidth = ref('140px')
const loginForm = reactive({
  email: '',
  password: ''
})
const loginedMember = reactive({
  email: '',
  name: '',
  isLogined: false
})

/**
 * 로그인폼을 열기 위한 함수
 */
const handleShowLoginForm = () => {
  loginFormVisible.value = true
  signupFormVisible.value = false
  loginForm.email = ''
  loginForm.password = ''
}

/**
 * 로그인폼을 닫기 위한 함수
 */
const handleCloseLoginForm = () => {
  loginFormVisible.value = false
}

/**
 * 로그인 함수
 */
const handleLogin = async () => {
  const email = loginForm.email
  const password = loginForm.password

  // 이메일 확인
  if(email == null || email.trim() === '') {
    errorNotification('이메일을 입력해주세요.')
    return
  }
  // 비밀번호 확인
  if(password == null || password.trim() === '') {
    errorNotification('비밀번호를 입력해주세요.')
    return
  }

  // 로그인
  try {
    const response = await axios.post('/api/members/signin', {
      email: loginForm.email,
      password: loginForm.password
    })
    
    const data = response.data;
    if(data.status == 'SUCCESS') {
      const loginedMessage = data.data.name + '님 환영합니다.'
      successNotification(loginedMessage)
      handleCloseLoginForm()

      loginedMember.email = data.data.email
      loginedMember.name = data.data.name
      loginedMember.isLogined = true
      localStorage.setItem('accessToken', data.data.accessToken)
      return
    }else {
      errorNotification(data.message)
      return
    }
  }catch (error) {
    errorNotification(error.message)
    return
  }
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
 * 컴포넌트 마운트시 유효 토큰인지 확인
 */
onMounted(async () => {
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) {
    const isValid = await checkTokenValidity(accessToken);
    if (isValid) {
      loginedMember.isLogined = true
    } else {
      localStorage.removeItem('accessToken');
      loginedMember.isLogined = false
    }
  }
});

/**
 * 토큰 유효여부 확인 함수
 */
const checkTokenValidity = async () => {
  try {
    const response = await axios.get('/api/members/token', {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem("accessToken")
        }
      }
    )

    const data = response.data;
    if(data.status == 'SUCCESS') {
      return true
    }else {
      return false
    } 
  } catch (error) {
    return false
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