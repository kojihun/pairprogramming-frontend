<template>
  <div class="question-container">
    <div class="question-header">
      <QHeader></QHeader>
    </div>
    <div class="question-body">
      <el-container>
        <el-aside class="question-body-aside" width="500px">
          <el-scrollbar>
            <div class="question-body-problem-description">
              <div class="question-body-problem-description-title">Problem Description</div>
              <div class="question-body-problem-description-content">The string my_string is given as a parameter. Complete the solution function to return a string that reverses my_string.</div>
            </div>
            <div class="question-body-restrictions">
              <div class="question-body-restrictions-title">Restrictions</div>
              <div class="question-body-restrictions-content">1 ≤ length of my_string ≤ 1,000</div>
            </div>
            <div class="question-body-input-output-example">
              <div class="question-body-input-output-example-title">Input/Output Example</div>
              <div class="question-body-input-output-example-content">
                <table>
                  <thead>
                    <tr>
                      <th>price</th>
                      <th>result</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>150,000</td>
                      <td>142,500</td>
                    </tr>
                    <tr>
                      <td>580,000</td>
                      <td>464,000</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </el-scrollbar>
        </el-aside>
        <el-container>
          <el-main class="question-body-main">
            <el-scrollbar>
              <div>
                <div class="question-editor-main">
                  <CodeEditor theme="intellij-light" width="100%" height="340px" line-nums="true" :autofocus="true" border-radius="0px" :languages="[['python', 'Python'],['java', 'Java']]" v-model="demo"></CodeEditor>
                </div>
                <div class="question-editor-answer">
                  <CodeEditor theme="intellij-light" width= "100%" height="190px" :read-only="true" border-radius="0px" :languages="[['bash', 'Result']]"></CodeEditor>
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
      <el-button size="large" type="info">Clean</el-button>
      <el-button size="large" type="primary">Run</el-button>
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
  </div>
</template>

<script>
// Import - File
import QHeader from '../components/fragments/question/Header.vue'

// Import - Module
import hljs from 'highlight.js';
import CodeEditor from 'simple-code-editor';
import axios from 'axios';

export default {  
  components: {
    QHeader,
    CodeEditor
  },
  mounted() {
    // $route.params.id를 통해 id 값을 가져옴
    const id = this.$route.params.id;
    // 이제 id를 사용하여 원하는 작업을 수행할 수 있음
    console.log("이동한 페이지의 id 값:", id);
  },
  data() {
    return {
      c1: '# please start code',
      c2: 'waiting complie code..',
      demo: '',
      table: false,
      messages: [
                        { text: "안녕하세요!", sender: "bot" },
                        { text: "어떻게 지내세요?", sender: "bot" },
                        { text: "저도 잘 지내요!", sender: "user" },
                        { text: "오랜만에 만나서 반가워요!", sender: "user" },
                        { text: "안녕하세요!", sender: "bot" },
                        { text: "어떻게 지내세요?", sender: "bot" },
                        { text: "저도 잘 지내요!", sender: "user" },
                        { text: "오랜만에 만나서 반가워요!", sender: "user" }
                    ],
    }
  },
  methods: {
    resultBtn() {
      axios.get('http://localhost:8080/api', {
        params :{
            code : encodeURI(this.c1)
            }
        }).then((response)=>{
            console.log(response.data);
            this.c2 =  response.data;
        }).catch((error)=>{
            console.log("failed post http://localhost:8080/");
            console.log(error);
        })
    },
    handleChat() {
      this.table = true;
      console.log(this.table);
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
.question-body-input-output-example-content > table, th, td {
  border: 1px solid #fff;
  border-collapse: collapse;
  background-color: #A8ABB2;
  color: #fff;
  padding: 7px 15px;
}

</style>