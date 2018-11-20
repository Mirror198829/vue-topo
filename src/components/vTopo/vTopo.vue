<!--
 * @Author: caojing
 * @Date: 2017-6-30 17:29:55
 * @LastEditors: caojing
 * @LastEditTime: 2018-11-20 19:53:33
 -->
<template>
  <div id="topoComponent">
    <el-row class="topoRow">
      <el-col :xs="5" :sm="6" :md="6" :lg="4" :xl="6" class="topoCol">
        <div id="toolbarWrap">
            <div class="toolbar-head">
                Node Types
            </div>
            <div class="toolbar-main">
                <el-row :gutter="5">
                   <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="4"  v-for="(ele,key) in toolbarNodeData" :key="key">              
                    <li class="node-item node-css" @mousedown.stop.prevent = "dragToolbarNode(toolbarNodeData,key,$event)" :title="ele.type">                          
                        <div class="node-icon">
                          <img class="toolbar-node-icon" :src="ele.icon" />
                        </div>
                        <div class="node-name">{{ele.type}}</div>                           
                     </li>
                   </el-col>
                </el-row>
             </div>
        </div>
      </el-col>
      <el-col :xs="19" :sm="18" :md="18" :lg="20" :xl="18" class="svgCol">
        <div id="svgWrap">
          <div id="svgHead">
            <ul class="svgHeadItemLst">
              <li class="svgHeadItem" v-for="(ele,key) in svgToolbar" :key="key" :class="{'active':ele.isActive}" @mousedown="selectToolbar(key)"  :title="ele.name">
                <div class="svgHeadItemImg" :class="ele.className"></div>
              </li>
            </ul>
            <ul class="svgHeadItemLst">
              <li class="svgToolBarItem" @click="saveTopoJson" title="保存">
                <i class="fa fa-save svgToolBarIcon"></i>
                <span  class="svgToolBarTxt hidden-xs-only">保存</span>
              </li>              
              <!-- <li class="svgToolBarItem" title="上传">
                <i class="fa fa-upload svgToolBarIcon"></i>
                <span  class="svgToolBarTxt hidden-xs-only">上传</span>
              </li>
              <li class="svgToolBarItem" title="下载">
                <i class="fa fa-download svgToolBarIcon"></i>
                <span  class="svgToolBarTxt hidden-xs-only">下载</span>
              </li> -->
              <!-- <li class="svgToolBarItem" @click="saveTopoImage" title="保存图片">
                <i class="fa fa-file-image-o svgToolBarIcon"></i>
                <span  class="svgToolBarTxt hidden-xs-only">保存图片</span>
              </li> -->
            </ul>
          </div>
          <div id="topo-wrap">
            <svg id="topo-svg"
              :width="svgAttr.width" 
              :height="svgAttr.height"  
              @mousedown.stop = "mousedownTopoSvg($event)" 
              :viewBox="svgAttr.viewX+' '+svgAttr.viewY+' '+svgAttr.width+' '+svgAttr.height" 
              :class="{'hand':svgAttr.isHand,'crosshair':svgAttr.isCrosshair}">
              <defs>
                <pattern id="Pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                  <line :x1="ele.x1" :x2="ele.x2" :y1="ele.y1" :y2="ele.y2" :stroke="ele.color" :stroke-width="ele.strokeWidth" :opacity="ele.opacity" v-for="(ele,key) in gridData" :key="key"></line>
                </pattern>
              </defs>
              <rect fill="url(#Pattern)" :width="svgAttr.width" :height="svgAttr.height" />             
              <g>                        
                <g
                  class="nodesG" 
                  v-for="(ele,key) in topoData.nodes" 
                  :transform="'translate('+ele.x+','+ele.y+')'" 
                  :key="key" 
                  @mouseover.stop="mouseoverNode(key,$event)" 
                  @mousedown.stop="dragSvgNode(key,$event)"
                  @mouseout.stop = "mouseoutLeftConnector(key)"
                  >
                  <rect x="0" y="0" rx="2" ry="2" :width="ele.width" :height="ele.height" class="reactClass" :class="{isSelect:ele.isSelect}" />
                  <!-- <text  v-if="ele.classType == 'T1'" class="nodeName" x="5" y="15">{{ele.classType}}</text> -->
                  <text  v-if="ele.classType == 'T1'" class="nodeName" x="5" y="15">{{ele.name}}</text>
                  <image class="nodeImg" v-if="ele.classType == 'T1'" :xlink:href="ele.icon" :x="ele.width - 18" :y="3" height="15px" width="15px"/>

                  <image class="nodeImg" v-if="ele.classType == 'T2'" :xlink:href="ele.icon" :x="7" :y="7" height="36px" width="36px"/>
                  <text  v-if="ele.classType == 'T2'" class="nodeName" x="0" :y="ele.height + 14">{{ele.name}}</text>
                  <g class="connectorArror" :class="{'connector':ele.isLeftConnectShow}" :transform="'translate(0,'+ele.height/2+')'">
                    <circle r="8" cx="0" cy="0" class="circleColor"></circle>
                    <line x1="-3" y1="-5" x2="4" y2="0.5" stroke="#fff"></line>
                    <line x1="4" y1="-0.5" x2="-3" y2="5" stroke="#fff"></line>
                  </g>
                  <g class="connectorArror" :class="{'connector':ele.isRightConnectShow}" :transform="'translate('+ele.width+','+ele.height/2+')'" @mousedown.stop="drawConnectLine(key,$event)">
                    <circle r="8" cx="0" cy="0" class="circleColor"></circle>
                    <line x1="-3" y1="-5" x2="4" y2="0.5" stroke="#fff"></line>
                    <line x1="4" y1="-0.5" x2="-3" y2="5" stroke="#fff"></line>
                  </g>
                </g>
                <!-- node间关系连线样式 -->
                <g 
                  class="connectorsG"
                  :class="{active:ele.isSelect}" 
                  v-for="(ele,key) in topoData.connectors" v-if="ele.type == 'Line'"
                  @mousedown.stop="selectConnectorLine(key)"
                  :key="key">
                  /**
                  * 连线方式一共7种情况
                  */
                  <!-- 自连 -->
                  <path
                    class="connectorLine"
                    :class="{'defaultStrokeColor':!ele.color,'defaultStrokeW':!ele.strokeW}" 
                    :stroke="ele.color"
                    :stroke-width = "ele.strokeW"
                    v-if="ele.sourceNode.id == ele.targetNode.id" 
                    :d="'M'+(ele.sourceNode.x + ele.sourceNode.width)+','+(ele.sourceNode.y + ele.sourceNode.height / 2)+
                    'h'+connectorWSelf+
                    'v'+(-(ele.sourceNode.height / 2 + connectorWSelf))+ 
                    'h'+ (-(ele.sourceNode.width +  2 * connectorWSelf)) + 
                    'v'+(ele.sourceNode.height / 2 + connectorWSelf) + 
                    'H' + (ele.targetNode.x)"
                    ></path>
                  <!-- 非自连:1.sourceNode 的右侧箭头X <= targetNode的左侧箭头X -->
                  <path 
                    class="connectorLine" 
                    :class="{'defaultStrokeColor':!ele.color,'defaultStrokeW':!ele.strokeW}"
                    :stroke="ele.color"
                    :stroke-width = "ele.strokeW"
                    v-if="ele.sourceNode.id != ele.targetNode.id && 
                    (ele.sourceNode.x +ele.sourceNode.width) < ele.targetNode.x" 
                    :d="'M'+(ele.sourceNode.x + ele.sourceNode.width)+','+(ele.sourceNode.y + ele.sourceNode.height / 2) + 
                    'h'+ (ele.targetNode.x - ele.sourceNode.x - ele.sourceNode.width) / 2 + 
                    'V' + (ele.targetNode.y + ele.targetNode.height / 2) + 
                    'H' + ele.targetNode.x" 
                    ></path>
                  <!-- 非自连：
                  2.sourceNode 的右侧箭头X >= targetNode的左侧箭头X  
                  (1) 且 sourceNode的高度 < targetNode的高度 且 高度未重叠-->
                  <path
                    class="connectorLine" 
                    :class="{'defaultStrokeColor':!ele.color,'defaultStrokeW':!ele.strokeW}"
                    :stroke="ele.color"
                    :stroke-width = "ele.strokeW" 
                    v-if="ele.sourceNode.id != ele.targetNode.id && 
                    (ele.sourceNode.x + ele.sourceNode.width) >= ele.targetNode.x &&
                    (ele.sourceNode.y + ele.sourceNode.height ) < ele.targetNode.y" 
                    :d="'M'+(ele.sourceNode.x + ele.sourceNode.width)+','+(ele.sourceNode.y + ele.sourceNode.height / 2) +
                    'h'+connectorWSelf+ 
                    'v'+(ele.sourceNode.height / 2 + (ele.targetNode.y - ele.sourceNode.y -  ele.sourceNode.height) / 2) + 
                    'H'+(ele.targetNode.x - connectorWSelf) + 
                    'V'+(ele.targetNode.y + ele.targetNode.height / 2) + 
                    'h'+connectorWSelf" 
                    ></path>
                  <!-- 非自连：
                  2.sourceNode 的右侧箭头X >= targetNode的左侧箭头X
                   (2) 且 sourceNode的高度 > targetNode的高度 且 高度未重叠-->
                  <path 
                    class="connectorLine" 
                    :class="{'defaultStrokeColor':!ele.color,'defaultStrokeW':!ele.strokeW}"
                    :stroke="ele.color"
                    :stroke-width = "ele.strokeW"
                    v-if="ele.sourceNode.id != ele.targetNode.id && 
                    (ele.sourceNode.x + ele.sourceNode.width) >= ele.targetNode.x &&
                    (ele.targetNode.y + ele.targetNode.height) < ele.sourceNode.y" 
                    :d="'M'+(ele.sourceNode.x + ele.sourceNode.width)+','+(ele.sourceNode.y + ele.sourceNode.height / 2) +
                    'h'+connectorWSelf+ 
                    'V'+(ele.sourceNode.y-(ele.sourceNode.y - ele.targetNode.y - ele.targetNode.height) / 2) + 
                    'H'+ (ele.targetNode.x - connectorWSelf) + 
                    'V'+(ele.targetNode.y + ele.targetNode.height / 2) + 
                    'H'+ele.targetNode.x" 
                    ></path>
                   <!-- 
                   非自连：
                   2.sourceNode 的右侧箭头X >= targetNode的左侧箭头X 
                   (3) sourceNode的箭头y < = targetNode的箭头
                  sourceNode 的y < targetNode的y < = (sourceNode 的y + sourceNode的height) 或者 sourceNode的y介于其间
                   高度重叠-->
                  <path 
                    class="connectorLine"
                    :class="{'defaultStrokeColor':!ele.color,'defaultStrokeW':!ele.strokeW}"
                    :stroke="ele.color"
                    :stroke-width = "ele.strokeW" 
                    v-if="ele.sourceNode.id != ele.targetNode.id &&
                    (ele.sourceNode.x + ele.sourceNode.width) >= ele.targetNode.x &&
                    (ele.sourceNode.y + ele.sourceNode.height/2) <= (ele.targetNode.y + ele.targetNode.height / 2) &&
                    ((ele.targetNode.y <= (ele.sourceNode.y + ele.sourceNode.height) && ele.targetNode.y >= ele.sourceNode.y) ||
                    (ele.sourceNode.y <= (ele.targetNode.y + ele.targetNode.height) && ele.sourceNode.y >= ele.targetNode.y)
                    )" 
                    :d="'M'+(ele.sourceNode.x + ele.sourceNode.width)+','+(ele.sourceNode.y + ele.sourceNode.height / 2)+'h'+connectorWSelf + 
                    'V'+ ((ele.sourceNode.y-ele.targetNode.y ) <= 0? (ele.sourceNode.y - connectorWSelf) : (ele.targetNode.y -connectorWSelf)) + 
                    'H' + (ele.targetNode.x - connectorWSelf) + 
                    'V' +(ele.targetNode.y + ele.targetNode.height / 2) + 
                    'H' + ele.targetNode.x" 
                    ></path> 
                   <!-- 
                   非自连：
                   2.sourceNode 的右侧箭头X > targetNode的左侧箭头X 
                   (3) 且 sourceNode的高度 < targetNode的高度 且 
                   sourceNode的起点 > targetNode的终点 且 
                   高度重叠-->
                  <path 
                    class="connectorLine" 
                    :class="{'defaultStrokeColor':!ele.color,'defaultStrokeW':!ele.strokeW}"
                    :stroke="ele.color"
                    :stroke-width = "ele.strokeW"
                    v-if="ele.sourceNode.id != ele.targetNode.id &&
                    (ele.sourceNode.x + ele.sourceNode.width) >= ele.targetNode.x &&
                    (ele.sourceNode.y + ele.sourceNode.height/2) > (ele.targetNode.y + ele.targetNode.height / 2) &&
                    ((ele.targetNode.y <= (ele.sourceNode.y + ele.sourceNode.height) && ele.targetNode.y >= ele.sourceNode.y) ||
                    (ele.sourceNode.y <= (ele.targetNode.y + ele.targetNode.height) && ele.sourceNode.y >= ele.targetNode.y)
                    )" 
                    :d="'M'+(ele.sourceNode.x + ele.sourceNode.width)+','+(ele.sourceNode.y + ele.sourceNode.height / 2)+'h'+connectorWSelf + 
                    'V'+ ((ele.sourceNode.y  + ele.sourceNode.height-ele.targetNode.y -ele.targetNode.height ) >= 0? (ele.sourceNode.y+ele.sourceNode.height + connectorWSelf) : (ele.targetNode.y+ele.targetNode.height +connectorWSelf)) + 
                    'H' + (ele.targetNode.x - connectorWSelf) + 
                    'V' +(ele.targetNode.y + ele.targetNode.height / 2) + 
                    'H' + ele.targetNode.x"
                    ></path> 
                </g>
                <!-- 动态绘制的连线 -->
                <g>
                  <line :x1='connectingLine.x1' :y1="connectingLine.y1" :x2="connectingLine.x2" :y2="connectingLine.y2" v-show="connectingLine.isConnecting" stroke="#768699" stroke-width = "2"></line>
                </g>           
              </g>
              <line :class="{isMarkerShow:marker.isMarkerShow}" id="xmarker" class="marker" x1="0" :y1="marker.xmarkerY" :x2="marker.xmarkerX" :y2="marker.xmarkerY"></line>
              <line :class="{isMarkerShow:marker.isMarkerShow}" id="ymarker" class="marker" :x1="marker.ymarkerX" y1="0" :x2="marker.ymarkerX" :y2="marker.ymarkerY"></line>
              <rect :x="selectionBox.x" :y="selectionBox.y" :width="selectionBox.width" :height="selectionBox.height" stroke-dasharray="5,5" stroke-width="1" stroke="#222" fill="rgba(170,210,232,0.5)" v-show="selectionBox.isShow"/>
            </svg>
            <div id="topoAttrWrap" :class="{active:isTopoAttrShow}">
                <i v-if="isTopoAttrShow" class="fa fa-chevron-circle-right topoAttrArrow" @click="isTopoAttrShow =!isTopoAttrShow"></i>
                <i v-if="!isTopoAttrShow" class="fa fa-chevron-circle-left topoAttrArrow" @click="isTopoAttrShow =!isTopoAttrShow"></i>
                <div id="topoAttrHeader">
                  属性设置框
                </div>
                <div v-if="selectNodeIndex == null">
                    <div style="padding:50px;text-align:center">没有任何节点属性</div>
                </div>
                <div v-if="selectNodeIndex != null && topoData.nodes.length > 0" style="overflow-y: scroll;height:calc(100% - 40px);padding:20px 15px;box-sizing:border-box">
                  <el-form  :model="topoData.nodes[selectNodeIndex]"  label-width="100px" class="demo-ruleForm" labelPosition="left">
                    <div>
                      <el-form-item label="名称">
                        <el-input v-model="topoData.nodes[selectNodeIndex].name"></el-input>
                      </el-form-item>
                    </div>
                    
                    <!-- <div v-if="topoData.nodes[selectNodeIndex].attrs.length == 0" id="infoWrap">
                        <i class="infoIcon fa fa-info-circle"></i>
                        暂无属性信息
                    </div> -->
                    <div>
                      <el-form-item  v-if="topoData.nodes[selectNodeIndex].attrs.length > 0 && ele.type !='keyVal'" :label="ele.name" :prop="ele.name" v-for="(ele,key) in topoData.nodes[selectNodeIndex].attrs" :rules="ele.rules" :key="key">
                      
                          <el-input v-if="ele.type == 'input'" v-model="ele.value" :placeholder="ele.placeholder" :disabled="ele.disabled"></el-input>
                
                          <el-select v-if="ele.type == 'select'" v-model="ele.value" :placeholder="ele.placeholder" :disabled="ele.disabled">
                            <el-option v-for="(option,key) in ele.options" :key="key" :label="option.label" :value="option.value"></el-option>
                          </el-select>
                
                          <el-checkbox-group v-if="ele.type == 'checkbox'" v-model="ele.value" :disabled="ele.disabled">
                            <el-checkbox :label="option.label" v-for="(option,key) in ele.options" :key="key"></el-checkbox>
                          </el-checkbox-group>
                    
                          <el-input v-if="ele.type == 'textarea'" type="textarea" v-model="ele.value" :disabled="ele.disabled"></el-input>
             
                          <el-radio-group  v-if="ele.type == 'radio'" v-model="ele.value" :disabled="ele.disabled">
                            <el-radio :label="option.label" v-for="(option,key) in ele.options" :key="key"></el-radio>
                          </el-radio-group>                      
                      </el-form-item> 
                      <div class="clearfix" style="margin-bottom:10px">
                          <i class="fa fa-plus-square" style="font-size:25px;float:right;cursor:pointer" @click="openKeyValueDialog(selectNodeIndex)"></i>
                      </div>
                      <div class="clearfix" v-for="(ele,key) in topoData.nodes[selectNodeIndex].attrs" :key="key" v-if="ele.type == 'keyVal'" style="margin:15px 0">
                          <el-input style="float:left;width:20%"  v-model="ele.name" placeholder="key"></el-input>
                          <el-input style="float:left;width:calc(80% - 15px - 25px);margin-left:15px;" v-model="ele.value" placeholder="value"></el-input>
                          <i class="removeAttrArrow fa fa-remove"  @click="removeKeyValue(selectNodeIndex,key)"></i>
                      </div>                      
                    </div>
                  </el-form>
                </div>
            </div>
          </div>
        </div>
      </el-col>    
    </el-row>
    <div v-if="toolbarMoveNode.isShow" id="move-node" class="nodeMoveCss" :style="{ left:toolbarMoveNode.left + 'px', top: toolbarMoveNode.top + 'px' }">
      <div class="node-icon">
        <img class="toolbar-node-icon" :src="toolbarMoveNode.icon"/>
      </div>
      <div class="node-name">{{toolbarMoveNode.name}}</div>
    </div>
    <el-dialog title="新增key和value" :visible.sync="keyFormDialog.visible" @close="closeKeyValueDialog('keyFormDialog')">
      <el-form :model="keyFormDialog" :inline="true" :rules="keyFormRules" label-width="50px" label-position="left" ref="keyFormDialog">
        <el-form-item label="key"  prop="key">
          <el-input v-model="keyFormDialog.key" auto-complete="off" placeholder="key"></el-input>
        </el-form-item>
        <el-form-item label="value" prop="value">
          <el-input v-model="keyFormDialog.value" auto-complete="off" placeholder="value"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="keyFormDialog.visible = false">取 消</el-button>
        <el-button type="primary" @click="submitKeyValueForm('keyFormDialog')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import connectorRules from '../../config/connectorRules' //连线包含关系规则
