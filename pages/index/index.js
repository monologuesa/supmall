
const app = getApp()

Page({
  data: {
    city:'',//市区
    latitude:'',//经度
    longitude:'',//纬度
    imageUrl:'',//域名
    address:'',//地址
    hide_1:false,//联系客服的隐藏
    //轮播开始
    indicatorDots:true,
    autoplay:true,
    interval:5000,
    duration:500,
    circular:true,
    //结束
  },
  onLoad: function (options) {
    //要是有分享进来的话，要先调用isShowLoginMask，吊起授权登录
    var that = this;
    if (options.scenes){//转发进来的
      that.setData({
        scene: options.scenes,
        imageUrl: getApp().openidData.urls,//域名
      })
      getApp().isShowLoginMask(that.data.scene, '', that);
    } else if (options.scene){//二维码
      that.setData({
        scene: options.scene,
        imageUrl: getApp().openidData.urls,//域名
      })      
      getApp().login(that.data.scene, '',getdata, that);
    }
    else{
      that.setData({
        imageUrl: getApp().openidData.urls,//域名
      })
      getApp().getUserInfo(-1, '', that);//两种情况，-1不是二维码进来的，不等于-1的就是二维码传进来的参数
    }
    getdata(that);
  },
  //获取头部的地址
  onShow:function(){
    var that = this;
    wx.getLocation({//这里是获取经纬度
      type: 'gcj02',
      success(res) {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
        wx.request({
          url: getApp().openidData.url + 'get_address.php',
          data: {
            latitude: that.data.latitude,
            longitude: that.data.longitude
          },
          method: 'POST',
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          success: function (res) {
            that.setData({
              city: res.data
            })
          },fail:function(res){

          }
        })
      }
    })
    
  },
  //第一张照片的各类跳转
  jump:function(){
    var that = this;
    let id = that.data.index_data.get_type;
    let pid = that.data.index_data.get_goods_id;
    let isOK = getApp().isLogin(-1, getdata, that);
    if (isOK) {
      if (id == 1) {
        wx.navigateTo({
          url: '/pages/Travelfood/Travelfood?type=1',
        })
      }else if(id == 2){
        wx.navigateTo({
          url: '/pages/attractions/attractions',
        })
      }else if(id == 3){
        wx.switchTab({
          url: '/pages/specialty/specialty',
        })
      }else if(id == 4){
        wx.navigateTo({
          url: '/pages/gold/gold?type=1',
        })
      }else if(id == 5){
        wx.navigateTo({
          url: '/pages/traveList/traveList?type=1',
        })
      }else if(id == 6){
        wx.navigateTo({
          url: '/pages/foodList/foodList?type=1',
        })
      }else if(id == 7){
        wx.navigateTo({
          url: '/pages/integral/integral',
        })
      }else if(id == 8){
        wx.navigateTo({
          url: '/pages/spec/spec',
        })
      }else if(id == 9){
        wx.navigateTo({
          url: '/pages/preferred/preferred',
        })
      }else if(id == 10){
        wx.navigateTo({
          url: '/pages/recommend/recommend',
        })
      }else if(id == 11){
        wx.navigateTo({
          url: '/pages/shop/shop?id=' + pid,
        })
      }else if(id == 12){
        that.setData({
          hide_1:true
        })
      }else if(id == 13){
        wx.navigateTo({
          url: '/pages/in/in?type=1',
        })
      }
    }
  },
  hide:function(){
    var that = this;
    that.setData({
      hide_1:false
    })
  },
  //第二张照片的跳转
  jump_1:function(){
    var that = this;
    let id = that.data.index_data.get_type2;
    let pid = that.data.index_data.get_goods_id2;
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
      } else if (id == 12) {
        that.setData({
          hide_1: true
        })
      } else if (id == 13) {
        wx.navigateTo({
          url: '/pages/in/in?type=1',
        })
      }
    }
  },
  //点击获取具体地址
  address_1: function () {
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
            that.setData({
              address: re.data
            })
          }
        })
      }
    })
  },
  //头部轮播图点击跳转商品详情
  choose:function(e){
    let that = this;
    let isOK = getApp().isLogin(-1, getdata, that);
    if (isOK) {
      let id = e.currentTarget.dataset.id;//商品的id
      wx.navigateTo({
        url: '/pages/shop/shop?id=' + id,
      })
    }
  },
  //优选特产跳转
  choose_1:function(){
    let that = this;
    let isOK = getApp().isLogin(-1, getdata, that);
    if (isOK) {
      wx.navigateTo({
        url: '/pages/spec/spec',
      })
    }
  },
  //优选推荐跳转
  choose_2:function(){
    let that = this;
    let isOK = getApp().isLogin(-1, getdata, that);
    // if (isOK) {
      wx.navigateTo({
        url: '/pages/recommend/recommend',
      })
    // }
  },
  //优选商家跳转
  choose_3:function(){
    let that = this;
    let isOK = getApp().isLogin(-1, getdata, that);
    if (isOK) {
      wx.navigateTo({
        url: '/pages/preferred/preferred',
      })
    }
  },
  //优选商家里面的点击店铺跳转
  info: function (e) {
    let that = this;
    let isOK = getApp().isLogin(-1, getdata, that);
    if (isOK) {
      let id = e.currentTarget.dataset.id;//店铺的id
      wx.navigateTo({
        url: '/pages/goldShop/goldShop?type=2' + '&id=' + id,
      })
    }
  },
  //优选推荐里面的各种跳转
  choose_4:function(e){
    let that = this;
    let isOK = getApp().isLogin(-1, getdata, that);
    // if (isOK) {
      let type = e.currentTarget.dataset.type;
      let id = e.currentTarget.dataset.id;
      if(type == 1){//旅游攻略的
        wx.navigateTo({
          url: '/pages/temple/temple?id=' + id + '&sort=1',
        })
      }else if(type == 2){//美食攻略的
        wx.navigateTo({
          url: '/pages/temple/temple?id=' + id + '&sort=1',
        })
      }else if(type == 4){//商品详情的
        wx.navigateTo({
          url: '/pages/shop/shop?id=' + id,
        })
      }
    // }
  },
