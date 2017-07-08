//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    userInfo: {}
  },
  hopeTip : function(){
      wx.showToast({
          title: '好玩的还好在后头~',
          icon: 'loading',
          duration: 1000
      });
  },
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
    onShareAppMessage: function () {
        return {
            title: '聚会party无忧~',
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
