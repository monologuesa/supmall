//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);
    // 获取小程序customer_id
    var that = this;
    //  console.log('获取小程序customer_id！！');
    let extConfig = wx.getExtConfigSync ? wx.getExtConfigSync() : {}
    if (extConfig.customer_id) {
      that.openidData.customer_id = extConfig.customer_id;
      that.openidData.extConfig = JSON.stringify(extConfig);
      that.globalData.checkcustomer_id = true;
      // 所以此处加入 callback 以防止这种情况
      if (that.checkLoginReadyCallback) {
        that.checkLoginReadyCallback(extConfig);
      }
    } else {
      that.openidData.customer_id = 37;
      that.globalData.checkcustomer_id = true;
      if (that.checkLoginReadyCallback) {
        that.checkLoginReadyCallback(extConfig);
      }
      wx.getExtConfig({
        success: function (res) {
          if (res.extConfig.customer_id) {
            that.openidData.customer_id = res.extConfig.customer_id
            that.globalData.checkcustomer_id = true;
            if (that.checkLoginReadyCallback) {
              that.checkLoginReadyCallback(res);
            }
          }
        }
      })
    }
  },
  //获取了那些权限
  getImg:function(){
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              console.log('授权成功')
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    checkcustomer_id: false
  },
  openidData:{
    url: 'https://youte.xmtzxm.com.cn/weixinpl/youte/',
    urls:'https://youte.xmtzxm.com.cn',
    customer_id: 37,
    user_id:null,
    city:'',//获取城市地址
  },
  //这是正常的登录，还有店铺扫码的都是用这个方法
  getUserInfo: function (cb,getData, thats) {//cb是user_id
    var that = this;
    wx.login({
      success: function (res) {
        wx.getUserInfo({
          success: function (re) {
            wx.request({
              url: that.openidData.url + 'getUserlogin.php',
              data: {
                code: res.code,
                weixin_name: re.userInfo.nickName,
                weixin_headimgurl: re.userInfo.avatarUrl,
                customer_id: that.openidData.customer_id,
                secen: cb
              },
              method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
              header: {
                "Content-Type": "application/x-www-form-urlencoded"
              },
              success: function (r) {
                getApp().getAddress(that);//获取地址
                that.openidData.user_id = r.data.user_id;
                if(cb == -1){//cb为二维码传进来的参数，等于-1为不是二维码进来的参数
                  if (getData) {
                    getData(thats);
                  }
                } else if (cb != -1) {//不等于-1为是二维码进来的参数
                  if (getData) {
                    getData(cb, thats);//cb是user_id
                  }
                }
              },
            })
          },
          fail: (res) => {
            wx.hideLoading();
          }
        })
      }
    })
  },
//这个登录是用来商品详情的扫码
  login: function (cb,id,getData,thats) {//cb是user_id ，id是商品的id
    var that = this;
    wx.login({
      success: function (res) {
        wx.getUserInfo({
          success: function (re) {
            wx.request({
              url: that.openidData.url + 'getUserlogin.php',
              data: {
                code: res.code,
                weixin_name: re.userInfo.nickName,
                weixin_headimgurl: re.userInfo.avatarUrl,
                customer_id: that.openidData.customer_id,
                secen: cb
              },
              method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
              header: {
                "Content-Type": "application/x-www-form-urlencoded"
              },
              success: function (r) {
                getApp().getAddress(that);//获取地址
                that.openidData.user_id = r.data.user_id;
                if(id){
                  if (getData) {
                    getData(id, thats); //id是商品的id
                  }
                }else{
                  if (getData) {
                    getData(thats); //id是商品的id
                  }
                }
              },
            })
          },
          fail: (res) => {
            wx.hideLoading();
          }
        })
      }
    })
  },
  
  /**
 * 是否跳出授权弹窗函数：isShowLoginMask
 */
  isShowLoginMask: function (user, getData, that) {
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          that.setData({ shouquan: 1 })
        } else {
          if (getApp().globalData.checkcustomer_id) {
            getApp().getUserInfo(user, getData, that);//user为二维码传进来的参数,两种 情况，-1不是二维码进来的，不等于-1的就是二维码传进来的参数
          } else {
            getApp().checkLoginReadyCallback = res => {
              getApp().getUserInfo(user, getData, that);
            };
          }
        }
      }
    })
  },
  isShow: function (user,id,getData, that) {
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          that.setData({ shouquan: 1 })
        } else {
          if (getApp().globalData.checkcustomer_id) {
            getApp().login(user,id,getData, that);//user为二维码传进来的参数,两种 情况，-1不是二维码进来的，不等于-1的就是二维码传进来的参数
          } else {
            getApp().checkLoginReadyCallback = res => {
              getApp().login(user, id,getData, that);
            };
          }
        }
      }
    })
  },
  /**
   * 判断用户是否登录函数：isLogin
   */
  isLogin: function (user,getData, that) {
    let isLogin;
    if (getApp().openidData.user_id) {
      isLogin = true;
    } else {
      isLogin = false;
      wx.showModal({
        title: '提示',
        content: '您未登录，是否立即登录?',
        success: function (res) {
          if (res.confirm) {
            getApp().isShowLoginMask(user, getData, that);
          } else {

          }
        }
      })
    }
    return isLogin;
  },
  //获取地址
  getAddress: function (that) {
    var that = this;
    var latitude;
    var longitude;
    wx.getLocation({
      type: 'gcj02',
      success(res) {
          latitude = res.latitude,
          longitude=res.longitude
        wx.request({
          url: getApp().openidData.url + 'get_address.php',
          data: {
            latitude: latitude,
            longitude: longitude
          },
          method: 'POST',
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          success: function (res) {
              that.openidData.city=res.data
          }
        })
      }
    })
  },
})


