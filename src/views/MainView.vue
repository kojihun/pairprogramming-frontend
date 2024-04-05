<template>
  <div class="main-container">
    <div>
      <div class="main-search-container">
        <div class="main-search">
          <el-input v-model="searchData.searchInput" placeholder="Please search for the title" size="large" style="width: 715px">
            <template #prepend>
              <el-select v-model="searchData.searchSelect" placeholder="Rank" size="large" style="width: 120px">
                <el-option label="All" value="" />
                <el-option label="Lv. 0" value="LEVEL0" />
                <el-option label="Lv. 1" value="LEVEL1" />
                <el-option label="Lv. 2" value="LEVEL2" />
                <el-option label="Lv. 3" value="LEVEL3" />
                <el-option label="Lv. 4" value="LEVEL4" />
                <el-option label="Lv. 5" value="LEVEL5" />
              </el-select>
            </template>
          </el-input>
          <el-button type="primary" size="large" @click="handleShowProblems()" style="width: 80px; margin-left: 5px;">Search</el-button>
        </div>
      </div>
      <div class="main-table">
        <el-table @row-click="handleShowProblemDetail" :data="problemData.problems" :header-cell-style="{ background: '#c6e2ff', color: '#FAFCFF', cursor: 'default' }" border size="large" style="max-width: 800px; min-width: 800px; cursor: pointer">
          <el-table-column prop="problemId" label="No" width="120" />
          <el-table-column prop="rank" label="Rank" width="120" :formatter="formatRank" />
          <el-table-column prop="title" label="Title" />
        </el-table>
      </div>
      <div class="main-pagination">
        <el-pagination layout="prev, pager, next" v-model:current-page="problemData.pageNumber" :total="problemData.totalPages" @current-change="handlePageChange()" />
      </div>
    </div>
  </div>
  <div class="main-footer">
    <Footer></Footer>
  </div>
</template>

<script setup lang="ts">
// 컴포넌트 임포트
import Footer from '../components/fragments/Footer.vue'

// Axios 라이브러리 임포트
import axios from 'axios'

// Vue 관련 라이브러리 임포트
import { reactive, ref } from 'vue'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

// 라우터 관련 변수
const router = useRouter()

// 검색 관련 변수
const searchData = reactive({
  searchInput: '',
  searchSelect: '',
})

// 문제 관련 변수
const problemData = reactive({
  problems: [],
  totalPages: 0,
  pageNumber: 1,
  pageSize: 10
})

/**
 * rank의 포멧을 변경하는 함수
 */
const formatRank = (row: any) => {
  const level = row.rank.replace('LEVEL', '');
  return `Lv. ${level}`
}

/**
 * 화면 마운트될 때 호출되는 함수
 */
onMounted(() => {
  handleShowProblems()
})

/**
 * 모든 문제 목록을 가져오는 함수
 */
const handleShowProblems = async () => {
  try {
    const response = await axios.get('/api/problems/all', {
      params: {
        pageNumber: problemData.pageNumber,
        pageSize: problemData.pageSize,
        searchInput: searchData.searchInput,
        searchSelect: searchData.searchSelect
      }
    })

    const data = response.data
    problemData.problems = data.data.problems
    problemData.totalPages = data.data.totalPages
  }catch (error) {
    console.log(error)
  }
}

/**
 * 페이지 변경시 호출되는 함수
 */
const handlePageChange = () => {
  handleShowProblems()
}

/**
 * 번호에 해당하는 문제로 이동
 */
const handleShowProblemDetail = async (row: any) => {
  router.push({ name: 'question', params: { id: row.problemId } })
}
</script>

<style>
/* main */
.main-container {
  padding-top: 50px;
  padding-bottom: 50px;
}
.main-search-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
.main-search {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.main-table {
  margin-top: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.main-pagination {
  margin-top: 15px;
  display: flex;
  justify-content: center;
  align-items:  center;
}
</style>