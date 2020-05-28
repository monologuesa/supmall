// pages/fail/fail.js
Page({
  data: {
     index_data:'',//获取数据
     batchcode:'',//商品订单
     imageUrl:'',//域名
  },
  onLoad: function (options) {
    var that = this;
    that.setData({ batchcode: options.batchcode, imageUrl:getApp().openidData.urls})
    getdata(that);
  },
  //跳转到商品详情
  jump: function (e) {
    var that = this;
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/shop/shop?id=' + id,
    })
  },
})
//获取订单详情
function getdata(that) {
  wx.request({
    url: getApp().openidData.url + 'get_goods_details.php',
    data: {
      batchcode: that.data.batchcode
    },
    method: 'POST',
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    success: function (res) {
      console.log(res.data);
      that.setData({
        index_data: res.data,
      })
    }
  })

}
