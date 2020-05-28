// pages/ins/ins.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.request({
      url: getApp().openidData.url + 'get_update.php',
      data: {
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success:function(res){
        wx.setNavigationBarTitle({
          title: res.data.msg
        })
      }
    })
  },
  //点击返回个人中心
  again:function(){
    wx.switchTab({
      url: '/pages/person/person',
    })
  },
  //点击返回商家管理
  manage:function(){
   wx.redirectTo({
     url: '/pages/management/management',
   })
  },
})