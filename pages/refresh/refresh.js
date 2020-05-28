// pages/refresh/refresh.js
var WxParse = require('../../wxParse/wxParse.js');
Page({


  data: {
    check:true,
    batchcode:'',//商品的订单号
    index_data:'',//获取数据
  },

  onLoad: function (options) {
   var that = this ;
    getdata(that);
  },
  onShow:function(){
  var that =this;
  },
  //点击支付
  button:function(){
    var that = this;
    wx.request({
      url: getApp().openidData.url + 'save_user_cash.php',
      data: {
        user_id: getApp().openidData.user_id,//用户id
        customer_id:getApp().openidData.customer_id,
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res.data);
        that.setData({ batchcode: res.data.batchcode })
        if (res.data.status == 1){
           wx.showModal({
             title: '提示',
             content: res.data.msg,
             success: function(res) {
               if(res.confirm){
                 console.log('点击了确认')
               }else if (res.cancel){
                 console.log('点击了取消')
               }
             },
             fail: function(res) {
               
             },
           })
        } else if (res.data.status == 2){
             wx.request({
               url: 'https://youte.xmtzxm.com.cn/weixinpl/mshop/WeChatPay/wxpay_cash.php',
               data:{
                 user_id: getApp().openidData.user_id,//用户id
                 // user_id: 3063,
                 customer_id: getApp().openidData.customer_id,
                 order_id: res.data.batchcode,
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
                         url: '/pages/refreshPay/refreshPay?batchcode=' + that.data.batchcode + '&sertial=1',
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
function getdata(that) {

  wx.request({
    url: getApp().openidData.url + 'get_user_cash.php',
    data: {
      user_id: getApp().openidData.user_id,//用户id
      // user_id: 3063,
      customer_id:getApp().openidData.customer_id,
    },
    method: 'POST',
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    success: function (res) {
      that.setData({
        index_data: res.data,
      })
      if (res.data.is_cash_money == 1){
        wx.showModal({
          title: '提示',
          content: '你已经缴纳过保证金，无需缴纳',
          success: function(re) {
            if(re.confirm){
              wx.switchTab({
                url: '/pages/person/person',
              })
            }else if(re.cancel){
              console.log('取消')
            }
          },
        })
      }
      var infoFlg = "<!--SPINFO#0-->";
      var imgFlg = "<!--IMG#";


      var content = "<div style=\"line-height:25px; font-weight:200; font-size:32rpx; word-break:normal\">" + res.data.cash_content + "</div>";

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
