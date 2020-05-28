// pages/blesspay/blesspay.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
     id:'',//传过来的id
     index_data:'',//获取数据
     imageUrl:'',//域名
     money:'',//所需支付的钱
     type:'',//支付的索引值
    batchcode:'',//订单号
    sort:'',//判断是从哪里来的，1是请香的数据  2 是祈福的数据
    name:'',//祈福那边传过来的祈福人
    comment:'',//祈福传过来的祈福愿
    img_id:'',//祈福签的id
  },
  onLoad: function (options) {
     var that = this;
     that.setData({ 
       id: options.id,//传过来的id
       imageUrl: getApp().openidData.urls,//域名
       type:options.type,
       sort:options.sort,
      })
      if(that.data.sort == 1){
        console.log("这里是请香的")
      }else if(that.data.sort == 2){
        that.setData({ 
          img_id: options.img_id,
          name:options.name,
          comment:options.comment,
        })
        
      }
    getdata(that.data.id, that)
  },
  //点击切换支付方式
  click:function(e){
    var that = this;
    let index = e.currentTarget.dataset.index;//索引值
    let integral = e.currentTarget.dataset.integral;//积分
    let money = e.currentTarget.dataset.money;//钱
    console.log(integral)
    that.setData({ type: index })
    if(index == 1){
      that.setData({ money: integral })
    } else if(index == 2){
      that.setData({ money: money})
    } else if(index == 3){
      that.setData({ money: 0 })
    }
  },
  //支付
  button:function(){
    var that = this;
    if(that.data.sort == 1 ){
      console.log('这里是请香的')
      if (that.data.type == 0) {
        wx.request({
          url: getApp().openidData.url + 'save_temple_order.php',
          data: {
            user_id: getApp().openidData.user_id,
            customer_id: getApp().openidData.customer_id,
            type: 0,
            temple_id: that.data.id,
            paytype: that.data.type,
          },
          method: 'POST',
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          success: function (res) {
            that.setData({ batchcode: res.data.batchcode })
            if (res.data.status == 4) {
              wx.request({
                url: 'https://youte.xmtzxm.com.cn/weixinpl/mshop/WeChatPay/wxpay_temple.php',
                data: {
                  user_id: getApp().openidData.user_id,
                  order_id: res.data.batchcode,
                  customer_id: getApp().openidData.customer_id,
                },
                method: 'POST',
                header: {
                  "Content-Type": "application/x-www-form-urlencoded"
                },
                success: function (re) {
                  wx.requestPayment({
                    'timeStamp': JSON.stringify(re.data.data.timestamp),
                    'nonceStr': re.data.data.noncestr,
                    'package': re.data.data.package,
                    'signType': 'MD5',
                    'paySign': re.data.data.paySign,
                    'success'(res) {
                      console.log('微信支付成功')
                        wx.showToast({
                          title: '成功',
                          icon: 'success',
                          duration: 1000
                        })
                        setTimeout(function () {
                          wx.redirectTo({
                            url: '/pages/refreshPay/refreshPay?batchcode=' + that.data.batchcode + '&sertial=4',
                          });
                        }, 1000)
         
                    },
                    fail(res) {
                      console.log('微信支付失败');
                    }
                  })
                }
              })
            }
          },
        })
      } else if (that.data.type == 2) {
        wx.request({
          url: getApp().openidData.url + 'save_temple_order.php',
          data: {
            user_id: getApp().openidData.user_id,
            customer_id: getApp().openidData.customer_id,
            type: 0,
            temple_id: that.data.id,
            paytype: that.data.type,
            blessing_to: that.data.comment,
            blessing_user:that.data.name
          },
          method: 'POST',
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          success: function (res) {
            console.log('积分支付成功')
            that.setData({ batchcode: res.data.batchcode })
             if (res.data.status == 4){
              wx.showToast({
                title: '成功',
                icon: 'success',
                duration: 1000
              })
              setTimeout(function () {
                wx.redirectTo({
                  url: '/pages/refreshPay/refreshPay?batchcode=' + that.data.batchcode + '&sertial=4',
                });
              }, 1000)
            }else{
              wx.showModal({
                title: '提示',
                content: res.data.msg,
              })
            }
          }, fail: function (res) {
            wx.showModal({
              title: '提示',
              content: '零钱支付失败',
              success: function (re) {
                if (re.confirm) {
                  console.log('用户点击确认')
                } else if (re.cancel) {
                  console.log('用户点击了取消')
                }
              },
            })
          }
        })
      } else if (that.data.type == 3) {
        wx.request({
          url: getApp().openidData.url + 'save_temple_order.php',
          data: {
            user_id: getApp().openidData.user_id,
            customer_id: getApp().openidData.customer_id,
            type: 0,
            temple_id: that.data.id,
            paytype: that.data.type,
          },
          method: 'POST',
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          success: function (res) {
            console.log('免费支付成功')
            that.setData({ batchcode: res.data.batchcode })
            wx.showToast({
              title: '成功',
              icon: 'success',
              duration: 1000
            })
            setTimeout(function () {
              wx.redirectTo({
                url: '/pages/refreshPay/refreshPay?batchcode=' + that.data.batchcode + '&sertial=4',
              });
            }, 1000)
          }, fail: function (res) {
            wx.showModal({
              title: '提示',
              content: '零钱支付失败',
              success: function (re) {
                if (re.confirm) {
                  console.log('用户点击确认')
                } else if (re.cancel) {
                  console.log('用户点击了取消')
                }
              },
            })
          }
        })
      }
    }else if(that.data.sort == 2){//祈福的
      console.log('这里是祈福')
      if (that.data.type == 0) {//微信支付
        wx.request({
          url: getApp().openidData.url + 'save_temple_order.php',
          data: {
            user_id: getApp().openidData.user_id,
            customer_id: getApp().openidData.customer_id,
            type: 1,
            temple_id: that.data.id,
            paytype: that.data.type,
            blessing_to:that.data.comment,
            blessing_user:that.data.name,
            pray_sign_id:that.data.img_id,
          },
          method: 'POST',
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          success: function (res) {
            that.setData({ batchcode: res.data.batchcode })
            if (res.data.status == 4) {
              wx.request({
                url: 'https://youte.xmtzxm.com.cn/weixinpl/mshop/WeChatPay/wxpay_temple.php',
                data: {
                  user_id: getApp().openidData.user_id,
                  order_id: res.data.batchcode,
                  customer_id: getApp().openidData.customer_id,
                },
                method: 'POST',
                header: {
                  "Content-Type": "application/x-www-form-urlencoded"
                },
                success: function (re) {
                  wx.requestPayment({
                    'timeStamp': JSON.stringify(re.data.data.timestamp),
                    'nonceStr': re.data.data.noncestr,
                    'package': re.data.data.package,
                    'signType': 'MD5',
                    'paySign': re.data.data.paySign,
                    'success'(res) {
                      console.log('微信支付成功')
                      if(res.data.status == 4){
                        wx.showToast({
                          title: '成功',
                          icon: 'success',
                          duration: 1000
                        })
                        setTimeout(function () {
                          wx.redirectTo({
                            url: '/pages/refreshPay/refreshPay?batchcode=' + that.data.batchcode + '&sertial=5',
                          });
                        }, 1000)
                      }else{
                        wx.showModal({
                          title: '提示',
                          content: res.data.msg,
                          success: function(res) {},
                        })
                      }
                    },
                    fail(res) {
                      console.log('微信支付失败');
                    }
                  })
                }
              })
            }
          },
        })
      } else if (that.data.type == 2) {//积分支付
        wx.request({
          url: getApp().openidData.url + 'save_temple_order.php',
          data: {
            user_id: getApp().openidData.user_id,
            customer_id: getApp().openidData.customer_id,
            type: 1,
            temple_id: that.data.id,
            paytype: that.data.type,
            pray_sign_id: that.data.img_id,
            blessing_to: that.data.comment,
            blessing_user: that.data.name,
          },
          method: 'POST',
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          success: function (res) {
            console.log('积分支付成功')
            that.setData({ batchcode: res.data.batchcode })
            if(res.data.status == 4){
              wx.showToast({
                title: '成功',
                icon: 'success',
                duration: 1000
              })
              setTimeout(function () {
                wx.redirectTo({
                  url: '/pages/refreshPay/refreshPay?batchcode=' + that.data.batchcode + '&sertial=5',
                });
              }, 1000)
            }else{
              wx.showModal({
                title: '提示',
                content: res.data.msg,
                success: function(res) {},
              })
            }
          }, fail: function (res) {
            wx.showModal({
              title: '提示',
              content: '零钱支付失败',
              success: function (re) {
                if (re.confirm) {
                  console.log('用户点击确认')
                } else if (re.cancel) {
                  console.log('用户点击了取消')
                }
              },
            })
          }
        })
      } else if (that.data.type == 3) {//免费支付
        wx.request({
          url: getApp().openidData.url + 'save_temple_order.php',
          data: {
            user_id: getApp().openidData.user_id,
            customer_id: getApp().openidData.customer_id,
            type: 1,
            temple_id: that.data.id,
            paytype: that.data.type,
            pray_sign_id: that.data.img_id,
            blessing_to: that.data.comment,
            blessing_user: that.data.name,
          },
          method: 'POST',
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          success: function (res) {
            console.log('免费支付成功')
            that.setData({ batchcode: res.data.batchcode })
            wx.showToast({
              title: '成功',
              icon: 'success',
              duration: 1000
            })
            setTimeout(function () {
              wx.redirectTo({
                url: '/pages/refreshPay/refreshPay?batchcode=' + that.data.batchcode + '&sertial=5',
              });
            }, 1000)
          }, fail: function (res) {
            wx.showModal({
              title: '提示',
              content: '零钱支付失败',
              success: function (re) {
                if (re.confirm) {
                  console.log('用户点击确认')
                } else if (re.cancel) {
                  console.log('用户点击了取消')
                }
              },
            })
          }
        })
      }
    }

  },
})
//获取数据
function getdata( id,that) {
  wx.request({
    url: getApp().openidData.url + 'temple_sweet.php',
    data: {
      s_id:id,
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