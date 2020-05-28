// pages/check/check.js
Page({

  data: {
    index_data:'',//获取数据
  },


  onLoad: function (options) {
   var that = this;
    getdata(that)
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