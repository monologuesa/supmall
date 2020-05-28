// pages/shopDetail/shopDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    gettype: '',//判断是 2 待发货，还是 3待收货的 
    batchcode: '',//商品的订单号
    idnex_data: '',//获取数据列表
    imageUrl: '',//图片地址
    sort:'',//判断从哪里进来的  0 是我的订单点击进来的  1 是商家订单管理进来的
  },

  onLoad: function (options) {
    var that = this;
    that.setData({
      sort:options.sort,
      batchcode: options.batchcode,
      imageUrl: getApp().openidData.urls,
    })
    if(that.data.sort == 0){
      that.setData({
        gettype: options.gettype,
      })
    }else{
    console.log('这是商家订单点击进来的')
    }
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
  //提醒发货
  remind: function (e) {
    var that = this;
    let id = e.currentTarget.dataset.id;
    wx.request({
      url: 'https://youte.xmtzxm.com.cn/weixinpl/mshop/orderlist_operation.php',
      data: {
        batchcode: id,
        user_id: getApp().openidData.user_id,
        op: 'remind',
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
  },
  //申请售后
  aftersale: function (e) {
    var that = this;
    let totalprice = e.currentTarget.dataset.totalprice;
    let batchcode = e.currentTarget.dataset.batchcode
    wx.redirectTo({
      url: '/pages/refund/refund?totalprice=' + totalprice + '&batchcode=' + batchcode + '&gettype=' + that.data.gettype,
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
