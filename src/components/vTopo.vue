<template>
  <div id="topoComponent" class="clearfix">
    <div id="toolbar">
        <div class="toolbar-head">
            Node Types
        </div>
        <div class="toolbar-main">
          <el-collapse v-model="activeNames">
            <el-collapse-item title="nodecellar.nodes" name="1">
              <div class="according-inner">
                <ul class="nodelist clearfix">
                   <li v-for="(ele,key) in toolbarNodeData" :key="key" class="node-item node-css" @mousedown.stop.prevent = "dragToolbarNode(toolbarNodeData,key,$event)">
                      <div class="node-icon">
                        <img class="toolbar-node-icon" :src="ele.icon"/>
                      </div>
                      <div class="node-name" :title="ele.name">{{ele.name}}</div>
                   </li>
                </ul>
              </div>
            </el-collapse-item>
            <el-collapse-item title="haproxy.nodes" name="2">
              
            </el-collapse-item>
            <el-collapse-item title="cloudify.nodes" name="3">
              
            </el-collapse-item>
            <el-collapse-item title="cloudify.openstack.nodes" name="4">
              
            </el-collapse-item>
          </el-collapse>
         </div>
    </div>
    <div id="topo-wrap">
      <svg id="topo-svg"
        :width="svgAttr.width" 
        :height="svgAttr.height" 
        @mouseover = "moveInTopoSvg" 
        @mouseout = "moveOutTopoSvg" 
        @mousedown.stop = "mousedownTopoSvg($event)" 
        :viewBox="svgAttr.viewX+' '+svgAttr.viewY+' '+svgAttr.width+' '+svgAttr.height" 
        :class="{'hand':svgAttr.isHand}">
        <defs>
          <pattern id="Pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <line :x1="ele.x1" :x2="ele.x2" :y1="ele.y1" :y2="ele.y2" :stroke="ele.color" :stroke-width="ele.strokeWidth" :opacity="ele.opacity" v-for="(ele,key) in gridData"></line>
          </pattern>
        </defs>      
          <rect fill="url(#Pattern)" :width="svgAttr.width" :height="svgAttr.height" />         
          <g
            class="nodesG" 
            v-for="(ele,key) in topoData.nodes" 
            :transform="'translate('+ele.x+','+ele.y+')'" 
            :key="key" 
            @mouseover.stop="mouseroverNode(key,$event)" 
            @mousedown.stop="dragSvgNode(key,$event)">
            <rect x="0" y="0" rx="2" ry="2" :width="ele.width" :height="ele.height" class="reactClass" :class="{isSelect:ele.isSelect}" />
            <text v-if="ele.type == 'T1'" class="nodeName" x="5" y="15">{{ele.name}}</text>
            <image v-if="ele.type == 'T1'" :xlink:href="ele.icon" :x="ele.width - 23" :y="5" height="17px" width="17px"/>

            <image v-if="ele.type == 'T2'" :xlink:href="ele.icon" :x="7" :y="7" height="36px" width="36px"/>
            <text v-if="ele.type == 'T2'" class="nodeName" x="0" :y="ele.height + 14">{{ele.name}}</text>
            <!-- <text class="fontIcon" x="0" y="50">{{ele.icon}}</text> -->
            <g class="connectorArror" :class="{'connector':ele.isLeftConnectShow}" :transform="'translate(0,'+ele.height/2+')'"  @mouseover.stop="getConnectLine(key)" @mouseout.stop = "mouseoutLeftConnector(key)">
              <circle r="8" cx="0" cy="0" fill="#768699"></circle>
              <line x1="-3" y1="-5" x2="4" y2="0.5" stroke="#fff"></line>
              <line x1="4" y1="-0.5" x2="-3" y2="5" stroke="#fff"></line>
            </g>
            <g class="connectorArror" :class="{'connector':ele.isRightConnectShow}" :transform="'translate('+ele.width+','+ele.height/2+')'" @mousedown.stop="drawConnectLine(key,$event)">
              <circle r="8" cx="0" cy="0" fill="#768699"></circle>
              <line x1="-3" y1="-5" x2="4" y2="0.5" stroke="#fff"></line>
              <line x1="4" y1="-0.5" x2="-3" y2="5" stroke="#fff"></line>
            </g>
          </g>
          <!-- node间关系连线样式 -->
          <g 
            class="connectorsG" 
            v-for="(ele,key) in topoData.connectors">
            <!-- 自连 -->
            <path 
              v-if="ele.sourceNode.id == ele.targetNode.id && ele.type == 'Line'" 
              :d="'M'+(ele.sourceNode.x + ele.sourceNode.width)+','+(ele.sourceNode.y + ele.sourceNode.height / 2)+
              'h'+connectorWSelf+
              'v'+(-(ele.sourceNode.height / 2 + connectorWSelf))+ 
              'h'+ (-(ele.sourceNode.width +  2 * connectorWSelf)) + 
              'v'+(ele.sourceNode.height / 2 + connectorWSelf) + 
              'H' + (ele.targetNode.x)"
              stroke = "#768699"
              fill = "none"
              stroke-width = "2"></path>
            <!-- 非自连:1.sourceNode 的右侧箭头X <= targetNode的左侧箭头X -->
            <path 
              v-if="ele.sourceNode.id != ele.targetNode.id && ele.type == 'Line' && 
              (ele.sourceNode.x +ele.sourceNode.width) < ele.targetNode.x" 
              :d="'M'+(ele.sourceNode.x + ele.sourceNode.width)+','+(ele.sourceNode.y + ele.sourceNode.height / 2) + 
              'h'+ (ele.targetNode.x - ele.sourceNode.x - ele.sourceNode.width) / 2 + 
              'V' + (ele.targetNode.y + ele.targetNode.height / 2) + 
              'H' + ele.targetNode.x" 
              stroke = "#768699"
              fill = "none"
              stroke-width = "2"></path>
            <!-- 非自连：
            2.sourceNode 的右侧箭头X >= targetNode的左侧箭头X  
            (1) 且 sourceNode的高度 < targetNode的高度 且 高度未重叠-->
            <path 
              v-if="ele.type == 'Line' && 
              ele.sourceNode.id != ele.targetNode.id && 
              (ele.sourceNode.x + ele.sourceNode.width) >= ele.targetNode.x &&
              (ele.sourceNode.y + ele.sourceNode.height ) < ele.targetNode.y" 
              :d="'M'+(ele.sourceNode.x + ele.sourceNode.width)+','+(ele.sourceNode.y + ele.sourceNode.height / 2) +
              'h'+connectorWSelf+ 
              'v'+(ele.sourceNode.height / 2 + (ele.targetNode.y - ele.sourceNode.y -  ele.sourceNode.height) / 2) + 
              'H'+(ele.targetNode.x - connectorWSelf) + 
              'V'+(ele.targetNode.y + ele.targetNode.height / 2) + 
              'h'+connectorWSelf" 
              stroke = "#768699"
              fill = "none"
              stroke-width = "2"></path>
            <!-- 非自连：
            2.sourceNode 的右侧箭头X >= targetNode的左侧箭头X
             (2) 且 sourceNode的高度 > targetNode的高度 且 高度未重叠-->
            <path 
              v-if="ele.type == 'Line' && 
              ele.sourceNode.id != ele.targetNode.id && 
              (ele.sourceNode.x + ele.sourceNode.width) >= ele.targetNode.x &&
              (ele.targetNode.y + ele.targetNode.height) < ele.sourceNode.y" 
              :d="'M'+(ele.sourceNode.x + ele.sourceNode.width)+','+(ele.sourceNode.y + ele.sourceNode.height / 2) +
              'h'+connectorWSelf+ 
              'V'+(ele.sourceNode.y-(ele.sourceNode.y - ele.targetNode.y - ele.targetNode.height) / 2) + 
              'H'+ (ele.targetNode.x - connectorWSelf) + 
              'V'+(ele.targetNode.y + ele.targetNode.height / 2) + 
              'H'+ele.targetNode.x" 
              stroke = "#768699"
              fill = "none"
              stroke-width = "2"></path>
             <!-- 
             非自连：
             2.sourceNode 的右侧箭头X >= targetNode的左侧箭头X 
             (3) sourceNode的箭头y < = targetNode的箭头
            sourceNode 的y < targetNode的y < = (sourceNode 的y + sourceNode的height) 或者 sourceNode的y介于其间
             高度重叠-->
            <path 
              v-if="ele.type == 'Line' && 
              ele.sourceNode.id != ele.targetNode.id &&
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
              stroke = "#768699"
              fill = "none"
              stroke-width = "2"></path> 
             <!-- 
             非自连：
             2.sourceNode 的右侧箭头X > targetNode的左侧箭头X 
             (3) 且 sourceNode的高度 < targetNode的高度 且 
             sourceNode的起点 > targetNode的终点 且 
             高度重叠-->
            <path 
              v-if="ele.type == 'Line' && 
              ele.sourceNode.id != ele.targetNode.id &&
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
              stroke = "#768699"
              fill = "none"
              stroke-width = "2"></path> 
          </g>
          
          <g>
            <line :x1='connectingLine.x1' :y1="connectingLine.y1" :x2="connectingLine.x2" :y2="connectingLine.y2" v-show="connectingLine.isConnecting" stroke="#768699" stroke-width = "2"></line>
          </g> 
          <line :class="{isMarkerShow:marker.isMarkerShow}" id="xmarker" class="marker" x1="0" :y1="marker.xmarkerY" :x2="marker.xmarkerX" :y2="marker.xmarkerY"></line>
          <line :class="{isMarkerShow:marker.isMarkerShow}" id="ymarker" class="marker" :x1="marker.ymarkerX" y1="0" :x2="marker.ymarkerX" :y2="marker.ymarkerY"></line>     
      </svg>
    </div>
    <div v-if="toolbarMoveNode.isShow" id="move-node" class="node-css" :style="{ left:toolbarMoveNode.left + 'px', top: toolbarMoveNode.top + 'px' }">
      <div class="node-icon">
        <img class="toolbar-node-icon" :src="toolbarMoveNode.icon"/>
      </div>
      <div class="node-name">{{toolbarMoveNode.name}}</div>
    </div>
  </div>
