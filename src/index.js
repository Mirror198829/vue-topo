/*
 * @Author: caojing
 * @Date: 2018-11-26 16:53:12
 * @LastEditors: caojing
 * @LastEditTime: 2018-11-26 16:53:15
 * @Description: 用于vue-topo上传到npm
 */
import VueTopo from './components/vTopo/vTopo'
const vueTopo={
  install:function (Vue) {
    Vue.component('vueTopo',VueTopo)
  }
};
// 这里的判断很重要
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(vueTopo)
}
export default vueTopo
