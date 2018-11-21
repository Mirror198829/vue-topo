<template>
    <div id="topoAttrWrap" :class="{active:isTopoAttrShow}">
        <i v-if="isTopoAttrShow" class="fa fa-chevron-circle-right topoAttrArrow" @click="isTopoAttrShow =!isTopoAttrShow"></i>
        <i v-if="!isTopoAttrShow" class="fa fa-chevron-circle-left topoAttrArrow" @click="isTopoAttrShow =!isTopoAttrShow"></i>
        <h3 id="topoAttrHeader">属性设置框</h3>
        <div class="noAttrTip" v-if="JSON.stringify(nodeData)=='{}'">
            未选择任何节点属性
        </div>
        <div class="topoAttrMain" v-else>
            <el-form  label-width="100px" class="demo-ruleForm" labelPosition="left">
                <div>
                    {{nodeData}}
                    <el-form-item label="颜色选择">
                        <el-color-picker v-model="vSelectNodeData.color"></el-color-picker>
                    </el-form-item>
                    <el-form-item label="粗细选择">
                        <el-slider
                        v-model="vSelectNodeData.strokeW"
                        :step="1"
                        show-stops
                        :min="2"
                        :max="20">
                        </el-slider>
                    </el-form-item>
                </div> 
            </el-form>
        </div>
        <div class="topoAttrFooter">
            <el-button type="info">确定</el-button>
            <el-button>取消</el-button>
        </div>
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
       isTopoAttrShow:true
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
@import '../../../less/index.less';
/* 属性设置框 */
#topoAttrWrap{display:flex;flex-direction:column;height:100%;width:400px;position:absolute;top:0;right:-400px;background:#fff;border-left:1px solid @theme-color;transition:all 1s;box-sizing:border-box;
    &.active{right:0;box-shadow:-1px 0px 8px  @theme-color}
    .topoAttrArrow{color:@theme-color;font-size:20px;position:absolute;top:50%;left:-10px;translate:transform(0 -50%);z-index:10000;cursor:pointer;}
    #topoAttrHeader{padding:10px 0;background-color:@theme-color;color:#fff;text-align:center;font-weight:400;font-size:14px;}
    .noAttrTip{padding:50px;text-align:center;flex:1;}
    .topoAttrMain{overflow-y: scroll;flex:1;padding:20px 15px;box-sizing:border-box;}
    .topoAttrFooter{padding:30px 0;display:flex;justify-content: center;align-items:center;}
}
</style>