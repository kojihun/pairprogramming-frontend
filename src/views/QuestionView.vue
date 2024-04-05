<template>
  <div class="question-container">
    <div class="question-header">

    
      <el-menu :default-active="menuData.activeIndex" mode="horizontal" :ellipsis="false" @select="handleSelect">
        <el-menu-item index='1'>{{ problemData.title }}</el-menu-item>
        <el-menu-item index='2'>Submission history</el-menu-item>
      </el-menu>
    
    
    </div>
    <div class="question-body">
      <el-container>


        <el-aside class="question-body-aside" width="500px" v-if="menuData.activeIndex == '1'">
          <el-scrollbar>
            <div class="question-body-problem-description">
              <div class="question-body-problem-description-title">Problem Description</div>
              <div class="question-body-problem-description-content">
                {{ problemData.description }}
              </div>
            </div>
            <div class="question-body-restrictions">
              <div class="question-body-restrictions-title">Restrictions</div>
              <div class="question-body-restrictions-content">
                {{ problemData.restriction }}
              </div>
            </div>
            <div class="question-body-input-output-example">
              <div class="question-body-input-output-example-title">Input/Output Example</div>
              <div class="question-body-input-output-example-content">
                {{ problemData.inputOutputExample }}
              </div>
            </div>
          </el-scrollbar>
        </el-aside>


        <el-aside class="question-body-aside" width="500px" v-if="menuData.activeIndex == '2'">
          <el-scrollbar>
            <div class="question-body-problem-description">
              <div style="display: flex; justify-content: right; align-items: center; margin-bottom: 10px; ">
                <el-icon color="#3977b8"  @click="handleRefresh()" style="cursor: pointer"><Refresh /></el-icon>
              </div>
              <el-table empty-text="No submission history found" @row-click="handleShowCode" :data="problemAnswerHistoryData" :header-cell-style="{ background: '#c6e2ff', color: '#FAFCFF', cursor: 'default' }" border style="cursor: pointer;" >
                <el-table-column prop="" label="Submit Date" width="120" />
                <el-table-column prop="language" label="Language" width="120" />
                <el-table-column prop="status" label="Success status" />
              </el-table>
            </div>
          </el-scrollbar>
        </el-aside>


        <el-container>
          <el-main class="question-body-main">
            <el-scrollbar>
              <div>
                <div class="question-editor-main">
                  <CodeEditor
                    theme="intellij-light"
                    width="100%"
                    height="340px"
                    :line-nums="true"
                    :autofocus="true"
                    border-radius="0px"
                    :languages="[['python', 'Python'], ['java', 'Java']]"
                    v-model="problemAnswerData.standardFormat"
                    @lang="handleGetStandardFormat"
                  />
                </div>
                <div class="question-editor-answer">
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
            </el-scrollbar>
          </el-main>
        </el-container>
      </el-container>
    </div>
    <div class="question-footer">
      <!-- temp -->
      <el-button size="large" type="success" @click="handleChat()">Chat</el-button>
      <!-- //temp -->

      <el-button size="large" type="info">Save</el-button>
      <el-button size="large" type="info">Pull</el-button>
      <el-button size="large" type="info" @click="handleClean()">Clean</el-button>
      <el-button size="large" type="primary" @click="handleCompile()">Run</el-button>
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
      problemAnswerHistoryData: [],
      codeFormVisible: false,
      copyCode: '',
      table: false
    }
  },
  mounted() {
    this.handleLoadProblemDetail(this.$route.params.id)
  },
  methods: {
    async handleLoadProblemDetail(problemId) {
      try {
        const response = await axios.get('/api/problems/detail', {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
          },
          params: {
            problemId: problemId
          }
        })

        const data = response.data.data
        Object.assign(this.problemData, {
          problemId: data.problemId,
          title: data.title,
          rank: data.rank,
          restriction: data.restriction,
          description: data.description,
          inputOutputExample: data.inputOutputExample
        })
      } catch (error) {
        console.error("문제 세부 정보를 가져오는 중 오류 발생:", error)
      }
    },
    async handleGetStandardFormat(language) {
      try {
        const response = await axios.get('/api/problems/format', {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
          },
          params: {
            problemId: this.$route.params.id,
            languageType: language
          }
        })

        const data = response.data.data
        Object.assign(this.problemAnswerData, {
          languageType: data.languageType,
          standardFormat: data.standardFormat
        })
      } catch (error) {
        console.error("문제 세부 정보를 가져오는 중 오류 발생:", error)
      }
    },
    async handleCompile() {
      try {
        const response = await axios.post('/api/problems/compile', {
          code: this.problemAnswerData.standardFormat,
          languageType: this.problemAnswerData.languageType
        })

        const data = response.data.data
        this.problemAnswerData.compileAnswer = data.return
        console.log(data)
      } catch (error) {
        console.error("문제 세부 정보를 가져오는 중 오류 발생:", error)
      }
    },
    handleClean() {
      this.$confirm(
        'Your written code will be reset. Continue?',
        'Reset code',
        {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning',
        }
      ).then(() => {
        this.handleGetStandardFormat(this.problemAnswerData.languageType)
      }).catch(() => {
        
      })
    },
    handleSelect(selectedIndex) {
      this.menuData.activeIndex = selectedIndex
    },
    async handleRefresh() {
      try {
        console.log(this.problemData.problemId)
        const response = await axios.get('/api/problems/answer', {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
          },
          params: {
            problemId: this.problemData.problemId
          }
        });

        this.problemAnswerHistoryData = response.data.data
      } catch (error) {
        console.error("문제 세부 정보를 가져오는 중 오류 발생:", error)
      }
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
</style>