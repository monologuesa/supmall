
var WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    collect:'',//判断是否收藏，0为没收藏  1 为收藏
    hide:false,
    id:0,//产品id
    index_data:'',//列表数据
    index_data_2: '',//获取购买里面的价格 积分
    index:'',//这是获取购买里面的数据
    imageurl:'',  //轮播图地址
    type:-1, //选择属性状态
    //轮播图
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 500,
    circular: true,
    //轮播图结束
    nums: 1,
    arrName: [],//选择属性
    arrId: [],//选择属性

    btntype:'',//判断点击状态0：购物车，1：立即购买
    addId:'',//地址id 
    supply_id:'',//跳转需要参数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (options.scene){
      var scene = decodeURIComponent(options.scene);
      that.setData({
        imageurl: getApp().openidData.urls,//照片前缀
        sharer_id: that.getUrlData(scene, 'sharer_id'),
        goods_id: that.getUrlData(scene, 'goods_id')
      })
      getApp().login(that.data.sharer_id, that.data.goods_id, getdata, that);
    }else{
      that.setData({
        id: options.id,//商品id
        imageurl: getApp().openidData.urls,//照片前缀
      });
      getdata(that);
    }
  },
  //切割options.scene的
  getUrlData: function (vars, variable) {
    vars = vars.split("&");
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      if (pair[0] == variable) { return pair[1]; }
    }
    return (false);
  },
  //确认登录
  bindgetuserinfo: function () {
    var that = this;
    that.setData({ shouquan: 0 });
    getApp().getUserInfo(-1, getdata, that);
  },
  //取消登录
  noGetuserinfo: function () {
    wx.hideLoading();
    this.setData({ shouquan: 0 });
  },
  //跳转店铺
  jump:function(e){
    var that = this;
    let id = e.currentTarget.dataset.id;//店铺的id 
    wx.navigateTo({
      url: '/pages/goldShop/goldShop?type=2' + '&id=' + id,
    })
  },  //导航
  address_info: function () {
    var that = this;
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        let latitude = Number(that.data.index_data.latitude);
        let longitude = Number(that.data.index_data.longitude);
        wx.openLocation({
          latitude: latitude,
          longitude: longitude,
          name: that.data.index_data.shop_address,
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
  //收藏
  collect:function(){
   var that = this;
    wx.request({
      url: getApp().openidData.url + 'collect.php',
      data: {
        type:'add',
        user_id:getApp().openidData.user_id,
        pid:that.data.id,
        get_type:0
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        that.setData({
          collect:1
        })
      }
    })
  },
  //取消收藏
  cancel:function(){
   var that = this;
    wx.request({
      url: getApp().openidData.url + 'collect.php',
      data: {
        type: 'del',
        user_id: getApp().openidData.user_id,
        pid: that.data.id,
        get_type:0,
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        that.setData({
          collect: 0
        })
      }
    })
  },
  //点击首页
  home:function(){
   var that = this;
   wx.switchTab({
     url: '/pages/index/index',
   })
  },
  //点击照片变大
  imgYu: function (e) {
    var that = this;
    var list = e.currentTarget.dataset.list;
    var index = e.currentTarget.dataset.index;
    for (var i = 0; i < list.length; i++) {
      list[i] = that.data.imageurl + list[i].imgurl
    }
    wx.previewImage({
      current: list[index], // 当前显示图片的http链接
      urls: list // 需要预览的图片http链接列表
    })
  },
  //开启购物车
  showModal: function (e) {
    let that = this;
    let isOK = getApp().isLogin(-1, getdata, that);
      let type = e.currentTarget.dataset.type;
      that.setData({
        btntype: type,
      })
      // getdata(that.data.id,that);
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
        hide: true
      })
      setTimeout(function () {
        animation.translateY(0).step()
        this.setData({
          animationData: animation.export()
        })
      }.bind(this), 200)


  },
  //隐藏购物车
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
        hide: false,
        arrName:[],
        arrId: [],
      })
    }.bind(this), 200)
  },
  //数量减少
  less:function(){
    var that = this;
   if(that.data.nums != 1){
     var n = Number(that.data.nums) - 1;
     that.setData({nums:n})
   }
  },
  //增加
  add: function () {
    var that = this;
    var n = Number(this.data.nums) + 1;
    this.setData({ nums: n })
  },
  //点击确认跳转购物车
  button:function(){
    var that = this;
    if (that.data.index_data.storenum < that.data.nums) {
      wx.showModal({
        title: '提示',
        content: '库存不足',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击了确认')
          } else if (res.cancel) {
            console.log('用户点击了取消')
          }
        },
      })
    } else if (that.data.shu_P == undefined) {
      wx.showModal({
        title: '提示',
        content: '您还未选择商品',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击了确认')
          } else if (res.cancel) {
            console.log('用户点击了取消')
          }
        },
      })
    } else if (that.data.nums > that.data.index_data.storenum) {
      wx.showModal({
        title: '提示',
        content: '库存不足',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击了确认')
          } else if (res.cancel) {
            console.log('用户点击了取消')
          }
        },
      })
    } else if (that.data.nums > that.data.index_data_2.storenum) {
      wx.showModal({
        title: '提示',
        content: '库存不足',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击了确认')
          } else if (res.cancel) {
            console.log('用户点击了取消')
          }
        },
      })
    }else{
      wx.request({
        url: 'https://youte.xmtzxm.com.cn/weixinpl/youte/cart2/user_cart_add.php',
        data: {
          user_id: getApp().openidData.user_id,
          customer_id: getApp().openidData.customer_id,//customer_id
          good_id: that.data.id,//产品id
          num: that.data.nums,
          sel_pro_str: that.data.shu_P,
        },
        method: 'POST',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: function (res) {
          console.log(res.data)
          if (res.data.code == 200) {
            console.log(11111111)
            wx.switchTab({
              url: '/pages/cart/cart',
            })
          }
        }
      })
    }
  },

  //点击确定跳转到支付
  button1:function(){
    var that = this;
    console.log(that.data.shu_P)
    if (that.data.index_data.storenum < that.data.nums){
      wx.showModal({
        title: '提示',
        content: '库存不足',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击了确认')
          } else if (res.cancel) {
            console.log('用户点击了取消')
          }
        },
      })
    }else if (that.data.shu_P == undefined){
      wx.showModal({
        title: '提示',
        content: '您还未选择商品',
        success: function(res) {
          if(res.confirm){
            console.log('用户点击了确认')
          }else if(res.cancel){
            console.log('用户点击了取消')
          }
        },
      })
    } else if (that.data.nums > that.data.index_data.storenum){
      wx.showModal({
        title: '提示',
        content: '库存不足',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击了确认')
          } else if (res.cancel) {
            console.log('用户点击了取消')
          }
        },
      })
    } else if (that.data.nums > that.data.index_data_2.storenum) {
      wx.showModal({
        title: '提示',
        content: '库存不足',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击了确认')
          } else if (res.cancel) {
            console.log('用户点击了取消')
          }
        },
      })
    }
    else{
      wx.request({
        url: getApp().openidData.url + 'order_form_xiao.php',
        data: {
          user_id: getApp().openidData.user_id,
          customer_id: getApp().openidData.customer_id,//customer_id
          pid: that.data.id,//产品id
          formtype: 1,
          rcount: that.data.nums,
          sel_pros: that.data.shu_P,
          aid: that.data.addId,
        },
        method: 'POST',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: function (res) {
          console.log(res.data);
          if (res.data.code == 10014) {
                  wx.redirectTo({
                    url: '/pages/payOrder/payOrder?aid=' + that.data.addId + '&formtype=1' + '&pid=' + that.data.id + '&rcount=' + that.data.nums + '&sel_pros=' + that.data.shu_P + '&supply_id=' + that.data.supply_id + '&num=' + '微信支付',
                  })
          } else if (res.data.feedback.code == 10001) {
            wx.redirectTo({
              url: '/pages/payOrder/payOrder?aid=' + that.data.addId + '&formtype=1' + '&pid=' + that.data.id + '&rcount=' + that.data.nums + '&sel_pros=' + that.data.shu_P + '&supply_id=' + that.data.supply_id + '&num=' + '微信支付',
            })
          }
        }
      })
    }
  },
  //跳转用户评价
  assess:function(e){
    let that = this;
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/shopAssess/shopAssess?id='+id,
    })
  },
  //分享微信好友
  onShareAppMessage: function (res) {
    var that = this;
    return {
      title: '精选游玩购',
    }
  },
  //选择商品
  click: function (e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let pindex = e.currentTarget.dataset.pindex;
    //点击当前的名字
    let name = e.currentTarget.dataset.name;
    //点击当前的id
    let id = e.currentTarget.dataset.id;
    let arrId = that.data.arrId;
    let arrName = that.data.arrName;
    arrName[pindex] = name;
    arrId[pindex] = id;
    var shu_P = '';
    var shu_name = '';
    // console.log(that.data.index_data.pros_all.son_name.length)
    for (var i = 0; i < that.data.index_data.pros_all.son_name.length; i++){
      if(i == 0){
        shu_P = arrId[i];
        shu_name = arrName[i];
      }else{
        shu_P = shu_P + "_" + arrId[i];
        shu_name = shu_name + "_" +  arrName[i];
      }
    }
    that.setData({
      arrName :arrName,
      arrId:arrId,
      shu_P:shu_P,
    })
    console.log(that.data.shu_P);
    getPrice(that.data.id, that.data.shu_P, that)
  },
})
//获取地址
function getaddress(that) {
  wx.request({
    url: getApp().openidData.url + 'get_my_address.php',
    data: {
      user_id: getApp().openidData.user_id,
      customer_id: getApp().openidData.customer_id,//customer_id
      op:'check',
    },
    method: 'POST',
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    success: function (res) {
      console.log(res.data);
      that.setData({
        index_address:res.data,
      })
      getshow(that)
      for(var i =0; i<that.data.index_address.length;i++){
        if (that.data.index_address[i].is_default == 1){
           that.setData({
             addId: that.data.index_address[i].id
           })
           return;
        } else if (that.data.index_address[i].is_default == 0){
          console.log('没有默认地址')
        }
      }
    }
  })
}
//获取数据
function getdata(that) {
  wx.request({
    url: getApp().openidData.url + 'product_detail.php',
    data: {
      user_id: getApp().openidData.user_id,
      customer_id: getApp().openidData.customer_id,//customer_id
      pid: that.data.id,//产品id
    },
    method: 'POST',
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    success: function (res) {
       that.setData({
         index_data:res.data,
         supply_id: res.data.is_supply_id,
         collect: res.data.c_id
       })
      getaddress(that);

      var data = res.data.description;

      //替换标签中特殊字符
      var infoFlg = "<!--SPINFO#0-->";
      var imgFlg = "<!--IMG#";


      var content = "<div class=\"rich-img\"; style=\"line-height:25px; font-weight:200; font-size:17px; word-break:normal\">" + res.data.description + "</div>";

      // 替换标签中特殊字符
      var infoFlg = "<!--SPINFO#0-->";
      if (content.indexOf(infoFlg) > 0) {
        content = content.replace(/<!--SPINFO#0-->/, "");
      }

      var imgFlg = "<!--IMG#";
      //图片数量
      var imgCount = (content.split(imgFlg)).length - 1;
      if (imgCount > 0) {
        // console.log("有dd" + imgCount + "张图片");

        for (var i = 0; i < imgCount; i++) {
          var imgStr = "<!--IMG#" + i + "-->";
          var imgSrc = "\"" + imgInfoArr[i].src + "\"";
          var imgHTML = "<div> <img style=\"width:100%\" src=" + imgSrc + "> </div>";
          content = content.replace(imgStr, imgHTML);
        }
      }

      var article = content;
      // console.log(article);
      WxParse.wxParse('article', 'html', article, that, imgCount);
    }
  })
}
//点击完规格让其价格变动，
function getPrice(id,shu_P,that){
  wx.request({
    url: getApp().openidData.url + 'get_pros_price.php',
    data: {
      pid:id,
      proids: shu_P
    },
    method: 'POST',
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    success: function (res) {
      console.log(res.data);
      that.setData({
        index_data_2: res.data,

      })
    }
  })
}
//显示隐藏按钮
function getshow(that){
  wx.request({
    url: getApp().openidData.url + 'is_show_goods.php',
    data: {
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


