// pages/payOrder/payOrder.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ischeck:true,
    aid:'',//默认地址id 
    pid:'',//产品id
    rcount:'',//产品数量
    sel_pros:'',//拼接的数据
    supply_id:'',//这个我也不知道是什么参数。。在product_detail.php中获取的
    imageUrl:'',//地址前缀
    check:false,//选择支付的状态
    check_1:false,//选择支付的状态
    num:0,//这是选择支付的index
    price:'',//这是总价格
    cart_ids:'',//购物车的商品中的id  这个id不是商品id
  },
  onLoad: function (options) {
   var that = this;
    that.setData({
      formtype: options.formtype,//这是 1 是立即购买  2 是购物车
      imageUrl: getApp().openidData.urls,//这是域名
      num:options.num
    })
      if (that.data.formtype == 1) {
        that.setData({
          aid:options.aid
        })
        if (that.data.aid == '') {
          that.setData({
            pid: options.pid,//商品的id
            rcount: options.rcount,//商品的数量
            sel_pros: options.sel_pros,//商品的规格
            supply_id: options.supply_id,//店铺的id 
          })
          wx.showModal({
            title: '提示',
            content: '暂无地址，请前往选择或添加',
            success: function (res) {
              if (res.confirm) {
                wx.redirectTo({
                  url: '/pages/address/address?sort=1' + '&pid=' + that.data.pid + '&rcount=' + that.data.rcount + '&sel_pros=' + that.data.sel_pros + '&supply_id=' + that.data.supply_id +'&num=' + '微信支付',
                })
              } else if (res.cancel) {
                // console.log('用户点击了取消')
              }
            },
          })
        } else if (that.data.aid != '') {
          that.setData({
            pid: options.pid,//商品的id
            rcount: options.rcount,//商品的数量
            sel_pros: options.sel_pros,//商品的规格
            supply_id: options.supply_id,//店铺的id 
            num:options.num
          })
          getdata(that.data.formtype, that);
         if (that.data.num == '微信支付') {
            that.setData({ check: true, check_1: false })
          } else {
            that.setData({ check: false, check_1: true })
          }
        }

      } else if (that.data.formtype == 2) {
        that.setData({
          aid: options.aid,
          cart_ids: options.cart_ids,
        })
        if(that.data.aid == ''){
          that.setData({
            pro_arr: options.pro_arr,
            num: options.num,//这是做支付判断的
          })
          wx.showModal({
            title: '提示',
            content: '你现在还未选择地址',
            success: function (res) {
              if (res.confirm) {
                wx.redirectTo({
                  url: '/pages/address/address?sort=3' + '&pro_arr=' + that.data.pro_arr + '&num=' + '微信支付' + '&cart_ids=' + that.data.cart_ids,
                })
              } else if (res.cancel) {
                // console.log('用户点击了取消')
              }
            },
          })
        } else if (that.data.aid != ''){
          that.setData({
            pro_arr: options.pro_arr,
            num: options.num,//这是做支付判断的
            formtype: options.formtype,//这是 1 是立即购买  2 是购物车
          })
          getdata(that.data.formtype, that);
        }
        if (that.data.num == '微信支付') {
          that.setData({ check: true, check_1: false })
        } else {
          that.setData({ check: false, check_1: true })
        }

      }

  },
  //点击跳转到地址页面
  address:function(){
    var that = this ;
    if (that.data.formtype == 1) {//这是 1 是立即购买  2 是购物车
      wx.redirectTo({
        url: '/pages/address/address?sort=1' + '&pid=' + that.data.pid + '&rcount=' + that.data.rcount + '&sel_pros=' + that.data.sel_pros + '&supply_id=' + that.data.supply_id + '&num=' + '微信支付' + '&index=0',
      })
    } else if (that.data.formtype == 2){
      wx.redirectTo({
        url: '/pages/address/address?sort=3' + '&pro_arr=' + that.data.pro_arr + '&num=' + '微信支付' + '&index=0' + '&cart_ids=' + that.data.cart_ids,
      })
    }

  },
  //点击跳转到地址页面
  address_1: function () {
    var that = this;
    if (that.data.formtype == 1) {//这是 1 是立即购买  2 是购物车
      wx.redirectTo({
        url: '/pages/address/address?sort=1' + '&pid=' + that.data.pid + '&rcount=' + that.data.rcount + '&sel_pros=' + that.data.sel_pros + '&supply_id=' + that.data.supply_id + '&num=' + '微信支付',
      })
    } else if (that.data.formtype == 2){
      wx.redirectTo({
        url: '/pages/address/address?sort=3' + '&pro_arr=' + that.data.pro_arr + '&num=' + '微信支付' + '&cart_ids=' + that.data.cart_ids,
      })
    }
  },
  //点击选择支付状态
  button:function(e){
    var that = this;
    let name  = e.currentTarget.dataset.name;//微信支付和零钱支付
    if( name == '微信支付'){
      that.setData({ check:true, check_1:false ,num:name })
    }else{
      that.setData({ check: false, check_1: true ,num:name })
    }
  },
  //积分支付
  buy_1:function(){
   var that = this;
   that.setData({
     num:'零钱支付'
   })
   that.buy()
  },
  //点击立即支付
  buy:function(){
    var that = this;
    // that.data.aid 地址id
    if (that.data.ischeck && that.data.aid != ''){
      that.setData({ ischeck:false })
        if (that.data.index_data.final_info.is_order_pay == 3){
            wx.showModal({
              title: '提示',
              content: '暂无配送方式',
              success: function(res) {
                if(res.confirm){
                  // console.log('用户点击了确认')
                  that.setData({
                    ischeck: true,
                  })
                }else if(res.cancel){
                  // console.log('用户点击了取消')
                }
              }
            })
        }else{
          if(that.data.num == '零钱支付'){
            wx.request({
              url: getApp().openidData.url + 'save_order_xiao.php',
              data: {
                user_id: getApp().openidData.user_id,
                aid: that.data.aid,
                customer_id: getApp().openidData.customer_id,
                json_data: that.data.index_data.buy_array_add_express_json,
                pay_type: that.data.num,
                formtype: that.data.formtype,
                cart_ids: that.data.cart_ids
              },
              method: 'POST',
              header: {
                "Content-Type": "application/x-www-form-urlencoded"
              },
              success: function (res) {
                if (res.data.status == 4){
                  wx.showModal({
                    title: '提示',
                    content: res.data.msg,
                    success: function(re) {
                      if(re.confirm){
                        setTimeout(function () {
                          that.setData({
                            ischeck: true
                          })
                          wx.redirectTo({
                            url: '/pages/my/my?type=3',
                          });
                        }, 1000)
                      }else if(re.cancel){
                        console.log('取消')
                      }
                    },
                  })
                } else{
                  wx.showModal({
                    title: '提示',
                    content: res.data.msg,
                    success: function (re) {
                      if (re.confirm) {
                        setTimeout(function () {
                          that.setData({
                            ischeck: true
                          })
                          wx.redirectTo({
                            url: '/pages/my/my?type=2',
                          });
                        }, 1000)
                      } else if (re.cancel) {
                        console.log('取消')
                      }
                    },
                  })
                 }
              },fail:function(res){
                that.setData({
                  ischeck: true,
                })
              }
            })
          } else if (that.data.num == '微信支付' ){
            wx.request({
              url: getApp().openidData.url + 'save_order_xiao.php',
              data: {
                user_id: getApp().openidData.user_id,
                aid: that.data.aid,
                customer_id: getApp().openidData.customer_id,
                json_data: that.data.index_data.buy_array_add_express_json,
                pay_type: that.data.num,
                formtype: that.data.formtype,
                cart_ids: that.data.cart_ids
              },
              method: 'POST',
              header: {
                "Content-Type": "application/x-www-form-urlencoded"
              },
              success: function (res) {
                if (res.data.status == 4){
                  wx.request({
                    url: 'https://youte.xmtzxm.com.cn/weixinpl/mshop/WeChatPay/wxpay.php',
                    data: {
                      user_id: getApp().openidData.user_id,
                      customer_id: getApp().openidData.customer_id,
                      order_id: res.data.batchcode,
                      pay_type: 2,
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
                          that.setData({
                            ischeck: true,
                          })
                          wx.showToast({
                            title: '成功',
                            icon: 'success',
                            duration: 1000
                          })
                          setTimeout(function () {
                            wx.hideLoading();
                            that.setData({
                              ischeck: true
                            })
                            wx.redirectTo({
                              url: '/pages/my/my?type=3',
                            });
                          }, 100)
                        },
                        fail(res) {
                          wx.hideLoading();
                          that.setData({
                            ischeck: true,
                          })
                          // console.log('微信支付失败');
                          setTimeout(function () {
                            that.setData({
                              ischeck: true
                            })
                            wx.redirectTo({
                              url: '/pages/my/my?type=2',
                            });
                          }, 1000)
                        }
                      })
                    }
                  })
                }else{
                  that.setData({
                    ischeck: true
                  })
                  wx.showModal({
                    title: '提示',
                    content: res.data.msg,
                    success: function (re) {
                      if(re.confirm){
                        setTimeout(function () {
                          that.setData({
                            ischeck: true
                          })
                          wx.redirectTo({
                            url: '/pages/my/my?type=2',
                          });
                        }, 1000)
                      }else if(re.cancel){
                        // console.log('取消')
                      }
                    },
                  })
                }
              }
            })
          }
        }
    }else{
      if (that.data.aid == ''){
        wx.showModal({
          title: '提示',
          content: '暂无地址，请前往选择或添加',
          success:function(re){
            if(re.confirm){
              wx.redirectTo({
                url: '/pages/address/address?sort=1' + '&pid=' + that.data.pid + '&rcount=' + that.data.rcount + '&sel_pros=' + that.data.sel_pros + '&supply_id=' + that.data.supply_id + '&num=' + '微信支付',
              })
            }
          }
        })
      }else{
        wx.showToast({
          title: '请勿频繁点击',
          icon: 'none'
        })
      }
    }
  },
})

