# cubic-parametric-spline

三次参数样条函数，在三次样条函数基础上可以适应非递进式数据

## installation

```sh
npm install cubic-parametric-spline
```

## usage

```js
import SPLINE from "cubic-parametric-spline"

const p = [[0,0],[0,2],[3,2]];//点集合
const p_ =[[-1,1],[],[2,-1]];//端点矢切，只对两端提供，中间点对应位空数组

// new a Spline object
const spline = new SPLINE(p, p_);

// 通过输入参数（指和点i距离为t的坐标）获取曲线上某一点
spline.caculate_point(i,t)

// 以1为间隔得到曲线上的诸点,方便绘制曲线
spline.grasp_sample();
console.log(spline.samples_s)