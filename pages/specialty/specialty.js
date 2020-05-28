// pages/specialty/specialty.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    latitude:'',//纬度
    longitude:'',//经度
    type_1:0,//销量和离我最近的选择
    hide_2:false,//筛选的隐藏
    city:'',//市
    city_1:'',//判断是否选择过地区
    index_data:'',    //列表数据
    imageurl:'',    //地址
    hide:false,    //搜索隐藏区域
    type:1,//列表的索引值
    id:'',//列表的id
    //轮播图
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 500,
    circular: true,
    //轮播图结束
  },
  //获取数据
  onLoad: function (options) {
    var that = this;
    that.setData({
      imageurl: getApp().openidData.urls,
    })
    wx.getLocation({
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
          }
        })
        getlist(that)
      }
    })
   
  },
  //获取头部的地址
  onShow: function () {
    var that = this;

  },
  //点击切换头部列表
  click:function(e){
    var that = this;
    let index = e.currentTarget.dataset.index;
    let id = e.currentTarget.dataset.id;
    that.setData({
      type : Number(index) + 1,
      id : id
    })
    console.log(222)
    getdata(that)
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
              city: re.data,
              city_1:re.data
            })
            getdata(that)
          }
        })
      }
    })
  },
  //点击轮播图跳转商品详情
  choose:function(e){
    let that = this;
    let isOK = getApp().isLogin(-1, getlist, that);
    if (isOK) {
      let id = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: '/pages/shop/shop?id=' + id,
      })
    }

  },
  //跳转商品详情
  list:function(e){
    let that = this;
      let id = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: '/pages/shop/shop?id=' + id,
      })
  },
  //搜索栏
  input:function(){
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },
  //确认登录
  bindgetuserinfo: function () {
    var that = this;
    that.setData({ shouquan: 0 });
    getApp().getUserInfo(-1, getdata, that);
  },
  //取消登录
  noGetuserinfo: function () {
    wx.hideLoading();
    this.setData({ shouquan: 0 });
  },
  //开启筛选
  open:function(){
     this.setData({ hide_2:true })
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
        hide_1: false,
        hide_2: false,
      })
    }.bind(this), 200)
  },
  //筛选选择
  select:function(e){
    var that =this;
    let index = e.currentTarget.dataset.index;//索引值
    that.setData({ type_1:index })
    getdata(that)
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
        hide_2: false,
      })
    }.bind(this), 200)
  }
})
//获取数据
function getdata(that){
  if(that.data.type_1 == 0){
    wx.request({
      url: getApp().openidData.url + 'local_specialty.php',
      data: {
        customer_id: getApp().openidData.customer_id,//customer_id
        address: that.data.city_1,
        type_id: that.data.id,
        latitude: that.data.latitude,
        longitude: that.data.longitude,
        distance:'',
        sell_count:''
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        that.setData({
          index_data: res.data,
        })
      }
    })
  }else if(that.data.type_1 == 1){
    wx.request({
      url: getApp().openidData.url + 'local_specialty.php',
      data: {
        customer_id: getApp().openidData.customer_id,//customer_id
        address: that.data.city_1,
        type_id: that.data.id,
        latitude: that.data.latitude,
        longitude: that.data.longitude,
        distance: '',
        sell_count: 'desc',
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        that.setData({
          index_data: res.data,
        })
      }
    })
  }else if(that.data.type_1 == 2){
    wx.request({
      url: getApp().openidData.url + 'local_specialty.php',
      data: {
        customer_id: getApp().openidData.customer_id,//customer_id
        address: that.data.city_1,
        type_id: that.data.id,
        latitude: that.data.latitude,
        longitude: that.data.longitude,
        distance: 1,
        sell_count: '',
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(3333)
        that.setData({
          index_data: res.data,
        })
      }
    })
  }
}
//获取列表数据
function getlist(that){
  wx.request({
    url: getApp().openidData.url + 'speciality_type.php',
    data: {
      customer_id: getApp().openidData.customer_id,//customer_id
    },
    method: 'POST',
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    success: function (res) {
      console.log(res.data);
      that.setData({
        index_data_1: res.data,
        id: res.data.arr[0].type_id
      })
      getdata(that) 
    }
  })
}
