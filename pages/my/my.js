// pages/my/my.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:1,
    hide:false,
    hide1:false,
    data:'',//获取全部数据
    imageUrl:'',
  },

  onLoad: function (options) {
    var that = this;
    console.log(options);
    that.setData({
      type: options.type,
      imageUrl:'https://'
    })
    getdata(that, that.data.type);
  },
  //跳转店铺
  jump:function(e){
   var that =this;
   let pid = e.currentTarget.dataset.pid;//店铺的id
   if(pid == -1){
     console.log('平台的商品')
   }else{
     wx.navigateTo({
       url: '/pages/goldShop/goldShop?type=2' + '&id=' + pid,
     })
   }
  },
  //申请售后
  aftersale:function(e){
  var that = this;
  let gettype = e.currentTarget.dataset.gettype;
  let totalprice = e.currentTarget.dataset.totalprice;
  let batchcode = e.currentTarget.dataset.batchcode;
    console.log(gettype)
  wx.redirectTo({
    url: '/pages/refund/refund?totalprice=' + totalprice + '&batchcode=' + batchcode + '&gettype=' + gettype,
  })
  },
  //查看物流
  wuliu: function (e) {
    var expressnum = e.currentTarget.dataset.expressnum
    wx.navigateToMiniProgram({
      appId: 'wx6885acbedba59c14',//小程序appid
      path: 'pages/result/result?nu=' + expressnum + '&querysource=third_xcx',//跳转关联小程序app.json配置里面的地址
      extraData: {//需要传递给目标小程序的数据，目标小程序可在 App.onLaunch()，App.onShow() 中获取到这份数据。
        foo: 'bar'
      },
      //**重点**要打开的小程序版本，有效值 develop（开发版），trial（体验版），release（正式版） 
      envVersion: 'develop',
      success(res) {
        // 打开成功
      }
    })
  },
  //导航栏切换
  click:function(e) {
    var that = this;
    let type = that.data.type;//获取点击的状态
    let index = e.currentTarget.dataset.index;
    that.setData({
      type:index,
      data:'',
    })
    getdata(that, that.data.type);
  },
  //提醒发货
  remind:function(e){
    var that = this;
    let id = e.currentTarget.dataset.id;//订单号
    wx.request({
      url:'https://youte.xmtzxm.com.cn/weixinpl/mshop/orderlist_operation.php',
      data:{
        batchcode:id,
        user_id:getApp().openidData.user_id,
        op: 'remind',
      },
      method: 'GET',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success:function(res){
        if (res.data) {
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 2000
          })
          getdata(that, that.data.type);
        }
      }
    }) 
  },
  //取消订单
  cancel:function(e){
    var that = this;
    let id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '取消订单之后无法恢复，请慎重考虑',
      success: function(res) {
       if(res.confirm){
         wx.request({
          url: 'https://youte.xmtzxm.com.cn/weixinpl/mshop/orderlist_operation.php',
          data: {
            batchcode: id,
            user_id: getApp().openidData.user_id,
            op: 'cancel',
          },
          method: 'GET',
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          success: function (re) {
            if (re.data) {
              wx.showToast({
                title: '成功',
                icon: 'success',
                duration: 2000
              })
              getdata(that, that.data.type);
            }
          }
        })
       }else if(res.cancel){
         console.log('用户点击了取消，这里是取消订单的按钮')
       }

      },
    })
  },
  //确认收货
  confirm: function (e) {
    var that = this;
    let id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '确认订单之后无法恢复，请慎重考虑',
      success: function(res) {
        if (res.confirm) {
          wx.request({
            url: 'https://youte.xmtzxm.com.cn/weixinpl/mshop/orderlist_operation.php',
            data: {
              batchcode: id,
              user_id: getApp().openidData.user_id,
              op: 'confirm',
            },
            method: 'GET',
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
              if (res.data) {
                wx.showToast({
                  title: '成功',
                  icon: 'success',
                  duration: 2000
                })
                wx.redirectTo({
                  url: '/pages/my/my?type=5',
                })
                getdata(that, that.data.type);
              }
            }
          })

        }else if(res.cancel){
          console.log('用户点击了取消，这里是确认收货的')
        }

      },
    })

  },
  //售后按钮的查看订单
  look:function(e){
   var that = this;
   let batchcode = e.currentTarget.dataset.batchcode;
   wx.navigateTo({
     url: '/pages/fail/fail?batchcode=' + batchcode,
   })
  },
  //删除
  updete: function (e) {
    var that = this;
    let id = e.currentTarget.dataset.id;//获取商品订单号
    wx.showModal({
      title: '提示',
      content: '是否删除订单，删除订单之后无法恢复',
      success: function(res) {
        if(res.confirm){
          wx.request({
            url: 'https://youte.xmtzxm.com.cn/weixinpl/mshop/orderlist_operation.php',
            data: {
              batchcode: id,
              user_id: getApp().openidData.user_id,
              op: 'order_update',
            },
            method: 'GET',
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
              if (res.data) {
                wx.showToast({
                  title: '成功',
                  icon: 'success',
                  duration: 2000
                })
                getdata(that, that.data.type);
              }
            }
          })
        }else if(res.cancel){
          console.log('用户点击了删除订单的取消按钮')
        }
      },
    })

  },
  //去支付
  goPay: function (e) {
    console.log(11111111);
    var that = this;
    let id = e.currentTarget.dataset.id;//获取商品的订单号
    wx.redirectTo({
      url: '/pages/shopDetail/shopDetail?batchcode=' + id + '&sort=0',
    })
  },
  //立即评价
  discuss:function(e){
    console.log(e)
    let that = this;
    let batchcode = e.currentTarget.dataset.batchcode;//获取商品的订单号
    wx.redirectTo({
      url: '/pages/post/post?batchcode=' + batchcode,
    })
  },
  //跳转订单详情
  get_type:function(e){
     var that = this;
    let gettype = e.currentTarget.dataset.gettype;
    let batchcode = e.currentTarget.dataset.batchcode;//商品的id
    let type = e.currentTarget.dataset.type;//索引值
    console.log(type)
    if( type == 1){//跳转到待付款的订单详情
      wx.navigateTo({
        url: '/pages/shopDetail/shopDetail?batchcode=' + batchcode + '&sort=0',
      })
    }
    else if(type == 2 ){//跳转到待发货的订单详情
      wx.navigateTo({
        url: '/pages/shopDetail/ship/ship?batchcode=' + batchcode + '&gettype=' + gettype + '&sort=0',
      })
    }
    else if (type == 3) {//跳转到待收货的订单详情
      wx.navigateTo({
        url: '/pages/shopDetail/complete/complete?batchcode=' + batchcode + '&gettype=' + gettype + '&sort=0',
      })
    }
    else if (type == 4) {//待评价的订单详情
      wx.navigateTo({
        url: '/pages/shopDetail/invalid/invalid?batchcode=' + batchcode + '&sort=0',
      })
    }
    else if (type == 5) {//已完成的订单详情
      wx.navigateTo({
        url: '/pages/shopDetail/down/down?batchcode=' + batchcode + '&sort=0',
      })
    }
    else if (type == 6) {//售后的订单详情
      wx.navigateTo({
        url: '/pages/fail/fail?batchcode=' + batchcode,
      })
    }
  }
})
//获取全部订单
function getdata(that,type){
  wx.request({
    url: getApp().openidData.url + 'orderlist_xiao.php',
    data: {
      user_id: getApp().openidData.user_id,//用户id
      customer_id:getApp().openidData.customer_id,
      currtype:type,
    },
    method: 'GET',
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    success: function (res) {
      that.setData({
        data: res.data.data.order_list
      })
    }
  })
  
}
