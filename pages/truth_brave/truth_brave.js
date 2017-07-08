//获取应用实例
var app = getApp()
var truthBraveData = app.globalData.truthBraveData;
var expressionData = truthBraveData.expressionData;
var expressionDataLength = expressionData.length;
var actionData = truthBraveData.actionData;
var actionDataLength = actionData.length;
function getRandomData(me) {
    //Math.ceil(Math.random()*max);
    var expressionRandom = expressionData[Math.ceil(Math.random()*(expressionDataLength-1))];
    var actionRandom = actionData[Math.ceil(Math.random()*(actionDataLength-1))];
    console.log('表情随机'+expressionRandom);
    me.setData({
        expression : expressionRandom,
        action : actionRandom
    });
}
Page({
  data: {
    motto: 'Hello World',
    onHide : true,
      lastUpdate: 0,
      expression : '',
      action : '',
      hide : 0
  },
    onReady: function (e) {
        // 使用 wx.createAudioContext 获取 audio 上下文 context
        this.audioCtx = wx.createAudioContext('myAudio')
    },
    onHide: function() {
        //当前页面处于onHide状态
        this.setData({onHide: true})
    },
    onShow: function() {
        //重力监测
        var tag = true
        var index = 0
        var me = this;
        //当前页面状态属于onShow,所以onHide为false
        me.setData({onHide: false})
        wx.onAccelerometerChange(function(res){
            //如果不再当前页面，直接返回
//            console.log(res)
            if(me.data.onHide === true) {
                return
            }
            var currentTime = new Date().getTime()
            var SHAKE_THRESHOLD = app.globalData.sensitivity;
            var lastUpdate = me.data.lastUpdate
            if ((currentTime - lastUpdate) > 100) {
                var diffTime = currentTime - lastUpdate;
                var speed = Math.abs(res.x + res.y + res.z - me.data.lastX - me.data.lastY - me.data.lastZ) / diffTime * 10000;

                if(speed > SHAKE_THRESHOLD && tag) {
                    tag = false
                    //用户摇一摇后的代码逻辑
                    //...
                    me.setData({
                        hide : 'hide'
                    });
                    setTimeout(function(){
                        me.setData({
                            hide : ''
                        });
                    }, 300)
                    me.audioCtx.play();
                    getRandomData(me);
                    console.log("摇一摇~");
                    setTimeout(function(){
                        tag = true;
                }, 800)
            }
        }
            me.setData({
            lastX: res.x,
            lastY: res.y,
            lastZ: res.z,
            lastUpdate: currentTime
        });
});
},
  onLoad: function () {
//    console.log('onLoad')
//    var that = this
//    //调用应用实例的方法获取全局数据
//    app.getUserInfo(function(userInfo){
//      //更新数据
//      that.setData({
//        userInfo:userInfo
//      })
//    })
  },
    onShareAppMessage: function () {
        return {
            title: '摇一摇真心话大冒险~',
//            path: '/page/user?id=123',
            success: function(res) {
                // 分享成功
            },
            fail: function(res) {
                // 分享失败
            }
        }
    }
})
