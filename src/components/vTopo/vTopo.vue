<!--
 * @Author: caojing
 * @Date: 2017-10-20 09:29:55
 * @LastEditors: caojing
 * @LastEditTime: 2018-11-27 10:57:15
 -->
<template>
  <div class="topoComponent">
    <div class="svgHead" v-show="editable">
        <ul class="svgHeadItemLst">
          <li class="svgHeadItem" v-for="(ele,key) in svgToolbar" :key="ele.className" :class="{'active':ele.isActive}" @mousedown="selectToolbar(key)"  :title="ele.name">
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
    <div class="svgMain">
      <v-shapebar @click="dragShapeNode" v-show="editable"></v-shapebar>
      <div :id="'topoId'+topoId" class="topoWrap" ref="topoWrap">
        <svg class="topoSvg"
          :width="svgAttr.width" 
          :height="svgAttr.height"  
          @mousedown.stop = "mousedownTopoSvg($event)" 
          :viewBox="svgAttr.viewX+' '+svgAttr.viewY+' '+svgAttr.width+' '+svgAttr.height" 
          :class="{'hand':svgAttr.isHand,'crosshair':svgAttr.isCrosshair}">
          <defs>
            <pattern id="Pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <line :x1="ele.x1" :x2="ele.x2" :y1="ele.y1" :y2="ele.y2" :stroke="ele.color" :stroke-width="ele.strokeWidth" :opacity="ele.opacity" v-for="ele in gridData" :key="ele.id"></line>
            </pattern>
          </defs>
          <defs>
            <filter id="f1" x="0" y="0" width="200%" height="200%">
              <feOffset result="offOut" in="SourceGraphic" dx="4" dy="4" />
              <feColorMatrix result="matrixOut" in="offOut" type="matrix"
              values="0.2 0 0 0 0 0 0.2 0 0 0 0 0 0.2 0 0 0 0 0 1 0" />
              <feGaussianBlur result="blurOut" in="matrixOut" stdDeviation="2" />
              <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
            </filter>
          </defs>
          <rect fill="url(#Pattern)" :width="svgAttr.width" :height="svgAttr.height" />             
          <g>                        
            <g
              class="nodesG" 
              v-for="(ele,key) in topoData.nodes" 
              :class="{isSelect:ele.isSelect,hoverShowConnectorArror:editable}" 
              :transform="'translate('+ele.x+','+ele.y+')'" 
              :key="ele.id" 
              @mouseover.stop="mouseoverNode(key,$event)" 
              @mousedown.stop="dragSvgNode(key,$event)"
              @mouseout.stop = "mouseoutLeftConnector(key)"
              >
              <rect x="0" y="0" rx="2" ry="2" :width="ele.width" :height="ele.height" class="reactClass"/>
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
              :key="ele.id">
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
        <v-topo-attr-panel :v-select-node-data = "selectNodeData" v-show="editable"></v-topo-attr-panel>
      </div>
    </div>
    <div v-if="shapebarMoveNode.isShow" class="moveNode nodeMoveCss" :style="{ left:shapebarMoveNode.left + 'px', top: shapebarMoveNode.top + 'px' }">
      <div class="shapeIcon">
        <img class="shapeIconImg" :src="shapebarMoveNode.icon"/>
      </div>
      <div class="shapeName">{{shapebarMoveNode.name}}</div>
    </div>
  </div>
