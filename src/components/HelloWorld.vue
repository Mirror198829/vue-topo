<template>
  <div>
  <div id="topo-wrap">
    <svg id="topo-svg">
      <defs>
        <pattern id="Pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
          <line :x1="ele.x1" :x2="ele.x2" :y1="ele.y1" :y2="ele.y2" :stroke="ele.color" :stroke-width="ele.strokeWidth" :opacity="ele.opacity" v-for="(ele,key) in gridData"></line>
        </pattern>
      </defs>      
        <rect fill="url(#Pattern)" width="100%" height="100%" />
        <line :class="{isMarkerShow:isMarkerShow}" id="xmarker" class="marker" :x1="marker.xmarkerX1" :y1="marker.xmarkerY1" :x2="marker.xmarkerX2" :y2="marker.xmarkerY2"></line>
        <line :class="{isMarkerShow:isMarkerShow}" id="ymarker" class="marker" :x1="marker.ymarkerX1" :y1="marker.ymarkerY1" :x2="marker.ymarkerX2" :y2="marker.ymarkerY2"></line>
        <g>
          <line :x1='connectingLine.x1' :y1="connectingLine.y1" :x2="connectingLine.x2" :y2="connectingLine.y2" v-show="connectingLine.isConnecting" stroke="#000"></line>
        </g>
        <g 
          class="connectorsG" 
          v-for="(ele,key) in topoData.connectors">
          <line :x1 = "ele.x1" :y1 = "ele.y1" :x2="ele.x2" :y2="ele.y2" stroke = "#000"></line>
        </g>
        <g
          class="nodesG" 
          v-for="(ele,key) in topoData.nodes" 
          :transform="'translate('+ele.x+','+ele.y+')'" 
          :key="key" 
          @mouseover="mouseroverNode(key,$event)" 
          @mouseout="ele.isActive = ! ele.isActive" 
          @mousedown="dragNode(key,$event)">
          <rect x="0" y="0" :width="ele.width" :height="ele.height" class="reactClass" :class="{isChoose:ele.isActive}" />
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
    </svg>
  </div>
  </div>
