// pages/goldShop/goldShop.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index_data_1:'',//获取二维码
    index_data:'',//获取数据
    type:2,//点击切换的参数
    id: '',//店铺的id
    imageUrl:'',//照片前缀
    phone:'',//获取的电话号码
  },
  onLoad: function (options) {
   var that = this;
    console.log(options)
    if (options.scene){
      that.setData({ 
        id: options.scene,//二维码所携带的参数
        imageUrl: getApp().openidData.urls//域名
       })
      getApp().getUserInfo(that.data.id,getdata,that);
    }else{
      that.setData({
        type: options.type,
        id: options.id,//店铺的id
        imageUrl: getApp().openidData.urls//域名
      })
      getdata(that.data.id, that);
    }
  },
  //拨打电话
  call:function(){
   var that = this;
    wx.makePhoneCall({
      phoneNumber: that.data.phone,
    })
  },
  //导航
  address_info:function(){
   var that = this;
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        let latitude = Number(that.data.index_data.latitude);
        let longitude = Number(that.data.index_data.longitude);
        wx.openLocation({
          latitude: latitude,
          longitude: longitude,
          name: that.data.index_data.address,
          scale: 28
        })
      }, fail: res => {
        //接口调用失败，提示用户打开定位功能
        wx.showModal({
          title: '提示',
          content: '获取定位失败，请打开定位，重新进入！',
        })
      }
    })
  },
  //点击跳转商品详情
  info:function(e){
    var that = this;
    let id = e.currentTarget.dataset.id;//商品的id
    wx.navigateTo({
      url: '/pages/shop/shop?id=' + id,
    })
  },
  //点击切换
 shop:function(e){
   let that = this;
   let index = e.currentTarget.dataset.index;//索引值
   that.setData({
     type:index
   })
 },
 //点击获取专属电话
  photo:function(){
   var that = this;
   wx.request({
     url: getApp().openidData.url + 'get_shop_exclusive.php',
     data:{
       supply_id:that.data.id
      //  supply_id: 4381
     },
     method: 'POST',
     header: {
       "Content-Type": "application/x-www-form-urlencoded"
     },
     success:function(res){
       console.log(res.data)
       if (res.data.status == 1){
        //  wx.showModal({
        //    title: '提示',
        //    content: res.data.msg,
        //    success: function(re) {
        //       if(re.confirm){
        //         console.log('用户点击了确认')
        //       }else if(re.cancel){
        //         console.log('用户点击了取消')
        //       }
        //    },
        //  })
       } else if (res.data.status == 2){
         that.setData({
           phone: res.data.phone
         })
       }
     }
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
  //点击评论照片变大
  imgYu_1: function (e) {
    var that = this;
    let imageurl = getApp().openidData.urls;
    var list = e.currentTarget.dataset.list;
    var index = e.currentTarget.dataset.index;
    for (var i = 0; i < list.length ; i++ ){
      list[i] = imageurl + list[i]
    }
    wx.previewImage({
      current: list[index],
      urls: list // 需要预览的图片http链接列表
    })
  },
})

//获取数据
function getdata(id,that) {
  wx.request({
    url: getApp().openidData.url + 'shops_details.php',
    data: {
      supply_id: id,
    },
    method: 'POST',
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    success: function (res) {
      console.log(res.data);
      that.setData({
        index_data: res.data
      })
      getcode(id,that)
    }
  })
}
//获取二维码
function getcode(id,that) {
  wx.request({
    url: getApp().openidData.url + 'shop_weima.php',
    data: {
      user_id: id,
      customer_id:getApp().openidData.customer_id,
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