// pages/address/address.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
     hide:false,//这是判断有没有数据的，没数据的时候这个为true
     hide_1: false, //有数据的时候显示地址列表，有数据的时候这个为true
     index_data:'',//获取数据
     sort:'',//这是确认订单过来的数据

  },

  onLoad: function (options) {
    console.log(options)
    var that = this;
    that.setData({
      sort: options.sort,
    })
    if(that.data.sort == 1){//这是商品详情过来的数据
      that.setData({
        pid: options.pid,//商品的id
        rcount: options.rcount,//商品的数量
        sel_pros: options.sel_pros,//商品的规格
        supply_id: options.supply_id,//店铺的id
      })
    } else if (that.data.sort == 2){
     console.log('这里是点击地址信息进来的')
    } else if (that.data.sort == 3){//这是购物车传过来的
      that.setData({
        pro_arr: options.pro_arr,
        num: options.num,//这是做支付判断的
        cart_ids: options.cart_ids
      })
    }
    get_address(that)
  },
  //点击返回地址
  choose:function(e){
    var that =this;
    let id = e.currentTarget.dataset.id;
    if (that.data.sort == 1) {//商品详情过来的
      wx.redirectTo({
        url: '/pages/payOrder/payOrder?aid=' + id + '&formtype=1' + '&pid=' + that.data.pid + '&rcount=' + that.data.rcount + '&sel_pros=' + that.data.sel_pros + '&supply_id=' + that.data.supply_id + '&num=' + '微信支付',
      })
    } else if (that.data.sort == 2) {//个人中心地址管理进来的
      console.log('不要出问题啊')
    } else if (that.data.sort == 3) {//购物车过来的
      wx.redirectTo({
        url: '/pages/payOrder/payOrder?aid=' + id + '&formtype=2' + '&pro_arr=' + that.data.pro_arr + '&num=' + '微信支付'+'&cart_ids=' + that.data.cart_ids,
      })
    }
  },
  //跳转到新建地址
  button:function(){
    var that = this;
    if(that.data.sort == 1){//商品详情过来的
      wx.redirectTo({
        url: '/pages/addressM/addressM?sort=1' + '&diff=2' + '&pid=' + that.data.pid + '&rcount=' + that.data.rcount + '&sel_pros=' + that.data.sel_pros + '&supply_id=' + that.data.supply_id + '&num=' + '微信支付' + '&index=0',
      })
    }else if(that.data.sort == 3){//购物车过来的
      wx.redirectTo({
        url: '/pages/addressM/addressM?sort=3' + '&diff=2' + '&pro_arr=' + that.data.pro_arr + '&num=' + '微信支付' + '&index=0' + '&cart_ids=' + that.data.cart_ids,
      })
    } else if (that.data.sort == 2){//个人中心地址管理进来的
    console.log('地址管理进来的')
    wx.redirectTo({
      url: '/pages/addressM/addressM?sort=2' + '&diff=2' + '&index=0'
    })  
    }
  },
  //设置默认地址
  check:function(e){
    let that = this;
    var id = e.currentTarget.dataset.id;//地址的id
    let index = e.currentTarget.dataset.index;//索引值
    console.log(id);
    wx.request({
      url: getApp().openidData.url + 'save_address.php',
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        id: id,
        user_id:getApp().openidData.user_id,
        op: 'savedefault',
      },
      success: function (res) {
        console.log(res);
        if (res.data) {
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 2000
          })
          get_address(that)
        } else {
          wx.showModal({
            title: '提示',
            content: res.errMsg,
          })
        }
        
      }
    })
  },

  //编辑按钮
  edit:function(e){
    let that = this;
    var index = e.currentTarget.dataset.opindex;//索引值
    var id = that.data.index_data[index].id;//地址的id
    if (that.data.sort == 1) {//商品详情过来的
      wx.redirectTo({
        url: '/pages/addressM/addressM?sort=1' + '&diff=1' + '&pid=' + that.data.pid + '&rcount=' + that.data.rcount + '&sel_pros=' + that.data.sel_pros + '&supply_id=' + that.data.supply_id + '&num=' + '微信支付' + '&index=' + index + '&id=' + id,
      })
    } else if (that.data.sort == 3) {//购物车过来的
      wx.redirectTo({
        url: '/pages/addressM/addressM?sort=3' + '&diff=1' + '&pro_arr=' + that.data.pro_arr + '&num=' + '微信支付' + '&index=' + index + '&id=' + id + '&cart_ids=' + that.data.cart_ids,
      })
    } else if (that.data.sort == 2) {//个人中心地址管理进来的
      console.log('地址管理进来的')
      wx.redirectTo({
        url: '/pages/addressM/addressM?sort=2' + '&diff=1' + '&index=' + index + '&id=' + id,
      })
    }
    // wx.redirectTo({
    //   url: '/pages/addressM/addressM?index=' + index + '&id=' + id + '&diff=1' ,
    // })
  },
  //删除
  del:function(e){
   let that = this;
   let delindex = e.currentTarget.dataset.delindex;//索引值
    var id = e.currentTarget.dataset.id;//地址的id
   console.log(id);
  wx.request({
    url: getApp().openidData.url + 'get_my_address.php',
    method:'POST',
    header:{
      "Content-Type": "application/x-www-form-urlencoded"
    },
    data:{
      id:id,
      customer_id:getApp().openidData.customer_id,
      op:'delete',
    },
    success:function(res){
      console.log(res.data);
      if (res.data.status == 1) {
        wx.showToast({
          title: '成功',
          icon: 'success',
          duration: 2000
        })
        get_address(that)
      } else {
        wx.showModal({
          title: '提示',
          content: res.errMsg,
        })
      }
      
    }

  })
  }

})
//获取数据
function get_address(that) {
  wx.request({
    url: getApp().openidData.url + 'get_my_address.php',
    data: {
      user_id: getApp().openidData.user_id,//用户id
      customer_id: getApp().openidData.customer_id,//默认37
      op: "check",
    },
    method: 'POST',
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
      // 'Content-Type': 'application/json'
    },
    success: function (res) {
      console.log(res.data);
      if(res.data.length == 0){
       that.setData({
         hide:true,
         hide_1:false,
       })
      }
      else if (res.data.length != 0){
        that.setData({
          hide_1:true,
          hide: false,
          index_data: res.data
        })

      }

    }
  })
}
