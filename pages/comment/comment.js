// pages/comment/comment.js
Page({


  data: {
     index_data:'',//获取数据
     imageUrl:'',//域名
  },
  onLoad: function (options) {
    var that = this;
    that.setData({
      imageUrl:getApp().openidData.urls,//域名
    })
    getdata(that)
  },
  //点击删除，驳回，通过
  click:function(e){
    var that = this;
    let name = e.currentTarget.dataset.name;
    let id = e.currentTarget.dataset.id;
    wx.request({
      url: getApp().openidData.url + 'update_shop_discuss.php',
      data:{
        e_id:id,
        type:name,
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success:function(res){
        if (res.data.status == 1) {
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            success: function (re) {
              if (re.confirm) {
                wx.showToast({
                  title: '成功',
                  icon: 'success',
                  duration: 2000
                })
                getdata(that)
              } else if (re.cancel) {
                console.log('用户点击了取消')
              }
            },
          })
        }
      }
    })
  },
  //跳转评论详情
  detail:function(e){
     var that = this;
     let id = e.currentTarget.dataset.id;
     wx.navigateTo({
       url: '/pages/commentInfo/commentInfo?id=' + id,
     })
  },
})
//获取数据
function getdata(that) {
  wx.request({
    url: getApp().openidData.url + 'get_shop_discuss.php',
    data: {
      user_id: getApp().openidData.user_id,//用户id
      // user_id: 4526,
    },
    method: 'POST',
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    success: function (res) {
      // 获取评论数据转成16进制再渲染
      for (let i = 0; i < res.data.length; i++) {
        res.data[i].discuss = entitiesToUtf16(res.data[i].discuss);
      }
      that.setData({
        index_data: res.data
      })
    }
  })
}
//将编码后的八进制的emoji表情重新解码成十六进制的表情字符
function entitiesToUtf16(str) {
  return str.replace(/&#(\d+);/g, function (match, dec) {
    let H = Math.floor((dec - 0x10000) / 0x400) + 0xD800;
    let L = Math.floor(dec - 0x10000) % 0x400 + 0xDC00;
    return String.fromCharCode(H, L);
  });
}