//定位
  address:function(){
  var that = this;
    wx.chooseLocation({
      success: function (res) {
        that.setData({
          address: res.name
        })
      }
    })
  },
  //搜索
  search:function(){
    let that = this;
    let isOK = getApp().isLogin(-1, getdata, that);
    if (isOK) {
      wx.navigateTo({
        url: '/pages/search/search',
      })
    }
  },
  //旅游美食
  click_1:function(){
    let that = this;
    let isOK = getApp().isLogin(-1, getdata, that);
    if (isOK) {
      wx.navigateTo({
        url: '/pages/Travelfood/Travelfood?type=1',
      })
    }
  },
  //寺庙景点
  click_2:function(){
    let that = this;
    let isOK = getApp().isLogin(-1, getdata, that);
    if (isOK) {
      wx.navigateTo({
        url: '/pages/attractions/attractions',
      })
    }

  },
  // 当地特产
  click_3:function(){
    let that = this;
    let isOK = getApp().isLogin(-1, getdata, that);
    if (isOK) {
      wx.switchTab({
        url: '/pages/specialty/specialty',
      })
    }

  },
  // 金牌店铺
  click_4:function(){
    let that = this;
    let isOK = getApp().isLogin(-1, getdata, that);
    if (isOK) {
      wx.navigateTo({
        url: '/pages/gold/gold?type=1',
      })
    }

  },
  // 旅游攻略
  click_5:function(){
    let that = this;
    let isOK = getApp().isLogin(-1, getdata, that);
    if (isOK) {
      wx.navigateTo({
        url: '/pages/traveList/traveList?type=1',
      })
    }

  },
  // 美食攻略
  click_6:function(){
    let that = this;
    let isOK = getApp().isLogin(-1, getdata, that);
    if (isOK) {
      wx.navigateTo({
        url: '/pages/foodList/foodList?type=1',
      })
    }
  },
  // 积分商城
  click_7:function(){
    let that = this;
    let isOK = getApp().isLogin(-1,getdata, that);
    if (isOK) {
      wx.navigateTo({
        url: '/pages/integral/integral',
      })
    }
  },
  // 查看更多
  click_8:function(){
    let that = this;
    let isOK = getApp().isLogin(-1, getdata, that);
    if (isOK) {
      wx.navigateTo({
        url: '/pages/more/more',
      })
    }
  },
  //确认登录
  bindgetuserinfo: function () {
    var that = this;
    that.setData({ shouquan: 0 });
    getApp().login(that.data.scene,'','', that);
  },
  //取消登录
  noGetuserinfo: function () {
    wx.hideLoading();
    this.setData({ shouquan: 0 });
  },
  //分享微信好友
  onShareAppMessage: function (res) {
    var that = this;
    return {
      title: '精选游玩购,免费入驻开店',
      path: '/pages/index/index?scenes=' + getApp().openidData.user_id,
    }
  },
 
})
//获取数据
function getdata(that) {
  wx.request({
    url: getApp().openidData.url +'get_index.php',
    data: {
      customer_id: getApp().openidData.customer_id,
    },
    method: 'POST',
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    success: function (res) {
      console.log(res)
      that.setData({
        index_data: res.data
      })
      getshow(that)
    }
  })
}
//显示隐藏按钮
function getshow(that) {
  wx.request({
    url: getApp().openidData.url + 'is_show_goods.php',
    data: {
      
    },
    method: 'POST',
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    success: function (res) {
      that.setData({
        index_data_1: res.data
      })
    }
  })
}
