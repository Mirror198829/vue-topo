<template>
  <footer id="footer">
  	<div class="foot-txt">江苏南京 前端开发工程师 曹静</div>
  	<div class="foot-txt">
      <a href="https://github.com/Mirror198829" target="_blank">
      Github：https://github.com/Mirror198829
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
#footer{padding:20px;background-color: @theme-color;color:@theme-font-color;text-align: center;font-size: 13px;}
.foot-txt{margin-bottom:5px;-webkit-user-select:none;user-select:none;
  a{color:#fff;}
}
</style>