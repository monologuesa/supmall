// pages/release/release.js
Page({
  data: {
    imageUrl:'',//域名
    id:'',
  },
  onLoad: function (options) {
   var that = this;
   that.setData({
     index: options.index, //0 可发布产品  1已发布  2库存
     imageUrl:getApp().openidData.urls,//域名
   })
    getdata(that)
  },
  //跳转详情
   info:function(e){
    var that = this;
     let id = e.currentTarget.dataset.id;
     wx.navigateTo({
       url: '/pages/shop/shop?id=' + id,
     })
  },
  //点击上架下架
  click:function(e){
    var that = this;
    let type = e.currentTarget.dataset.type;
    let id = e.currentTarget.dataset.id;
    wx.request({
      url: getApp().openidData.url + 'update_shop_goods.php',
      data: {
        goods_id: id,
        type: type
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
       if(res.data.status == 1){
         wx.showModal({
           title: '提示',
           content: res.data.msg,
           success: function(re) {
             if(re.confirm){
               console.log('确认')
             }else if(re.cancel){
               console.log('取消')
             }
           },
         })
         getdata(that)
       }
        
      }
    })
  },
})
//获取数据
function getdata(that) {
  wx.request({
    url: getApp().openidData.url + 'get_shop_goods.php',
    data: {
      user_id: getApp().openidData.user_id,//用户id
      // user_id:4393,
      type:that.data.index
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
}
