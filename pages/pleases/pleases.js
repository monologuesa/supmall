// pages/pleases/pleases.js
var WxParse = require('../../wxParse/wxParse.js');
var imgSrc = "https://youte.xmtzxm.com.cn/weixinpl/youte/common_img/76.png"

Page({

  /**
   * 页面的初始数据
   */
  data: {
   hide:false,
   hide_1: false,//体验码
   batchcode:'',//传过来的订单号
  },
  onLoad: function (options) {
    console.log(options)
    var that = this;
    if (options.scene) {
      var scene = decodeURIComponent(options.scene);
      that.setData({
        imageurl: getApp().openidData.urls,//照片前缀
        sid: that.getUrlData(scene, 'sid'),//user_id
        bc: that.getUrlData(scene, 'bc')//订单号
      })
      getApp().login(that.data.sid, that.data.bc, getdata, that);
    }else{
      that.setData({ batchcode: options.batchcode })
      getdata(that.data.batchcode, that);
    }
  },
  //切割options.scene的
  getUrlData: function (vars, variable) {
    vars = vars.split("&");
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      if (pair[0] == variable) { return pair[1]; }
    }
    return (false);
  },
  //点击照片变大
  imgYu: function (e) {
    var that = this;
    let all = [];
    var list = e.currentTarget.dataset.list;
    all.push(list)
    console.log(all)
    wx.previewImage({
      urls: all // 需要预览的图片http链接列表
    })
  },
  //保存照片
  getImage_1: function () {
    getApp().getImg();
    wx.downloadFile({
      url: imgSrc,
      success: function (res) {
        console.log(res);
        //图片保存到本地
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function (data) {
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 1000
            })
          },
          fail: function (err) {
            console.log(err);
            if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
              console.log("用户一开始拒绝了，我们想再次发起授权")
              console.log('打开设置窗口')
              wx.openSetting({
                success(settingdata) {
                  console.log(settingdata)
                  if (settingdata.authSetting['scope.writePhotosAlbum']) {
                    console.log('获取权限成功，给出再次点击图片保存到相册的提示。')
                  } else {
                    console.log('获取权限失败，给出不给权限就无法正常使用的提示')
                  }
                }
              })
            }
          }
        })
      }
    })
  },
  //继续请香
  comment:function(){
    wx.redirectTo({
      url: '/pages/please/please',
    })
  },
  //打开小程序码
  hide:function(){
    var that = this;
    that.setData({ hide:true})
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
        hide: false,
        hide_1:false
      })
    }.bind(this), 200)
  },
  //小程序码中的分享朋友圈
  click: function () {
    var that = this;
    that.setData({
      hide: false,
      hide_1: true,
    })
  },
  //点击保存到手机
  getImage: function () {
    var that = this;
    getApp().getImg();
    var imgSrc = that.data.index_data_1.url_path
    console.log(imgSrc)
    wx.downloadFile({
      url: imgSrc,
      success: function (res) {
        console.log(res);
        //图片保存到本地
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function (data) {
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 1000
            })
            that.setData({
              hide_1:false,
            })
            console.log(data);
          },
          fail: function (err) {
            console.log(err);
            if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
              console.log("用户一开始拒绝了，我们想再次发起授权")
              console.log('打开设置窗口')
              wx.openSetting({
                success(settingdata) {
                  console.log(settingdata)
                  if (settingdata.authSetting['scope.writePhotosAlbum']) {
                    console.log('获取权限成功，给出再次点击图片保存到相册的提示。')
                  } else {
                    console.log('获取权限失败，给出不给权限就无法正常使用的提示')
                  }
                }
              })
            }
          }
        })
      }
    })
  },
  //分享微信好友
  onShareAppMessage: function (res) {
    var that = this;
    return {
      title: '精选游玩购',
    }
  },
})
//获取数据
function getdata(batchcode,that){
  wx.request({
    url: getApp().openidData.url + 'temple_order_details.php',
    data: {
      batchcode: batchcode,
    },
    method: 'POST',
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    success: function (res) {
      getcode(batchcode, that)
      that.setData({
        index_data: res.data,
      })
        for (var i = 0; i < res.data.saying.length; i++) {
          var list = res.data.saying[i].content
        }
        //替换标签中特殊字符
        var infoFlg = "<!--SPINFO#0-->";
        var imgFlg = "<!--IMG#";


        var content = "<div style=\"line-height:25px; font-weight:200; font-size:17px;  word-break:normal\">" + list + "</div>";

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
function getcode(batchcode, that) {
  wx.request({
    url: getApp().openidData.url + 'temple_weima.php',
    data: {
      batchcode: batchcode,
      user_id: getApp().openidData.user_id,
      customer_id: getApp().openidData.customer_id
    },
    method: 'POST',
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    success: function (res) {
      that.setData({
        index_data_1: res.data,
      })
    }
  })
}