import topoJson from '../../data/topoJson' //初始topo的数据（从后台获取）
import toolbarNodeData from '../../data/toolbarNodeData' //初始左侧toolbarNode数据（可从后台获取）
export default {
  data () {
    return {
     keyFormDialog:{
      visible:false,
      key:"",
      value:"",
      nodeKey:null
     },
     keyFormRules:{
      key:[
        { required: true, message: '请输入key值', trigger: 'blur' },
      ],
      value:[
        { required:true,message:'请输入value值',trigger:'blur'}
      ]
     },
     connectorRules:connectorRules,//节点间关系的规则
     selectNodeIndex:0,
     svgAttr:{width:0,height:0,isHand:false,viewX:0,viewY:0,minW:0,minH:0,isCrosshair:false},
     activeNames: ['1'],
     isTopoAttrShow:false,
     svgToolbar:[
      {name:'默认模式',className:'toolbar-default',isActive:true},
      {name:'框选模式',className:'toolbar-rectangle_selection',isActive:false},
      // {name:'放大',className:'toolbar-zoomin',isActive:false},
      // {name:'缩小',className:'toolbar-zoomout',isActive:false},
      // {name:'恢复出厂设置',className:'toolbar-zoomreset',isActive:false}
     ],
     toolbarNodeData:[],//toolbarNodeData的初始数据
     toolbarMoveNode:{
      left:0,
      top:0,
      name:'',
      icon:'',
      isShow:false
     },
     svgTopo:{
      isMoveover:false
     },
     selectionBox:{
      x:0,
      y:0,
      width:0,
      height:0,
      isShow:false
     },
     connectorWSelf:15, //自连连线的宽度
     connectorW:15,//非自连连线宽度
     containTop:30, //包含关系的子node距离父node
     containLeft:22,//包含关系的左右距离
     classchoose:false,    
     connectingLine:{
      x1:0,
      y1:0,
      x2:0,
      y2:0,
      isConnecting:true,
      sourceNode:'',
      endNode:''
     },
     marker:{
      xmarkerY:0,
      xmarkerX:0,
      ymarkerX:0,
      ymarkerY:0,
      isMarkerShow:false,
     },     
     gridData:[
      {x1:0,x2:100,y1:20,y2:20,color:'#c0c0c0',strokeWidth:1,opacity:0.3},
      {x1:0,x2:100,y1:40,y2:40,color:'#c0c0c0',strokeWidth:1,opacity:0.3},
      {x1:0,x2:100,y1:60,y2:60,color:'#c0c0c0',strokeWidth:1,opacity:0.3},
      {x1:0,x2:100,y1:80,y2:80,color:'#c0c0c0',strokeWidth:1,opacity:0.3},
      {x1:20,x2:20,y1:0,y2:100,color:'#c0c0c0',strokeWidth:1,opacity:0.3},
      {x1:40,x2:40,y1:0,y2:100,color:'#c0c0c0',strokeWidth:1,opacity:0.3},
      {x1:60,x2:60,y1:0,y2:100,color:'#c0c0c0',strokeWidth:1,opacity:0.3},
      {x1:80,x2:80,y1:0,y2:100,color:'#c0c0c0',strokeWidth:1,opacity:0.3},
      {x1:100,x2:100,y1:0,y2:100,color:'#c0c0c0',strokeWidth:2,opacity:0.6},
      {x1:0,x2:100,y1:100,y2:100,color:'#c0c0c0',strokeWidth:2,opacity:0.6}
     ],
     topoData:{
      nodes:[],
      connectors:[]
     }
    }
  },
  computed:{
  },
  methods:{
    //测试节点性能
    testNodeNums(num){
        for(let i=0;i<num;i++){
          let x = Math.random()*1000+50
          let y = Math.random()*1000+50
          let id = Math.random()*10000+50
          let node = {x:x,y:y,width:50,height:50,id:id,isLeftConnectShow:false,isRightConnectShow:false,name:i,isSelect:false,initW:50,initH:50,icon:database,classType:'T1',containNodes:[],attrs:[],type:'DataBase'}
          this.topoData.nodes.push(node)
        }
    },
    //打开key-value对话框窗口
    openKeyValueDialog(key){
      this.keyFormDialog.visible =  true
      this.keyFormDialog.nodeKey = key
    },
    //删除属性
    removeKeyValue(selectNodeIndex,attrIndex){
      let delTxt = '此操作将删除  key:'+this.topoData.nodes[selectNodeIndex].attrs[attrIndex].name+"  value:"+this.topoData.nodes[selectNodeIndex].attrs[attrIndex].value+'，是否继续？'
      this.$confirm(delTxt, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.topoData.nodes[selectNodeIndex].attrs.splice(attrIndex,1)
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });     
    },
    //提交key-value值
    submitKeyValueForm(formName){
      this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$message({
              message: '新增key和value成功',
              type: 'success'
            })

            let newAttr ={type:'keyVal',name:this.keyFormDialog.key,value:this.keyFormDialog.value}
            this.topoData.nodes[this.keyFormDialog.nodeKey].attrs.push(newAttr)
            //重置keyFormDialog值
            this.keyFormDialog.visible =  false
            this.$refs[formName].resetFields();
          } else {
            return false;
          }
        });
    },
    //关闭key-value框
    closeKeyValueDialog(formName){
      this.keyFormDialog.visible =  false
      this.$refs[formName].resetFields();
    },
    canConnectorTo(curNodeType,connectorToNodeType,connectorType){
      //当需要包含和连线规则的时候 清除以下注释
      // let canConnector = false
      // if(connectorType == 'Link'){
      //   this.connectorRules.forEach((ele,key)=>{
      //     if(ele.type == curNodeType){
      //       ele.canLinkToType.forEach((el,index)=>{
      //         if(el == connectorToNodeType) canConnector = true
      //       })
      //     }
      //   })       
      // }else if(connectorType == 'Contain'){
      //   this.connectorRules.forEach((ele,key)=>{
      //     if(ele.type == curNodeType){
      //       ele.canBeContainedType.forEach((el,index)=>{
      //         if(el == connectorToNodeType) canConnector = true
      //       })
      //     }
      //   })
      // }  
      let canConnector = true   
      return canConnector
    },
    //拖拽toolbar中的node
    dragToolbarNode(nodeData,key,event){
      let NODE = nodeData[key]
      let toolbarName =NODE.type
      let toolbarIcon = NODE.icon
      let svgOffsetLeft = $("#topo-svg").offset().left
      let svgOffsetTop = $("#topo-svg").offset().top
      let svgWidth = $("#topo-svg").width()
      let svgHeight = $("#topo-svg").height()
      let isContainSvgArea = false
      document.onmousemove = (event) =>{        
        let mouseX = event.clientX    //当前鼠标位置
        let mouseY = event.clientY 
        let nodeX = event.clientX - svgOffsetLeft + $(document).scrollLeft()+ this.svgAttr.viewX   //svg最终位置
        let nodeY = event.clientY - svgOffsetTop  + $(document).scrollTop() + this.svgAttr.viewY
        isContainSvgArea = false
        this.toolbarMoveNode.left = mouseX + 4 + $(document).scrollLeft()  // 鼠标位置 + 文档滚动的距离
        this.toolbarMoveNode.top =  mouseY + 4 + $(document).scrollTop()
        this.toolbarMoveNode.name = toolbarName
        this.toolbarMoveNode.icon = toolbarIcon
        this.toolbarMoveNode.isShow = true
        this.marker.isMarkerShow = false
        // 鼠标滑入svg区域内显示标尺并显示标尺正确位置
        if( mouseX >= svgOffsetLeft && 
            mouseX <= (svgOffsetLeft + svgWidth) && 
            mouseY >= (svgOffsetTop - $(document).scrollTop()) && 
            mouseY <= (svgOffsetTop+svgHeight - $(document).scrollTop())
          ){
          this.marker.isMarkerShow = true
          isContainSvgArea = true
          let n1 = Math.floor(nodeX / 20)  //grid宽高的整数倍
          let n2 = Math.floor(nodeY / 20)         
          this.marker.xmarkerY = n2 * 20
          this.marker.ymarkerX = n1 * 20
        }
      }
      document.onmouseup = (event)=>{
         document.onmousemove = null
　　　　　document.onmouseup = null
         // 判断鼠标在svg区域
        if(isContainSvgArea){
            let TOPODATA = this.topoData
            let type = NODE.type
            let name = NODE.type+'_'+ NODE.num
            NODE.num ++ 
            let id = GenNonDuplicateID(5)
            let nodeEndX = this.marker.ymarkerX
            let nodeEndY = this.marker.xmarkerY
            let svgNode ={
               name,
               type,
               id:id,
               x:nodeEndX,
               y:nodeEndY,
               icon:NODE.icon,
               width:NODE.width,
               height:NODE.height,
               initW:NODE.width,
               initH:NODE.height,           
               classType:NODE.classType,
               isLeftConnectShow:false,
               isRightConnectShow:false,
               containNodes:[],
               attrs:[]
            }
            this.marker.isMarkerShow = false    //标尺取消显示
            this.topoData.nodes.push(svgNode)   //创建一个svg Node    
            //计算是否与某个节点重叠
            for(let i =( TOPODATA.nodes.length - 1); i >= 0; i-- ){
              let node = TOPODATA.nodes[i]
              if(node.x <= nodeEndX && nodeEndX <= (node.x + node.width) && nodeEndY >= node.y && node.y + node.height >= nodeEndY && node.id != id){
                let canBeContain =  this.canConnectorTo(NODE.type,node.type,'Contain')  //判断是否能被包含在目标元素中
                if(canBeContain){
                  let connector={
                    type:'Contain',
                    sourceNode:{
                      id:id,
                    },
                    targetNode:{
                      id:node.id,
                    },
                    isSelect:false
                  }                                                 
                  TOPODATA.connectors.push(connector)             
                  node.containNodes.push(id)   //如果有嵌套关系，就在父节点放入子节点id        
                  this.refreshRowAndOuterNode(svgNode)  //刷新并列节点位置和父节点宽高 
                  this.refreshConnectorsData()  
                  break
                }          
              }
            }
        }    
        //重新初始toolbarMoveNode的值
        this.toolbarMoveNode.left = 0
        this.toolbarMoveNode.top =  0
        this.toolbarMoveNode.name = ''
        this.toolbarMoveNode.icon = ''
        this.toolbarMoveNode.isShow = false
      }
      //生成唯一id值
      function GenNonDuplicateID(randomLength){
        return Number(Math.random().toString().substr(3,randomLength) + Date.now()).toString(36)
      }
    },
    //svg区域事件
    // moveInTopoSvg(){
    //   //this.svgTopo.isMoveover = true
    // },
    // moveOutTopoSvg(){
    //   // this.svgTopo.isMoveover = false
    //   // this.marker.isMarkerShow = false
    // },
    //1.取消选中的node节点 2. 移动viewbox
    mousedownTopoSvg(event){ 
      let mouseX0 = event.clientX //鼠标点击下的位置
      let mouseY0 = event.clientY
      let startViewX = this.svgAttr.viewX
      let startViewY = this.svgAttr.viewY
      let startSvgW =  this.svgAttr.width
      let startSvgH = this.svgAttr.height
      let svgMinW = this.svgAttr.minW
      let svgMinH = this.svgAttr.minH  
      let selectionBoxX = 0
      let selectionBoxY = 0   
      this.cancelAllNodesSelect() //取消所有节点选中     
      this.cancelAllLinksSelect() //取消连线选中  
      if(this.svgToolbar[1].isActive) {        
        selectionBoxX = event.clientX - $("#topo-svg").offset().left + $(document).scrollLeft() + this.svgAttr.viewX  
        selectionBoxY = event.clientY - $("#topo-svg").offset().top + 4 + $(document).scrollTop() + this.svgAttr.viewY
        this.selectionBox.isShow = true
        this.selectionBox.x = selectionBoxX
        this.selectionBox.y = selectionBoxY
      }    
      //移动viewbox位置
      document.onmousemove=(event)=>{
        let disX = event.clientX - mouseX0
        let disY = event.clientY - mouseY0
        let endSvgW = startSvgW - disX
        let endSvgH = startSvgH - disY

        if(this.svgToolbar[1].isActive) {
          let selectionW = Math.abs(disX)
          let selectionH = Math.abs(disY)
          this.svgAttr.isCrosshair = true         
          if(disX <= 0){
            this.selectionBox.x = selectionBoxX + disX
          }else{
            this.selectionBox.x = selectionBoxX
          }
          if(disY <=0){
            this.selectionBox.y = selectionBoxY + disY
          }else{
            this.selectionBox.y = selectionBoxY
          }
          this.selectionBox.width = selectionW
          this.selectionBox.height = selectionH
          return false
        }
        this.svgAttr.isHand = true
        this.svgAttr.viewX = (startViewX <= disX) ? 0 : startViewX - disX   //根据鼠标移动的位移，得到视图移动位移
        this.svgAttr.viewY = (startViewY <= disY) ? 0 : startViewY - disY 
        this.svgAttr.width = (endSvgW < svgMinW) ? svgMinW : endSvgW   // 动态设置svg宽高
        this.svgAttr.height = (endSvgH < svgMinH) ? svgMinH : endSvgH
        this.marker.xmarkerX = this.svgAttr.width
        this.marker.ymarkerY = this.svgAttr.height
      }
      document.onmouseup =(event)=>{
        document.onmousemove = null
　　　　 document.onmouseup = null
        this.svgAttr.isHand = false
        this.svgAttr.isCrosshair = false
        //如果是框选模式
        if(this.svgToolbar[1].isActive){
          let selectionBoxObj = this.selectionBox
          let sW = selectionBoxObj.width
          let sH = selectionBoxObj.height
          let sX = selectionBoxObj.x
          let sY = selectionBoxObj.y 
          this.topoData.nodes.forEach((node,key) => {
            if(sX <= node.x && sY <= node.y && node.x + node.width <= sX + sW && node.y + node.height <= sY + sH){
              node.isSelect = true
            }
          })
          this.selectionBox.isShow = false
          this.selectionBox.x = 0 
          this.selectionBox.y = 0
          this.selectionBox.width = 0
          this.selectionBox.height = 0
        }
      }
    },
    //拖拽svg中的node
    dragSvgNode(key,event){
       let mouseX0 = event.clientX + $(document).scrollLeft()//鼠标点击下的位置
       let mouseY0 = event.clientY + $(document).scrollTop()
       let CURNODE = this.topoData.nodes[key] //点击的node对象
       let startX = CURNODE.x //节点开始位置
       let startY = CURNODE.y
       let curNodeId = CURNODE.id  //当前结点id
       let nodeW = CURNODE.width  //节点 宽高
       let nodeH = CURNODE.height 
       let nodeStartPosArr = []  
       let moveDis = false   
       this.marker.isMarkerShow = true //显示标尺
       //把选中的node信息放入数组最后一位，待看结果 可能有bug
       this.topoData.nodes.splice(key,1)
       this.topoData.nodes.push(CURNODE) 
       /********优化*********/     
       this.putInnerNodeLast(CURNODE) //递归循环将嵌套节点依次放置，判断包含关系，如果内部有子node，则需要将子node放入数组最后的位置
       //取消所有节点选中
       this.cancelAllNodesSelect()
       //取消所有连线选中
       this.cancelAllLinksSelect()
       //节点选中
       CURNODE.isSelect = true    
       this.storeCurnodeStartPosition(CURNODE,nodeStartPosArr)  //将选择的node的子子节点初始位置保存进去
       this.topoData.nodes.forEach((node,key)=>{            // 关联属性设置框       
          if(node.id == CURNODE.id) this.selectNodeIndex= key
       })

　　　　document.onmousemove = (event) => {         
　　　　　　let disX = event.clientX - mouseX0 + $(document).scrollLeft() //移动位置
           let disY = event.clientY - mouseY0 + $(document).scrollTop()
           let endX = startX + disX //最终位置
           let endY = startY + disY
           let n1 = Math.floor(endX / 20)  //grid宽高的整数倍
           let n2 = Math.floor(endY / 20) 
           if(n1 <= 0 ) n1 = 0
           if(n2 <= 0)  n2 = 0
           if(endX <= 0) {
            endX = 0 
            disX = -startX
           }
           if(endY <= 0 ){
            endY = 0 
            disY = -startY
           }
           this.marker.isMarkerShow = true  //显示标尺        
           this.marker.xmarkerY = n2 * 20   //标尺的移动位置，以每格20的距离移动
           this.marker.ymarkerX = n1 * 20          
           this.moveContianNode(disX,disY,nodeStartPosArr) //根据保存的数组数据移动相关节点
           this.refreshConnectorsData()  //及时更新连线数据
　　　　};
　　　　document.onmouseup = (event) => {　　　　　　           
           document.onmousemove = null
　　　　　　document.onmouseup = null
           this.marker.isMarkerShow = false    //隐藏标尺
           let NodeEndX = this.marker.ymarkerX  //最终位置为标尺的位置 最终节点位置
           let NodeEndY = this.marker.xmarkerY
           let disX = NodeEndX - startX
           let disY = NodeEndY - startY
           let mouseDisX = event.clientX - mouseX0
           let mouseDisY = event.clientY - mouseY0
           this.moveContianNode(disX,disY,nodeStartPosArr)  //移动包含着的子节点           
           this.drawContainLayout(CURNODE,NodeEndX,NodeEndY,true,nodeStartPosArr,mouseDisX,mouseDisY,startY) 
           this.refreshConnectorsData() //最后刷新连线            
　　　　};
       
    },
    //绘制contain布局及刷新连线数据
    drawContainLayout(CURNODE,NodeEndX,NodeEndY,isStop,nodeStartPosArr,mouseDisX,mouseDisY,startY){       
         let TOPODATA = this.topoData
         let curNodeId = CURNODE.id
         let nodeW = CURNODE.width 
         let nodeH = CURNODE.height
         let originTargetNodeId ='' //原先的targetNode
         let originTargetNode ={}      
         //预留 ++++ 判断是否能增加包含关系
         let NodePoint1 = [NodeEndX,NodeEndY]   //初始当前节点四个角的位置
         let NodePoint2 = [(NodeEndX + nodeW),NodeEndY]
         let NodePoint3 = [(NodeEndX + nodeW),(NodeEndY + nodeH)]
         let NodePoint4 = [NodeEndX,(NodeEndY + nodeH)]
         //如果点击的node有contain关系，先记录下targetNode
         TOPODATA.connectors.forEach((ele,key) => {
          if(ele.type == "Contain" && ele.sourceNode.id == curNodeId) {
            originTargetNodeId = ele.targetNode.id
          }
         })
         if(originTargetNodeId){
          TOPODATA.nodes.forEach((node,key) => {
            if(node.id == originTargetNodeId) originTargetNode = node
          })
         }
         //情况一：移出后依然恢复原来的位置，前提：1.移除的距离在一定范围 2.点击的节点有父层包含关系
         let endNodeY = startY+ mouseDisY
         if(
          originTargetNode && 
          Math.abs(mouseDisX) <= this.containLeft && 
          endNodeY < originTargetNode.y + originTargetNode.height &&
          endNodeY > originTargetNode.y - CURNODE.height
          ){
            this.refreshRowAndOuterNode(originTargetNode)
            return false
         }
         //清除当前node的包含关系
         this.deleteCurNodeContainConnector(CURNODE) 
         // 与NodeData对比，判断是否有值与其他Node重合的
         var isContainNode = false
         let overlapTargetNode = {}
         for(let i =( TOPODATA.nodes.length - 1); i >= 0; i--){      //forEach无法跳出循环,暂用for循环
            let targetNode = TOPODATA.nodes[i]
            isContainNode = false   //初始isContainNode为false的值
            if(CURNODE.id != targetNode.id){   //排除自身元素                       
              let minX = targetNode.x
              let maxX = targetNode.x + targetNode.width
              let minY = targetNode.y
              let maxY = targetNode.y + targetNode.height
              let canContianTargetNode = this.canConnectorTo(CURNODE.type,targetNode.type,'Contain')//确认是否能被包含
              //四种包含情况判重合
              if(NodePoint1[0] <= maxX && NodePoint1[0] >= minX && NodePoint1[1] <=  maxY && NodePoint1[1] >= minY) isContainNode = true
              if(NodePoint2[0] <= maxX && NodePoint2[0] >= minX && NodePoint2[1] <=  maxY && NodePoint2[1] >= minY) isContainNode = true
              if(NodePoint4[0] <= maxX && NodePoint4[0] >= minX && NodePoint4[1] <=  maxY && NodePoint4[1] >= minY) isContainNode = true
              if(NodePoint3[0] <= maxX && NodePoint3[0] >= minX && NodePoint3[1] <=  maxY && NodePoint3[1] >= minY) isContainNode = true             
              if(isContainNode && canContianTargetNode){
                  overlapTargetNode = targetNode
                  break
                }                          
            }
         }
         //选中的node 有 与其他node 重合
         if(isContainNode){                
          //关系数组中增加包含关系              
          let connector={
            type:'Contain',
            sourceNode:{
              id:CURNODE.id,
            },
            targetNode:{
              id:overlapTargetNode.id,
            },
            isSelect:false
          }                                                 
          TOPODATA.connectors.push(connector)
          //如果有嵌套关系，就在父节点放入子节点id
          TOPODATA.nodes.forEach((node,key) => {
            if(node.id == overlapTargetNode.id) node.containNodes.push(CURNODE.id)
          })
          this.refreshRowAndOuterNode(CURNODE)  //刷新并列节点位置和父节点宽高                               
        }
        //移动包含着的子节点 
        if(isContainNode){
          nodeStartPosArr.forEach((node,key) => {
            if(node.id == CURNODE.id){
              let disX = CURNODE.x - node.x 
              let disY = CURNODE.y - node.y
              this.moveContianNode(disX,disY,nodeStartPosArr)   
            }
          }) 
        }
        //如果初始targetNodeId 与现在重合的taregtNodeId不同，让originTargetNode位置重置
        if(originTargetNodeId && originTargetNodeId != overlapTargetNode.id){               
          this.refreshRowAndOuterNode(originTargetNode)
        }   
    },
    //计算是否与其他节点包含
    computedIsContain(CURNODE){

    },
    //存入node及其子节点位置信息
    storeCurnodeStartPosition(CURNODE,startNodePosition){
      let containNodes = CURNODE.containNodes
      startNodePosition.push({id:CURNODE.id,x:CURNODE.x,y:CURNODE.y})
      if(containNodes.length){
        containNodes.forEach((nodeId,key) => {
          this.topoData.nodes.forEach((ele,index) => {
            if(ele.id == nodeId){
              this.storeCurnodeStartPosition(ele,startNodePosition)
            }
          })
        })
      }
    },
    //contain情况下移动子节点位置
    moveContianNode(disX,disY,nodeStartPosArr){
      nodeStartPosArr.forEach((ele,key) => {
        let storeInfoId = ele.id
        this.topoData.nodes.forEach((node,key) => {
          if(node.id == storeInfoId){
            node.x = ele.x +disX
            node.y =ele.y +disY
          }
        })
      })      
    },
    //将选中的容器的最内的容器放置在数组最后
    putInnerNodeLast(CURNODE){
      let curNodeId = CURNODE.id
      this.topoData.connectors.forEach((ele,key) => {
          if(ele.type == 'Contain' && ele.targetNode.id == curNodeId){
            let childNodeId = ele.sourceNode.id
            this.topoData.nodes.forEach((node,index) => {
              if(node.id == childNodeId) {
                let childNode = node 
                this.topoData.nodes.splice(index,1)
                this.topoData.nodes.push(childNode)
                this.putInnerNodeLast(childNode)
              }
            })
          }
       })
    },
    
    //清除当前选中元素的Contain关系
    deleteCurNodeContainConnector(CURNODE){
      let curNodeId = CURNODE.id
      this.topoData.connectors.forEach((ele,key) => {
          if(ele.type == 'Contain' && ele.sourceNode.id == curNodeId){
            let targetNodeId = ele.targetNode.id
            //1.删除cennetors关系
            this.topoData.connectors.splice(key,1)  
            //2.删除contains 里面的关系            
            this.topoData.nodes.forEach((node,key) => {
              if(node.id == targetNodeId){
                if(node.containNodes.length){
                  node.containNodes.forEach((ele,key) => {
                    let targetNode = node
                    if(ele == curNodeId){ 
                      targetNode.containNodes.splice(key,1) 
                     }                    
                  })
                }
              }
            })           
          }
       })
    },
    //刷新外部node的宽度（递归） 且 刷新右侧所欲并列节点宽度
    refreshOuterNodeWidth(CURNODE){
      this.topoData.connectors.forEach((ele,key) => {
        if(ele.sourceNode.id == CURNODE.id && ele.type == "Contain") {
          let targetNodeId = ele.targetNode.id
          this.topoData.nodes.forEach((node,index) => {
            if(node.id == targetNodeId){
              node.width = 2*this.containLeft +CURNODE.width
              node.height = 10 + CURNODE.height +this.containTop
              this.refreshOuterNodeWidth(node)
            }
          })
        }
      })
    }, 
    //刷新父节点的宽度 及 其子节点位置
    refreshRowAndOuterNode(TARGETNODE){
      if(TARGETNODE.containNodes.length>0){
        //重新计算targetnode的宽度
        let sumWidth = 0
        let maxHeight = 0
        TARGETNODE.containNodes.forEach((ele,key) => {
          let containNodeId = ele 
          this.topoData.nodes.forEach((node,index) => {
            if(node.id == containNodeId) {
              sumWidth += node.width
              if(node.height > maxHeight) maxHeight = node.height

            }
          })
        })
        sumWidth += (TARGETNODE.containNodes.length + 1) * this.containLeft
        TARGETNODE.width = sumWidth
        TARGETNODE.height = maxHeight + 10 + this.containTop
        
      }else{
        TARGETNODE.width = TARGETNODE.initW
        TARGETNODE.height = TARGETNODE.initH
        
      }
      this.topoData.connectors.forEach((ele,key) => {
        let parentNodeId = ""
        let parentNode={}
        if(ele.sourceNode.id == TARGETNODE.id && ele.type=="Contain"){
          parentNodeId = ele.targetNode.id
          this.topoData.nodes.forEach((node,key) => {
            if(node.id == parentNodeId)  this.refreshRowAndOuterNode(node)
          })
        }
      })

      //重新计算每个containNode的位置
     this.refreshContainNodesPosition(TARGETNODE)
    },
    //计算每个containNode的位置
    refreshContainNodesPosition(TARGETNODE){
      TARGETNODE.containNodes.forEach((ele,key) =>{    
        let containNodeId =ele
        let containNode 
        let preNode
        this.topoData.nodes.forEach((node,index) => {
          if(node.id == containNodeId) {
            containNode = node                          
          }
        })
        if(key == 0){
           this.refreshRowNodesPosition(TARGETNODE,containNode,null) 
        }else{
          let preNodeIndex = key - 1
          let preNodeId = TARGETNODE.containNodes[preNodeIndex]
          this.topoData.nodes.forEach((node,index) => {
            if(node.id == preNodeId) preNode = node
          })
          this.refreshRowNodesPosition(TARGETNODE,containNode,preNode)
        }
      }) 
    },
    //计算并列的nodes位置
    refreshRowNodesPosition(TARGETNODE,CURNODE,PRENODE){            
      if(PRENODE != null){
        CURNODE.x = PRENODE.x + PRENODE.width + this.containLeft
      }else{
        CURNODE.x = TARGETNODE.x +this.containLeft
      }
      CURNODE.y = TARGETNODE.y +this.containTop
      this.refreshContainNodesPosition(CURNODE)
    },

    //刷新连线数据
    refreshConnectorsData(){
      this.topoData.connectors.forEach((item,index) => {
        //更新connectors里的数据
        this.topoData.nodes.forEach((node,key) =>{
          if(item.sourceNode.id == node.id) {
            item.sourceNode.width = node.width
            item.sourceNode.height = node.height
            item.sourceNode.x = node.x
            item.sourceNode.y = node.y
          }
          if(item.targetNode.id == node.id) {
            item.targetNode.width = node.width
            item.targetNode.height = node.height
            item.targetNode.x = node.x
            item.targetNode.y = node.y
          }
        })                   
       })
    },
    
    //动态绘制连线
    drawConnectLine(key,event){
      let CONNECTLINE = this.connectingLine //绘制连线对象
      let CURNODE =  this.topoData.nodes[key] //当前点击node
      let nodeW = CURNODE.width //当前node宽高
      let nodeH = CURNODE.height 
      let sourceNodeX = CURNODE.x 
      let sourceNodeY = CURNODE.y    
      let mouseX0 = event.clientX    
      let mouseY0 = event.clientY
      let x1 = event.clientX - $("#topo-svg").offset().left-2 + $(document).scrollLeft() + this.svgAttr.viewX   //连线开始位置的位置：鼠标点击的实际位置   为鼠标位置 - 当前元素的偏移值
      let y1 = event.clientY - $("#topo-svg").offset().top+4+ $(document).scrollTop() + this.svgAttr.viewY
      CONNECTLINE.isConnecting = true   //显示绘制连线
      CONNECTLINE.x1 = x1 
      CONNECTLINE.y1 = y1 
      CONNECTLINE.x2 = x1   //连线终点同样赋值为起点值
      CONNECTLINE.y2 = y1
      CONNECTLINE.sourceNode = CURNODE.id //将当前点击nodeid值赋给连线起点
      document.onmousemove = (event) => {
        let disX = event.clientX - mouseX0
        let disY = event.clientY - mouseY0
        let x2 = x1 + disX
        let y2 = y1 + disY
        CURNODE.isRightConnectShow = true
        CONNECTLINE.x2 = x2
        CONNECTLINE.y2 = y2
      }
      document.onmouseup = () =>{
        document.onmousemove = null
　　　　 document.onmouseup = null 
        let hasConnected = false   //标记是否已经有过连线 
        let CONNECTORS =  this.topoData.connectors
        let sourceNodeW = nodeW
        let sourceNodeH = nodeH
        let targetNodeW = 0    //目标节点相关信息
        let targetNodeH = 0
        let targetNodeX = 0 
        let targetNodeY = 0
        let targetNodeType = ""
        let connectType = ""

        if(CONNECTLINE.endNode){      //正确连线：添加连线信息在connectors中

          //判断是否有已经有连线的情况
          CONNECTORS.forEach((item,index) => {
            if(item.sourceNode.id == CURNODE.id && item.targetNode.id == CONNECTLINE.endNode && item.type == 'Line') 
              hasConnected = true
          })
          //未连线情况下增加两者连线
          if(!hasConnected){
            connectType = "Line"
            //获取目标节点宽高
            this.topoData.nodes.forEach((item,index) =>{
              if(item.id == CONNECTLINE.endNode){
                targetNodeW = item.width
                targetNodeH = item.height
                targetNodeX = item.x
                targetNodeY = item.y
                targetNodeType = item.type
              }
            })
            let canLinkToTargetNode = this.canConnectorTo(CURNODE.type,targetNodeType,'Link')
            if(!canLinkToTargetNode){
               this.$message({
                  showClose: true,
                  message: CURNODE.type+"类型 不能连接 "+targetNodeType+"类型",
                  type: 'error'
               })
               CURNODE.isRightConnectShow = false     //连线失败：起点右侧箭头暂且设置为消失
               CONNECTORS.forEach((item,key) => {     //连线判断，如果已经有连线起点为当前的node，将起点箭头设置为显示
                  this.topoData.nodes.forEach((node,key) => {
                    if(node.id == item.sourceNode.id && item.type == 'Line') node.isRightConnectShow = true
                  })
               })
            }else{
               //类型：包含
              let connector = {
                type:connectType,
                strokeW:null,//仅用于Line类型
                color:'', //仅用于Line类型
                targetNode:{
                  x:targetNodeX,
                  y:targetNodeY,
                  id:CONNECTLINE.endNode,
                  width:targetNodeW,
                  height:targetNodeH
                },
                sourceNode:{
                  x:sourceNodeX,
                  y:sourceNodeY,
                  id:CURNODE.id,
                  width:sourceNodeW,
                  height:sourceNodeH
                }
              }
              CURNODE.isRightConnectShow = true
              this.topoData.nodes.forEach((item,key) => {
                if(item.id == CONNECTLINE.endNode) item.isLeftConnectShow = true
              })
              CONNECTORS.push(connector)
              }           
          }         
        }else{

          CURNODE.isRightConnectShow = false     //连线失败：起点右侧箭头暂且设置为消失
          CONNECTORS.forEach((item,key) => {     //连线判断，如果已经有连线起点为当前的node，将起点箭头设置为显示
              this.topoData.nodes.forEach((node,key) => {
                if(node.id == item.sourceNode.id && item.type == 'Line') node.isRightConnectShow = true
              })
          })
          
        }
        //绘制连线恢复初始值
        CONNECTLINE.x1 = 0
        CONNECTLINE.y1 = 0
        CONNECTLINE.x2 = 0
        CONNECTLINE.y2 = 0
        CONNECTLINE.isConnecting = false
        CONNECTLINE.sourceNode = ''
        CONNECTLINE.endNode = ''
      }
    },
    //鼠标滑过node
    mouseoverNode(key,event){
      this.marker.xmarkerY = this.topoData.nodes[key].y
      this.marker.ymarkerX = this.topoData.nodes[key].x
      this.getConnectLine(key)
    },
    //获取连线终点时的node的ID值
    getConnectLine(key){
      this.connectingLine.endNode = this.topoData.nodes[key].id 
    },
    //鼠标划出左侧箭头时，将connectingLine.endNode再次初始化
    mouseoutLeftConnector(key){
      this.connectingLine.endNode = ''
    },
    //点击选中连线
    selectConnectorLine(key){
      let connectors =  this.topoData.connectors
      let nodes = this.topoData.nodes
      let selectLine = this.topoData.connectors[key]
      let lastIndex = connectors.length - 1
      connectors.splice(key,1)
      connectors.push(selectLine)
      //取消所有选中样式
      this.cancelAllNodesSelect()
      this.cancelAllLinksSelect()
      selectLine.isSelect = true
      this.$set(connectors,lastIndex,selectLine)
    },
    //取消所有节点选中
    cancelAllNodesSelect(){
      this.topoData.nodes.forEach((ele,key) =>{
          ele.isSelect = false
          this.$set(this.topoData.nodes,key,ele)
      })
    },
    //取消所有连线选中
    cancelAllLinksSelect(){
      this.topoData.connectors.forEach((ele,key)=>{
          ele.isSelect = false
          this.$set(this.topoData.connectors,key,ele)
      }) 
    },
    //删除node节点及其关系
    deleteNodeAndConnetor(){
     document.onkeydown =(event)=>{
      let keycode =  event.which //键盘值
      if(keycode == 46 || keycode == 8) {   //在mac上del的keycode是8,这样又会引起win下输入backspace也会删除
        //单节点和多选删除节点
         for(let i=0;i<this.topoData.nodes.length;i++){
           let node = this.topoData.nodes[i]
           if(node.isSelect){
              this.deleteSelectNodeLink(node.id)
              let targetNodeId=""
              let targetNode = null
              this.topoData.connectors.forEach((ele,key) => {
                if(ele.sourceNode.id == node.id ) targetNodeId = ele.targetNode.id
              })
              this.deleteCurNodeContainConnector(node)
              if(targetNodeId){
                this.topoData.nodes.forEach((node,index) => {
                if(node.id  == targetNodeId)
                this.refreshRowAndOuterNode(node)
               }) 
              }            
              this.topoData.nodes.splice(i,1)
              //删除包含关系1.如果有父元素，恢复父元素的宽高位置
              this.deleteCurnodeAndChildnodes(node) // 删除此节点内部所有包含的节点及其关系          
              this.refreshNodeArrows() //刷新节点的左右箭头展示  
              i -- 
              if(this.topoData.nodes.length > 0){
                this.selectNodeIndex = 0 
              }else{
                this.selectNodeIndex = null
                this.isTopoAttrShow = false
              } 
           }
         }

         //单选删除连线功能
         this.topoData.connectors.forEach((ele,key)=>{
           if(ele.isSelect){
             this.topoData.connectors.splice(key,1)
             this.refreshNodeArrows()//重新绘制node节点左右箭头
           }
         })

         this.refreshConnectorsData()
      }    
     }
    },
    //删除选中node的连线
    deleteSelectNodeLink(selectId){
      let connectorObjArr = this.topoData.connectors
      let connectorsLen = connectorObjArr.length
      for(let i=0; i<connectorsLen;i++){
        let connectorObj = connectorObjArr[i]
        //删除连线
        if(connectorObj.type == "Line" && (connectorObj.sourceNode.id == selectId || connectorObj.targetNode.id == selectId)){
          this.topoData.connectors.splice(i,1)
          i--
          connectorsLen --
        }        
      }
    },
    //删除此节点下所有包含的所有节点
    deleteCurnodeAndChildnodes(CURNODE){      
      this.deleteCurNodeContainConnector(CURNODE)
      if(CURNODE.containNodes.length){        
         CURNODE.containNodes.forEach((containNodeId,key) => {
          let containId =  containNodeId
          this.topoData.nodes.forEach((ele,index)=>{
            if(ele.id == containId) {
              let curnode = ele
              this.topoData.nodes.splice(index,1)
              this.deleteSelectNodeLink(containId)
              this.deleteCurnodeAndChildnodes(curnode) //递归删除内部所有的节点及其关系
            }
          })
         })
      }
    },
    //重新绘制node节点左右箭头
    refreshNodeArrows(){
      this.topoData.nodes.forEach((topoNode,index)=>{
        topoNode.isLeftConnectShow = false 
        topoNode.isRightConnectShow = false
      })
      this.topoData.connectors.forEach((ele,key)=>{
        let sourceNodeId = ele.sourceNode.id
        let targetNodeId = ele.targetNode.id
        if(ele.type == 'Line'){
          this.topoData.nodes.forEach((topoNode,index) => {             
          if(topoNode.id == targetNodeId) topoNode.isLeftConnectShow = true
          if(topoNode.id == sourceNodeId) topoNode.isRightConnectShow = true
        })
        }            
      })   

    },
    //svg工具栏选择工具
    selectToolbar(key){
      this.svgToolbar.forEach((ele,key) => {
        ele.isActive = false
      })
      this.svgToolbar[key].isActive = true
    },
    //保存topo的json数据
    saveTopoJson(){      
      console.log(JSON.stringify(this.topoData))
    },
    saveTopoImage(){
      let maxW = 0
      let maxH = 0
      let initW = this.svgAttr.width
      let initH = this.svgAttr.height
      this.topoData.nodes.forEach((node,key)=>{
        let nodeEndX = node.width + node.x
        let nodeEndY = node.height + node.y
        if(nodeEndX > maxW) maxW = nodeEndX
        if(nodeEndY > maxH) maxH = nodeEndY
      })
      maxW = (maxW < this.svgAttr.minW) ? this.svgAttr.minW : maxW
      maxH = (maxH < this.svgAttr.minH) ? this.svgAttr.minH : maxH
      this.svgAttr.width = maxW + 50
      this.svgAttr.height = maxH + 20
      saveSvgAsPng(document.getElementById("topo-svg"), "topo.png")
      // 建议使用promise进行优化
      setTimeout(()=>{
        this.svgAttr.width = initW
        this.svgAttr.height = initH
      },1000)
      
    },
    //初始化获取topo组件宽高
    initTopoWH(){
      this.marker.xmarkerX = $("#topo-wrap").width()
      this.marker.ymarkerY = $("#topo-wrap").height()
      this.svgAttr.width = $("#topo-wrap").width()
      this.svgAttr.height = $("#topo-wrap").height()
      this.svgAttr.minW = $("#topo-wrap").width()
      this.svgAttr.minH = $("#topo-wrap").height()
    },
    //初始toolbarNodes
    initToolbarNodes(){
      let initToolbarNodeLst = toolbarNodeData //toolbarNodeData从后台获取
      if(!initToolbarNodeLst instanceof Array){ //类型检测，必须为Array
          console.error('toolbarNodeData must be Array')
          initToolbarNodeLst = []
      }
      this.toolbarNodeData = initToolbarNodeLst
    },
    //初始化topo数据
    initTopoData(){
      let initTopoData = topoJson//开发：topoJson从后台获取数据
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
  mounted(){
    this.initTopoWH() //初始化topo组件宽高
    this.deleteNodeAndConnetor() //绑定删除Node事件 
    this.initToolbarNodes() //初始化toolbarNodes数据
    this.initTopoData() //初始化topo数据
 }
}
</script>
<style scoped lang="less">
@import '../../less/index.less';

