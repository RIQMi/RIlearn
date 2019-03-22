Shopping
==============
## 功能
--------------
	购物车

## 期间遇到的问题及解决方法
--------------

- 计算单品总金额时显示NaN错误<br/>
	通过谷歌调试器consloe.log分别调用数量和单价查看是否有误，发现单价带有符号¥导致运算中产生错误。<br/>
	通过正则表达式对金额进行转换<br/>
- 计算总金额时调用函数页面没有变化<br/>
	对全选框之外的所有checkbox设定name=“check”，在调用price和nums时，因为位于店铺前面的checkbox不具有这些属性，导致错误。函数无法实现。<br/>
	查询资料发现除了class和name还可以对标签自定义属性，通过自定义属性仅调用商品，从而实现函数。<br/>

## 总结 
--------------

	通过这次项目，更加一步掌握了Flex弹性盒子布局，JS对DOM的增删改查。<br/>
	学会利用谷歌调试器寻找错误并进行调试。