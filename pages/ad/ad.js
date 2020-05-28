
Page({


  data: {
   index_data:'',//获取数据
   imageUrl:'',//你知道的
  },
  onLoad: function (options) {
   var that = this;
   that.setData({ imageUrl:getApp().openidData.urls })
    getdata(that)
  },
  //点击创建广告位
  ad:function(){
   wx.navigateTo({
     url: '/pages/adM/adM?index=2',
   })
  },
  //点击详情跳转
  click:function(e){
    var that = this;
    let id = e.currentTarget.dataset.id;
    wx.redirectTo({
      url: '/pages/adM/adM?id='+ id +'&index=1',
    })
  }
})
//获取数据
function getdata(that) {
  wx.request({
    url: getApp().openidData.url +'get_advertising.php',
    data: {
      user_id: getApp().openidData.user_id,//用户id
      // user_id: 3063,
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


