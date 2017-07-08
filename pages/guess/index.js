//获取应用实例
var app = getApp()

Page({
  data:{
    userInfo : {},
    bgImg : '',
    arrContext : [],
    pen : 3, //画笔粗细默认值
    color : '#cc0033' //画笔颜色默认值
  },
  startX: 0, //保存X坐标轴变量
  startY: 0, //保存X坐标轴变量
  isClear : false, //是否启用橡皮擦标记
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
  },
  //手指触摸动作开始
  touchStart: function (e) {
      //得到触摸点的坐标
      this.startX = e.changedTouches[0].x
      this.startY = e.changedTouches[0].y
      this.context = wx.createContext()

      if(this.isClear){ //判断是否启用的橡皮擦功能  ture表示清除  false表示画画
         this.context.setStrokeStyle('#F8F8F8') //设置线条样式 此处设置为画布的背景颜色  橡皮擦原理就是：利用擦过的地方被填充为画布的背景颜色一致 从而达到橡皮擦的效果
         this.context.setLineCap('round') //设置线条端点的样式
         this.context.setLineJoin('round') //设置两线相交处的样式
         this.context.setLineWidth(20) //设置线条宽度
         this.context.save();  //保存当前坐标轴的缩放、旋转、平移信息
         this.context.beginPath() //开始一个路径
         this.context.arc(this.startX,this.startY,5,0,2*Math.PI,true);  //添加一个弧形路径到当前路径，顺时针绘制  这里总共画了360度  也就是一个圆形
         this.context.fill();  //对当前路径进行填充
         this.context.restore();  //恢复之前保存过的坐标轴的缩放、旋转、平移信息
      }else{
         this.context.setStrokeStyle(this.data.color)
         this.context.setLineWidth(this.data.pen)
         this.context.setLineCap('round') // 让线条圆润
         this.context.beginPath()

      }
  },
  //手指触摸后移动
  touchMove: function (e) {

      var startX1 = e.changedTouches[0].x
      var startY1 = e.changedTouches[0].y

      if(this.isClear){ //判断是否启用的橡皮擦功能  ture表示清除  false表示画画

        this.context.save();  //保存当前坐标轴的缩放、旋转、平移信息
        this.context.moveTo(this.startX,this.startY);  //把路径移动到画布中的指定点，但不创建线条
        this.context.lineTo(startX1,startY1);  //添加一个新点，然后在画布中创建从该点到最后指定点的线条
        this.context.stroke();  //对当前路径进行描边
        this.context.restore()  //恢复之前保存过的坐标轴的缩放、旋转、平移信息

        this.startX = startX1;
        this.startY = startY1;

      }else{
        this.context.moveTo(this.startX, this.startY)
        this.context.lineTo(startX1, startY1)
        this.context.stroke()

        this.startX = startX1;
        this.startY = startY1;

      }
      //只是一个记录方法调用的容器，用于生成记录绘制行为的actions数组。context跟<canvas/>不存在对应关系，一个context生成画布的绘制动作数组可以应用于多个<canvas/>

      wx.drawCanvas({
         canvasId: 'myCanvas',
         reserve: true,
         actions: this.context.getActions() // 获取绘图动作数组
      })
  },
  //手指触摸动作结束
  touchEnd: function () {

  },
  //启动橡皮擦方法
  clearCanvas: function(){
    console.log('橡皮擦')
      if(this.isClear){
        this.isClear = false;
      }else{
        this.isClear = true;
      }
  },
  penSelect: function(e){ //更改画笔大小的方法
      console.log('更改画笔大小')
    console.log(e.currentTarget);
    this.setData({pen:parseInt(e.currentTarget.dataset.param)});
    this.isClear = false;
  },
  colorSelect: function(e){ //更改画笔颜色的方法
    console.log('更改画笔颜色')
    console.log(e.currentTarget);
    this.setData({color:e.currentTarget.dataset.param});
    this.isClear = false;
  },
  // 保存图片-上传到服务器
  saveImg : function(){
     let me = this;
    console.log("保存图片")
    wx.canvasToTempFilePath({
    // x: 100,
    // y: 200,
    // width: 375,
    // height: 500,
    // destWidth: 100,
    // destHeight: 100,
    canvasId: 'myCanvas',
    success: function(res) {
      console.log(res.tempFilePath)
      // /live/upload/wxapp_image_upload
      //上传到服务器
                wx.uploadFile({
                    url: 'https://wx425b266532349551.mgeek.com.cn/live/upload/wxapp_image_upload', //仅为示例，非真实的接口地址
                    filePath: res.tempFilePath,
                    name: 'image',//文件对应的 key , 开发者在服务器端通过这个 key 可以获取到文件二进制内容
                    formData:{},
                    success: function(res){
                        wx.hideToast();
                        let imgInfo = JSON.parse(res.data);
                        let accessUrl = imgInfo.data.accessUrl;
                        if(accessUrl != undefined){
                            me.setData({
                                "bgImg" : 'https:'+accessUrl
                            })
                        }
                    },
                    fail: function(res){
                        wx.showToast({
                            title: '上传失败！',
                            icon: 'loading',
                            duration: 3000
                        });
                    }
                })
    },
    complete: function(res) {
      console.log(res)
    }
  })
},
// 保存上下文
  saveContext : function(){

  },
    onShareAppMessage: function (res) {
      console.log(res)
   if (typeof(res) != 'undefined' && typeof(res.from) != 'undefined' && res.from === 'button') {
     // 来自页面内转发按钮
     console.log(res.target)
   }
   return {
     title: '我已使出洪荒之力作画，快来猜猜画的啥！',
     success: function(res) {
       // 转发成功
     },
     fail: function(res) {
       // 转发失败
     }
   }
 }
})
