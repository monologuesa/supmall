// pages/myOrder/myOrder.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
     hide:false,//隐藏物流
     type:0,//切换状态时的参数
     hide:false,//暂时没用
     hide1:false,//暂时没用
     imageUrl: '',//别问，看下面
    show: false,//控制下拉列表的显示隐藏，false隐藏、true显示
    selectData: [],//下拉列表的数据
    index: 0,//选择的下拉列表下标
    name:'',//所选的物流公司的名字
    id: '',//所选的物流公司的id
    batchcode:'',//点击发货是所携带的订单号
  },
  onLoad: function (options) {
     var that = this;
     that.setData({
       type:options.type,
       imageUrl: 'https://',
     })
    getdata(that, that.data.type)
  },
  //查看物流
  wuliu: function (e) {
    var expressnum = e.currentTarget.dataset.expressnum
    wx.navigateTo({
      url: '/wuliu/index?expressnum=' + expressnum,
    })
  },
  //点击发货出现填写信息
  click_1:function(e){
    var batchcode = e.currentTarget.dataset.batchcode;
    this.setData({ hide: true, batchcode: batchcode })
  },
  // 点击下拉显示框
  selectTap() {
    this.setData({
      show: !this.data.show
    });
  },
  // 点击下拉列表
  optionTap(e) {
    let Index = e.currentTarget.dataset.index;//获取点击的下拉列表的下标
    let id = e.currentTarget.dataset.id;//获取点击的下拉列表的id
    let name = e.currentTarget.dataset.name;//获取点击的下拉列表的id
    this.setData({
      index: Index,
      show: !this.data.show,
      name:name,
      id:id
    });
  },
  //点击发货
  formSubmit: function (e) {
    var that = this;
    let number = e.detail.value.number;
    if (number == ''){
      wx.showModal({
        title: '提示',
        content: '请输入物流单号',
        success: function(res) {},
      })
    }else if(that.data.id == ''){
      wx.showModal({
        title: '提示',
        content: '请选择物流公司',
        success: function (res) { },
      })
    }else{
      wx.request({
        url: getApp().openidData.url + 'shop_operation_goods.php',
        data: {
          batchcode: that.data.batchcode,
          type: 'send',
          expressnum: number,//单号
          express_id: that.data.id,//物流id

        },
        method: 'POST',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: function (res) {
          that.setData({ hide:false })
          if (res.data.status == 1) {
            wx.showToast({
              title: '成功',
              icon: 'success',
              duration: 2000
            })
            getdata(that, that.data.type)
          }
        }
      })
    }
  },
  //点击订单操作
  click:function(e){
   var that= this;
   let batchcode = e.currentTarget.dataset.batchcode; //传过来的订单号
   let name = e.currentTarget.dataset.name;//传过来的参数，用在data那边的
   console.log(name);

   wx.request({
     url: getApp().openidData.url + 'shop_operation_goods.php',
     data:{
       batchcode: batchcode,
       type:name
     },
     method: 'POST',
     header: {
       "Content-Type": "application/x-www-form-urlencoded"
     },
     success:function(res){
       if (res.data.status == 1){
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
               getdata(that, that.data.type)
             }else if(re.cancel){
               console.log('用户点击了取消')
             }
           },
         })
       }
     }
   })
  },
  //点击切换状态
  top:function(e){
    var that = this;
    var type = that.data.type;//切换状态时用的
    let index = e.currentTarget.dataset.index;//获取索引值
    that.setData({
      type:index
    })
    getdata(that, that.data.type);
  },
  // 显示遮罩层
  showModal: function () {
    let that = this;
      // 显示遮罩层
      var animation = wx.createAnimation({
        duration: 200,
        timingFunction: "linear",
        delay: 0
      })
      this.animation = animation
      animation.translateY(300).step()
      this.setData({
        animationData: animation.export(),
        hide1: true
      })
      setTimeout(function () {
        animation.translateY(0).step()
        this.setData({
          animationData: animation.export()
        })
      }.bind(this), 200)
  },
  // 隐藏遮罩层
  hideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        hide1: false,
        hide:false,
        name:''
      })
    }.bind(this), 200)
  },
  //跳转订单详情
  get_type: function (e) {
    var that = this;
    let gettype = e.currentTarget.dataset.gettype;
    let batchcode = e.currentTarget.dataset.batchcode;//商品的id
    let type = e.currentTarget.dataset.type;//索引值
    if (type == 1) {//跳转到待付款的订单详情
      wx.navigateTo({
        url: '/pages/shopDetail/shopDetail?batchcode=' + batchcode + '&sort=1',
      })
    }
    else if (type == 2) {//跳转到待发货的订单详情
      wx.navigateTo({
        url: '/pages/shopDetail/ship/ship?batchcode=' + batchcode + '&sort=1',
      })
    }
    else if (type == 3) {//跳转到待收货的订单详情
      wx.navigateTo({
        url: '/pages/shopDetail/complete/complete?batchcode=' + batchcode + '&sort=1',
      })
    }
    else if (type == 5) {//已完成的订单详情
      wx.navigateTo({
        url: '/pages/shopDetail/down/down?batchcode=' + batchcode + '&sort=1',
      })
    }
    else if (type == 6) {//售后的订单详情
      wx.navigateTo({
        url: '/pages/fail/fail?batchcode=' + batchcode,
      })
    }
  },
  //售后按钮的查看订单
  look: function (e) {
    var that = this;
    let batchcode = e.currentTarget.dataset.batchcode;
    wx.navigateTo({
      url: '/pages/fail/fail?batchcode=' + batchcode,
    })
  },
  //跳转店铺
  jump: function (e) {
    var that = this;
    let pid = e.currentTarget.dataset.pid;//店铺的id
    if (pid == -1) {
      console.log('平台的商品')
    } else {
      wx.navigateTo({
        url: '/pages/goldShop/goldShop?type=2' + '&id=' + pid,
      })
    }
  },
})
//获取数据
function getdata(that, type){
  wx.request({
    url: getApp().openidData.url + 'shop_orders.php',
    data: {
      user_id: getApp().openidData.user_id,
      // user_id:4388,
      customer_id: getApp().openidData.customer_id,
      currtype: type,
    },
    method: 'GET',
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    success: function (res) {
      that.setData({
        data: res.data.data.order_list
      })
      getlogistics(that)
    }
  })
}
//获取数据
function getlogistics(that) {
  wx.request({
    url: getApp().openidData.url + 'get_logistics.php',
    data: {
      user_id: getApp().openidData.user_id,
    },
    method: 'POST',
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    success: function (res) {
      that.setData({
        selectData: res.data.expresses
      })
    }
  })
}
