# vue2.0拓扑组件
## demo演示地址
https://mirror198829.github.io/vue2-topo-exhibition
## 序
2016年9月接到html5替换flash的拓扑图任务，历时3月整，使用jquery+SVG技术完成第一款拓扑图组件，涵盖拖拽、缩放、删除、选中区域、连线、导入、保存图片、多种布局显示等功能，但当node数高达百位时，因dom的操作，出现了非常可怕的性能问题。<br/>
2017年10月20日，因新公司项目需要，果断决定结合当下流行的VUE2.0框架 + SVG技术 重写拓扑组件，并将此开源，希望大家多提意见
## 技术选型
* VUE2.0
* SVG
## 功能
1. toolbar的拖拽
2. 连线关系
3. 包含关系（单层，多层嵌套）
4. 删除单节点
5. 删除节点间连线及包含关系
6. 框选多选删除功能
7. svg的viewbox的移动功能
## usage
```
npm install
```
```
npm run dev
```
## 说明
代码开源，欢迎码农们提出宝贵意见，bug请提issues，本人将及时修改。最后请大家注明引用地址：https://github.com/Mirror198829/vue-topo
