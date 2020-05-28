
Page({


  data: {
    hide_3:true,//判断跳转地址是否隐藏
    time:'',//开始的时间
    time_1:'',//结束的时间
    day:'',//相差的时间
    hide:false,//广告位置的隐藏
    hide_1:false,//跳转地址的隐藏
    type:-1,//判断广告位置的
    type_1:-1,//判断跳转地址的
    name_1:'',//这里是跳转地址的文字内容
    id:'',//这是跳转里面的id
    content:'',//这是广告位置里面的内容文字
    money:'',//广告位置里面的金额
    all_money:'',//这是总的金额
    urlImage:'',//域名
    bgimgurl:'',//寸照片的
    a_id:'',//传过来的广告id
    index_data_1:'',//获取数据
    index:'',//用作判断是支付还是修改
    pname:'',//判断是创建广告进来的还是详情点进来的
  },
  onLoad: function (options) {
    var that = this;
    that.setData({ 
      urlImage:getApp().openidData.urls,
      index:options.index,
    })
    if (that.data.index == 2){//这是点击创建的  index为2
      getlist(that);
    } else if (that.data.index == 1) {//这是修改的  index为1
      that.setData({ a_id:options.id })
      getdata(that.data.a_id, that)
    }
    

  },
  //选择跳转地址
  click_1:function(e){
    console.log(e);
    var that = this;
    let id = e.currentTarget.dataset.id;//跳转地址的id
    let index = e.currentTarget.dataset.index;//索引值
    let name = e.currentTarget.dataset.name;//跳转地址的名字
    let type_1 = that.data.type_1;//判断第几个的
    that.setData({ type_1: index, name_1:name,id:id });
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: "ease",
      delay: 200
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
        hide_1: false
      })
    }.bind(this), 200)
  },
  //选择广告位置
  click:function(e){
    var that = this;
    let index = e.currentTarget.dataset.index;//索引值
    let content = e.currentTarget.dataset.content;//广告位置的名称
    let money = e.currentTarget.dataset.money;//广告位置所携带的钱
    let type = that.data.type;//判断点击第几个
    that.setData({ type: index, content: content, money:money,name_1:'',id:'',hide_3:true});
    if (that.data.type == 3){//当type为3的时候，让其id不为空，这样支付的时候就不会提示，顺便隐藏跳转地址
      that.setData({
        id: 1,//不让首页优选商家的id为0
        hide_3:false
      })
    }
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: "ease",
      delay: 200
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
        hide: false
      })
    }.bind(this), 200)
  },
  //开始时间
  changeDate(e) {
    var that = this;
    if (that.data.content == ''){
      wx.showModal({
        title: '提示',
        content: '你还未选择广告的位置',
        success: function(res) {
          if(res.confirm){
            console.log('用户点击了确认')
          }else if(res.cancel){
            console.log('用户点击可取消')
          }
        },
      })
    } else if (that.data.content != ''){
      that.setData({ time: e.detail.value });
    }
  },
  //结束时间
  changeDate1(e) {
    var that = this;
    that.setData({ time_1: e.detail.value });
    var date1 = new Date(that.data.time)
    var date2 = new Date(that.data.time_1)
    var s1 = date1.getTime(), s2 = date2.getTime();
    var total = (s2 - s1) / 1000;
    var day = parseInt(total / (24 * 60 * 60));
    that.setData({ day:day })
    console.log(that.data.day)
    if(that.data.day < 0){
      wx.showModal({
        title: '提示',
        content: '请选择正确的时间段',
        success: function(res) {
          if(res.confirm){
            console.log('用户点击了确认')
          }else if(res.cancel){
            console.log('用户点击了取消')
          }
        },
      })
    } else if (that.data.day == 0 ){
      console.log(2222)
      let all_money = Number(that.data.money);
      console.log(all_money);
      that.setData({ all_money: all_money })
    } else if (that.data.day > 0){
      console.log(3333333)
      let all_money = Number(that.data.day) * Number(that.data.money);
      console.log(all_money);
      that.setData({ all_money: all_money })
    }
  },
  //点击开启广告位置的遮罩
  position:function(){
    var that = this;
    that.setData({ hide:true })
  },
  //点击开启跳转地址的遮罩
  address:function(){
    var that = this;
    let data = that.data.index_data;
    if(that.data.type == 1){
      if (data.goods.length == 0) {
        wx.showModal({
          title: '提示',
          content: '现在还没有能跳转的地址',
          success: function (res) {
            if (res.confirm) {
              console.log('确认')
            } else if (res.cancel) {
              console.log('取消')
            }
          },
        })
      }else{
        that.setData({ hide_1: true });
      }
    }else if(that.data.type == 2){
      if (data.goods.length == 0) {
        wx.showModal({
          title: '提示',
          content: '现在还没有能跳转的地址',
          success: function (res) {
            if (res.confirm) {
              console.log('确认')
            } else if (res.cancel) {
              console.log('取消')
            }
          },
        })
      } else {
        that.setData({ hide_1: true });
      }
    } else if (that.data.type == 3){
      wx.showModal({
        title: '提示',
        content: '没有跳转的地址',
      })
    }
    else if (that.data.type == 4){
      if (data.scenic.length == 0) {
        wx.showModal({
          title: '提示',
          content: '现在还没有能跳转的地址',
          success: function (res) {
            if (res.confirm) {
              console.log('确认')
            } else if (res.cancel) {
              console.log('取消')
            }
          },
        })
      } else {
        that.setData({ hide_1: true });
      }
    }else if(that.data.type == 5){
      if (data.strategy.length == 0) {
        wx.showModal({
          title: '提示',
          content: '现在还没有能跳转的地址',
          success: function (res) {
            if (res.confirm) {
              console.log('确认')
            } else if (res.cancel) {
              console.log('取消')
            }
          },
        })
      } else {
        that.setData({ hide_1: true });
      } 
    }else if(that.data.type == 6){
      if (data.temple.length == 0) {
        wx.showModal({
          title: '提示',
          content: '现在还没有能跳转的地址',
          success: function (res) {
            if (res.confirm) {
              console.log('确认')
            } else if (res.cancel) {
              console.log('取消')
            }
          },
        })
      } else {
        that.setData({ hide_1: true });
      } 
    }
    else if (that.data.type == 7) {
      if (data.cate_strategy.length == 0) {
        wx.showModal({
          title: '提示',
          content: '现在还没有能跳转的地址',
          success: function (res) {
            if (res.confirm) {
              console.log('确认')
            } else if (res.cancel) {
              console.log('取消')
            }
          },
        })
      } else {
        that.setData({ hide_1: true });
      }
    }
    else if (that.data.type == 8) {
      if (data.temple.goods == 0) {
        wx.showModal({
          title: '提示',
          content: '现在还没有能跳转的地址',
          success: function (res) {
            if (res.confirm) {
              console.log('确认')
            } else if (res.cancel) {
              console.log('取消')
            }
          },
        })
      } else {
        that.setData({ hide_1: true });
      }
    }
  },
   // 隐藏遮罩层
  hideModal: function () {
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
        hide_1: false,
      })
    }.bind(this), 200)
  },
  //上传广告图片
  addimage: function () {
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        wx.uploadFile({
          url: getApp().openidData.url +'/headimg_handle_xiao.php',
          filePath: res.tempFilePaths[0],
          name: 'headimg',
          formData: {
            user_id: getApp().openidData.user_id,
            customer_id: getApp().openidData.customer_id,
          },
          success: function (re) {
            var shop_bgimgurl = JSON.parse(re.data).data.shop_bgimgurl;
            var shop = that.data.urlImage + shop_bgimgurl
            console.log(shop_bgimgurl)
            console.log(shop);
            that.setData({
              bgimgurl: shop
            })
            console.log(that.data.index_data);
          }
        })
      }
    })
  },
  //表单提交
  formSubmit:function(e){
   var that =this;
   let name = e.detail.value.name;
   if(that.data.pname == ''){
     if (e.detail.value.name.length == '') {
       wx.showModal({
         title: '提示',
         content: '请填写标题',
       })
       return;
     }else if(that.data.content == ''){
       wx.showModal({
         title: '提示',
         content: '请选择广告位置',
       })
       return;
     } else if (that.data.time == ''){
       wx.showModal({
         title: '提示',
         content: '请选择开始的时间',
       })
       return;
     } else if (that.data.time_1 == '') {
       wx.showModal({
         title: '提示',
         content: '请选择结束的时间',
       })
       return;
     } else if (that.data.all_money == '') {
       wx.showModal({
         title: '提示',
         content: '尚未价格',
       })
       return;
     } else if (that.data.bgimgurl == '') {
       wx.showModal({
         title: '提示',
         content: '尚未上传照片',
       })
       return;
     } else if (that.data.id == '') {
       wx.showModal({
         title: '提示',
         content: '尚未选择跳转地址',
       })
       return;
     }
     else {
       wx.request({
         url: getApp().openidData.url +'save_order_advertising.php',
         data: {
           user_id: getApp().openidData.user_id,
           pname: name,
           type: that.data.type,
           begin_time: that.data.time,
           end_time: that.data.time_1,
           advertising_img: that.data.bgimgurl,
           goods_id: that.data.id,
           money: that.data.all_money,
           apply_num: that.data.day,
           goods_type: 1,
         },
         method: 'POST',
         header: {
           "Content-Type": "application/x-www-form-urlencoded"
         },
         success: function (res) {
           console.log(res.data)
           that.setData({ batchcode: res.data.batchcode })
           if (res.data.status == 1) {
            //  wx.showModal({
            //    title: '提示',
            //    content: res.data.msg,
            //    success: function (re) {
            //      if (re.confirm) {
                   wx.request({
                     url: 'https://youte.xmtzxm.com.cn/weixinpl/mshop/WeChatPay/wxpay_advertising.php',
                     data: {
                       user_id: getApp().openidData.user_id,//用户id
                       // user_id: 3063,
                       customer_id: getApp().openidData.customer_id,
                       order_id: res.data.batchcode,
                     },
                     method: 'POST',
                     header: {
                       "Content-Type": "application/x-www-form-urlencoded"
                     },
                     success: function (r) {
                       console.log('开始调用微信支付');
                       wx.requestPayment({
                         'timeStamp': JSON.stringify(r.data.data.timestamp),
                         'nonceStr': r.data.data.noncestr,
                         'package': r.data.data.package,
                         'signType': 'MD5',
                         'paySign': r.data.data.paySign,
                         'success'(a) {
                           console.log('微信支付成功')
                           wx.showToast({
                             title: '成功',
                             icon: 'success',
                             duration: 1000
                           })
                           setTimeout(function () {
                             wx.redirectTo({
                               url: '/pages/adS/adS?money=' + that.data.all_money,
                             });
                           }, 1000)
                         },
                         fail(res) {
                           wx.showModal({
                             title: '提示',
                             content: '微信支付失败',
                             success: function (res) {
                               console.log('用户点击了确认,微信支付失败')
                               setTimeout(function () {
                               }, 1000)
                             },
                           })

                         }
                       })
                     }
                   })
           }
         },
       })
     }
   }else if(that.data.pname != ''){
    wx.request({
      url: getApp().openidData.url +'save_order_advertising.php',
      data:{
        a_id: that.data.a_id,
        advertising_img: that.data.bgimgurl,
        pname:name,
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
                console.log('成功')
                wx.redirectTo({
                  url: '/pages/ad/ad',
                })
              }else if(re.cancel){
                console.log('用户点击了取消')
              }
            },
          })
        }
      }
    })
   }
  

  },

})
//获取列表选择数据  广告位置  跳转地址
function getlist(that) {
  wx.request({
    url: getApp().openidData.url +'apply_advertising.php',
    data: {
      user_id: getApp().openidData.user_id,//用户id
      // user_id: 4386,
    },
    method: 'POST',
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    success: function (res) {
      console.log(res.data)
      that.setData({
        index_data: res.data
      })
    }
  })
}
//获取数据
function getdata(id,that) {
  wx.request({
    url: getApp().openidData.url +'advertising_list_details.php',
    data: {
      a_id: id,
    },
    method: 'POST',
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    success: function (res) {
      that.setData({
        index_data_1: res.data,
        pname: res.data.pname
      })
    }
  })
}