// pages/cart/cart.js
Page({

  data: {
    index_data:'',//获取数据
    imageUrl:'',//图片地址前缀
    nums:1,
    num:[],//点击商品按钮所携带的值
    prices:0,//总价格
    allcheck:false,//全选的按钮
    list:[],//列表数据
    shop_index:'',//第几个店铺
    remove:true,//判断编辑隐藏的
    addId:'',//获取默认地址的id
    productIdArr:'',//拼接的商品id
  },
  onLoad: function (options) {
    var that = this;
   that.setData({
     imageUrl: getApp().openidData.urls,
   })
  },
  onShow:function(){
    let that = this;
    let isOK = getApp().isLogin(-1,getdata, that);
    if (isOK) {
      that.setData({
        imageUrl: getApp().openidData.urls,
        prices: 0,
        remove: true,
        cart: '',
        ids:'',
        cart_ids: '',
        allcheck:'',
      })
      getdata(that);
    }
  },
  //点击去购物
  shopping:function(){
   var that = this;
   wx.switchTab({
     url: '/pages/index/index',
   })
  },
  //点击跳转商家店铺
  jump_1:function(e){
    var that = this;
    let id = e.currentTarget.dataset.id;//店铺的id
    wx.navigateTo({
      url: '/pages/goldShop/goldShop?id=' + id,
    })
  },
  //点击跳转到商品详情
  jump:function(e){
  var that = this;
  let id = e.currentTarget.dataset.id//商品的id
  wx.navigateTo({
    url: '/pages/shop/shop?id=' + id,
  })
  },
  //点击编辑变换删除
  change:function(){
    var that = this;
    let remo = false;
    remo = !this.data.remove;
    that.setData({ remove: remo,prices:0});
    let data = that.data.index_data;
    cheng(data, that);
  },
//点击删除
delete:function(){
 var that = this;
 let data = that.data.index_data;//获取数据
 let delList = del(data,that);
  if (delList == ''){
    wx.showModal({
      title: '提示',
      content: '你还未选择商品',
      success: function(res) {
        if(res.confirm){
          console.log('确认')
        }else if(res.cancel){
          console.log('取消')
        }
      },
    })
  } else if (delList != ''){
    wx.request({
      url: 'https://youte.xmtzxm.com.cn/weixinpl/youte/cart2/user_cart_del.php',
      data: {
        id: delList
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        if (res.data.code == 200) {
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            success: function (res) {
              if(res.confirm){
                console.log('用户点击了确认');
                getdata(that);
              }else{
                console.log('用户点击了取消');
                getdata(that);
              }
            },
          })
        }
      }
    })
  }
},
  //去结算
  sum: function () {
    let that = this;
    let data = that.data.index_data;//获取数据
    let all = summer(data, that);
    if(all == '[]'){
      wx.showModal({
        title: '提示',
        content: '您还未选择商品,请选择商品在结算',
        success: function(res) {
          if(res.confirm){
            console.log('用户点击了确认')
          }else if(res.cancel){
            console.log('用户点击了取消')
          }
        },
      })
    }else if(all != '[]'){
      wx.request({
        url: getApp().openidData.url + 'order_form_xiao.php',
        data: {
          user_id: getApp().openidData.user_id,
          customer_id: getApp().openidData.customer_id,//customer_id
          formtype: 2,
          aid: that.data.addId,
          pro_arr: all,
        },
        method: 'POST',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: function (res) {
          if (res.data.code == 10014) {
            wx.navigateTo({
              url: '/pages/payOrder/payOrder?aid=' + that.data.addId + '&pro_arr=' + all + '&num=' + '微信支付' + '&formtype=2' + '&cart_ids=' + that.data.productIdArr,
            })
          }
          else if (res.data.feedback.code == 10001) {
            wx.navigateTo({
              url: '/pages/payOrder/payOrder?aid=' + that.data.addId + '&pro_arr=' + all + '&num=' + '微信支付' + '&formtype=2' + '&cart_ids=' + that.data.productIdArr,
            })
          }

        }
      })
    }
},

  //点击店铺按钮状态
  shopBool:function(e){
    var that = this;
    let id = e.currentTarget.dataset.id;//获取商品id
    let supplys_id = e.currentTarget.dataset.supplys_id;//获取店铺id
    let data = that.data.index_data;//获取购物车列表数据
    for (let i = 0; i < data.length; i++) {  
      if (data[i].supplys_id == supplys_id) {//判断点击的店铺
        data[i].check = !data[i].check;//修改店铺的选中状态
        for (let j = 0; j < data[i].product.length; j++) {
          data[i].product[j].check = data[i].check;
          if (data[i].product[j].check == true){//判断店铺点击的状态
            getPrice(data, that);
          } else if (data[i].product[j].check == false){
            getPrice(data, that);
          }
        }
        that.setData({
          index_data: data,
        })
      }
    }
  },
  //点击商品中的按钮
  boolt:function(e){
    var that =this;
    that.setData({ cart: '', ids: '', cart_ids: '', })
    var btnCheck = null;//判断变量，判断勾选的时候店铺里面的商品是否都是选中状态。
    let id = e.currentTarget.dataset.id; //商品id
    let supplys_id = e.currentTarget.dataset.supplys_id; //店铺id
    let data = that.data.index_data; //获取数据
    for(var i=0; i<data.length; i++){//遍历店铺
      for (var j = 0; j < data[i].product.length; j++){//遍历店铺里的商品
        if (data[i].product[j].id == id){//商品id是否等于点击的商品id
          data[i].product[j].check = !data[i].product[j].check//修改选中状态
          if (data[i].supplys_id == supplys_id){//判断选中的商品所属的店铺id
            for (var d = 0; d < data[i].product.length; d++ ){//遍历对应店铺下的商品
              if (data[i].product[d].check == false){
                btnCheck = false;
                data[i].check = btnCheck;//判断店铺的状态 ，false
                that.setData({ index_data: data });
                getPrice(data, that);
                return;
              } else{
                btnCheck = true;
                data[i].check = btnCheck;
                that.setData({ index_data: data });
                getPrice(data, that);
              }
            }
          }
        } else{
          getPrice(data, that);
        }
      }
    }
  },
  //数量减
  less:function(e){
    var that = this;
    let supplys_id = e.currentTarget.dataset.shopindex;//店铺id
    let pid = e.currentTarget.dataset.pid; //商品中的id
    let index_data = that.data.index_data;
    let index = e.currentTarget.dataset.index;//获取索引值
    let id = e.currentTarget.dataset.id;//商品id 
    let prvalues = e.currentTarget.dataset.prvalues;//产品规格
    for(var i = 0; i< index_data.length;i++){
      if (index_data[i].supplys_id == supplys_id ){
        for (var j = 0; j < index_data[i].product.length; j++ ){
          if (index_data[i].product[j].id == pid){
            if (index_data[i].product[j].num == 1 ){
              index_data[i].product[j].num == 1
            }else{
              index_data[i].product[j].num--;
              wx.request({
                  url: getApp().openidData.url + 'cart2/user_cart_add.php',
                  data: {
                    user_id: getApp().openidData.user_id,
                    customer_id: getApp().openidData.customer_id,
                    good_id: id,
                    num: index_data[i].product[j].num ,
                    val: 1,
                    sel_pro_str: prvalues,
                  },
                  method: 'POST',
                  header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                  },
                  success: function (res) {
                    getdata(that)
                  },
                })
            }
          }
        }
      }
    }
  },
  //数量加
  add:function(e){
    var that = this;
    let supplys_id = e.currentTarget.dataset.shopindex;//店铺id
    let pid = e.currentTarget.dataset.pid;//商品中另一个id
    let index_data = that.data.index_data;//获取
    let index = e.currentTarget.dataset.index;//获取索引值
    let id = e.currentTarget.dataset.id;//商品id
    let prvalues = e.currentTarget.dataset.prvalues;//商品规格
    for(var i = 0; i<index_data.length; i++){
      if (index_data[i].supplys_id == supplys_id){
        for (var j = 0; j < index_data[i].product.length; j++){
          if (index_data[i].product[j].id == pid ){
            index_data[i].product[j].num ++;
              wx.request({
                  url: getApp().openidData.url + 'cart2/user_cart_add.php',
                  data:{
                    user_id:getApp().openidData.user_id,
                    customer_id: getApp().openidData.customer_id,
                    good_id:id,
                    num: index_data[i].product[j].num,
                    val:1,
                    sel_pro_str: prvalues,
                  },
                  method: 'POST',
                  header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                  },
                  success:function(res){
                    getdata(that)
                  },
                })

          }
        }
      }
    }

  },
  //全选
  boolts:function(){
   var that = this;
   let check = false;
   check = !that.data.allcheck;
   that.setData({ allcheck: check })
   let data = that.data.index_data;
   for(var i = 0; i<data.length; i++){
     for (var j = 0; j < data[i].product.length; j++){
       if ( that.data.allcheck == true){
         data[i].check = true;
         data[i].product[j].check = true;
         getPrice(data, that);
       }else{
         data[i].check = false;
         data[i].product[j].check = false;
         getPrice(data, that);
       }
     }
     that.setData({ index_data: data })
   }
  },
  //确认登录
  bindgetuserinfo: function () {
    var that = this;
    that.setData({ shouquan: 0 });
    getApp().getUserInfo(getdata, that);
  },
  //取消登录
  noGetuserinfo: function () {
    wx.hideLoading();
    this.setData({ shouquan: 0 });
  },
})
//获取产品数据
function getdata(that) {
  wx.request({
    url: getApp().openidData.url + 'cart2/user_cart_list.php',
    data: {
      user_id:getApp().openidData.user_id,
      // user_id:4393
    },
    method: 'POST',
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    success: function (res) {
      getaddress(that)
      var cardata = res.data;
      for (let i = 0; i < cardata.length;i++){
        cardata[i].check = false;
        for (let j = 0; j < cardata[i].product.length; j++){
          cardata[i].product[j].check = false;
        }
      }
      that.setData({
        index_data: cardata,
      })
      
    } 
  })
}
/*
 * 遍历数据函数：checkData
 * data:需要遍历的数据
 * pid:店铺id
 * id:商品id
 */
