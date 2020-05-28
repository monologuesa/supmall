// pages/shopDetail/shopDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

    batchcode: '',//商品的订单号
    idnex_data: '',//获取数据列表
    imageUrl: '',//图片地址
    price: '',//总价
  },

  onLoad: function (options) {
    var that = this;
    that.setData({
      batchcode: options.batchcode,//商品的订单号
      imageUrl: getApp().openidData.urls,
    })
    getdata(that.data.batchcode,that);
  },
  //售后按钮的查看订单
  look: function (e) {
    var that = this;
    wx.navigateTo({
      url: '/pages/fail/fail?batchcode=' + that.data.batchcode,
    })
  },
  // //取消订单
  // cancel: function () {
  //   var that = this;
  //   wx.showModal({
  //     title: '提示',
  //     content: '取消订单之后无法恢复，请慎重考虑',
  //     success: function (res) {
  //       wx.request({
  //         url: 'https://youte.xmtzxm.com.cn/weixinpl/mshop/orderlist_operation.php',
  //         data: {
  //           batchcode: that.data.batchcode,
  //           user_id: getApp().openidData.user_id,
  //           op: 'cancel',
  //         },
  //         method: 'GET',
  //         header: {
  //           "Content-Type": "application/x-www-form-urlencoded"
  //         },
  //         success: function (res) {
  //           if (res.data) {
  //             wx.showToast({
  //               title: '成功',
  //               icon: 'success',
  //               duration: 2000
  //             })
  //             getdata(that, that.data.type);
  //           }
  //         }
  //       })
  //     },
  //     fail: function (res) {
  //       console.log('用户点击了取消，这里点击的是取消订单的取消')
  //     },
  //   })

  // },



})
//获取订单详情
function getdata(batchcode,that) {
  wx.request({
    url: getApp().openidData.url + 'get_goods_details.php',
    data: {
      batchcode:batchcode
    },
    method: 'POST',
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    success: function (res) {
      console.log(res.data);
      let price = Number(res.data.price) + Number(res.data.ExpressPrice)
      that.setData({
        index_data: res.data,
        price: price
      })
    }
  })

}
