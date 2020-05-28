// pages/integral/integral.js
Page({

  data: {
    index_data:'',//获取数据
    imageUrl:'',//你知道的
  },
  onLoad: function (options) {
    var that = this;
    that.setData({ imageUrl:getApp().openidData.urls })
    getdata(that);
  },
  jump:function(e){
   var that = this;
   let id = e.currentTarget.dataset.id;
   wx.navigateTo({
     url: '/pages/shop/shop?id=' + id,
   })
  },
  //签到记录
  click:function(){
    wx:wx.navigateTo({
      url: '/pages/check/check',
    })
  },
  //签到
  check:function(){
    var that =this ;
    wx.request({
      url: getApp().openidData.url + 'add_sign_in.php',
      data: {
        user_id: getApp().openidData.user_id,//用户id
        // user_id:3063,
        customer_id:getApp().openidData.customer_id,
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        if (res.data.status == 1){
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            success: function(re) {
              if(re.confirm){
                getdata(that)
              }else if(re.cancel){
                console.log('用户点击了取消')
              }
            },
          })
        } else if (res.data.status == 2){
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            success: function (re) {
              if (re.confirm) {
                console.log('用户点击了确认')
                getdata(that)
              } else if (re.cancel) {
                console.log('用户点击了取消')
              }
            },
          })
        }
      }
    })
  },
})
//获取数据
function getdata(that) {
  wx.request({
    url: getApp().openidData.url + 'user_sign_in.php',
    data: {
      user_id: getApp().openidData.user_id,//用户id
      // user_id: 3063,
    },
    method: 'POST',
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    success: function (res) {
      that.setData({
        index_data: res.data
      })
    }
  })
}