function checkData(data,pid,id,that){
  var a = 0;
  for (let i = 0; i < data.length; i++) {
    if (data[i].supplys_id == pid){
      for (let j = 0; j < data[i].product.length; j++) {
        if (data[i].product[j].id == id){
          data[i].product[j].check = !data[i].product[j].check;
        }
      }
      that.setData({
        index_data: data,
      })
    }
  }
}
//计算总价格
function getPrice(data,that){
  var price = 0;
  for(var i = 0; i< data.length; i++ ){
    for (var j = 0; j < data[i].product.length; j++){
      if (data[i].product[j].check == true){
        price += Number(data[i].product[j].num) * Number(data[i].product[j].now_prices)
      }else{
        
      }
    }
    that.setData({
      prices: price
    })
  }
}
//点击编辑切换让各个按钮变为未选中状态
function cheng(data,that){
  for(var i=0; i<data.length; i++){
    for (var j = 0; j < data[i].product.length; j++){
      if (data[i].product[j].check == true){
        data[i].check = false;
        data[i].product[j].check = false;
        that.setData({ index_data:data });
      }
    }
  }
}
//这是删除中的遍历
function del(data, that){
  var delList = '';
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].product.length; j++) {
      if (data[i].product[j].check == true) {
        delList += data[i].product[j].id +',';  
      }
    }
  }
  return delList;
}
//这是去结算的遍历
function summer(data,that){
  var arr = '[';
  var all = [];
  let attrId = '';
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].product.length; j++) {
      if (data[i].product[j].check == true) {
        attrId += data[i].product[j].id + ',';
        all += '[' + '\"' + data[i].supplys_id + '\"' + ',' + '[' + '\"' + data[i].product[j].product_id + '\"' + ',' + '\"' + data[i].product[j].prvalues + '\"' + ',' + '\"' + data[i].product[j].num + '\"' +']'+']'+',';
      }
    }
  }
  attrId = attrId.slice(0, -1);
  all = all.slice(0,-1);
  arr += all + ']';
  that.setData({ productIdArr: attrId })
  return arr;
}
//获取地址
function getaddress(that) {
  wx.request({
    url: getApp().openidData.url + 'get_my_address.php',
    data: {
      user_id: getApp().openidData.user_id,
      customer_id: getApp().openidData.customer_id,//customer_id
      op: 'check',
    },
    method: 'POST',
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    success: function (res) {
      that.setData({
        index_address: res.data,
      })
      for (var i = 0; i < that.data.index_address.length; i++) {
        if (that.data.index_address[i].is_default == 1) {
          that.setData({
            addId: that.data.index_address[i].id
          })
          return;
        }
      }

    }
  })

}
