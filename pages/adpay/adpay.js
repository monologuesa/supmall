

var WxParse = require('../../wxParse/wxParse.js');

Page({


  data: {
     index_data:'',//获取数据列表
     select:-1,//判断点击第几个
     check:true,//按钮的状态  
     id:'',//商品的id
  },

  onLoad: function (options) {
    var that = this;
    that.setData({
      select: options.select,
      id:options.id
    })
    getdata(that)
    console.log(that.data.id)
  },
  //点击切换
  ad:function(e){
    var that = this;
    let index = e.currentTarget.dataset.index;//索引值
    let id = e.currentTarget.dataset.id;
    that.setData({ 
      select: index,
      id:id
    })
  },
  //点击支付
  button: function () {
    var that = this;
    wx.request({
      url: getApp().openidData.url + 'exclusive_phone_add.php',
      data: {
        user_id: getApp().openidData.user_id,//用户id
        customer_id: getApp().openidData.customer_id,
        exclusive_id:that.data.id,
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res.data);
        that.setData({ batchcode: res.data.batchcode })
        if (res.data.status == 1) {
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            success: function (res) {
              if (res.confirm) {
                console.log('点击了确认')
              } else if (res.cancel) {
                console.log('点击了取消')
              }
            },
            fail: function (res) {

            },
          })
        } else if (res.data.status == 2) {
          wx.request({
            url: 'https://youte.xmtzxm.com.cn/weixinpl/mshop/WeChatPay/wxpay_exclusive.php',
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
                      url: '/pages/refreshPay/refreshPay?batchcode=' + that.data.batchcode + '&sertial=2',
                    });
                  }, 1000)
                },
                fail(res) {
                  wx.showModal({
                    title: '提示',
                    content: '微信支付失败',
                    success: function (res) {
                      console.log('用户点击了确认,微信支付失败')
                      setTimeout(function () {
                      }, 1000)
                    },
                    fail: function (res) {
                      console.log('用户点击了取消，微信支付失败')
                    },
                  })

                }
              })
            }

          })
        }


      }
    })
  },

})
//获取数据
function getdata(that) {
  wx.request({
    url: getApp().openidData.url + 'exclusive_phone_list.php',
    data: {
      customer_id:getApp().openidData.customer_id,
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
      var infoFlg = "<!--SPINFO#0-->";
      var imgFlg = "<!--IMG#";


      var content = "<div style=\"line-height:25px; font-weight:200; font-size:31rpx;  word-break:normal\">" + res.data.arr2.exclusive_content + "</div>";

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
