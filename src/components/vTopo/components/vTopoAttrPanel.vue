<!--
 * @Author: caojing
 * @Date: 2018-11-21 09:31:49
 * @LastEditors: caojing
 * @LastEditTime: 2018-11-23 14:43:14
 -->
<template>
    <div id="topoAttrWrap" :class="{active:isTopoAttrShow}">
        <h3 id="topoAttrHeader">属性设置框</h3>
        <div class="noAttrTip" v-if="JSON.stringify(nodeData)=='{}'">
            未选择任何节点属性
        </div>
        <div class="topoAttrBody" v-else>
            <div class="topoAttrMain">
                <el-form  label-width="100px" class="demo-ruleForm" labelPosition="left">
                    <div v-if="vSelectNodeData.type == 'Line'">
                        <el-form-item label="颜色选择">
                            <el-color-picker v-model="vSelectNodeData.color"></el-color-picker>
                        </el-form-item>
                        <el-form-item label="粗细选择">
                            <el-slider
                            v-model="vSelectNodeData.strokeW"
                            :step="1"
                            show-stops
                            :min="3"
                            :max="20">
                            </el-slider>
                        </el-form-item>                        
                    </div> 
                    <div v-else>节点属性框</div>
                </el-form>
            </div>
            <div class="topoAttrFooter">
                <nl-button type="primary" style="margin-right:15px;">确定</nl-button>
                <nl-button>取消</nl-button>
            </div>
        </div>
        <i  class="topoAttrArrow"
            :class="{'pushIcon':!isTopoAttrShow,'pullIcon':isTopoAttrShow}"
             @click="isTopoAttrShow =!isTopoAttrShow">
            <img src="../../../assets/topo/push.svg" v-if="!isTopoAttrShow">
            <img src="../../../assets/topo/pull.svg" v-else>
        </i>
    </div>
</template>

<script>
export default {
  name:'vTopoAttrPanel',
  props:{
      vSelectNodeData:{
          type:Object,
          default: function () {
                return {}
          }
      }
  },
  data(){
   return {
       isTopoAttrShow:false
   }
  },
  computed:{
      nodeData(){
          let nodeData = JSON.parse(JSON.stringify(this.vSelectNodeData))
          return nodeData
      }
  },
  components: {

  },
  methods:{
  },
  mounted(){

  },
  created(){}
}
</script>

<style lang="less">

</style>
<style lang="less" scoped>
#topoAttrWrap{display:flex;flex-direction:column;height:100%;width:400px;position:absolute;top:0;right:-400px;background:#fff;border-left:1px solid darken(@theme-color,10%);transition:all 1s;box-sizing:border-box;
    &.active{right:0;box-shadow:-1px 0px 15px  @theme-color}
    .topoAttrArrow{color:@theme-color;font-size:20px;position:absolute;top:50%;translate:transform(0 -50%);z-index:200;cursor:pointer;
        &.pushIcon{left:-17px;}
        &.pullIcon{left:-2px;}
    }
    #topoAttrHeader{padding:10px 0;background-color:darken(@theme-color,5%);color:@theme-font-color;text-align:center;font-weight:400;font-size:14px;}
    .noAttrTip{padding:50px;text-align:center;flex:1;}
    .topoAttrBody{flex:1;display:flex;flex-direction:column;
        .topoAttrMain{overflow-y: scroll;flex:1;padding:20px 15px;box-sizing:border-box;}
        .topoAttrFooter{padding:30px 0;display:flex;justify-content: center;align-items:center;}
    }
}
</style>