
Page({
  data: {
    index_data: '',//获取数据
    imageUrl: '',//照片前缀
  },
  onLoad: function (options) {
    var that = this;
    that.setData({
      imageUrl: getApp().openidData.urls
    })
    getdata(that);
  },
  //点击跳转
  info: function (e) {
    var that = this;
    let id = e.currentTarget.dataset.id;//商品详情的
    let type = e.currentTarget.dataset.type;//商品详情的
    if (type == 0){
      wx.navigateTo({
        url: '/pages/shop/shop?id=' + id,
      })
    } else if (type == 1 || type == 2 || type == 3){
      wx.navigateTo({
        url: '/pages/temple/temple?id=' + id + '&sort=1',
      })
    }else if(type == 4){
      wx.navigateTo({
        url: '/pages/temple/temple?id=' + id + '&sort=2',
      })
    }
  },
  //跳转首页
  go:function(){
    var that = this;
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
})
//获取数据
function getdata(that) {
  wx.request({
    url: getApp().openidData.url + 'collect.php',
    data: {
      type:'list',
      user_id:getApp().openidData.user_id,
      // user_id:4381,
    },
    method: 'POST',
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    success: function (res) {
      that.setData({
        index_data: res.data
      })
    }
  })
}