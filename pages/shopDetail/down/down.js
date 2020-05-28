// pages/shopDetail/shopDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

    batchcode: '',//商品的订单号
    idnex_data: '',//获取数据列表
    imageUrl: '',//图片地址
    sort:'',//判断从哪里进来的 0是我的订单  1 是商家管理的订单
  },

  onLoad: function (options) {
    var that = this;
    that.setData({
      sort:options.sort,
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
    let totalprice = e.currentTarget.dataset.totalprice;
    let batchcode = e.currentTarget.dataset.batchcode;
    wx.redirectTo({
      url: '/pages/refund/refund?totalprice=' + totalprice + '&batchcode=' + batchcode + '&gettype=6',
    })
  },
  //删除
  updete: function (e) {
    var that = this;
    let id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '是否删除订单，删除订单之后无法恢复',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: 'https://youte.xmtzxm.com.cn/weixinpl/mshop/orderlist_operation.php',
            data: {
              batchcode: id,
              user_id: getApp().openidData.user_id,
              op: 'order_update',
            },
            method: 'GET',
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
              if (res.data) {
                wx.showToast({
                  title: '成功',
                  icon: 'success',
                  duration: 2000
                })
                getdata(that, that.data.type);
              }
            }
          })
        } else if (res.cancel) {
          console.log('用户点击了删除订单的取消按钮')
        }
      },
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
