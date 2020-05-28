// pages/service/service.js
Page({
  data: {
    index_data:'',//获取数据
    imageUrl:'',//域名
  },
  onLoad: function (options) {
   var that = this;
   that.setData({
     imageUrl:getApp().openidData.urls
   })
    getdata(that)
  },
  //跳转问题详情
  jump:function(e){
    var that = this;
    let index = e.currentTarget.dataset.index;
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/info/info?id=' + id + '&index=' + index,
    })
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
})
//获取数据
function getdata(that){
  wx.request({
    url: getApp().openidData.url + 'service_centre.php',
    data: {
      user_id:getApp().openidData.user_id
    },
    method: 'POST',
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    success: function (res) {
      console.log(res.data);
      that.setData({
        index_data: res.data,
      })
    }
  })
}
