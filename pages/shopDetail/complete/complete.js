// pages/shopDetail/shopDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    gettype: '',////判断是 2 待发货，还是 3待收货的 
    batchcode: '',//商品的订单号
    idnex_data: '',//获取数据列表
    imageUrl: '',//图片地址
    sort: '',//判断从哪里点进来的，0是我的订单 1是商家管理
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
      console.log('这是商家订单进来的')
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
  //确认收货
  confirm: function (e) {
    var that = this;
    let id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '确认订单之后无法恢复，请慎重考虑',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: 'https://youte.xmtzxm.com.cn/weixinpl/mshop/orderlist_operation.php',
            data: {
              batchcode: id,
              user_id: getApp().openidData.user_id,
              op: 'confirm',
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
                wx.redirectTo({
                  url: '/pages/my/my?type=5',
                })
                getdata(that, that.data.type);
              }
            }
          })

        } else if (res.cancel) {
          console.log('用户点击了取消，这里是确认收货的')
        }

      },
    })

  },
  //查看物流
  wuliu: function (e) {
    var expressnum = e.currentTarget.dataset.expressnum
    wx.navigateTo({
      url: '/wuliu/index?expressnum=' + expressnum,
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
