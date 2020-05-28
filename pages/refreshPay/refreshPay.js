// pages/refreshPay/refreshPay.js
Page({
  data: {
    batchcode:'',//保证金的订单号
    sertial: '',//这是判断从哪里传过来的值 1 是从保证金传过来的  2 是专属电话过来的 3 是店铺刷新支付过来的数据  4 是从请香支付里面过来的  5 是祈福过来的 6 是商品刷新
  },
  onLoad: function (options) {
    var that = this;
    that.setData({ 
      batchcode: options.batchcode,
      sertial: options.sertial
    })
    console.log(that.data.sertial)
    if (that.data.sertial == 1){
      getdata(that.data.sertial,that);
    } else if (that.data.sertial == 2){
      getdata(that.data.sertial,that);
    } else if (that.data.sertial == 3){
      getdata(that.data.sertial,that);
    } else if (that.data.sertial == 4) {
      getdata(that.data.sertial, that);
    } else if (that.data.sertial == 5) {
      getdata(that.data.sertial, that);
    } else if (that.data.sertial == 6) {
      getdata(that.data.sertial, that);
    }
   
  },
//查看订单
  manage_2:function(){
    var that = this;
    wx.redirectTo({
      url: '/pages/blessS/blesss?batchcode=' + that.data.batchcode,
    })
  },
    //返回商家管理
  manage:function(){
   wx.redirectTo({
     url: '/pages/management/management',
   })
  },
  //查看订单
  manage_1:function(){
    var that = this;
    wx.redirectTo({
      url: '/pages/pleases/pleases?batchcode=' + that.data.batchcode,
    })
  },
  //继续购买
  contion:function(){
    var that = this;
    if (that.data.sertial == 1){
      wx.redirectTo({
        url: '/pages/refresh/refresh',
      })
    } else if (that.data.sertial == 2){
      wx.redirectTo({
        url: '/pages/adpay/adpay',
      })
    } else if (that.data.sertial == 3){
      wx.redirectTo({
        url: '/pages/rankM/rankM',
      }) 
    } else if (that.data.sertial == 4) {
      wx.redirectTo({
        url: '/pages/please/please',
      })
    } else if (that.data.sertial == 5) {
      wx.redirectTo({
        url: '/pages/blessing/blessing',
      })
    } else if (that.data.sertial == 6) {
      wx.redirectTo({
        url: '/pages/shopRank/shopRank',
      })
    }

  },

})
//获取保证金数据
function getdata(sertial,that) {
  if (sertial == 1){
    wx.request({
      url: getApp().openidData.url + 'cash_order_details.php',
      data: {
        batchcode: that.data.batchcode,
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
  } else if (sertial == 2){
    wx.request({
      url: getApp().openidData.url + 'exclusive_order.php',
      data: {
        batchcode: that.data.batchcode,
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
  } else if (sertial == 3){
    wx.request({
      url: getApp().openidData.url + 'refresh_order_details.php',
      data: {
        batchcode: that.data.batchcode,
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
  } else if (sertial == 4) {
    wx.request({
      url: getApp().openidData.url + 'temple_order_details.php',
      data: {
        batchcode: that.data.batchcode,
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
  } else if (sertial == 5) {
    wx.request({
      url: getApp().openidData.url + 'temple_order_details.php',
      data: {
        batchcode: that.data.batchcode,
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
  } else if (sertial == 6) {
    wx.request({
      url: getApp().openidData.url + 'refresh_goods_order_details.php',
      data: {
        batchcode: that.data.batchcode,
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

}