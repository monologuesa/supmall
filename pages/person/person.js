// pages/person/person.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    emp: '',
    user_id: '',//用户id
    shouquan: 0,
    scene: -1,
    index_data:'',//获取数据
    inName:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    this.setData({
      user_id: getApp().openidData.user_id,
    })
    getdata(that)
  },
  onShow: function () {
    var that = this;
    //用户登录才调用获取用户数据接口
    if (that.data.user_id != "") {
      getApp().getUserInfo(-1,getdata, that);
    }
    wx.request({
      url: getApp().openidData.url + 'get_update.php',
      data: {
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res)
        that.setData({
          inName:res.data.msg
        })
      }
    })
  },
  // 用户登录
  login: function (e) {
    this.setData({ shouquan: 1 });
    let that = this;
    getApp().getUserInfo(-1,getdata, that);
    
  },
  //用户取消授权
  noGetuserinfo: function () {
    wx.hideLoading();
    this.setData({ shouquan: 0 });
    getApp().getUserInfo(-1,getdata, that);
  },
  //确认登录
  bindgetuserinfo: function () {
    var that = this;
    that.setData({ shouquan: 0 });
    getApp().getUserInfo(-1,getdata,that);
  },
  //取消登录
  noGetuserinfo: function () {
    wx.hideLoading();
    this.setData({ shouquan: 0 });
  },
  //订单跳转
  goMyorder:function(e){
    let type = e.currentTarget.dataset.type;
    console.log(type);
    wx.navigateTo({
      url: '/pages/my/my?type='+type,
    })
  },
  //我的钱包
  purse:function(){
    let that = this;
    let isOK = getApp().isLogin(-1, getdata, that);
    if (isOK) {
      wx.navigateTo({
        url: '/pages/purse/purse?index=1',
      })
    }
  },
  //请香祈福
  request:function(){
  let that = this;
    let isOK = getApp().isLogin(-1, getdata, that);
  if(isOK){
    wx.navigateTo({
      url: '/pages/request/request?type=0',
    })
  }
  },
  //申请
  in:function(){
    let that = this;
    let isOK = getApp().isLogin(-1, getdata, that);
    console.log(isOK);
    if (isOK) {
      wx.navigateTo({
        url: '/pages/in/in?type=1',
      })
    }
  },
  //商家管理
  management:function(){
    let that = this;
    let isOK = getApp().isLogin(-1, getdata, that);
      wx.navigateTo({
        url: '/pages/management/management',
      })

  },
  //消息管理
  notice:function(){
    let that = this;
    let isOK = getApp().isLogin(-1, getdata, that);
    if (isOK) {
      wx.navigateTo({
        url: '/pages/notice/notice?type=1',
      })
    }
  },
  //收藏夹
  collect: function () {
    let that = this;
    let isOK = getApp().isLogin(-1, getdata, that);
    if (isOK) {
      wx.navigateTo({
        url: '/pages/collect/collect',
      })
    }
  },
  //地址管理
  address:function(){
    let that = this;
    let isOK = getApp().isLogin(-1, getdata, that);
    if (isOK) {
      wx.navigateTo({
        url: '/pages/address/address?sort=2',
      })
    }
  },
  //签到
  sign:function(){
    let that = this;
    let isOK = getApp().isLogin(-1, getdata, that);
    if (isOK) {
      wx.navigateTo({
        url: '/pages/integral/integral',
      })
    }
  },
  //客服
  service:function(){
    let that = this;
    let isOK = getApp().isLogin(-1, getdata, that);
    if (isOK) {
      wx.navigateTo({
        url: '/pages/service/service',
      })
    }
  },
})
//获取数据
function getdata(that) {
  wx.request({
    url: getApp().openidData.url + 'get_user_data.php',
    data: {
      user_id: getApp().openidData.user_id,//用户id
    },
    method: 'POST',
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    success: function (res) {
      that.setData({
        index_data: res.data,
        user_id: getApp().openidData.user_id,
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