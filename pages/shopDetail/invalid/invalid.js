// pages/shopDetail/shopDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

    batchcode: '',//商品的订单号
    idnex_data: '',//获取数据列表
    imageUrl: '',//图片地址
  },

  onLoad: function (options) {
    var that = this;
    that.setData({
      batchcode: options.batchcode,
      imageUrl: getApp().openidData.urls,
    })
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
  //申请售后
  aftersale: function (e) {
    var that = this;
    let totalprice = e.currentTarget.dataset.totalprice;//价格
    let batchcode = e.currentTarget.dataset.batchcode//订单号
    wx.redirectTo({
      url: '/pages/refund/refund?totalprice=' + totalprice + '&batchcode=' + batchcode + '&gettype=' + that.data.gettype,
    })
  },
  //立即评价
  discuss: function (e) {
    console.log(e)
    let that = this;
    let batchcode = e.currentTarget.dataset.batchcode;
    wx.redirectTo({
      url: '/pages/post/post?batchcode=' + that.data.batchcode,
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
        index_data: res.data
      })
    }
  })

}
