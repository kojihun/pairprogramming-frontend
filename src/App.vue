<template>
  <div class="container">
    <div class="header">
      <Header></Header>
    </div>
    <div class="menu">
      <RouterView></RouterView>
    </div>
    <div class="body">
    </div>
    <el-divider class="el-divider-block"></el-divider>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import Header from './components/fragments/Header.vue'
</script>

<style>
.el-divider-block {
    margin: 0px;
}
</style>