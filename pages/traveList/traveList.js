Page({
  data: {
    id:'',//列表的id
    type_1: 0,//筛选里面的
    hide_1:false,//筛选的隐藏
    type_id: '',//这是创建景点中选择类别的id
    city_1:'',//获取头部地址
    city:'',//判断是否选过地址
    hide: false,//创建攻略隐藏
    hide_2:false,//这是搜索的
    index_data:'',//获取数据
    index_data_1:'',//获取列表数据
    type:'',//切换的状态
    imageUrl:'',//照片域名
    address:'',//获取市区
    address_1:'',//获取具体的地址
    imgArr:[],//存照片的
    latitude:'',//纬度
    longitude:'',//经度
    all:[],//存放照片的数组
    getName:'',//input中的value值
    //轮播图开始
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 500,
    circular: true,
    //轮播图结束
  },
  onLoad: function (options) {
  var that = this;
  that.setData({
    type : options.type,//列变默认点击第一个
    imageUrl:getApp().openidData.urls,//域名
    city_1: getApp().openidData.city//获取默认城市
  })
    wx.getLocation({
      type: 'gcj02',
      success(res) {
        console.log(res.latitude)
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
        getdata(that.data.type_1, that.data.latitude, that.data.longitude, '', that);
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
  //筛选里面的切换
  click_6: function (e) {
    var that = this;
    let index = e.currentTarget.dataset.index;
    that.setData({ type_1: index })
    console.log(that.data.id)
    if (index == 1) {
      wx.request({
        url: getApp().openidData.url + 'scenic_spot_list.php',
        data: {
          customer_id: getApp().openidData.customer_id,//customer_id
          type_id: that.data.id,
          name: '',
          latitude: that.data.latitude,
          longitude: that.data.longitude,
          distance: '',
          popularity: 1,
          city: that.data.city
        },
        method: 'POST',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: function (res) {
          console.log(res.data);
          that.setData({
            index_data_1: res.data,
          })
        }
      })
    } else if (index == 2) {
      wx.request({
        url: getApp().openidData.url + 'scenic_spot_list.php',
        data: {
          customer_id: getApp().openidData.customer_id,//customer_id
          type_id: that.data.id,
          name: '',
          latitude: that.data.latitude,
          longitude: that.data.longitude,
          distance: 1,
          popularity: '',
          city: that.data.city
        },
        method: 'POST',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: function (res) {
          console.log(res.data);
          that.setData({
            index_data_1: res.data,
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

  //创建景点中的选择类别
  choose: function (e) {
    var that = this;
    let index = e.currentTarget.dataset.index;
    let id = e.currentTarget.dataset.id;
    that.setData({
      type_id: id,
      sort: Number(index) + 1
    })
  },
  //点击搜索
  form: function (e) {
    var that = this;
    let name = e.detail.value.text;//搜索名
    that.setData({
      getName:''
    })
    if(name == ''){
     wx.showModal({
       title: '提示',
       content: '你还未输入内容',
       success: function(res) {
         if(res.confirm){
           console.log('确认')
         }else if(res.cancel){
           console.log('取消')
         }
       },
     })
    }else{
      wx.request({
        url: getApp().openidData.url + 'scenic_spot_list.php',
        data: {
          customer_id: getApp().openidData.customer_id,//customer_id
          type_id: that.data.id,
          name: name,
          latitude: that.data.latitude,
          longitude: that.data.longitude,
          distance: 1,
          popularity: '',
          city: that.data.city,
        },
        method: 'POST',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: function (res) {
          if(res.data.length == 0){
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
          }else{
            that.setData({
              index_data_2: res.data,
            })
          }
        }
      })
    }

  },
  //创建景点
  formSubmit: function (e) {
    var that = this;
    let name = e.detail.value.name;//添加正文
    let title = e.detail.value.title;//添加标题
    if (name == '') {
      wx.showModal({
        title: '提示',
        content: '您还未添加正文',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击了确认')
          } else if (res.cancel) {
            console.log('用户点击了取消')
          }
        },
      })
    } else if (title == '') {
      wx.showModal({
        title: '提示',
        content: '您还未添加标题',
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
        content: '您还未添加照片',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击了确认')
          } else if (res.cancel) {
            console.log('用户点击了取消')
          }
        },
      })
    } else if (that.data.address_1 == '') {
      wx.showModal({
        title: '提示',
        content: '您还未添加地址',
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
      for (var i = 0; i < that.data.imgArr.length; i++) {
        newimgArr += that.data.imgArr[i] + ',';
      }
      newimgArr = newimgArr.slice(0, -1);
      wx.request({
        url: getApp().openidData.url + 'scenic_spot_add.php',
        data: {
          name: title,
          address: that.data.address_1,
          img: '',
          content: name,
          introduce_img: newimgArr,
          type_id: that.data.type_id,
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
              address: ''
            })
            that.hideModal();
          } else if (res.data.status == 2){
            wx.showModal({
              title: '提示',
              content: res.data.msg,
            })
            that.setData({
              tempFilePaths: '',
              address: ''
            })
            that.hideModal();
          }
        }
      })
    }

  },
  //点击获取具体地址
  click_4:function(){
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
            console.log(re)
            that.setData({
              city: re.data,
              latitude: res.latitude,
              longitude: res.longitude,
              city_1:re.data
            })
            getdata(that.data.type_1,that.data.latitude, that.data.longitude, that.data.city, that);
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
  //跳转详情
  jump: function (e) {
    var that = this;
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/temple/temple?id=' + id + '&sort=1',
    })
  },
  //开启创建攻略
  click_1: function () {
    this.setData({ hide: true })
  },
  //开启筛选
  click_2: function () {
    this.setData({ hide_1: true })
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
        hide_2:false,
      })
    }.bind(this), 200)
  },
  //点击切换状态
  click: function (e) {
    var that = this;
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    that.setData({
      type: index + 1,
      id: id,
    })
    getlist(that.data.type_1,that.data.latitude,that.data.longitude,that.data.city,that.data.id, that)
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
//获取轮播图和点击切换的数据
function getdata(type_1,latitude, longitude, city, that) {
  wx.request({
    url: getApp().openidData.url + 'scenic_spot_type.php',
    data: {
      customer_id: getApp().openidData.customer_id,//customer_id
      get_type: 2,
    },
    method: 'POST',
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    success: function (res) {
      console.log('获取目录')
      console.log(res.data);
      that.setData({
        index_data: res.data,
        id: res.data.arr[0].type_id
      })
      getlist(type_1,latitude, longitude, city, res.data.arr[0].type_id, that)
    }
  })
}
//获取列表数据
function getlist(type_1,latitude, longitude, city, id, that){
  if (type_1 == 0){
    wx.request({
      url: getApp().openidData.url + 'scenic_spot_list.php',
      data: {
        customer_id: getApp().openidData.customer_id,//customer_id
        type_id: id,
        name: '',
        latitude: latitude,
        longitude: longitude,
        distance: 1,
        popularity: '',
        city: city,
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res.data);
        that.setData({
          index_data_1: res.data,
        })
      }
    })
  }
  if (type_1 == 1) {
    wx.request({
      url: getApp().openidData.url + 'scenic_spot_list.php',
      data: {
        customer_id: getApp().openidData.customer_id,//customer_id
        type_id: id,
        name: '',
        latitude: latitude,
        longitude: longitude,
        distance: '',
        popularity: 1,
        city: city,
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res.data);
        that.setData({
          index_data_1: res.data,
        })
      }
    })
  } else if (type_1 == 2) {
    wx.request({
      url: getApp().openidData.url + 'scenic_spot_list.php',
      data: {
        customer_id: getApp().openidData.customer_id,//customer_id
        type_id: id,
        name: '',
        latitude: latitude,
        longitude: longitude,
        distance: 1,
        popularity: '',
        city: city,
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res.data);
        that.setData({
          index_data_1: res.data,
        })
      }
    })
  }
  // wx.request({
  //   url: getApp().openidData.url + 'scenic_spot_list.php',
  //   data: {
  //     customer_id: getApp().openidData.customer_id,//customer_id
  //     type_id: id,
  //     name: '',
  //     latitude: latitude,
  //     longitude: longitude,
  //     distance: 1,
  //     popularity: '',
  //     city:city,
  //   },
  //   method: 'POST',
  //   header: {
  //     "Content-Type": "application/x-www-form-urlencoded"
  //   },
  //   success: function (res) {
  //     console.log('获取列表数据')
  //     console.log(res.data);
  //     that.setData({
  //       index_data_1: res.data,
  //     })
  //   }
  // })
}
