<template>
  <div class="main-container">
    <div>
      <div class="main-search">
        <div class="mt-4">
          <el-input v-model="searchInput" placeholder="Please search for the title" size="large" style="width: 800px">
            <template #prepend>
              <el-select v-model="searchSelect" placeholder="Rank" size="large" style="width: 120px">
                <el-option label="All" value="0" />
                <el-option label="Lv. 0" value="1" />
                <el-option label="Lv. 1" value="2" />
                <el-option label="Lv. 2" value="3" />
                <el-option label="Lv. 3" value="4" />
              </el-select>
            </template>
          </el-input>
        </div>

      </div>
      <div class="main-table">
        <el-table :data="tableData" :header-cell-style="{ background: '#c6e2ff', color: '#FAFCFF' }" border size="large" style="width: 800px">
          <el-table-column prop="date" label="No" width="120" />
          <el-table-column prop="name" label="Rank" width="120" />
          <el-table-column prop="address" label="Title" />
        </el-table>
      </div>
      <div class="main-pagination">
        <el-pagination layout="prev, pager, next" :total="1000" />
      </div>
    </div>
  </div>
  <div class="main-footer">
    <Footer></Footer>
  </div>
</template>

<script setup lang="ts">
// Import - File
import Footer from '../components/fragments/Footer.vue'

// Import -Variables
import { ref } from 'vue'

// Variables - Search
const searchInput = ref('')
const searchSelect = ref('')

const tableData = [
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-08',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-06',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-07',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-07',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-07',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-07',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
]
</script>

<style>
/* main */
.main-container {
  padding-top: 50px;
  padding-bottom: 50px;
}
.main-search {
  display: flex;
  justify-content: center;
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