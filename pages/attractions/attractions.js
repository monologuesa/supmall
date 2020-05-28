// pages/attractions/attractions.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hide_1:false,//筛选的隐藏
    getName:'',//input中的value值
    address_1:'',//具体地址
    city:'',//市
    address:'',//具体地址
    index_data_1:'',//上传主图
    imageUrl:'',//照片要用的e
    hide:false,//这是隐藏创建寺庙的
    latitude:'',//纬度
    longitude:'',//经度
    imgArr:[],//存照片的
    all:[],//存放照片的数组
    //轮播开始
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 500,
    circular: true,
    //轮播结束
  },
  onLoad: function (options) {
    var that = this;
    that.setData({
      city_1:getApp().openidData.city,//获取市区
      imageUrl:getApp().openidData.urls//域名
    })
    wx.getLocation({
      type: 'gcj02',
      success(res) {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
        getdata(that.data.latitude, that.data.longitude, '', that);
      }
    })
    
  },
  //点击显示遮罩
  show: function () {
    var that = this;
    that.setData({
      hide_2: true,
      index_data_2: '',
    })
  },
  //点击显示筛选
  click_2:function(){
   var that =this;
   that.setData({ hide_1:true })
  },
  //点击搜索
  form: function (e) {
    var that = this;
    let name = e.detail.value.text;//携带的内容
    that.setData({ getName: '' })
    if(name == ''){
      wx.showModal({
        title: '提示',
        content: '你还未输入内容',
        success: function (res) {
          if (res.confirm) {
            console.log('确认')
          } else if (res.cancel) {
            console.log('取消')
          }
        },
      })
    }else{
      wx.request({
        url: getApp().openidData.url + 'temple.php',
        data: {
          customer_id: getApp().openidData.customer_id,//customer_id
          latitude: that.data.latitude,
          longitude: that.data.longitude,
          distance: 1,
          pname: name,
        },
        method: 'POST',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: function (res) {
          if (res.data.list.length == 0) {
            that.setData({
              hide_2: false
            })
            wx.showModal({
              title: '提示',
              content: '没有相关内容',
              success: function (re) {
                if (re.confirm) {
                  console.log('确认')
                } else if (re.cancel) {
                  console.log('取消')
                }
              },
            })
          } else {
            that.setData({
              index_data_2: res.data,
            })
          }
        }
      })
    }
  },
  //筛选里面的切换
  click: function (e) {
    var that = this;
    let index = e.currentTarget.dataset.index;
    that.setData({ type_1: index })
    if (index == 1) {
      wx.request({
        url: getApp().openidData.url + 'temple.php',
        data: {
          customer_id: getApp().openidData.customer_id,//customer_id
          latitude: that.data.latitude,
          longitude: that.data.longitude,
          distance: '',
          popularity: 1,
          pname: '',
          city: that.data.city
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
    } else if (index == 2) {
      wx.request({
        url: getApp().openidData.url + 'temple.php',
        data: {
          customer_id: getApp().openidData.customer_id,//customer_id
          latitude: that.data.latitude,
          longitude: that.data.longitude,
          distance: 1,
          popularity:'',
          pname: '',
          city: that.data.city
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
        hide_1: false,
      })
    }.bind(this), 200)
  },
  //跳转详情
  jump: function (e) {
    var that = this;
    let id = e.currentTarget.dataset.id;//寺庙id
    wx.navigateTo({
      url: '/pages/temple/temple?id=' + id + '&sort=2',//跳转寺庙详情 sort为2的时候是寺庙的  1是景点的
    })
  },
  //跳转祈福
  bless:function(){
   var that = this;
    wx.navigateTo({
      url: '/pages/blessing/blessing?change=1',
   })
  },
  //跳转请香
  spice:function(){
    wx.navigateTo({
      url: '/pages/please/please',
    })
  },
  //开启购物车
  showModal: function (e) {
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
  //隐藏
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
        hide_2:false,
      })
    }.bind(this), 200)
  },
  //创建景点
  formSubmit: function (e) {
    var that = this;
    let name = e.detail.value.name;//寺庙名称
    let text = e.detail.value.text;//文字介绍
    if (name == '') {
      wx.showModal({
        title: '提示',
        content: '您还未添加寺庙名称',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击了确认')
          } else if (res.cancel) {
            console.log('用户点击了取消')
          }
        },
      })
    } else if (text == '') {
      wx.showModal({
        title: '提示',
        content: '您还未添加文字介绍',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击了确认')
          } else if (res.cancel) {
            console.log('用户点击了取消')
          }
        },
      })
    } else if (that.data.tempFilePath == '') {
      wx.showModal({
        title: '提示',
        content: '您还未添加寺庙介绍图',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击了确认')
          } else if (res.cancel) {
            console.log('用户点击了取消')
          }
        },
      })
    } else if (that.data.index_data_1 == ''){
      wx.showModal({
        title: '提示',
        content: '您还未添加寺庙主图',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击了确认')
          } else if (res.cancel) {
            console.log('用户点击了取消')
          }
        },
      })
    }
     else if (that.data.address_1 == '') {
      wx.showModal({
        title: '提示',
        content: '您还未添加寺庙详细地址',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击了确认')
          } else if (res.cancel) {
            console.log('用户点击了取消')
          }
        },
      })
    }else{
      let newimgArr = '';//存照片的地方
     for(var i = 0; i < that.data.imgArr.length; i++){
       newimgArr += that.data.imgArr[i]+',';
     }
      newimgArr = newimgArr.slice(0, -1);
      wx.request({
        url: getApp().openidData.url + 'temple_add.php',
        data: {
          pname: name,
          default_imgurl2:  that.data.index_data_1,
          address: that.data.address_1,
          content: name,
          introduce_img: newimgArr,
          content: text,
          user_id: getApp().openidData.user_id,
        },
        method: 'POST',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: function (res) {
          if (res.data.status == 1) {
            wx.showModal({
              title: '提示',
              content: res.data.msg,
            })
            that.setData({
              tempFilePaths: '',
              address: '',
              index_data_1: ''
            })
            that.hideModal();
          } else if (res.data.status == 2){
            wx.showModal({
              title: '提示',
              content: res.data.msg,
            })
            that.setData({
              tempFilePaths: '',
              address: '',
              index_data_1: ''
            })
            that.hideModal();
          }
        }
      })
    }
  },
  //点击获取具体地址
  click_4: function () {
    var that = this
    wx.chooseLocation({
      success: function (res) {
        wx.request({
          url: getApp().openidData.url + 'get_address.php',
          data: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          method: 'POST',
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          success: function (re) {
            that.setData({
              city: re.data,
              latitude: res.latitude,
              longitude: res.longitude,
              city_1: re.data
            })
            getdata(that.data.latitude, that.data.longitude, that.data.city, that);
          }
        })
      }
    })
  },
  //点击获取具体地址
  click_5: function () {
    var that = this
    wx.chooseLocation({
      success: function (res) {
      that.setData({
        address_1: res.address
      })
      }
    })
  },
  //上传主图
  addimage_1: function () {
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        wx.uploadFile({
          url: getApp().openidData.url + '/headimg_handle_xiao.php',
          filePath: res.tempFilePaths[0],
          name: 'headimg',
          formData: {
            user_id: getApp().openidData.user_id,
            customer_id: getApp().openidData.customer_id,
          },
          success: function (re) {
            var shop_bgimgurl = JSON.parse(re.data).data.shop_bgimgurl;
            var shop = JSON.parse(re.data).data;
            that.setData({
              index_data_1: shop_bgimgurl
            })
          }
        })
      }
    })
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
      all:all
    })
  },
  //隐藏
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
        hide_1: false,
        hide_2: false,
      })
    }.bind(this), 200)
  },
  //上传照片
  addimage: function () {
    var that = this;
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        if (that.data.all.length <= 9){
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
          }else {
          wx.showModal({
            title: '提示',
            content: '只能上传9张照片',
          })
        }
        }else{
          wx.showModal({
            title: '提示',
            content: '只能上传9张照片',
          })
        }
      }
    })
  },
})
//获取列表数据
function getdata(latitude,longitude,city,that) {
  wx.request({
    url: getApp().openidData.url + 'temple.php',
    data: {
      customer_id: getApp().openidData.customer_id,//customer_id
      latitude: latitude,
      longitude: longitude,
      distance: 1,
      pname: '',
      city:city
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