function getdata(formtype,that){
  //这是立即购买的接口
  if (formtype == 1){
    wx.request({
      url: getApp().openidData.url + 'order_form_xiao.php',
      data: {
        user_id: getApp().openidData.user_id,
        customer_id: getApp().openidData.customer_id,//customer_id
        pid: that.data.pid,//产品id
        formtype: formtype,
        rcount: that.data.rcount,
        sel_pros: that.data.sel_pros,
        aid: that.data.aid,
        supply_id: that.data.supply_id,
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        let price = Number(res.data.feedback.data.final_info.all_express) + Number(res.data.feedback.data.final_info.pro_all_price);
        that.setData({
          index_data: res.data.feedback.data,
          price:price
        })
      }
    })
  } else if (formtype == 2){
    wx.request({
      url: getApp().openidData.url + 'order_form_xiao.php',
      data: {
        user_id: getApp().openidData.user_id,
        customer_id: getApp().openidData.customer_id,//customer_id
        formtype: formtype,
        aid: that.data.aid,
        pro_arr: that.data.pro_arr
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        let price = Number(res.data.feedback.data.final_info.all_express) + Number(res.data.feedback.data.final_info.pro_all_price);
        that.setData({
          index_data: res.data.feedback.data,
          price: price
        })
      }
    })
  }

}