</template>
<script>
import database from '../assets/topo/database.png'
import cloud from '../assets/topo/cloud.png'
import compute from '../assets/topo/compute.png'
import message from  '../assets/topo/message.png'
import network from '../assets/topo/network.png'
import router from  '../assets/topo/router.png'
import sercurity from  '../assets/topo/sercurity.png'
import webserver from  '../assets/topo/webserver.png'
import filesystem from '../assets/topo/filesystem.png'
import virtualip from '../assets/topo/virtualip.png'
export default {
  name: 'HelloWorld',
  data () {
    return {
     svgAttr:{width:0,height:0,isHand:false,viewX:0,viewY:0,minW:0,minH:0},
     maxRowIndexNode:null,
     activeNames: ['1'],
     toolbarNodeData:[
      {name:'Compute',icon:compute,width:150,height:100,num:1,type:'T1'},
      {name:'Database',icon:database,width:150,height:100,num:1,type:'T1'},
      {name:'Cloud',icon:cloud,width:150,height:100,num:1,type:'T1'},
      {name:'Network',icon:network,width:150,height:100,num:1,type:'T1'},
      {name:'Router',icon:router,width:150,height:100,num:1,type:'T1'},
      {name:'Sercurity',icon:sercurity,width:50,height:50,num:1,type:'T2'},
      {name:'webserver',icon:webserver,width:150,height:100,num:1,type:'T1'},
      {name:'filesystem',icon:filesystem,width:150,height:100,num:1,type:'T1'},
      {name:'message',icon:message,width:150,height:100,num:1,type:'T1'},
      {name:'virtualip',icon:virtualip,width:50,height:50,num:1,type:'T2'}
     ],
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
     connectorWSelf:15, //自连连线的宽度
     connectorW:15,//非自连连线宽度
     containTop:30, //包含关系的子node距离父node
     containLeft:17,//包含关系的左右距离
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
      nodes:[
        {x:30,y:10,width:150,height:100,id:66,isLeftConnectShow:false,isRightConnectShow:false,name:'New_server_0',isSelect:false,initW:150,initH:100,icon:database,type:'T1',containNodes:[]},
        {x:100,y:50,width:150,height:100,id:77,isLeftConnectShow:false,isRightConnectShow:false,name:'New_volumn_0',isSelect:false,initW:150,initH:100,icon:database,type:'T1',containNodes:[]},
        {x:500,y:100,width:100,height:100,id:88,isLeftConnectShow:false,isRightConnectShow:false,name:'New_proxy_0',isSelect:false,initW:100,initH:100,icon:database,type:'T1',containNodes:[]}
      ],
      connectors:[
        
      ]
     }
    }
  },
  computed:{
  },
  methods:{
    //拖拽toolbar中的node
    dragToolbarNode(nodeData,key,event){
      let NODE = nodeData[key]
      let toolbarName =NODE.name
      let toolbarIcon = NODE.icon
      document.onmousemove = (event) =>{        
        let mouseX = event.clientX    //当前鼠标位置
        let mouseY = event.clientY 
        let nodeX = event.clientX - $("#topo-svg").offset().left + $(document).scrollLeft()  //svg最终位置
        let nodeY = event.clientY - $("#topo-svg").offset().top  + $(document).scrollTop()
        this.toolbarMoveNode.left = mouseX + 4 + $(document).scrollLeft()  // 鼠标位置 + 文档滚动的距离
        this.toolbarMoveNode.top =  mouseY + 4 + $(document).scrollTop()
        this.toolbarMoveNode.name = toolbarName
        this.toolbarMoveNode.icon = toolbarIcon
        this.toolbarMoveNode.isShow = true
        // 鼠标滑入svg区域 显示标尺并显示标尺正确位置
        if(this.svgTopo.isMoveover){
          this.marker.isMarkerShow = true          
          let n1 = Math.floor(nodeX / 20)  //grid宽高的整数倍
          let n2 = Math.floor(nodeY / 20)         
          this.marker.xmarkerY = n2 * 20
          this.marker.ymarkerX = n1 * 20
        }
      }
      document.onmouseup = (event)=>{
         document.onmousemove = null
　　　　　document.onmouseup = null
         // 鼠标在svg区域
        if(this.svgTopo.isMoveover){
          let type = NODE.name
          let name = 'New_'+NODE.name+'_'+ NODE.num
          NODE.num ++ 
          let id = GenNonDuplicateID(5)
          let svgNode ={
             name,
             type,
             x:this.marker.ymarkerX+this.svgAttr.viewX,
             y:this.marker.xmarkerY+this.svgAttr.viewY,
             icon:NODE.icon,
             width:NODE.width,
             height:NODE.height,
             initW:NODE.width,
             initH:NODE.height,
             id:id,
             type:NODE.type,
             isLeftConnectShow:false,
             isRightConnectShow:false,
             containNodes:[]
          }
          this.marker.isMarkerShow = false    //标尺取消显示
          this.topoData.nodes.push(svgNode)   //创建一个svg Node                   
        }
        //初始化toolbarMoveNode的值
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
    moveInTopoSvg(){
      this.svgTopo.isMoveover = true
    },
    moveOutTopoSvg(){
      this.svgTopo.isMoveover = false
      this.marker.isMarkerShow = false

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
      //取消所有节点选中
      this.topoData.nodes.forEach((ele,key) =>{
        ele.isSelect = false
       })
      //移动viewbox位置
      document.onmousemove=(event)=>{
        let disX = event.clientX - mouseX0
        let disY = event.clientY - mouseY0
        let endSvgW = startSvgW - disX
        let endSvgH = startSvgH - disY
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
      }
    },
    //拖拽svg中的node
    dragSvgNode(key,event){
       let mouseX0 = event.clientX //鼠标点击下的位置
       let mouseY0 = event.clientY
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
       //节点选中
       this.topoData.nodes.forEach((ele,key) =>{
        ele.isSelect = false
       })
       CURNODE.isSelect = true       
       this.storeCurnodeStartPosition(CURNODE,nodeStartPosArr)  //将选择的node的子子节点初始位置保存进去

　　　　document.onmousemove = (event) => {         
　　　　　　let disX = event.clientX - mouseX0  //移动位置
           let disY = event.clientY - mouseY0
           let endX = startX + disX //最终位置
           let endY = startY + disY
           let n1 = Math.floor(endX / 20)  //grid宽高的整数倍
           let n2 = Math.floor(endY / 20) 
           this.marker.isMarkerShow = true  //显示标尺        
           this.marker.xmarkerY = n2 * 20   //标尺的移动位置，以每格20的距离移动
           this.marker.ymarkerX = n1 * 20
           
           this.moveContianNode(disX,disY,nodeStartPosArr) //根据保存的数组数据移动相关节点
           this.refreshConnectorsData()  //及时更新连线数据
          // this.drawContainLayout(CURNODE,endX,endY,false,nodeStartPosArr)
　　　　};
　　　　document.onmouseup = () => {　　　　　　           
           document.onmousemove = null
　　　　　　document.onmouseup = null
           this.marker.isMarkerShow = false    //隐藏标尺
           let NodeEndX = this.marker.ymarkerX  //最终位置为标尺的位置 最终节点位置
           let NodeEndY = this.marker.xmarkerY
           let disX = NodeEndX - startX
           let disY = NodeEndY - startY

           this.moveContianNode(disX,disY,nodeStartPosArr)  //移动包含着的子节点           
           this.drawContainLayout(CURNODE,NodeEndX,NodeEndY,true,nodeStartPosArr) 
           this.refreshConnectorsData() //最后刷新连线            
　　　　};
       
    },
    //绘制contain布局及刷新连线数据
    drawContainLayout(CURNODE,NodeEndX,NodeEndY,isStop,nodeStartPosArr){
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
          if(ele.type == "Contain" && ele.sourceNode.id == curNodeId) originTargetNodeId = ele.targetNode.id
         })
         if(originTargetNodeId){
          TOPODATA.nodes.forEach((node,key) => {
            if(node.id == originTargetNodeId) originTargetNode = node
          })
         }
         this.deleteCurNodeContain(CURNODE) //清除当前node的包含关系
         // 与NodeData对比，判断是否有值与其他Node重合的
         let isContainNode = false
         let overlapTargetNode = {}
         for(let i =( TOPODATA.nodes.length - 1); i >= 0; i--){      //forEach无法跳出循环,暂用for循环
            let targetNode = TOPODATA.nodes[i]
            if(CURNODE.id != targetNode.id && targetNode.type == "T1" && CURNODE.type == "T1"){   //排除自身元素             
              let minX = targetNode.x
              let maxX = targetNode.x + targetNode.width
              let minY = targetNode.y
              let maxY = targetNode.y + targetNode.height
              //四种包含情况判重合
              if(NodePoint1[0] <= maxX && NodePoint1[0] >= minX && NodePoint1[1] <=  maxY && NodePoint1[1] >= minY) isContainNode = true
              if(NodePoint2[0] <= maxX && NodePoint2[0] >= minX && NodePoint2[1] <=  maxY && NodePoint2[1] >= minY) isContainNode = true
              if(NodePoint4[0] <= maxX && NodePoint4[0] >= minX && NodePoint4[1] <=  maxY && NodePoint4[1] >= minY) isContainNode = true
              if(NodePoint3[0] <= maxX && NodePoint3[0] >= minX && NodePoint3[1] <=  maxY && NodePoint3[1] >= minY) isContainNode = true
              
              if(isContainNode){
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
            }
          }                          
           
                       
        if(isStop){     //鼠标是mouseup状态时，确定最终位置
          TOPODATA.connectors.push(connector)

          //this.refreshOuterWidthAndRowPosition(CURNODE,targetNode)
          //如果有嵌套关系，就在父节点放入子节点id
          TOPODATA.nodes.forEach((node,key) => {
            if(node.id == overlapTargetNode.id) node.containNodes.push(CURNODE.id)
          })
          this.refreshRowAndOuterNode(CURNODE)  //刷新并列节点位置和父节点宽高

          //移动包含着的子节点 
          nodeStartPosArr.forEach((node,key) => {
            if(node.id == CURNODE.id){
              let disX = CURNODE.x - node.x 
              let disY = CURNODE.y - node.y
              this.moveContianNode(disX,disY,nodeStartPosArr)   
            }
          })                    
        }
        }
        //如果初始targetNodeId 与现在重合的taregtNodeId不同，让originTargetNode位置重置
        if(originTargetNodeId && originTargetNodeId != overlapTargetNode.id){               
          this.refreshRowAndOuterNode(originTargetNode)
        }   
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
    deleteCurNodeContain(CURNODE){
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
    // getLastChildNode(CURNODE){
    //   let isLastChild = true
    //   this.topoData.connectors.forEach((ele,key) => {
    //     if(ele.targetNode.id == CURNODE.id && ele.type == 'Contain'){
    //       isLastChild = false
    //       let childNodeId =  ele.sourceNode.id
    //       this.topoData.nodes.forEach((node,index) => {
    //         if(node.id == childNodeId) this.getLastChildNode(node)
    //       })
    //     }

    //   })
    //   if(isLastChild){
    //     CURNODE.width = CURNODE.initW
    //     CURNODE.height =CURNODE.initH
    //     this.refreshOuterNodeWidth(CURNODE)
    //   }
    // },
    //刷新外部节点宽度 及 右侧节点的位置
    refreshOuterWidthAndRowPosition(CURNODE,TARGETNODE){
      this.topoData.connectors.forEach((ele,key) => {
        if(ele.sourceNode.id == CURNODE.id && ele.type == "Contain") {
          let targetNodeId = ele.targetNode.id
          this.topoData.nodes.forEach((node,index) => {
            if(node.id == targetNodeId){
              node.width = 2*this.containLeft +node.width
              if(TARGETNODE.containNodes.length ==0){
                node.height = 10 + node.height +this.containTop
              }                          
              this.refreshOuterNodeWidth(node)
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
      let x1 = event.clientX - $("#topo-svg").offset().left + $(document).scrollLeft() + this.svgAttr.viewX   //连线开始位置的位置：鼠标点击的实际位置   为鼠标位置 - 当前元素的偏移值
      let y1 = event.clientY - $("#topo-svg").offset().top + 4 + $(document).scrollTop() + this.svgAttr.viewY
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
        // let pointes = []
        let sourceNodeW = nodeW
        let sourceNodeH = nodeH
        let targetNodeW = 0    //目标节点相关信息
        let targetNodeH = 0
        let targetNodeX = 0 
        let targetNodeY = 0
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
              }
            })
           
            //类型：包含
            let connector = {
              type:connectType,
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
    mouseroverNode(key,event){
      this.marker.xmarkerY = this.topoData.nodes[key].y
      this.marker.ymarkerX = this.topoData.nodes[key].x
    },
    //获取连线终点时的node的ID值
    getConnectLine(key){
      this.connectingLine.endNode = this.topoData.nodes[key].id 
    },
    //鼠标划出左侧箭头时，将connectingLine.endNode再次初始化
    mouseoutLeftConnector(key){
      this.connectingLine.endNode = ''
    }
    
  },
  mounted(){
    //初始化：获取topo组件宽高
    this.marker.xmarkerX = $("#topo-wrap").width()
    this.marker.ymarkerY = $("#topo-wrap").height()
    this.svgAttr.width = $("#topo-wrap").width()
    this.svgAttr.height = $("#topo-wrap").height()
    this.svgAttr.minW = $("#topo-wrap").width()
    this.svgAttr.minH = $("#topo-wrap").height() 
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#topoComponent{width:100%;height:650px;box-sizing: border-box;padding:15px;background-color: #fff}
/*toolbar样式*/
#toolbar{width:250px;height:100%;float: left;overflow-y: scroll;box-sizing: border-box;padding-right:10px;}
.toolbar-head{padding:10px;text-align: center;color:#000069;font-size:14px;}

/*toolbar node样式*/
.node-item{float: left;margin:3px 2px;cursor: pointer;border:1px solid #c7d1dd;-webkit-user-select:none;user-select:none;}
.node-css{width:57px;height: 57px;background-color: #fff;-webkit-user-select:none;user-select:none;box-sizing: border-box;padding:5px 0;}
.node-icon{text-align: center;-webkit-user-select:none;user-select:none;}
.toolbar-node-icon{width: 28px;height: 28px;-webkit-user-select:none;user-select:none;}
.node-name{font-size:12px;text-align: center;position: relative;top:-4px;padding:0 5px;text-overflow:ellipsis;overflow:hidden;white-space:nowrap;-webkit-user-select:none;user-select:none;}
/*移动的node*/
#move-node{position: absolute;border:1px solid #768699;box-sizing: border-box;}
/*topo主体样式*/
#topo-wrap{width:calc(100% - 250px);height:100%;box-sizing: border-box;float:left;border:1px solid #333;overflow:hidden;}
#topo-svg{box-sizing: border-box;}
#topo-svg.hand{cursor:pointer}
#topo-wrap::-webkit-scrollbar{width: 8px;height: 8px;}
#topo-wrap::-webkit-scrollbar-thumb{background: #000069;border-radius: 3px}
#topo-wrap::-webkit-scrollbar-track{background-color: #ddd;border-radius: 3px;}
.reactClass{stroke-width:2;stroke:#768699;fill:#fff;cursor: default;}
.isSelect{stroke:red;}
.marker{stroke:#3d7ed5;stroke-width:1;display: none;}
.isMarkerShow{display: block;}
.fontIcon{font-family:FontAwesome;font-size:50px;cursor: default;} 
.connectorArror{display: none;}
.nodesG:hover .connectorArror{display: block}
.nodeName{font-size:12px;fill:#4f5d71;-webkit-user-select:none;user-select:none;}
.connector{display: block;}

</style>
<style type="text/css">
  .el-collapse-item__header{-webkit-user-select:none;user-select:none;}
</style>
