
Page({
  data: {
    index_data:'',//获取数据
    imageUrl:'',//照片前缀
  },
  onLoad: function (options) {
   var  that = this;
   that.setData({
     imageUrl:getApp().openidData.urls
   })
    getdata(that);
  },
  //点击跳转
  info:function(e){
   var that = this;
    let type = e.currentTarget.dataset.type;
    let id = e.currentTarget.dataset.id;
    if (type == 1) {//旅游攻略的
      wx.navigateTo({
        url: '/pages/temple/temple?id=' + id + '&sort=1',
      })
    } else if (type == 2) {//美食攻略的
      wx.navigateTo({
        url: '/pages/temple/temple?id=' + id + '&sort=1',
      })
    } else if (type == 4) {//商品详情的
      wx.navigateTo({
        url: '/pages/shop/shop?id=' + id,
      })
    }
  },
})
//获取数据
function getdata(that) {
  wx.request({
    url: getApp().openidData.url + 'get_recommend.php',
    data: {
      // customer_id: getApp().openidData.customer_id,
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