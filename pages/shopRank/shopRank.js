// pages/rank/rank.js
Page({
  data: {
    index_data: '',//获取数据
    imageUrl: '',//我相信你明白的
    name: '微信支付',
  },
  onLoad: function (options) {
    var that = this;
    that.setData({ imageUrl: getApp().openidData.urls })
    getdata(that);
  },
  //点击跳转店铺刷新
  // rank: function () {
  //   wx.navigateTo({
  //     url: '/pages/shopRank/shopRM/shopRM?name=' + this.data.name,
  //   })
  // },
  //点击店铺跳转店铺详情
  jump: function (e) {
    var that = this;
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/shopRank/shopRM/shopRM?id=' + id + '&name=' + this.data.name,
    })
  },
})
//获取数据
function getdata(that) {
  wx.request({
    url: getApp().openidData.url + 'shop_goods.php',
    data: {
      user_id: getApp().openidData.user_id
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