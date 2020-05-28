// pages/rankM/rankM.js

var WxParse = require('../../../wxParse/wxParse.js');
Page({


  data: {
    index_data: '',//获取数据
    check: false,//微信支付
    check_1: false,//积分支付
    name: '',//参数   微信支付   积分支付
    money: '',
    id:'',//商品的id
  },

  onLoad: function (options) {
    var that = this;

    that.setData({ check: true, name: '微信支付',id:options.id })
    getdata(that);
  },
  //点击切换支付方式
  click: function (e) {
    var that = this;
    let name = e.currentTarget.dataset.name;
    let data = that.data.index_data.refresh_shop_money;
    let data_1 = that.data.index_data.refresh_shop_integral;
    if (name == '微信支付') {
      that.setData({ check: true, check_1: false, money: data, name: name })
    } else if (name == '积分支付') {
      that.setData({ check: false, check_1: true, money: data_1, name: name })
    }
  },
  //支付
  pay: function () {
    var that = this;
    if (that.data.name == '积分支付') {
      wx.request({
        url: getApp().openidData.url + 'save_refresh_shop_order.php',
        data: {
          user_id: getApp().openidData.user_id,
          pay_type: that.data.name,
          goods_id: that.data.id,
        },
        method: 'POST',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: function (res) {
          that.setData({ batchcode: res.data.batchcode })
          if (res.data.status == 2) {
            wx.showToast({
              title: '成功',
              icon: 'success',
              duration: 1000
            })
            setTimeout(function () {
              wx.redirectTo({
                url: '/pages/refreshPay/refreshPay?sertial=6' + '&batchcode=' + that.data.batchcode,
              });
            }, 1000)
          } else {
            wx.showModal({
              title: '提示',
              content: '积分支付失败',
              success: function (re) {
                if (re.confirm) {
                  console.log('用户点击了确认')
                } else if (re.cancel) {
                  console.log('用户点击了取消')
                }
              },
            })
          }
        }
      })
    } else if (that.data.name == '微信支付') {
      wx.request({
        url: getApp().openidData.url + 'save_refresh_shop_order.php',
        data: {
          user_id: getApp().openidData.user_id,
          pay_type: that.data.name,
          goods_id: that.data.id,
        },
        method: 'POST',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: function (res) {
          that.setData({ batchcode: res.data.batchcode });
          console.log(res.data);
          wx.request({
            url: 'https://youte.xmtzxm.com.cn/weixinpl/mshop/WeChatPay/wxpay_goods_refresh.php',
            data: {
              user_id: getApp().openidData.user_id,//用户id
              // user_id: 3063,
              customer_id: getApp().openidData.customer_id,
              order_id: res.data.batchcode,
            },
            method: 'POST',
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function (re) {
              console.log(re.data);
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
                      url: '/pages/refreshPay/refreshPay?batchcode=' + that.data.batchcode + '&sertial=6',
                    });
                  }, 1000)
                },
                fail(res) {
                  wx.showModal({
                    title: '提示',
                    content: '微信支付失败',
                    success: function (res) {
                      if (res.confirm) {
                        console.log('用户点击了确认')
                      } else if (res.cancel) {
                        console.log('用户点击了取消')
                      }
                    }
                  })

                }
              })
            }

          })
        }
      })
    }
  }
})
//获取数据
function getdata(that) {
  wx.request({
    url: getApp().openidData.url + 'refresh_list_shop.php',
    data: {},
    method: 'POST',
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    success: function (res) {
      that.setData({
        index_data: res.data,
      })
      //替换标签中特殊字符
      var infoFlg = "<!--SPINFO#0-->";
      var imgFlg = "<!--IMG#";


      var content = "<div style=\"line-height:25px; font-weight:200; font-size:17px; color:black; word-break:normal\">" + res.data.refresh_shop_content + "</div>";

      //替换标签中特殊字符
      var infoFlg = "<!--SPINFO#0-->";
      if (content.indexOf(infoFlg) > 0) {
        content = content.replace(/<!--SPINFO#0-->/, "");
      }

      var imgFlg = "<!--IMG#";
      //图片数量
      var imgCount = (content.split(imgFlg)).length - 1;
      if (imgCount > 0) {
        // console.log("有dd" + imgCount + "张图片");

        for (var i = 0; i < imgCount; i++) {
          var imgStr = "<!--IMG#" + i + "-->";
          var imgSrc = "\"" + imgInfoArr[i].src + "\"";
          var imgHTML = "<div> <img style=\"width:100%\" src=" + imgSrc + "> </div>";
          content = content.replace(imgStr, imgHTML);
        }
      }

      var article = content;
      // console.log(article);
      WxParse.wxParse('article', 'html', article, that, imgCount);
    }
  })
}