</template>
<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
     position:'translate(50,50)',
     classchoose:false,
     isMarkerShow:false,
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
      xmarkerX1:0,
      xmarkerY1:0,
      xmarkerX2:1000,
      xmarkerY2:0,
      ymarkerX1:0,
      ymarkerY1:0,
      ymarkerX2:0,
      ymarkerY2:500
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
        {x:30,y:10,isActive:false,icon:'\x2a',width:60,height:60,id:66,isLeftConnectShow:false,isRightConnectShow:false},
        {x:100,y:50,isActive:false,icon:'\u270f',width:80,height:60,id:77,isLeftConnectShow:false,isRightConnectShow:false},
        {x:500,y:100,isActive:false,icon:'\ue010',width:60,height:60,id:88,isLeftConnectShow:false,isRightConnectShow:false}
      ],
      connectors:[
        
      ]
     }
    }
  },
  computed:{
  },
  methods:{
    dragNode(key,event){
       let mouseX0 = event.clientX //鼠标点击下的位置
       let mouseY0 = event.clientY
       let CURNODE = this.topoData.nodes[key] //点击的node对象
       let startX = CURNODE.x //节点开始位置
       let startY = CURNODE.y
       let curNodeId = CURNODE.id  //当前结点id
       let nodeW = CURNODE.width  //节点 宽高
       let nodeH = CURNODE.height
       this.isMarkerShow = true
　　　　document.onmousemove = (event) => {
　　　　　　let disX = event.clientX - mouseX0  //移动位置
           let disY = event.clientY - mouseY0
           let endX = startX + disX //最终位置
           let endY = startY + disY
           let n1 = Math.floor(endX / 20)  //grid宽高的整数倍
           let n2 = Math.floor(endY / 20)         
           CURNODE.x = endX
           CURNODE.y = endY
           this.marker.xmarkerY1 = n2 * 20
           this.marker.xmarkerY2 = n2 * 20
           this.marker.ymarkerX1 = n1 * 20
           this.marker.ymarkerX2 = n1 * 20
           //连线移动
           this.topoData.connectors.forEach((item,index) => {
              if(item.sourceNode == curNodeId){ //情况一：sourceNode为鼠标点击的node
                  item.x1 = endX  + nodeW
                  item.y1 = endY + nodeH / 2
              }else if(item.targetNode == curNodeId){//情况二：targetNdoe为鼠标点击的node
                  item.x2 = endX
                  item.y2 = endY + nodeH / 2
              }
           })
　　　　};
　　　　document.onmouseup = () => {　　　　　　           
           document.onmousemove = null
　　　　　　document.onmouseup = null
           this.isMarkerShow = false    //隐藏标尺
           let NodeEndX = this.marker.ymarkerX1  //最终位置为标尺的位置 最终节点位置
           let NodeEndY = this.marker.xmarkerY2
           CURNODE.x = NodeEndX  
           CURNODE.y = NodeEndY
           //连线最终位置
           this.topoData.connectors.forEach((item,index) => {
              if(item.sourceNode == curNodeId){ //情况一：sourceNode为鼠标点击的node
                  item.x1 = NodeEndX + nodeW
                  item.y1 = NodeEndY + nodeH / 2
              }else if(item.targetNode == curNodeId){//情况二：targetNdoe为鼠标点击的node
                  item.x2 = NodeEndX
                  item.y2 = NodeEndY + nodeH / 2
              }
           })
　　　　};
    },
    drawConnectLine(key,event){
      let CONNECTLINE = this.connectingLine //绘制连线对象
      let CURNODE =  this.topoData.nodes[key] //当前点击node
      let nodeW = CURNODE.width //当前node宽高
      let nodeH = CURNODE.height    
      let mouseX0 = event.clientX    
      let mouseY0 = event.clientY
      let x1 = CURNODE.x + nodeW    //连线开始位置为node位置
      let y1 = CURNODE.y + nodeH / 2
      CONNECTLINE.isConnecting = true   //显示绘制连线
      CONNECTLINE.x1 = x1 
      CONNECTLINE.y1 = y1 
      CONNECTLINE.x2 = x1   //连线终点同样赋值为起点值
      CONNECTLINE.y2 = y1
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

        if(CONNECTLINE.endNode){      //正确连线：添加连线信息在connectors中
          //判断是否有已经有连线的情况
          CONNECTORS.forEach((item,index) => {
            if(item.sourceNode == CURNODE.id && item.targetNode == CONNECTLINE.endNode) hasConnected = true
          })
          //未连线情况下增加两者连线
          if(!hasConnected){
            let connector = {
              x1: CONNECTLINE.x1,
              y1: CONNECTLINE.y1,
              x2: CONNECTLINE.x2,  //待优化
              y2: CONNECTLINE.y2,
              sourceNode:CURNODE.id,
              targetNode:CONNECTLINE.endNode
            }
            CURNODE.isRightConnectShow = true
            this.topoData.nodes.forEach((item,key) => {
              if(item.id == CONNECTLINE.endNode) item.isLeftConnectShow = true
            })
            CONNECTORS.push(connector)
          }         
        }else{
          CURNODE.isRightConnectShow = true     //连线失败：起点右侧箭头消失
        }
        CONNECTLINE.isConnecting = false

      }
    },
    mouseroverNode(key,event){
      this.topoData.nodes[key].isActive = true
      this.marker.xmarkerY1 = this.topoData.nodes[key].y
      this.marker.xmarkerY2 = this.topoData.nodes[key].y
      this.marker.ymarkerX1 = this.topoData.nodes[key].x
      this.marker.ymarkerX2 = this.topoData.nodes[key].x
    },
    getConnectLine(key){
      this.connectingLine.endNode = this.topoData.nodes[key].id 
    },
    mouseoutLeftConnector(key){
      this.connectingLine.endNode = ''
    }
    
  },
  mounted(){
    
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#topo-wrap{width:1000px;height:500px;margin:0 auto;}
#topo-svg{width:100%;height:100%;border:1px solid #333;}
.reactClass{stroke-width:1;stroke:rgb(0,0,0);fill:#fff;cursor: default;}
.isChoose{stroke:red;stroke-width:2;}
.marker{stroke:#3d7ed5;stroke-width:2;display: none;}
.isMarkerShow{display: block;}
.fontIcon{font-family:FontAwesome;font-size:50px;cursor: default;} 
.connectorArror{display: none;}
.nodesG:hover .connectorArror{display: block}
.connector{display: block;}
</style>
