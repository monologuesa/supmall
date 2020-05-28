
var WxParse = require('../../wxParse/wxParse.js');

Page({

  data: {
    hide:false,
    check:false,
    check_1:false,
    index:-1,//3是银行卡提现，0是微信提现
  },


  onLoad: function (options) {
    let that = this;
    that.setData({
      index:options.index,
    })
    //传过来是3的话，就是银行卡提现按钮亮
    if (that.data.index == 3) {
      that.setData({ check: true, check_1: false })
    } else {
      that.setData({ check_1: true, check: false })
    }
    console.log(that.data.index)
    getdata(that)
  },
  //选择支付方式
  card:function(e){
    let that = this;
    let index = e.currentTarget.dataset.index;
    that.setData({index:index})
    console.log(index);
    if(index == 3){
      that.setData({ check:true,check_1:false})
    }else{
      that.setData({ check_1: true, check: false })
    }
  },
  formSubmit:function(e){
    var that = this;
    console.log(e);
    console.log(e.detail.value.money);
    let money = e.detail.value.money;
    if (money == ''){
      wx.showModal({
        title: '提示',
        content: '请填写金额',
      })
      return;
    }else if(that.data.index == 3 ){
      wx.request({
        url: getApp().openidData.url + 'my_alipay.php',
        data: {
          user_id: getApp().openidData.user_id,//用户id
          // user_id: 3063,
        },
        method: 'POST',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: function (res) {
           if(res.data == ''){
             wx.showModal({
               title: '提示',
               content: '你还未绑定银行卡，是否绑定银行卡',
               success(res) {
                 if (res.confirm) {
                   wx.navigateTo({
                     url: '/pages/bankcard/bankcard?type=' + that.data.index,
                   })
                 } else if (res.cancel) {
                   console.log('用户点击取消')
                 }
               }
             })
           }else{
             wx.request({
               url: getApp().openidData.url + 'add_withdraw.php',
               data: {
                 user_id: getApp().openidData.user_id,//用户id
                //  user_id: 3063,
                 to_cash: money,
                 type: that.data.index,
               },
               method: 'POST',
               header: {
                 "Content-Type": "application/x-www-form-urlencoded"
               },
               success: function (res) {
                 console.log("获取成功");
                 console.log(res.data);
                 if (res.data.msg == 407){
                   wx.showModal({
                     title: '提示',
                     content: res.data.remark,
                     success(re) {
                       if (re.confirm) {
                         wx.redirectTo({
                           url: '/pages/purse/purse?index=1',
                         })
                       } else if (re.cancel) {
                         console.log('用户点击取消')
                       }
                     }
                   })
                 } else if (res.data.msg == 388){
                   wx.showModal({
                     title: '提示',
                     content: res.data.remark,
                     success(re) {
                       if (re.confirm) {
                         wx.redirectTo({
                           url: '/pages/purse/purse?index=1',
                         })
                       } else if (re.cancel) {
                         console.log('用户点击取消')
                       }
                     }
                   })
                 } else if (res.data.msg == 398) {
                   wx.showModal({
                     title: '提示',
                     content: res.data.remark,
                     success(re) {
                       if (re.confirm) {
                        
                       } else if (re.cancel) {
                         console.log('用户点击取消')
                       }
                     }
                   })
                 } else if (res.data.msg == 404) {
                   wx.showModal({
                     title: '提示',
                     content: res.data.remark,
                     success(re) {
                       if (re.confirm) {

                       } else if (re.cancel) {
                         console.log('用户点击取消')
                       }
                     }
                   })
                 }
               }
             })
           }
        }
      })
    } else if (that.data.index == 0){
      wx.request({
        url: getApp().openidData.url + 'my_alipay2.php',
        data: {
          user_id: getApp().openidData.user_id,//用户id
          // user_id: 3063,
        },
        method: 'POST',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: function (res) {
          if (res.data == '') {
            wx.showModal({
              title: '提示',
              content: '你还未绑定微信，是否绑定微信',
              success(res) {
                if (res.confirm) {
                  wx.navigateTo({
                    url: '/pages/wxchat/wxchat?type=' + that.data.index,
                  })
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          }else{
            wx.request({
              url: getApp().openidData.url + 'add_withdraw.php',
              data: {
                user_id: getApp().openidData.user_id,//用户id
                // user_id: 3063,
                to_cash: money,
                type: that.data.index,
              },
              method: 'POST',
              header: {
                "Content-Type": "application/x-www-form-urlencoded"
              },
              success: function (res) {
                if (res.data.msg == 407) {
                  wx.showModal({
                    title: '提示',
                    content: res.data.remark,
                    success(re) {
                      if (re.confirm) {
                        wx.redirectTo({
                          url: '/pages/purse/purse?index=1',
                        })
                      } else if (re.cancel) {
                        console.log('用户点击取消')
                      }
                    }
                  })
                } else if (res.data.msg == 388) {
                  wx.showModal({
                    title: '提示',
                    content: res.data.remark,
                    success(re) {
                      if (re.confirm) {
                        wx.redirectTo({
                          url: '/pages/purse/purse?index=1',
                        })
                      } else if (re.cancel) {
                        console.log('用户点击取消')
                      }
                    }
                  })
                } else if (res.data.msg == 398) {
                  wx.showModal({
                    title: '提示',
                    content: res.data.remark,
                    success(re) {
                      if (re.confirm) {

                      } else if (re.cancel) {
                        console.log('用户点击取消')
                      }
                    }
                  })
                } else if (res.data.msg == 404) {
                  wx.showModal({
                    title: '提示',
                    content: res.data.remark,
                    success(re) {
                      if (re.confirm) {

                      } else if (re.cancel) {
                        console.log('用户点击取消')
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
  mag:function(){
   wx.navigateTo({
     url: '/pages/new/new',
   })
  },
  //选择提现规则的状态
  role:function(){
    let that = this;
    that.setData({
      hide:true
    })
  },
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
        animation.translateY(300).step()
        this.setData({
          animationData: animation.export()
        })
      }.bind(this), 2000)
    }
  },
  //隐藏购物车
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
})
function getdata(that) {
  wx.request({
    url: getApp().openidData.url + 'withdraw.php',
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
        balance: res.data.balance,
      })
      var data = res.data.description;

      //替换标签中特殊字符
      var infoFlg = "<!--SPINFO#0-->";
      var imgFlg = "<!--IMG#";


      var content = "<div style=\"line-height:25px; font-weight:200; font-size:15px; color:gray; word-break:normal\">" + res.data.remark + "</div>";

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
