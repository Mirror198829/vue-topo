/*
 * @Author: caojing
 * @Date: 2018-10-23 11:26:05
 * @LastEditors: caojing
 * @LastEditTime: 2018-11-13 16:19:15
 */
<template>
 <div class="nlPageTitleWrap">
  <h1 class="nlPageTitle">
      <slot></slot>
  </h1>
  <div v-show="splitLine" class="nlPageLine"></div>
 </div>
</template>

<script>
  export default {
    name:'nlPageTitle',
    props:{
      splitLine:{
        type:Boolean,
        default:false
      }
    },
    data() {
      return {
      };
    },
    methods: {
    }
  }
</script>
<style scoped>
.nlPageTitleWrap{margin-bottom:20px;}
.nlPageTitle{height: 14px;line-height: 14px;font-size:14px;color:#526476;padding-left: 5px;border-left:2px solid #419eff;font-weight: 500;}
.nlPageLine{margin-top:10px;height:2px;border:dashed #E6E9EB;border-width: 1px 0;}
</style>