/*toolbar样式*/
@svg-common-color:#768699;
@stroke-width:2;
@stroke-select-width:3;
@stroke-select-color:red;
@border-color:#adadad;

/*toolbar node样式 左侧工具菜单*/
#toolbarWrap{height:100%;box-sizing: border-box;display: flex;flex-direction: column;
  .toolbar-head{height:40px;line-height:40px;text-align: center;font-size:14px;-webkit-user-select:none;user-select:none;font-weight: 700;color:@theme-color;text-overflow:ellipsis;overflow:hidden;white-space:nowrap;}
  .toolbar-main{overflow-y: auto;box-sizing:border-box;padding:10px 15px;flex:1;}
}
.node-item{margin-top:5px;cursor: pointer;border:1px solid #c7d1dd;-webkit-user-select:none;user-select:none;}
.node-css{background-color: #fff;-webkit-user-select:none;user-select:none;box-sizing: border-box;padding:8px 0;}
.nodeMoveCss{width:57px;height: 57px;background-color: #fff;-webkit-user-select:none;user-select:none;box-sizing: border-box;padding:5px;}
.node-icon{text-align: center;-webkit-user-select:none;user-select:none;}
.toolbar-node-icon{width: 28px;height: 28px;-webkit-user-select:none;user-select:none;}
.node-name{font-size:12px;text-align: center;padding:0 5px;text-overflow:ellipsis;overflow:hidden;white-space:nowrap;-webkit-user-select:none;user-select:none;color:#000}
#topoComponent{width:100%;box-sizing: border-box;padding:15px;background-color: #fff;height:100%}
.topoRow,.topoCol,.svgCol{height:100%}
.topoRow{border:1px solid  @border-color;border-radius:2px}

/*移动的node*/
#move-node{position: absolute;border:1px solid @svg-common-color;box-sizing: border-box;}
.reactClass.isSelect{stroke:@stroke-select-color;stroke-width:@stroke-select-width;}
.marker{stroke:#3d7ed5;stroke-width:1;display: none;}
.isMarkerShow{display: block;}
.connectorArror{display: none;}
.nodesG{-webkit-user-select:none;user-select:none;-moz-select:none;-ms-select:none;-o-select:none;}
.nodesG:hover .connectorArror{display: block}
.nodeImg{-webkit-user-select:none;user-select:none;-moz-select:none;-ms-select:none;-o-select:none;}
.nodeName{font-size:12px;fill:@svg-common-color;-webkit-user-select:none;user-select:none;}
.connector{display: block;}
.connectorsG{
  .connectorLine{fill:none;
    &.defaultStrokeColor{stroke:@svg-common-color;}
    &.defaultStrokeW{stroke-width:@stroke-width;}
  }
  &.active .connectorLine{stroke:@stroke-select-color;}
} 


.reactClass{stroke-width:@stroke-width;stroke:@svg-common-color;fill:#fff;cursor: default;}
.circleColor{fill:@svg-common-color}
/*
* svg区域
 */
#svgWrap{height:100%;box-sizing: border-box;display: flex;flex-direction: column;}
/*svgHead工具栏*/
#svgHead{width: 100%;height:40px;box-sizing: border-box;padding:0 15px;border:solid @border-color;border-width: 0px 1px 0 1px;display:flex;justify-content: space-between;align-items:center;
  .svgHeadItemLst{display:flex;
    .svgHeadItem{padding:5px 10px;border:1px solid @border-color;cursor:pointer;list-style:none;border-left-width: 0;
      &:hover{background-color: #ebebeb}
      &:first-child{border-left-width: 1px}
      &.active{background-color: #ebebeb;box-shadow: 2px 2px 1px #ccc inset}
      .svgHeadItemImg{background: url('../../assets/topo/icons.png');width:16px;height:16px;background-size:479px 16px;
        &.toolbar-default{background-position:-16px 0px}
        &.toolbar-rectangle_selection{background-position:-294px 0px}
        &.toolbar-zoomin{background-position:-425px 0px}
        &.toolbar-zoomout{background-position:-444px 0px}
        &.toolbar-zoomreset{background-position:-462px 0px}
      }
    }
    .svgToolBarItem{font-size:13px;background-color:@theme-color;color:@theme-font-color;padding:5px 10px;border-radius: 2px;box-sizing:border-box;margin-left:5px;cursor:pointer;-webkit-user-select:none;user-select:none;
      .svgToolBarTxt{margin-left:2px;}
    }
  }
}
/*topo-wrap主体区域*/
#topo-wrap{flex:1;width:100%;box-sizing: border-box;border:1px solid @border-color;overflow:hidden;border-bottom:0;position:relative;
  #topo-svg{box-sizing: border-box;background-color: #fff;-webkit-user-select:none;user-select:none;-moz-select:none;-ms-select:none;-o-select:none; 
    &.hand{cursor:pointer}
    &.crosshair{cursor: crosshair;}
  }
}
/* 属性设置框 */
#topoAttrWrap{height:100%;width:400px;position:absolute;top:0;right:-400px;background:#fff;border-left:1px solid @theme-color;transition:all 1s;box-sizing:border-box;}
#topoAttrHeader{padding:10px 0;background-color:@theme-color;color:#fff;text-align:center}
.topoAttrArrow{color:@theme-color;font-size:20px;position:absolute;top:50%;left:-10px;translate:transform(0 -50%);z-index:10000;background-color:#fff;cursor:pointer;}
#topoAttrWrap.active{right:0;box-shadow:-1px 0px 8px  @theme-color}
.infoIcon{font-size:30px;position:relative;top:5px;left:-4px;color:#f7ba2a}
#infoWrap{padding:15px;text-align:center;margin-top:60px}
.removeAttrArrow{float:right;cursor:pointer;font-size:20px;position:relative;top:8px;color:@theme-color;transition:all .2s}
.removeAttrArrow:hover{transform:rotate(360deg);text-shadow:2px 2px 1px #000}
</style>
<style>
  .el-collapse-item__header{-webkit-user-select:none;user-select:none;-moz-select:none;-ms-select:none;-o-select:none;}
</style>
