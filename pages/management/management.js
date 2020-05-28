// pages/management/management.js
Page({


  data: {
    index_data:'',//获取数据

  },

  onLoad: function (options) {
  },
  onShow:function(){
    var that = this;
    getdata(that)
  },
  //可发布 已发布  库存 0 可发布产品  1已发布  2库存
  jump:function(e){
    var that = this;
    let index = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '/pages/release/release?index=' + index,
    })
  },
  //点击保证金退款
  refund:function(){
    var that = this;
    wx.showModal({
      title: '提示',
      content: '是否退保证金',
      success: function(res) {
        if(res.confirm){
            wx.request({
              url: getApp().openidData.url + 'supply_cash_refund.php',
              data: {
                user_id: getApp().openidData.user_id,//用户id
              },
              method: 'POST',
              header: {
                "Content-Type": "application/x-www-form-urlencoded"
              },
              success: function (re) {
                if (re.data.status == 1){
                  wx.showModal({
                    title: '提示',
                    content: re.data.msg,
                  })
                } else if (re.data.status == 2){
                    wx.showModal({
                      title: '提示',
                      content: re.data.msg,
                    })
                }
              }
            })
        }else if(res.cancel){
          console.log('取消')
        }
      },
    })
  },
  //保证金缴纳
  guarantee:function(){
    wx.navigateTo({
      url: '/pages/refresh/refresh',
    })
  },
  //跳转到订单管理
  getOrder:function(){
    wx.navigateTo({
      url: '/pages/myOrder/myOrder?type=9',
    })
  },
  //订单管理
  myOrder:function(){
    wx.navigateTo({
      url: '/pages/myOrder/myOrder?type=1',
    })
  },
  //专属电话
  phone:function(){
    wx.navigateTo({
      url: '/pages/adpay/adpay?select= 0' + '&id=1',
    })
  },
  //评论管理
  comment:function(){
   wx.navigateTo({
     url: '/pages/comment/comment',
   })
  },
  //广告位
  ad:function(){
    wx.navigateTo({
      url: '/pages/ad/ad',
    })
  },
  //店铺排行
  rank:function(){
    wx.navigateTo({
      url: '/pages/rank/rank',
    })
  },
  //商品排行
  shop: function () {
    wx.navigateTo({
      url: '/pages/shopRank/shopRank',
    })
  },
  //更新资料
  updata:function(){
    wx.navigateTo({
      url: '/pages/updata/updata?type=1',
    })
  },

})
//获取数据
function getdata(that) {
 wx.request({
  url: getApp().openidData.url + 'shop_manage.php',
  data: {
    user_id: getApp().openidData.user_id,//用户id
    // user_id: 4393,
  },
  method: 'POST',
  header: {
    "Content-Type": "application/x-www-form-urlencoded"
  },
  success: function (res) {
     that.setData({
       index_data:res.data
     })
  }
 })
}
