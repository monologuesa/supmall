// pages/refund/refund.js
Page({

  data: {
    name:'',
    gettype: '',//判断是待发货进来的还是待收货进来的 2是待发货 3 是待发货
     hide:false,
     num:0,//做退换货的参数用的
     check:false,//判断是不是换货
     check_1:false,//判断是不是退货
     type:0,//判断退款原因里面的
     current: 0,// 字数限制
     max: 170,// 字数限制
     reason:[ //这里是退款原因里面的
       { name: '商品信息描述不好',type:1 },
       { name: '功能/效果不好', type: 2 },
       { name: '少见/漏件', type: 3 },
       { name: '包装/商品破损', type: 4 },
       { name: '其他', type: 5 }
     ],
     all:[],//存放照片的
     batchcode:'',//商品的订单号
     totalprice:'',//商品的总价格
     imgArr: [],//存照片的
     imageUrl:'',//照片前缀
     
  },
  onLoad: function (options) {
    var that = this;
    console.log(options.gettype)
    that.setData({ 
      gettype: options.gettype,//判断是待发货进来的还是待收货进来的 2是待发货 3 是待发货
      batchcode: options.batchcode, //订单号
      totalprice: options.totalprice,//商品的价格
      imageUrl:getApp().openidData.urls//照片前缀
    })
  },
  //表单提交
  formSubmit:function(e){
    var that = this;
    console.log(e);
    let name = e.detail.value.introduction;
    if (that.data.num == 0 || that.data.num > 2){
      wx.showModal({
        title: '提示',
        content: '你还未选择申请类型',
        success: function(res) {
          if(res.confirm){
            console.log('确认')
          }else if(res.cancel){
            console.log('取消')
          }
        },
      })
    } else if (that.data.type == 0 || that.data.type > 5 ){
      wx.showModal({
        title: '提示',
        content: '你还未选择申请说明',
        success: function (res) {
          if (res.confirm) {
            console.log('确认')
          } else if (res.cancel) {
            console.log('取消')
          }
        },
      })
    }else{
      let newimgArr = '';//存照片的地方
      for (var i = 0; i < that.data.imgArr.length; i++) {
        newimgArr += that.data.imgArr[i] + ',';
      }
      newimgArr = newimgArr.slice(0, -1);
      if (that.data.num == 1) {
        wx.request({
          url: getApp().openidData.url + 'cust.php',
          data: {
            goods_id_tui: that.data.batchcode,
            spr3: that.data.totalprice,
            id_in: newimgArr,
            cust_radio: that.data.num,
            tuikuan: that.data.name,
            cause: name,
          },
          method: 'POST',
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          success: function (res) {
            console.log(11111)
            wx.showToast({
              title: '成功',
              icon: 'success',
              duration: 1000
            })
            wx.redirectTo({
              url: '/pages/my/my?type=7',
            })
          }

        })
      } else if (that.data.num == 2) {
        if (name == ''){
          wx.showModal({
            title: '提示',
            content: '你还未选择申请原因',
            success: function (res) {
              if (res.confirm) {
                console.log('确认')
              } else if (res.cancel) {
                console.log('取消')
              }
            },
          })
          return;
        } else if (that.data.imgArr == ''){
          wx.showModal({
            title: '提示',
            content: '你还未上传照片',
            success: function (res) {
              if (res.confirm) {
                console.log('确认')
              } else if (res.cancel) {
                console.log('取消')
              }
            },
          })
          return;
        }
        wx.request({
          url: getApp().openidData.url + 'cust.php',
          data: {
            goods_id_tui: that.data.batchcode,
            spr3: that.data.totalprice,
            id_in: newimgArr,
            cust_radio: 1,
            tuikuan2: that.data.name,
            cause: name,
          },
          method: 'POST',
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          success: function (res) {
            console.log(2222)
            wx.showToast({
              title: '成功',
              icon: 'success',
              duration: 1000
            })
            wx.redirectTo({
              url: '/pages/my/my?type=7',
            })
          }
        })
      }
    }
  },
  //限制字数
  limit: function (e) {
    var that = this;
    var value = e.detail.value;
    var length = parseInt(value.length);
    if (length > that.data.noteMaxLen) {
      return;
    }
    that.setData({
      current: length
    });
  },
  //判断换货退货
  check:function(e){
    var that = this;
    let index = e.currentTarget.dataset.index;
    if(index == 1){
      that.setData({ check : true,check_1:false,num:index})
    }else if(index == 2){
      that.setData({ check: false, check_1: true, num:index })
    }
  },
// 显示遮罩层
  showModal: function () {
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
        hide: false
      })
    }.bind(this), 200)
  },

  //选择退款原因
  click:function(e){
  var that = this;
  let index = e.currentTarget.dataset.index;
  let name = e.currentTarget.dataset.name;
  let type = that.data.type;
  that.setData({ type:index,name:name });
    // 隐藏遮罩层
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
  //删除照片
  clearImg: function (e) {
    let imgArr = this.data.imgArr;
    let all = this.data.all;
    let index = e.currentTarget.dataset.index // 图片索引
    imgArr.splice(index, 1) // 删除
    all.splice(index, 1)
    this.setData({
      imgArr: imgArr,
      all: all
    })
  },
  //上传照片
  addimage: function () {
    var that = this;
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        console.log(that.data.all.length)
        console.log(that.data.imgArr.length)
        if (that.data.all.length <= 9) {
          let img = Number(that.data.all.length) + Number(res.tempFilePaths.length)
          if (img <= 9) {
            for (var i = 0; i < res.tempFilePaths.length; i++) {
              wx.uploadFile({
                url: getApp().openidData.url + '/headimg_handle_xiao.php',
                filePath: res.tempFilePaths[i],
                name: 'headimg',
                formData: {
                  user_id: getApp().openidData.user_id,
                  customer_id: getApp().openidData.customer_id,
                  get_i: i
                },
                success: function (re) {
                  that.data.all.push(JSON.parse(re.data).data.shop_bgimgurl);
                  that.setData({
                    imgArr: that.data.all
                  })
                }
              })
            }
          } else {
            wx.showModal({
              title: '提示',
              content: '只能上传9张照片',
            })
          }
        } else {
          wx.showModal({
            title: '提示',
            content: '只能上传9张照片',
          })
        }
      }
    })
  },
})