// pages/refreshPay/refreshPay.js
Page({
  data: {
    money: '',//保证金的订单号
  },
  onLoad: function (options) {
    var that = this;
    that.setData({
      money: options.money
    })
  },
  //返回商家管理
  manage: function () {
    wx.redirectTo({
      url: '/pages/management/management',
    })
  },
  contion: function () {
    wx.redirectTo({
      url: '/pages/ad/ad',
    })
  },

})