</template>
<script>
import connectorRules from '../../config/connectorRules' //连线包含关系规则
import vTopoAttrPanel from './components/vTopoAttrPanel'
import vShapebar from './components/vShapebar'
export default {
  props:{
    editable:{
      type:Boolean,
      default:true
    },
    topoData:{
      type:Object,
      default() {
          return {}
      },
      required:true
    }
  },
  data () {
    return {
     keyFormRules:{
      key:[
        { required: true, message: '请输入key值', trigger: 'blur' },
      ],
      value:[
        { required:true,message:'请输入value值',trigger:'blur'}
      ]
     },
     connectorRules:connectorRules,//节点间关系的规则
     selectNodeData:{},
     selectNodeIndex:0,
     topoId:'',
     svgAttr:{width:0,height:0,isHand:false,viewX:0,viewY:0,minW:0,minH:0,isCrosshair:false},
     activeNames: ['1'],
     svgToolbar:[
      {name:'默认模式',className:'toolbar-default',isActive:true},
      {name:'框选模式',className:'toolbar-rectangle_selection',isActive:false},
      // {name:'放大',className:'toolbar-zoomin',isActive:false},
      // {name:'缩小',className:'toolbar-zoomout',isActive:false},
      // {name:'恢复出厂设置',className:'toolbar-zoomreset',isActive:false}
     ],
     shapebarMoveNode:{
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
      {x1:0,x2:100,y1:20,y2:20,color:'#c0c0c0',strokeWidth:1,opacity:0.3,id:1},
      {x1:0,x2:100,y1:40,y2:40,color:'#c0c0c0',strokeWidth:1,opacity:0.3,id:2},
      {x1:0,x2:100,y1:60,y2:60,color:'#c0c0c0',strokeWidth:1,opacity:0.3,id:3},
      {x1:0,x2:100,y1:80,y2:80,color:'#c0c0c0',strokeWidth:1,opacity:0.3,id:4},
      {x1:20,x2:20,y1:0,y2:100,color:'#c0c0c0',strokeWidth:1,opacity:0.3,id:5},
      {x1:40,x2:40,y1:0,y2:100,color:'#c0c0c0',strokeWidth:1,opacity:0.3,id:6},
      {x1:60,x2:60,y1:0,y2:100,color:'#c0c0c0',strokeWidth:1,opacity:0.3,id:7},
      {x1:80,x2:80,y1:0,y2:100,color:'#c0c0c0',strokeWidth:1,opacity:0.3,id:8},
      {x1:100,x2:100,y1:0,y2:100,color:'#c0c0c0',strokeWidth:2,opacity:0.6,id:9},
      {x1:0,x2:100,y1:100,y2:100,color:'#c0c0c0',strokeWidth:2,opacity:0.6,id:10}
     ],
    }
  },
  computed:{
  },
  components:{
    vTopoAttrPanel,
    vShapebar
  },
  methods:{
    GenNonDuplicateID(randomLength){
        return Number(Math.random().toString().substr(3,randomLength) + Date.now()).toString(36)
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
    //拖拽shapeBar中的node
    dragShapeNode(nodeData,key,event){
      let NODE = nodeData[key]
      let toolbarName =NODE.type
      let toolbarIcon = NODE.icon
      let topoEle = $(`#topoId${this.topoId}`)
      let svgOffsetLeft = topoEle.find(".topoSvg").offset().left
      let svgOffsetTop =  topoEle.find(".topoSvg").offset().top
      let svgWidth =  topoEle.find(".topoSvg").width()
      let svgHeight =  topoEle.find(".topoSvg").height()
      let isContainSvgArea = false
      document.onmousemove = (event) =>{        
        let mouseX = event.clientX    //当前鼠标位置
        let mouseY = event.clientY 
        let nodeX = event.clientX - svgOffsetLeft + $(document).scrollLeft()+ this.svgAttr.viewX   //svg最终位置
        let nodeY = event.clientY - svgOffsetTop  + $(document).scrollTop() + this.svgAttr.viewY
        isContainSvgArea = false
        this.shapebarMoveNode.left = mouseX + 4 + $(document).scrollLeft()  // 鼠标位置 + 文档滚动的距离
        this.shapebarMoveNode.top =  mouseY + 4 + $(document).scrollTop()
        this.shapebarMoveNode.name = toolbarName
        this.shapebarMoveNode.icon = toolbarIcon
        this.shapebarMoveNode.isShow = true
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
                  let connectorId = this.GenNonDuplicateID(3)
                  let connector={
                    id:connectorId,
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
        this.shapebarMoveNode.left = 0
        this.shapebarMoveNode.top =  0
        this.shapebarMoveNode.name = ''
        this.shapebarMoveNode.icon = ''
        this.shapebarMoveNode.isShow = false
      }
      //生成唯一id值
      function GenNonDuplicateID(randomLength){
        return Number(Math.random().toString().substr(3,randomLength) + Date.now()).toString(36)
      }
    },
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
        let topoEle = $(`#topoId${this.topoId}`)       
        selectionBoxX = event.clientX - topoEle.find(".topoSvg").offset().left + $(document).scrollLeft() + this.svgAttr.viewX  
        selectionBoxY = event.clientY - topoEle.find(".topoSvg").offset().top + 4 + $(document).scrollTop() + this.svgAttr.viewY
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
       if(!this.editable) return false  //editable[false]（非编辑状态）：svgNode不可移动  
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
          if(node.id == CURNODE.id){
            this.selectNodeData = node
          }
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
          let connectorId = this.GenNonDuplicateID(3)            
          let connector={
            id:connectorId,
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
      if(!this.editable) return false //如果非编辑状态，不可连线
      let CONNECTLINE = this.connectingLine //绘制连线对象
      let CURNODE =  this.topoData.nodes[key] //当前点击node
      let nodeW = CURNODE.width //当前node宽高
      let nodeH = CURNODE.height 
      let sourceNodeX = CURNODE.x 
      let sourceNodeY = CURNODE.y    
      let mouseX0 = event.clientX    
      let mouseY0 = event.clientY
      let topoEle = $(`#topoId${this.topoId}`)
      let x1 = event.clientX - topoEle.find(".topoSvg").offset().left-2 + $(document).scrollLeft() + this.svgAttr.viewX   //连线开始位置的位置：鼠标点击的实际位置   为鼠标位置 - 当前元素的偏移值
      let y1 = event.clientY - topoEle.find(".topoSvg").offset().top+4+ $(document).scrollTop() + this.svgAttr.viewY
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
              let connectorId = this.GenNonDuplicateID(3)
              let connector = {
                id:connectorId,
                type:connectType,
                strokeW:3,//仅用于Line类型,默认3
                color:'#768699', //仅用于Line类型，默认颜色
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
      if(!this.editable) return false //如果非编辑状态 不可点击
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
      this.selectNodeData = selectLine //将点击的连线信息赋值给属性面板
    },
    //取消所有节点选中
    cancelAllNodesSelect(){
      this.topoData.nodes.forEach((ele,key) =>{
          ele.isSelect = false
          this.$set(this.topoData.nodes,key,ele)
      })
      this.selectNodeData = {}
    },
    //取消所有连线选中
    cancelAllLinksSelect(){
      this.topoData.connectors.forEach((ele,key)=>{
          ele.isSelect = false
          this.$set(this.topoData.connectors,key,ele)
      }) 
      this.selectNodeData = {}
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
                this.selectNodeIndex = 
                this.selectNodeData = {} 
              }else{
                this.selectNodeIndex = null
                this.selectNodeData = {}
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
      saveSvgAsPng(document.getElementById("topoSvg"), "topo.png")
      // 建议使用promise进行优化
      setTimeout(()=>{
        this.svgAttr.width = initW
        this.svgAttr.height = initH
      },1000)
      
    },
    //初始化获取topo组件宽高
    initTopoWH(){
      this.$nextTick(()=>{
        // let width = this.$refs.topoWrap.offsetWidth - 2
        // let height = this.$refs.topoWrap.offsetHeight - 2
        let ele = `#topoId${this.topoId}`
        let topoW = $(ele).width()
        let topoH = $(ele).height()
        this.marker.xmarkerX = topoW
        this.marker.ymarkerY = topoH
        this.svgAttr.width = topoW
        this.svgAttr.height = topoH
        this.svgAttr.minW = topoW
        this.svgAttr.minH = topoH
        // this.marker.xmarkerX = width
        // this.marker.ymarkerY = height
        // this.svgAttr.width = width
        // this.svgAttr.height = height
        // this.svgAttr.minW = width
        // this.svgAttr.minH = height
        })
    },
  },
  mounted(){
    
    this.deleteNodeAndConnetor() //绑定删除Node事件 
    this.topoId = this.GenNonDuplicateID(5)
    this.initTopoWH() //初始化topo组件宽高
 }
}
</script>
<style scoped lang="less">
@svg-common-color:#768699;
@stroke-width:2;
@stroke-select-width:3;
@stroke-select-color:red;
@border-color:#aaaaaa;
@storke-dasharray:5,5;
.svgSelectClass{filter:url(#f1);}

.topoComponent{width:100%;box-sizing: border-box;background-color: #fff;height:100%;display:flex;flex-direction: column;}
/*svgHead工具栏*/
.svgHead{width: 100%;height:40px;box-sizing: border-box;padding:0 20px;display:flex;justify-content: space-between;align-items:center;background:@theme-color;border:solid @border-color;border-width:1px 1px 0;box-shadow:inset 0 1px 0 0 #fff;
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
    .svgToolBarItem{font-size:13px;color:@theme-font-color;padding:5px 10px;border-radius: 2px;box-sizing:border-box;margin-left:5px;cursor:pointer;-webkit-user-select:none;user-select:none;
      .svgToolBarTxt{margin-left:2px;}
    }
  }
}
/*svgMain*/
.svgMain{height:100%;box-sizing: border-box;display: flex;flex:1;}
/*移动的node*/
.shapeIcon{text-align: center;-webkit-user-select:none;user-select:none;
  .shapeIconImg{width: 28px;height: 28px;-webkit-user-select:none;user-select:none;}
}
.shapeName{font-size:12px;text-align: center;padding:0 5px;text-overflow:ellipsis;overflow:hidden;white-space:nowrap;-webkit-user-select:none;user-select:none;color:#000}
.moveNode{position: absolute;border:1px solid @svg-common-color;box-sizing: border-box;
  &.nodeMoveCss{width:57px;height: 57px;background-color: #fff;-webkit-user-select:none;user-select:none;box-sizing: border-box;padding:5px;}
}
/*svgMain右侧svg主体区域*/
.topoWrap{flex:1;width:100%;box-sizing: border-box;border:1px solid @border-color;overflow:hidden;position:relative;background:#fff;
  .topoSvg{box-sizing: border-box;background-color: #fff;-webkit-user-select:none;user-select:none;-moz-select:none;-ms-select:none;-o-select:none; 
    &.hand{cursor:pointer}
    &.crosshair{cursor: crosshair;}
  }
}
/*svg 节点 连线样式*/
.marker{stroke:#3d7ed5;stroke-width:1;display: none;
  &.isMarkerShow{display: block;}
}
.nodesG{-webkit-user-select:none;user-select:none;-moz-select:none;-ms-select:none;-o-select:none;
  &.isSelect .reactClass{stroke-width:@stroke-select-width;.svgSelectClass;}
  &.isSelect .nodeName{font-weight: 500;}
  &.hoverShowConnectorArror:hover .connectorArror{display: block}
  .nodeImg{-webkit-user-select:none;user-select:none;-moz-select:none;-ms-select:none;-o-select:none;}
  .nodeName{font-size:12px;fill:@svg-common-color;-webkit-user-select:none;user-select:none;}
  .reactClass{stroke-width:@stroke-width;stroke:@svg-common-color;fill:#fff;cursor: default;}
  .connectorArror{display: none;
    &.connector{display: block;}
    .circleColor{fill:@svg-common-color}
  }
}
.connectorsG{
  .connectorLine{fill:none;
    &.defaultStrokeColor{stroke:@svg-common-color;}
    &.defaultStrokeW{stroke-width:@stroke-width;}
  }
  &.active .connectorLine{.svgSelectClass;}
}
</style>
<style>
  .el-collapse-item__header{-webkit-user-select:none;user-select:none;-moz-select:none;-ms-select:none;-o-select:none;}
</style>
