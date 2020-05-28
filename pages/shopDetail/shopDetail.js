Page({
// pages/shopDetail/shopDetail.js

  /**
   * 页面的初始数据
   */
  data: {
    hide:false,//这是隐藏支付的
    disabled:true,//这个是判断遮罩的条件
    check:false,//判断微信支付的按钮显示
    check_1:false,//判断零钱支付按钮显示
    batchcode:'',//商品的订单号
    idnex_data:'',//获取数据列表
    imageUrl:'',//图片地址
    index_data:'',//获取数据
    show:0,//用来判断倒计时是否结束的 1 为结束了  2 为还没结束
    day:'',//判断还剩多少小时
    min:'',//判断还剩多少分钟
    price:'',//总价
    sort:'',//判断从哪里点进来的，0是我的订单 1是商家管理
  },
  onLoad: function (options) {
   var that = this;
   that.setData({
     sort:options.sort,
     batchcode: options.batchcode,
     imageUrl:getApp().openidData.urls,
   })
    getdata(that);
  },
  //跳转到商品详情
  jump:function(e){
    var that = this;
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/shop/shop?id=' + id,
    })
  },
  //开启隐藏
  showModal: function () {
    let that = this;
    if (that.data.disabled) {
      // 显示遮罩层
      var animation = wx.createAnimation({
        duration: 200,
        timingFunction: "linear",
        delay: 0
      })
      this.animation = animation
      animation.translateY(300).step()
      this.setData({
        animationData: animation.export(),
        hide: true
      })
      setTimeout(function () {
        animation.translateY(0).step()
        this.setData({
          animationData: animation.export()
        })
      }.bind(this), 200)
    }
  },
  //隐藏
  hideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        hide: false
      })
    }.bind(this), 200)
  },
  //选择支付 1 是微信支付  2 是零钱支付
  my:function(e){
    var that = this;
    let index = e.currentTarget.dataset.index;
    console.log(index);
    if( index == 1){
      that.setData({ check:true,check_1:false })
      wx.request({
        url: getApp().openidData.url + 'integral_order_pay.php',
        data:{
          batchcode: that.data.batchcodebatchcode,
          user_id:getApp().openidData.user_id,
        },
        method: 'POST',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success:function(res){
          console.log(res.data)
          if (res.data.status == 2){
            wx.request({
              url: 'https://youte.xmtzxm.com.cn/weixinpl/mshop/WeChatPay/wxpay_single.php',
              data:{
                user_id:getApp().openidData.user_id,
                order_id:that.data.batchcode,
                customer_id:getApp().openidData.customer_id,
              },
              method: 'POST',
              header: {
                "Content-Type": "application/x-www-form-urlencoded"
              },
              success:function(re){
                console.log('开始调用微信支付');
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
                        url: '/pages/my/my?type=3',
                      });
                    }, 100)
                  },
                  fail(res) {
                    wx.showModal({
                      title: '提示',
                      content: '微信支付失败',
                    })

                  }
                }) 
              }
            })
          }else{
            wx.showModal({
              title: '提示',
              content: res.data.msg,
              success: function (re) {
                if (re.cancel) {
                  console.log('用户点击了确认，这里是零钱支付失败')
                } else if (re.cancel) {
                  console.log('用户点击了取消，这里是零钱支付失败')
                }
              }
            })
          }
        },
      })
    }else if(index == 2){
      that.setData({ check: false, check_1: true })
      wx.request({
        url: getApp().openidData.url + 'integral_order_pay.php',
        data: {
          batchcode: that.data.batchcodebatchcode,
          user_id: getApp().openidData.user_id,
        },
        method: 'POST',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: function (res) {
          if (res.data.status == 1){
              wx.showModal({
                title: '提示',
                content: res.data.msg,
                success: function(re) {
                   if(re.confirm){
                     console.log('用户点击了确认，零钱支付')
                   }else if(re.cancel){
                     console.log('用户点击了取消，零钱支付')
                   }
                },
                fail: function(res) {
                  console.log('用户点击了取消，零钱支付')
                },
              })
          } else if (res.data.status == 2){
               wx.request({
                 url: getApp().openidData.url + 'moneybag_pay.php',
                 data:{
                    user_id:getApp().openidData.user_id,
                    batchcode: that.data.batchcode,
                    type: 'moneybag',
                 },
                 method: 'POST',
                 header: {
                   "Content-Type": "application/x-www-form-urlencoded"
                 },
                 success:function(res){
                   if (res.data.status == 1){
                     wx.showModal({
                       title: '提示',
                       content: res.data.msg,
                       success: function(re) {
                         if(re.cancel){
                           console.log('用户点击了确认，这里是零钱支付失败')
                         }else if(re.cancel){
                           console.log('用户点击了取消，这里是零钱支付失败')
                         }
                       }
                     })
                   } else if (res.data.status == 2){
                     wx.showModal({
                       title: '提示',
                       content: res.data.msg,
                       success: function (res) {
                         wx.redirectTo({
                           url: '/pages/my/my?type=3',
                         })
                       },
                       fail: function (res) {
                         console.log('用户点击了取消，这里是零钱支付失败')
                       },
                     })
                   }else{
                     wx.showModal({
                       title: '提示',
                       content: res.data.msg,
                       success: function (re) {
                         if (re.cancel) {
                           console.log('用户点击了确认，这里是零钱支付失败')
                         } else if (re.cancel) {
                           console.log('用户点击了取消，这里是零钱支付失败')
                         }
                       }
                     })
                   }
                 }
               })
          }
        }
      })
    }
  },
  //取消订单
  cancel: function (e) {
    var that = this;
    let id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '取消订单之后无法恢复，请慎重考虑',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: 'https://youte.xmtzxm.com.cn/weixinpl/mshop/orderlist_operation.php',
            data: {
              batchcode: id,
              user_id: getApp().openidData.user_id,
              op: 'cancel',
            },
            method: 'GET',
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function (re) {
              if (re.data) {
                wx.showToast({
                  title: '成功',
                  icon: 'success',
                  duration: 2000
                })
               wx.redirectTo({
                 url: '/pages/my/my?type=2',
               })
              }
            }
          })
        } else if (res.cancel) {
          console.log('用户点击了取消，这里是取消订单的按钮')
        }

      },
    })
  },


})
//获取订单详情
function getdata(that){
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
    let data = res.data;
    let price = Number(data.price) + Number(data.ExpressPrice)
    that.setData({
      index_data:res.data,
      price: price
    })
      getTime(data, that);
    }
  })

}
//这是倒计时的方法
function getTime(data,that){
  var currtime = data.currtime;//当前时间
  var recovery_time = data.recovery_time.replace(/-/g, '/');//订单失效时间
  var ctime = Date.parse(new Date(recovery_time));
  var times = ctime / 1000;
  if (times - currtime < 0){
    that.setData({ show: 1 })
  } else if(times - currtime > 0){
    var time = times - currtime;
    setInterval(function (){
      if (time > 0){
        time--;
        var day = parseInt(time % (60 * 60 * 24) / 3600);
        var min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
        that.setData({ day: day, min: min, show: 2 })
      } else{
        that.setData({ show: 1 })
      }
    }, 1000)
  }
}
