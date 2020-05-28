// pages/inf/inf.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    reason:'',//驳回理由
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      reason:options.reason
    })
    wx.request({
      url: getApp().openidData.url + 'get_update.php',
      data: {
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        wx.setNavigationBarTitle({
          title: res.data.msg
        })
      }
    })
  },
  again:function(){
    wx.redirectTo({
      url: '/pages/in/in?type=2',
    })
  }
})