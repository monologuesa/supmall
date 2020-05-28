
Page({


  data: {
    type:-1,
    imageUrl:'',

  },
  onLoad: function (options) {
    var that = this;
    that.setData({
      imageUrl:getApp().openidData.urls,
      type:options.type,
    })
    getdata(that.data.type,that)
  },
  //点击切换
  click:function(e){
    console.log(e);
   var that = this;
   let type = that.data.type;
   let index = e.currentTarget.dataset.index;
   that.setData({
     type:index,
   })
    getdata(that.data.type, that)
  },
  //点击请香记录跳转
  jump:function(e){
   var that = this;
   let batchcode = e.currentTarget.dataset.batchcode;
   wx.navigateTo({
     url: '/pages/pleases/pleases?batchcode=' + batchcode,
   })
  },
  //点击祈福记录跳转
  jump_1: function (e) {
    var that = this;
    let batchcode = e.currentTarget.dataset.batchcode;
    wx.navigateTo({
      url: '/pages/blessS/blesss?batchcode=' + batchcode,
    })
  },
  //长按删除
  longPress: function (e) {
    var that = this;
    let id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '是否删除此条消息',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: getApp().openidData.url + 'del_content.php',
            data: {
              type: 'temple',
              id: id
            },
            method: 'POST',
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
              getdata(that.data.type, that)
            }
          })
        } else if (res.cancel) {
          console.log('取消')
        }
      },
    })
  }
})
//获取数据
function getdata(type,that) {
  wx.request({
    url: getApp().openidData.url + 'my_temple_log.php',
    data: {
      user_id: getApp().openidData.user_id,//用户id
      type:type,
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