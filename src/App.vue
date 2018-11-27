<!--
 * @Author: caojing
 * @Date: 2017-10-20 09:09:21
 * @LastEditors: caojing
 * @LastEditTime: 2018-11-27 09:39:16
 -->
<template>
  <div id="app">
    <!-- 编辑如下 -->
    <div class="topoArea">
        <v-topo 
        :editable="true"
        :topo-data="topoData1"></v-topo>
    </div>
    <!-- 展示如下： -->
    <!-- <div style="height:500px;">
        <v-topo 
          :editable="false"
          :topo-data="topoData2"
        ></v-topo>
    </div> -->
    <v-footer></v-footer>
  </div>
</template>

<script>
import vHeader from './components/vHeader'
import vFooter from './components/vFooter'
import vTopo from './components/vTopo/vTopo'
import topoData1 from './data/topoData1'
import topoData2 from './data/topoData2'
export default {
  name: 'app',
  components:{
    vHeader,
    vFooter,
    vTopo
  },
  data(){
    return{
      topoData1:topoData1,
      topoData2:topoData2
    }
  },
  methods:{
    //初始化topo数据
    initTopoData(){
      let initTopoData = topoData2//开发：topoJson从后台获取数据
      let nullTopoData = {
        nodes:[],
        connectors:[]
      }
      //类型检测
      if(initTopoData instanceof Object && !Array.prototype.isPrototypeOf(initTopoData)){
        if('nodes' in initTopoData && 'connectors' in initTopoData){
          if(!initTopoData.nodes instanceof Array  || !initTopoData.connectors instanceof Array){
            console.error('topoJson.nodes or topoJson.connectors must be Array')
            initTopoData = nullTopoData
          }
        }else{
          console.error('topoJson must has nodes key and connectors key')
          initTopoData = nullTopoData
        }
      }else{
        console.error('topoJson must be {nodes:[],connectors:[]}')
        initTopoData = nullTopoData
      }
      this.topoData =  initTopoData
    }
  },
  mounted() {
    //this.initTopoData() //初始化topo数据
  },
}
</script>

<style lang="less" scoped>
body{background:url('./assets/topo/canvas_bg.jpg');}
#app{height:100%}
 .topoArea{height:calc(~"100% - 70px");min-height: 800px;} 
</style>
