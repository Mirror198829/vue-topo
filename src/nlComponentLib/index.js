/*
 * @Author: caojing 
 * @Date: 2018-10-23 11:25:17 
 * @Last Modified by: caojing
 * @Last Modified time: 2018-10-23 11:38:20
 */
import Vue from 'vue'
import nlPageTitle from './components/nlPageTitle';
import nlButton from './components/nlButton';
export default (Vue)=>{
    Vue.component("nlPageTitle",nlPageTitle);
    Vue.component("nlButton",nlButton)
}