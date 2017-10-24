<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
.clearfix{ zoom:1;}
.clearfix:after{ content:''; display:block; clear:both;}
*{margin:0;padding:0;}
ul,li{list-style: none;}
</style>
