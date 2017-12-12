<template>
  <footer id="footer">
  	<div class="foot-txt">江苏省南京市</div>
  	<div class="foot-txt">Github：https://github.com/Mirror198829</a></div>
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
#footer{padding:20px;background-color: @theme-color;color:@theme-font-color;text-align: center;font-size: 12px;}
.foot-txt{margin-bottom:5px;-webkit-user-select:none;user-select:none;}
</style>