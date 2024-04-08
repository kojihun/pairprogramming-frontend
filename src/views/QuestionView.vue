<template>
  <div class="question-container">

    <!-- Question Header -->
    <div class="question-header">
      <el-menu :default-active="menuData.activeIndex" mode="horizontal" :ellipsis="false" @select="handleSelectMenu">
        <el-menu-item index='1'>{{ problemDetailResponse.title }}</el-menu-item>
        <el-menu-item index='2'>Submission history</el-menu-item>
      </el-menu>
    </div>

    <!-- Question Body -->
    <div class="question-body">
      <el-container>
        <!-- Question Body Aside 1 -->
        <el-aside class="question-body-aside" width="500px" v-if="menuData.activeIndex == '1'">
          <el-scrollbar>
            <div class="question-body-problem-description">
              <div class="question-body-problem-description-title">Problem Description</div>
              <div class="question-body-problem-description-content">
                {{ problemDetailResponse.description }}
              </div>
            </div>
            <div class="question-body-restrictions">
              <div class="question-body-restrictions-title">Restrictions</div>
              <div class="question-body-restrictions-content">
                {{ problemDetailResponse.restriction }}
              </div>
            </div>
            <div class="question-body-input-output-example">
              <div class="question-body-input-output-example-title">Input/Output Example</div>
              <div class="question-body-input-output-example-content">
                {{ problemDetailResponse.inputOutputExample }}
              </div>
            </div>
          </el-scrollbar>
        </el-aside>
        <!-- Question Body Aside 2 -->
        <el-aside class="question-body-aside" width="500px" v-if="menuData.activeIndex == '2'">
          <el-scrollbar>
            <div class="question-body-problem-submit">
              <div class="question-body-problem-submit-refresh">
                <el-icon class="question-body-problem-submit-refresh-icon" @click="handleProblemAnswerSubmitsRefresh()" color="#3977b8"><Refresh /></el-icon>
              </div>
              <el-table empty-text="No submission history found" @row-click="handleShowCode" :data="problemAnswerSubmitResponse.list" :header-cell-style="{ background: '#3977b8', color: '#FAFCFF', cursor: 'default' }" border style="cursor: pointer;" >
                <el-table-column prop="submitDate" label="Submit Date" width="120" align="center" :formatter="formatDate" />
                <el-table-column prop="language" label="Language" width="120" align="center" :formatter="formatLanguage" />
                <el-table-column prop="status" label="Success status" align="center" />
              </el-table>
            </div>
          </el-scrollbar>
        </el-aside>
        <el-container>

          <!-- Question Body Main -->
          <el-main class="question-body-main">
            <el-scrollbar>
              <div class="question-editor-container">
                <div class="question-editor-main">
                  <CodeEditor
                    theme="intellij-light"
                    width="100%"
                    height="340px"
                    :line-nums="true"
                    :autofocus="true"
                    border-radius="0px"
                    :languages="[['PYTHON', 'Python'], ['JAVA', 'Java']]"
                    v-model="problemAnswerResponse.code"
                    @lang="handleChangeLanguage"
                  />
                </div>
                <div class="question-editor-answer">
                  <div v-for="data in problemTestData">
                    <el-descriptions :column="1" border style="padding: 15px;">
                      <el-descriptions-item>
                        <template #label>
                          <div class="cell-item">
                            Test Case
                          </div>
                        </template>
                        {{ data.problemTestCaseNo }}
                      </el-descriptions-item>
                      <el-descriptions-item>
                        <template #label>
                          <div class="cell-item">
                            입력값
                          </div>
                        </template>
                        {{ data.input }}
                      </el-descriptions-item>

                      <el-descriptions-item>
                        <template #label>
                          <div class="cell-item">
                            기대값
                          </div>
                        </template>
                        {{ data.expectedOutput }}
                      </el-descriptions-item>

                      <el-descriptions-item>
                        <template #label>
                          <div class="cell-item">
                            실행결과
                          </div>
                        </template>
                        {{ data.actualOutput }}
                      </el-descriptions-item>

                      <el-descriptions-item>
                        <template #label>
                          <div class="cell-item">
                            성공여부
                          </div>
                        </template>
                        {{ data.status }}
                      </el-descriptions-item>

                      <el-descriptions-item>
                        <template #label>
                          <div class="cell-item">
                            출력
                          </div>
                        </template>
                        {{ data.message }}
                      </el-descriptions-item>
                    </el-descriptions>
                  </div>
                  <div>
                    <CodeEditor 
                      theme="intellij-light" 
                      width= "100%" 
                      height="190px" 
                      :read-only="true" 
                      border-radius="0px" 
                      :languages="[['bash', 'Result']]"
                      v-model="problemAnswerData.compileAnswer"
                    />
                  </div>
                </div>
              </div>
            </el-scrollbar>
          </el-main>
        </el-container>
      </el-container>
    </div>
    <div class="question-footer">
      <!-- temp -->
      <el-button size="large" type="success" @click="handleChat()">Chat</el-button>
      <!-- //temp -->

      <el-button size="large" type="info" @click="handlePostProblemAnswer()">Save</el-button>
      <el-button size="large" type="info" @click="handleGetProblemAnswer()">Pull</el-button>
      <el-button size="large" type="info" @click="handleClearFormat()">Clear</el-button>
      <el-button size="large" type="primary" @click="handlePostProblemAnswerCompile()">Run</el-button>
    </div>



    <div>
      <el-drawer v-model="table" title="I have a nested table inside!" direction="rtl" size="40%">
        <el-container>
            <el-main>
              <div id="chat-messages" class="chat-messages">
                  <!-- 채팅 메시지가 여기에 추가됩니다. -->
                  <div v-for="(message, index) in messages" :key="index" class="message-wrapper" :class="{ 'sent-message': message.sender === 'user' }">
                      <div class="message">{{ message.text }}</div>
                  </div>
              </div>
              <div class="fixed-input" >
                <el-row>
                    <el-col :span="20">
                        <el-input v-model="newMessage" placeholder="메시지 입력"></el-input>
                    </el-col>
                    <el-col :span="4">
                        <el-button @click="sendMessage">전송</el-button>
                    </el-col>
                </el-row>
              </div>
            </el-main>
        </el-container>
      </el-drawer>
    </div>
        
    <el-dialog v-model="codeFormVisible" title="Code History" width="600" align-center>
      <CodeEditor 
        theme="intellij-light" 
        width= "100%" 
        height="400px" 
        :read-only="true" 
        border-radius="0px" 
        :languages="[['bash', 'Result']]"
        v-model="copyCode"
        style="border: 1px solid #dcdfe6"
      />
    </el-dialog>
  </div>
