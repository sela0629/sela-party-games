//获取应用实例
var app = getApp()
var underCoverData = app.globalData.underCoverData;
var underCoverDataLength = underCoverData.length;
//1.翻转动画
//2.第一位点击翻牌，
// 1）随机一个题目。（词库随机）2）并随机一个卧底词并记录。（所抽词随机）3）随机一个卧底编号（1~参与人数）
//3.当前编号非卧底编号，则展示平民词汇。
function _handleCard(me) {
    if (me.data.nowNo == 1) {//第一个时就是确定词汇
        var underCoverRandom = underCoverData[Math.ceil(Math.random() * (underCoverDataLength - 1))],
            arrUnderCover = underCoverRandom.split('-'),
            underCoverIndex = Math.ceil(Math.random() * (arrUnderCover.length - 1)),
            //卧底词汇
            underCover = arrUnderCover[underCoverIndex],
            //平民词汇
            commoner = arrUnderCover[(underCoverIndex == 1) ? 0 : 1],
            //卧底编号 Math.random为0~1 编号从1开始，故先减一再加一
            underCoverNo = Math.ceil(Math.random() * (me.data.memberCount-1))+1;
        me.setData({
            'objGameInfo.underCover': underCover,
            'objGameInfo.commoner': commoner,
            'objGameInfo.underCoverNo': underCoverNo
        });

    } else {//其他只需展示即可

    }
}
Page({
    data: {
        contentState: 0, //0 初始状态 1 请翻牌
        memberCount: '',//参与人数
        nowNo: 0,//当前是第几位用户
        isRotate : 1,//是否为点击翻牌 1 是 2 请点击后交给下一位
        coverState: 'cover-state',//是否添加一个遮盖
        nextCardBtnTxt : '请传递给下一位',
        cardRotateAnimation : '',//card-rotate-animation
        gameTxt : '',
        objGameInfo: {
            underCover: '',//卧底词汇
            commoner: '',//平民词汇
            underCoverNo: ''//卧底编号
        }
    },
    //请交给下一位
    nextCart : function(){
        var me = this;
        if(me.data.nowNo == me.data.memberCount){
            wx.redirectTo({
                url: '/pages/under_cover/under_cover'
            })
        }
        me.setData({
            'coverState' : 'cover-state',
            'isRotate' : 1,
            'gameTxt' : '',
            'cardRotateAnimation' : '',
            'nowNo' : me.data.nowNo+1
        });
    },
    //点击翻牌
    //1.isRotate = 2
    rotateCard : function(){
        try{
            var me = this;
            //cardRotateAnimation
            //先移除下才有动画

            me.setData({
                'cardRotateAnimation' : 'card-rotate-animation'
            });
            var gameTxt = me.data.objGameInfo.commoner;
            if(me.data.nowNo == me.data.objGameInfo.underCoverNo){
                gameTxt = me.data.objGameInfo.underCover
            }
            //如果当前no为最后一个，传递完毕~
            var nextCardBtnTxt = "请传递给下一位";
            if(me.data.nowNo == me.data.memberCount){
                nextCardBtnTxt = '传递完毕~'
            }
            setTimeout(function(){
                me.setData({
                    'coverState' : '',
                    'isRotate' : 2,
                    'nextCardBtnTxt' : nextCardBtnTxt,
                    'gameTxt' : gameTxt
                });
            },1000);
        }catch (e){
            wx.showToast({
                title: '请清空重来~',
                icon: 'loading',
                duration: 1000
            });
            console.dir(e);
        }

    },
    inputMemberCount: function (e) {
        var me = this;
        var num = e.detail.value;
        me.setData({
            'memberCount': num
        });
    },
    startGame: function () {
        var me = this;
        if(me.checkMemberCount()){
            //进入第一题
            me.setData({
                'contentState': 1,
                'nowNo': 1
            });
            _handleCard(me);
        }
    },
    checkMemberCount: function () {
        var me = this;
        var num = parseInt(me.data.memberCount);
        var nextFlag = true;
        if (isNaN(num)) {
            wx.showToast({
                title: '请输入参与人数',
                icon: 'loading',
                duration: 1000
            });
            num = '';
            nextFlag = false;
        } else {
            if (num > 12 || num < 3) {
                wx.showToast({
                    title: '请输入3~12的数字',
                    icon: 'loading',
                    duration: 1000
                });
                num = '';
                nextFlag = false;
            }
        }
        me.setData({
            'memberCount': num
        });
        return nextFlag;
    },
    onLoad: function () {
    },
    onShareAppMessage: function () {
        return {
            title: '谁是卧底~',
            success: function (res) {
                // 分享成功
            },
            fail: function (res) {
                // 分享失败
            }
        }
    }
})
