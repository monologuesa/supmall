// pages/in/in.js

var WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:'',//判断是个人中心进来的还是重新申请进来的
    tempFilePaths:null,
    urlImage:null,
    index_data:'',//上传商家营业执照
    index_data_1: '',//上传地址图片
    index_data_2:'',//
    hide:false,//隐藏的地方
    all:'',//页面数据
    judge:1,//判断上传的参数， 1的时候是显示默认的照片。2是显示上传的照片
    index_data_3:'',
  },

  onLoad: function (options) {
    var that = this;
    console.log(that.data.all);
    that.setData({
      type:options.type,
      urlImage: getApp().openidData.urls,
    })
    if(that.data.type == 1){
      getdata(that.data.type, that);
    }else if(that.data.type == 2){
      console.log(2222)
      that.setData({
        index_data: '',
        index_data_1: '',
        index_data_2: '',
      })
    }
  },
  onShow:function(){
   var that = this;
    // console.log(that.data.all);
    // wx.setNavigationBarTitle({
    //   title: that.data.all.name5
    // })

  },
  //上传商家营业执照
  addimage: function () {
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        wx.uploadFile({
          url: getApp().openidData.url + '/headimg_handle_xiao.php',
          filePath: res.tempFilePaths[0],
          name: 'headimg',
          formData: {
            user_id: getApp().openidData.user_id,
            customer_id: getApp().openidData.customer_id,
          },
          success: function (re) {
            var shop_bgimgurl = JSON.parse(re.data).data.shop_bgimgurl;
            var shop = JSON.parse(re.data).data;
            console.log(shop_bgimgurl)
            console.log(shop);
            that.setData({
              index_data: shop_bgimgurl,
              judge:2
            })
            console.log(that.data.index_data);
          }
        })
      }
    })
  },
  //上传身份证
  addimage1: function () {
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        wx.uploadFile({
          url: getApp().openidData.url + '/headimg_handle_xiao.php',
          filePath: res.tempFilePaths[0],
          name: 'headimg',
          formData: {
            user_id: getApp().openidData.user_id,
            customer_id: getApp().openidData.customer_id,
          },
          success: function (r) {
            var shop_bgimgurl = JSON.parse(r.data).data.shop_bgimgurl;
            var shop = JSON.parse(r.data).data;
            that.setData({
              index_data_1: shop_bgimgurl,
              judge: 2
            })
            console.log(that.data.index_data_1);
            // that.setData({
            //   index_data: res.data.data.shop_bgimgurl
            // })
          }
        })
      }
    })
  },
  //上传身份证
  addimage2: function () {
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        wx.uploadFile({
          url: getApp().openidData.url + '/headimg_handle_xiao.php',
          filePath: res.tempFilePaths[0],
          name: 'headimg',
          formData: {
            user_id: getApp().openidData.user_id,
            customer_id: getApp().openidData.customer_id,
          },
          success: function (r) {
            var shop_bgimgurl = JSON.parse(r.data).data.shop_bgimgurl;
            var shop = JSON.parse(r.data).data;
            that.setData({
              index_data_2: shop_bgimgurl,
              judge: 2
            })
            console.log(that.data.index_data_1);
            // that.setData({
            //   index_data: res.data.data.shop_bgimgurl
            // })
          }
        })
      }
    })
  },
  //表单提交
  formSubmit:function(e){
    var that =this;
    var mobile = e.detail.value.phone;//获取手机号
    var mobilePattern = /^1[3456789]\d{9}$/;
    if (e.detail.value.name.length > 12) {
      wx.showModal({
        title: '提示',
        content: '请填写12字以内的姓名',
      })
      return;
    }
    else if (!mobilePattern.test(mobile)) {

      wx.showModal({
        title: '提示',
        content: '请填写合法的手机号',
        showCancel: false
      })
      return;
    } 
    else if (e.detail.value.stort_name.length > 12) {
      wx.showModal({
        title: '提示',
        content: '请填写12字以内的店铺名字',
      })
      return;
    }
    else if (e.detail.value.address == '') {
      wx.showModal({
        title: '提示',
        content: '请输入正确的详细地址',
        showCancel: false
      })
      return;
    }
    else if (e.detail.value.paw == '') {
      wx.showModal({
        title: '提示',
        content: '请输入正确的密码',
        showCancel: false
      })
      return;
    }
    // else if (e.detail.value.stort_name.card > 21) {
    //   wx.showModal({
    //     title: '提示',
    //     content: '请输入正确的银行卡',
    //   })
    //   return;
    // }
    // else if (e.detail.value.card_name.length > 12) {
    //   wx.showModal({
    //     title: '提示',
    //     content: '请填写12字以内的银行卡名称',
    //   })
    //   return;
    // }
    // else if (that.data.index_data == '') {
    //   wx.showModal({
    //     title: '提示',
    //     content: '请上传商家营业执照',
    //   })
    //   return;
    // }
    else if (that.data.index_data_1 == '') {
      wx.showModal({
        title: '提示',
        content: '请上传身份证',
      })
      return;
    }
    // else if (that.data.index_data_2 == '') {
    //   wx.showModal({
    //     title: '提示',
    //     content: '请上传食品许可证',
    //   })
    //   return;
    // }
    else {
      wx.request({
        url: getApp().openidData.url + 'shop_reg.php',
        data:{
          user_id:getApp().openidData.user_id,
          customer_id:getApp().openidData.customer_id,
          name:e.detail.value.name,
          phone: e.detail.value.phone,
          shop_name: e.detail.value.stort_name,
          address: e.detail.value.address,
          pwd: e.detail.value.paw,
          card_num: e.detail.value.card,
          card_name: e.detail.value.card_name,
          license:that.data.index_data,
          id_in:that.data.index_data_1,
          food_licence: that.data.index_data_2,
        },
        method: 'POST',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success:function(res){
          console.log(res.data);
          if (res.data.status == 1) {
            wx.showToast({
              title: '成功',
              icon: 'success',
              duration: 2000
            })
            setTimeout(function () {
              wx.switchTab({
                url: '/pages/person/person',
             })
            }, 2000)
          } else if (res.data.status == 2 ){
            wx.showModal({
              title: '提示',
              content: res.data.msg,
              success: function(res) {
                if(res.confirm){
                  console.log('用户点击了确认')
                }else if(res.cancel){
                  console.log('用户点击了取消')
                }
              },
            })
          }
        }

      })
    }

  },
  //点击显示入驻须知
  out:function(){
   var that = this;
   that.setData({
     hide:true,
   })
  },
  //开启
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
})
//获取数据
function getdata(type,that) {
  wx.request({
    url: getApp().openidData.url + 'shop_status.php',
    data: {
      user_id: getApp().openidData.user_id,//用户id
      customer_id:getApp().openidData.customer_id
    },
    method: 'POST',
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    success: function (res) {
      wx.setNavigationBarTitle({
        title: res.data.name5
      })
      wx.request({
        url: getApp().openidData.url + 'is_show_goods.php',
        data: {

        },
        method: 'POST',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: function (res2) {
          if (res2.data.is_goods_open == 1) {
            if (res.data.status == 1) {
              that.setData({ all: res.data })
              console.log('未申请的状态')
              console.log(that.data.all)
            } else if (res.data.status == 2) {//未审核
              wx.showModal({
                title: '提示',
                content: res.data.msg,
                success: function (re) {
                  if (re.confirm) {
                    console.log('点击确认')
                  } else if (re.cancel) {
                    console.log('点击取消')
                  }
                },
              })
              that.setData({ all: res.data })
            } else if (res.data.status == 3 && type == 1) {//审核成功
              that.setData({ all: res.data })
              setTimeout(function () {
                wx.redirectTo({
                  url: '/pages/ins/ins',
                })
              }, 1000)
            } else if (res.data.status == 4 && type == 1) {//驳回
              that.setData({ all: res.data })
              setTimeout(function () {
                wx.redirectTo({
                  url: '/pages/inf/inf?reason=' + res.data.reason,
                })
              }, 1000)
            }
          } else {
            wx.switchTab({
              url: '/pages/person/person',
            })
          }
        }
      })




      var infoFlg = "<!--SPINFO#0-->";
      var imgFlg = "<!--IMG#";


      var content = "<div style=\"line-height:25px; font-weight:200; font-size:17px; color:black; word-break:normal\">" + res.data.supply_detail + "</div>";

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

function check(v) {
  var regex = new RegExp("^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z0-9_]){1,12}$");//不包含“-”
  // var regex = new RegExp("^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z0-9_-]){1,20}$");// 包含“-”
  var res = regex.test(v);
  if (res == true) {
    console.log("包含中英文字母或下划线");
    return true;
  } else {
    console.log("不包含中英文字母或下划线");
    return false;
  }
}
// //显示隐藏按钮
// function getshow(that) {
//   wx.request({
//     url: getApp().openidData.url + 'is_show_goods.php',
//     data: {

//     },
//     method: 'POST',
//     header: {
//       "Content-Type": "application/x-www-form-urlencoded"
//     },
//     success: function (res) {
//       that.setData({
//         index_data_3: res.data.is_goods_open
//       })
//     }
//   })
// }