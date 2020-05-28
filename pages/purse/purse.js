// pages/purse/purse.js
Page({

  data: {
     hide:false,//全部账户的隐藏
     check:false,//我的零钱
     check_1:false,//我的积分
     index:'',//判断是零钱还是积分

  },
  onLoad: function (options) {
     var that = this;
     that.setData({ index:options.index })
     getdata(that)
  },
  //开启遮罩,全部账户
  day:function(){
    var that = this;
    that.setData({
      hide:true
    })
  },
  //开启遮罩
  showModal: function () {
    let that = this;
    if (that.data.disabled) {
      // 显示遮罩层
      var animation = wx.createAnimation({
        duration: 200,
        timingFunction: "linear",
        delay: 0
      })
      this.animation = animation
      animation.translateY(300).step()
      this.setData({
        animationData: animation.export(),
        hide: true
      })
      setTimeout(function () {
        animation.translateY(300).step()
        this.setData({
          animationData: animation.export()
        })
      }.bind(this), 2000)
    }
  },
  //隐藏购物车
  hideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        hide: false
      })
    }.bind(this), 200)
  },
  //点击切换
  my:function(e){
    let that = this;
    let index = e.currentTarget.dataset.index;
    that.setData({ index:index })
    console.log(that.data.index);
    if( index == 1 ){
      that.setData({ check: true, check_1:false })
      getdata(that)
    }else{
      that.setData({ check_1: true , check:false })
      getdata(that)
    }
    
  },
  //跳转到提现
  money:function(){
    wx.redirectTo({
      url: '/pages/money/money?index=3',
    })
  },

});
function getdata(that) {
  wx.request({
    url: getApp().openidData.url + 'get_user_data.php',
    data: {
      user_id: getApp().openidData.user_id,//用户id
      // user_id:3063,
    },
    method: 'POST',
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    success: function (res) {
      that.setData({
        index_data: res.data,
      })
    }
  })
}
