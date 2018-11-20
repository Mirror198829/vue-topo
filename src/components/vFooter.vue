<template>
  <footer id="footer">
  	<div class="foot-txt">
      <a href="https://github.com/Mirror198829" target="_blank">
      江苏南京 前端开发工程师 曹静
      </a>
    </div>
  	<div class="foot-txt">
      <a href="https://github.com/Mirror198829/vue-topo" target="_blank">
      Github：https://github.com/Mirror198829/vue-topo
      </a>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'footer',
  data () {
    return {
     
    }
  }
}
</script>
<style scoped lang="less">
@import '../less/index.less';
#footer{height:84px;background-color: @theme-color;color:@theme-font-color;text-align: center;font-size: 13px;display: flex;flex-direction: column;justify-content: center;}
.foot-txt{-webkit-user-select:none;user-select:none;
  a{color:@theme-font-color;text-decoration: none;}
  &:first-child{margin-bottom:5px;}
}
</style>