// pages/gold/gold.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address:'',//具体地址
    imageUrl: '',//照片前缀
    hide: false,//隐藏
    hide_1:false,//联系客服的隐藏
  },
  onLoad: function (options) {
    console.log(options);
    var that = this;
    that.setData({
      city: getApp().openidData.city,//默认地址
      imageUrl: getApp().openidData.urls
    })
    getdata(that)
  },
  //第二张照片的跳转
  jump_1: function () {
    var that = this;
    let id = that.data.index_data.get_type4;
    let pid = that.data.index_data.get_goods_id4;
    let isOK = getApp().isLogin(-1, getdata, that);
    if (isOK) {
      if (id == 1) {
        wx.navigateTo({
          url: '/pages/Travelfood/Travelfood?type=1',
        })
      } else if (id == 2) {
        wx.navigateTo({
          url: '/pages/attractions/attractions',
        })
      } else if (id == 3) {
        wx.switchTab({
          url: '/pages/specialty/specialty',
        })
      } else if (id == 4) {
        wx.navigateTo({
          url: '/pages/gold/gold?type=1',
        })
      } else if (id == 5) {
        wx.navigateTo({
          url: '/pages/traveList/traveList?type=1',
        })
      } else if (id == 6) {
        wx.navigateTo({
          url: '/pages/foodList/foodList?type=1',
        })
      } else if (id == 7) {
        wx.navigateTo({
          url: '/pages/integral/integral',
        })
      } else if (id == 8) {
        wx.navigateTo({
          url: '/pages/spec/spec',
        })
      } else if (id == 9) {
        wx.navigateTo({
          url: '/pages/preferred/preferred',
        })
      } else if (id == 10) {
        wx.navigateTo({
          url: '/pages/recommend/recommend',
        })
      } else if (id == 11) {
        wx.navigateTo({
          url: '/pages/shop/shop?id=' + pid,
        })
      }else if(id == 12){
        that.setData({
          hide_1:true
        })
      } else if (id == 13) {
        wx.navigateTo({
          url: '/pages/in/in?type=1',
        })
      }
    }
  },
  //点击显示遮罩
  show: function () {
    var that = this;
    that.setData({
      hide: true,
      index_data_1:''
    })
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
  //点击获取具体地址
  click_4: function () {
    var that = this
    wx.chooseLocation({
      success: function (res) {
        wx.request({
          url: getApp().openidData.url + 'get_address.php',
          data: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          method: 'POST',
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          success: function (re) {
            console.log(re)
            that.setData({
              address: re.data
            })
          }
        })

      }
    })
  },
  //点击搜索
  form: function (e) {
    var that = this;
    let name = e.detail.value.text;
    wx.request({
      url: getApp().openidData.url + 'get_shop_list.php',
      data: {
        shop_name: name,
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res.data);
        that.setData({
          index_data_1: res.data,
          name:''
        })
      }
    })
  },
  //点击跳转详情
  info: function (e) {
    var that = this;
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/goldShop/goldShop?type=2' + '&id=' + id,
    })
  },
  //这是搜索里面点击跳转详情
  info_1: function (e) {
    var that = this;
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/goldShop/goldShop?type=2' + '&id=' + id,
    })
  },
  //点击切换
  // life: function (e) {
  //   let that = this;
  //   let index = e.currentTarget.dataset.index;
  //   that.setData({
  //     type: index
  //   })
  // },
})
//获取数据
function getdata(that) {
  wx.request({
    url: getApp().openidData.url + 'get_shop_list.php',
    data: {
      shop_name: '',
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
    }
  })
}