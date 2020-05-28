
Page({
  data: {
    index_data: '',//获取数据
    imageUrl: '',//照片前缀
  },
  onLoad: function (options) {
    var that = this;
    that.setData({
      imageUrl: getApp().openidData.urls
    })
    getdata(that);
  },
  //点击跳转
  info: function (e) {
    var that = this;
    let id = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: '/pages/shop/shop?id=' + id,
      })
  },
})
//获取数据
function getdata(that) {
  wx.request({
    url: getApp().openidData.url + 'optimize_specialty.php',
    data: {
      // customer_id: getApp().openidData.customer_id,
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