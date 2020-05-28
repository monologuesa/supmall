// pages/commentInfo/commentInfo.js
Page({

  data: {
     id:'',//评论id
     index_data:'',//获取数据
     imageUrl:'',//域名
  },
  onLoad: function (options) {
    var that = this;
    that.setData({
      id:options.id,
      imageUrl:getApp().openidData.urls
    })
    getdata(that);
  },
  //点击评论照片变大
  imgYu_1: function (e) {
    var that = this;
    let imageurl = getApp().openidData.urls;
    var list = e.currentTarget.dataset.list;
    var index = e.currentTarget.dataset.index;
    for (var i = 0; i < list.length; i++) {
      list[i] = imageurl + list[i]
    }
    wx.previewImage({
      current: list[index],
      urls: list // 需要预览的图片http链接列表
    })
  },
  //回复
  formSubmit:function(e){
  console.log(e);
  let that = this;
  let name = e.detail.value.name;
  wx.request({
    url: getApp().openidData.url + 'shop_discuss_details.php',
    data:{
      user_id:getApp().openidData.user_id,
      e_id:that.data.id,
      type:'add',
      discuss:name
    },
    method: 'POST',
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    success:function(res){
      if (res.data.status == 1 ){
        wx.showModal({
          title: '提示',
          content: res.data.msg,
          success: function(re) {
            if(re.confirm){
              wx.showToast({
                title: '成功',
                icon: 'success',
                duration: 2000
              })
              getdata(that) ;
              // wx.redirectTo({
              //   url: '/pages/comment/comment',
              // })
            }else if(re.cancel){
              console.log('用户点击了取消')
            }
          },
        })
      }
    }
  })
  },




  // //删除
  // click:function(e){
  //   var that = this;
  //   let id = e.currentTarget.dataset.id;
  //   wx.request({  
  //     url: getApp().openidData.url + 'update_shop_discuss.php',
  //     data: {
  //       e_id: id,
  //       type: 'del',
  //     },
  //     method: 'POST',
  //     header: {
  //       "Content-Type": "application/x-www-form-urlencoded"
  //     },
  //     success: function (res) {
  //       if (res.data.status == 1) {
  //         wx.showModal({
  //           title: '提示',
  //           content: res.data.msg,
  //           success: function (re) {
  //             if (re.confirm) {
  //               wx.showToast({
  //                 title: '成功',
  //                 icon: 'success',
  //                 duration: 2000
  //               })
  //               getdata(that)
  //              wx.redirectTo({
  //                url: '/pages/comment/comment',
  //              })
  //             } else if (re.cancel) {
  //               console.log('用户点击了取消')
  //             }
  //           },
  //         })
  //       }
  //     }
  //   })

  // },

})
//获取数据
function getdata(that) {

  wx.request({
    url: getApp().openidData.url + 'shop_discuss_details.php',
    data: {
      e_id:that.data.id,
      type:'get',
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