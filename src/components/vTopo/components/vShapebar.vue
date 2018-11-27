<!--
 * @Author: caojing
 * @Date: 2018-11-23 10:28:53
 * @LastEditors: caojing
 * @LastEditTime: 2018-11-27 10:12:26
 -->
<template>
    <div class="shapebarWrap">
        <div class="shapebarHead">
            Node Types
        </div>
        <div class="shapeNodeLstWrap">   
            <ul class="shapeNodeLst">
                <li v-for="(ele,key) in shapeNodeLstData" :key="key" class="shapeNode" @mousedown.stop.prevent = "dragShapeNode(shapeNodeLstData,key,$event)" :title="ele.type">                          
                <div class="shapeIcon">
                    <img class="shapeIconImg" :src="ele.icon" />
                </div>
                <div class="shapeName">{{ele.type}}</div>                           
                </li>
            </ul>      
        </div>
    </div>
</template>

<script>
import shapeNodeLstData from '../../../data/toolbarNodeData' //初始左侧toolbarNode数据（可从后台获取）
export default {
  name:'vShapebar',
  data(){
   return {
       shapeNodeLstData:[] //shapebar数据
   }
  },
  components: {

  },
  methods:{
    dragShapeNode(shapeNodeLstData,key,$event){
          this.$emit('click', shapeNodeLstData,key,$event);
    },
    //初始shapeLstData
    initToolbarNodes(){
      let initShapeLstData = shapeNodeLstData //toolbarNodeData从后台获取
      if(!initShapeLstData instanceof Array){ //类型检测，必须为Array
          console.error('shapeNodeLstData must be Array')
          initShapeLstData = []
      }
      this.shapeNodeLstData = initShapeLstData
    }
  },
  mounted(){
      this.initToolbarNodes() //初始化toolbarNodes数据
  },
  created(){}
}
</script>
<style lang="less" scoped>
@border-color:#aaaaaa;
/*svgMain左侧工具栏*/
.shapebarWrap{height:100%;box-sizing: border-box;display: flex;flex-direction: column;width:250px;border:1px solid @border-color;border-right:0;background:@theme-color;
  .shapebarHead{height:40px;line-height:40px;text-align: center;font-size:14px;-webkit-user-select:none;user-select:none;font-weight: 700;color:@theme-font-color;text-overflow:ellipsis;overflow:hidden;white-space:nowrap;}
  .shapeNodeLstWrap{overflow-y: auto;box-sizing:border-box;padding:10px 15px;flex:1;
    .shapeNodeLst{width:100%;display:flex;flex-wrap:wrap;box-sizing:border-box;}
  }
}
.shapeNode{margin-top:5px;cursor: pointer;border:1px solid #c7d1dd;border-radius:2px;-webkit-user-select:none;user-select:none;background-color: #fff;-webkit-user-select:none;user-select:none;box-sizing: border-box;
width:calc( ~"( 100% - 10px ) / 3" );box-sizing:border-box;padding:6px 0;margin-right: 5px;
    &:nth-child(3n){margin-right: 0}
}
/*移动的node*/
.shapeIcon{text-align: center;-webkit-user-select:none;user-select:none;
  .shapeIconImg{width: 28px;height: 28px;-webkit-user-select:none;user-select:none;}
}
.shapeName{font-size:12px;text-align: center;padding:0 5px;text-overflow:ellipsis;overflow:hidden;white-space:nowrap;-webkit-user-select:none;user-select:none;color:#000}
</style>