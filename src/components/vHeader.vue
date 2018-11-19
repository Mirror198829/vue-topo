<template>
  <header id="header">
  	<span>Vue2.0拓扑组件</span>
  </header>
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

<style lang="less" scoped>
@import '../less/index.less';
 #header{height:50px;background-color: @theme-color;color:@theme-font-color;padding:0 20px;display: flex;align-items: center;}
</style>
