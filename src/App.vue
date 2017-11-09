<template>
  <div id="app">
    <v-header></v-header>
    <v-topo></v-topo>
    <v-footer></v-footer>
  </div>
</template>

<script>
import vHeader from './components/vHeader.vue'
import vFooter from './components/vFooter.vue'
import vTopo from './components/vTopo.vue'
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
body{background-color: @theme-color}
</style>
