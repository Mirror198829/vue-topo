<template>
  <div>
  <div id="topo-wrap">
    <svg id="topo-svg">
      <defs>
        <pattern id="Pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
          <line :x1="ele.x1" :x2="ele.x2" :y1="ele.y1" :y2="ele.y2" :stroke="ele.color" :stroke-width="ele.strokeWidth" :opacity="ele.opacity" v-for="(ele,key) in gridData"></line>
        </pattern>
      </defs>
      <g>
        <rect fill="url(#Pattern)" width="100%" height="100%" />
        <line :class="{isMarkerShow:isMarkerShow}" id="xmarker" class="marker" :x1="marker.xmarkerX1" :y1="marker.xmarkerY1" :x2="marker.xmarkerX2" :y2="marker.xmarkerY2"></line>
        <line :class="{isMarkerShow:isMarkerShow}" id="ymarker" class="marker" :x1="marker.ymarkerX1" :y1="marker.ymarkerY1" :x2="marker.ymarkerX2" :y2="marker.ymarkerY2"></line>
        <rect v-for="(ele,key) in topoData" width="100" height="100" :x="ele.x" :y="ele.y" :key="key" class="reactClass" :class="{isChoose:ele.isActive}" @mouseover="ele.isActive = ! ele.isActive" @mouseout="ele.isActive = ! ele.isActive" @mousedown="drag(key,$event)"/>
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
     classchoose:false,
     isMarkerShow:false,
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
     topoData:[
      {x:30,y:10,isActive:false},
      {x:100,y:50,isActive:false},
      {x:500,y:100,isActive:false}
     ]
    }
  },
  methods:{
    drag(key,event){
      console.log(event)
       let mouseX0 = event.clientX
       let mouseY0 = event.clientY
       let x0 = this.topoData[key].x
       let y0 = this.topoData[key].y
       this.isMarkerShow = true
　　　　document.onmousemove = (event) => {
　　　　　　let disX = event.clientX - mouseX0
           let disY = event.clientY - mouseY0
           let x1 = x0 + disX
           let y1 = y0 + disY
           let n1 = Math.floor(x1 / 20)  
           let n2 = Math.floor(y1 / 20)         
           this.topoData[key].x = x1
           this.topoData[key].y = y1
           this.marker.xmarkerY1 = n2 * 20
           this.marker.xmarkerY2 = n2 * 20
           this.marker.ymarkerX1 = n1 * 20
           this.marker.ymarkerX2 = n1 * 20
　　　　};
　　　　document.onmouseup = () => {　　　　　　           
           document.onmousemove = null;
　　　　　　document.onmouseup = null;
           this.isMarkerShow = false
           this.topoData[key].x = this.marker.ymarkerX1
           this.topoData[key].y = this.marker.xmarkerY2
　　　　};
    },
  },
  mounted(){
    
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#topo-wrap{width:1000px;height:500px;margin:0 auto;}
#topo-svg{width:100%;height:100%;border:1px solid #333;}
.reactClass{stroke-width:1;stroke:rgb(0,0,0);fill:#fff;}
.isChoose{stroke:red;stroke-width:2;}
.marker{stroke:#3d7ed5;stroke-width:2;display: none;}
.isMarkerShow{display: block;}
</style>
