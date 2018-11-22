<!--
 * @Author: caojing
 * @Date: 2017-10-20 09:09:21
 * @LastEditors: caojing
 * @LastEditTime: 2018-11-22 14:37:52
 -->
<template>
  <div id="app">
    <v-header></v-header>
    <div class="topoArea">
        <v-topo></v-topo>
    </div>
    <v-footer></v-footer>
  </div>
</template>

<script>
import vHeader from './components/vHeader'
import vFooter from './components/vFooter'
import vTopo from './components/vTopo/vTopo'
export default {
  name: 'app',
  components:{
    vHeader,
    vFooter,
    vTopo
  },
}
</script>

<style lang="less">
@import '../src/less/index.less';
.clearfix{ zoom:1;}
.clearfix:after{ content:''; display:block; clear:both;}
*{margin:0;padding:0;}
ul,li{list-style: none;}
body{background-color: @theme-color;}
html,body,#app{height:100%}
</style>
<style>
 .topoArea{height:calc(100% - 60px - 40px);min-height: 600px;} 
</style>