</template>

<script>
axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('accessToken');

// 모듈 임포트
import hljs from 'highlight.js'
import CodeEditor from 'simple-code-editor'
import axios from 'axios'

export default {  
  components: {
    CodeEditor
  },
  data() {
    return {
      environmentVariable: {
        isMounted: false,
      },
      /**
       * URL경로에서 할당된 값
       */
      pathVariable: {
        problemId: this.$route.params.id,
        uuid: ''
      },
      /**
       * 문제 세부정보 응답 객체
       */
      problemDetailResponse: {
        problemId: '',
        title: '',
        description: '',
        restriction: '',
        inputOutputExample: '',
        rank: ''
      },
      /**
       * 문제 포멧 요청 객체
       */
      problemFormatRequest: {
        language: 'PYTHON'
      },
      /**
       * 문제 답변(포멧) 응답 객체
       */
      problemAnswerResponse: {
        code: '',
        language: '',
        uuid: ''
      },
      /**
       * 문제 제출 목록 응답 객체
       */
      problemAnswerSubmitResponse: {
        list: []
      },


      
      menuData: {
        activeIndex: '1'
      },
      problemData: {
        problemId: '',
        title: '',
        rank: '',
        restriction: '',
        description: '',
        inputOutputExample: ''
      },
      problemAnswerData: {
        languageType: '',
        standardFormat: '',
        savedFormat: '',
        compileAnswer: ''
      },
      problemTestData: [],
      problemAnswerHistoryData: [],
      codeFormVisible: false,
      copyCode: '',
      table: false
    }
  },
  /**
   * 화면 마운트 이벤트
   */
  async mounted() {
    await this.handleGetProblemDetail();
    await this.handleGetFormat();
    this.environmentVariable.isMounted = true;
  },
  methods: {
    /**
     * 서브 메뉴 선택 이벤트
     */
    handleSelectMenu(selectedIndex) {
      this.menuData.activeIndex = selectedIndex
    },
    /**
     * 문제의 세부 정보 조회
     */
    async handleGetProblemDetail() {
      try {
        const response = await axios.get('/api/problems/detail', {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
          },
          params: {
            problemId: this.pathVariable.problemId
          }
        });

        const data = response.data.data;
        Object.assign(this.problemDetailResponse, {
          problemId: data.problemId,
          title: data.title,
          description: data.description,
          restriction: data.restriction,
          inputOutputExample: data.inputOutputExample,
          rank: data.rank
        });
      } catch (error) {
        console.error("문제 세부 정보를 가져오는 중 오류 발생:", error);
      }
    },
    /**
     * 언어 선택 변경 이벤트
     */
    handleChangeLanguage(language) {
      this.problemFormatRequest.language = language;
      if(this.environmentVariable.isMounted) {
        this.handleGetFormat();
      }
    },
    /**
     * 선택한 언어에 맞는 문제 기본 포멧 조회
     */
    async handleGetClearFormat() {
      try {
        const response = await axios.get('/api/problems/format/clear', {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
          },
          params: {
            problemId: this.problemDetailResponse.problemId,
            language: this.problemAnswerResponse.language
          }
        });

        const data = response.data.data;
        Object.assign(this.problemAnswerResponse, {
          code: data.code,
          language: data.language
        });
      } catch (error) {
        console.error("문제 기본 포멧 정보를 가져오는 중 오류 발생:", error);
      }
    },
    /**
     * 선택한 언어에 맞는 문제 포멧 조회
     */
    async handleGetFormat() {
      try {
        const response = await axios.get('/api/problems/format', {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
          },
          params: {
            problemId: this.problemDetailResponse.problemId,
            language: this.problemFormatRequest.language
          }
        });

        const data = response.data.data;
        Object.assign(this.problemAnswerResponse, {
          code: data.code,
          language: data.language,
          uuid: data.uuid
        });
      } catch (error) {
        console.error("문제 기본 포멧 정보를 가져오는 중 오류 발생:", error);
      }
    },
    /**
     * 코드 초기화
     */
    async handleClearFormat() {
      this.$confirm(
        'Your written code will be reset. Continue?',
        'Reset code',
        {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning',
        }
      ).then(() => {
        this.handleGetClearFormat();
      }).catch((error) => {
        console.log(error);
      });
    },
    /**
     * 문제 답변 저장(컴파일은 미수행)
     */
    async handlePostProblemAnswer() {
      try {
        const response = await axios.post('/api/problems/answer', {
          code: this.problemAnswerResponse.code,
          language: this.problemAnswerResponse.language,
          problemId: this.problemDetailResponse.problemId
        }, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
          }
        });

        console.log(response);
      } catch (error) {
        console.error("문제 기본 포멧 정보를 가져오는 중 오류 발생:", error);
      }
    },
    /**
     * 저장된 문제 답변 조회
     */
    handleGetProblemAnswer() {
      this.handleGetFormat();
    },
    /**
     * 문제 컴파일 수행
     */
    async handlePostProblemAnswerCompile() {
      try {
        const response = await axios.post('/api/problems/compile', {
            problemId: this.problemDetailResponse.problemId,
            code: this.problemAnswerResponse.code,
            language: this.problemAnswerResponse.language
        }, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
          }
        });

        console.log(response);
      } catch (error) {
        console.error("문제 컴파일 중 오류 발생:", error);
      }
    },
    /**
     * 문제 제출 내역 조회
     */
    async handleProblemAnswerSubmitsRefresh() {
      try {
        const response = await axios.get('/api/problems/answer/submit', {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
          },
          params: {
            problemId: this.problemDetailResponse.problemId,
            uuid: this.problemAnswerResponse.uuid
          }
        });

        const data = response.data.data;
        this.problemAnswerSubmitResponse.list = data;
      } catch (error) {
        console.error("문제 제출 내역을 조회하는 중 오류 발생:", error)
      }
    },
    /**
     * 제출 일자 포멧을 변경하는 함수
     */
    formatDate(row) {
      const input = row.submitDate;
      const date = new Date(input);

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');

      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');

      return `${year}-${month}-${day} ${hours}:${minutes}`;
    },
    /**
     * 언어 포멧을 변경하는 함수
     */
    formatLanguage(row) {
      const input = row.language;
      return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
    },



    handleShowCode(row) {
      this.copyCode = row.code
      this.codeFormVisible = true
    },
    handleClose() {
      this.copyCode = ''
      this.codeFormVisible = false
    }
  }
}
</script>

