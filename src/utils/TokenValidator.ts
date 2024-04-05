// Axios 라이브러리 임포트
import axios from 'axios'

// element-plus 라이브러리 임포트
import { ElNotification } from 'element-plus'

class TokenValidator {
  /**
   * 토큰 유효여부 확인 정적 메서드
   */
  static async checkTokenValidity() {
    try {
      const response = await axios.get('/api/members/token', {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
        }
      });

      const data = response.data
      console.log(data)
      if(data.status === 'SUCCESS') {
        return true
      } else {
        errorNotification(data.message)
        return false
      } 
    } catch (error) {
      return false
    }
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
  
export default TokenValidator;