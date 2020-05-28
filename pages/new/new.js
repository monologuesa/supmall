// pages/new/new.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  wechat:function(){
    wx.redirectTo({
      url: '/pages/wxchat/wxchat',
    })

  },
  bank:function(){
    wx.redirectTo({
      url: '/pages/bankcard/bankcard',
    })
  },
 
})