<style>
/* question */
.question-body {
  height: 535px;
}
.question-body-aside {
  height: 535px;
  border-right: 1px solid #dcdfe6;
  font-size: 17px;
}
.question-body-main {
  height: 535px;
  --el-main-padding: 0px;
}
.question-footer {
  background-color: #fff;
  border-top: 1px solid #dcdfe6;
  text-align: right;
  padding: 10px;
}
.question-footer > .el-button {
  margin-left: 7px;
  width: 80px;
  font-size: medium
}
.question-editor-answer {
  border-top: 1px solid #dcdfe6;
}
.question-body-problem-description {
  padding: 20px 10px;
  border-bottom: 1px solid #dcdfe6;
}
.question-body-problem-description-title {
  font-weight: bold;
  margin-bottom: 15px;
}
.question-body-restrictions {
  padding: 20px 10px;
  border-bottom: 1px solid #dcdfe6;
}
.question-body-restrictions-title {
  font-weight: bold;
  margin-bottom: 15px;
}
.question-body-input-output-example {
  padding: 20px 10px;
}
.question-body-input-output-example-title {
  font-weight: bold;
  margin-bottom: 15px;
}
.question-body-problem-submit {
  padding: 20px 10px;
  border-bottom: 1px solid #dcdfe6;
}
.question-body-problem-submit-refresh {
  display: flex; 
  justify-content: right; 
  align-items: center; 
  margin-bottom: 10px;
}
.question-body-problem-submit-refresh-icon {
  cursor: pointer;
}
</style>