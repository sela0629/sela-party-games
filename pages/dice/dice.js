//获取应用实例
var app = getApp();
function getRandomData(me) {
    var pos_1 =Math.ceil(Math.random()*6),
        pos_2 =Math.ceil(Math.random()*6),
        pos_3 =Math.ceil(Math.random()*6),
        pos_4 =Math.ceil(Math.random()*6),
        pos_5 =Math.ceil(Math.random()*6),
        totalCount = pos_1+pos_2+pos_3+pos_4+pos_5;
    //在此处加个旋转小动画
    var arrDiceRotate = ['t','s','e'];
    var diceRotateTimer = setInterval(function(){
        me.setData({
            pos_1  : 'dice_'+arrDiceRotate[Math.ceil(Math.random()*3)-1],
            pos_2  : 'dice_'+arrDiceRotate[Math.ceil(Math.random()*3)-1],
            pos_3  : 'dice_'+arrDiceRotate[Math.ceil(Math.random()*3)-1],
            pos_4  : 'dice_'+arrDiceRotate[Math.ceil(Math.random()*3)-1],
            pos_5  : 'dice_'+arrDiceRotate[Math.ceil(Math.random()*3)-1]
        });
    },100);
    //随机色子数
    setTimeout(function(){
      clearInterval(diceRotateTimer);
                me.setData({
            pos_1  : 'dice_'+pos_1,
            pos_2  : 'dice_'+pos_2,
            pos_3  : 'dice_'+pos_3,
            pos_4  : 'dice_'+pos_4,
            pos_5  : 'dice_'+pos_5,
            totalCount : totalCount
    });
        me.audioCtx.pause();
    },1500);
}
Page({
  data: {
    motto: 'Hello World',
    onHide : true,
      lastUpdate: 0,
      totalCount : '',
      pos_1  : 'dice_1',
      pos_2  : 'dice_2',
      pos_3  : 'dice_3',
      pos_4  : 'dice_4',
      pos_5  : 'dice_5',
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
  },
    onShareAppMessage: function () {
        return {
            title: '摇一摇投色子~',
            success: function(res) {
                // 分享成功
            },
            fail: function(res) {
                // 分享失败
            }
        }
    }
})
