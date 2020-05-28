
var address = require('../../utils/city.js')
var animation

Page({
  data: {
    index:0,//判断是点击第几个地址过来的
    address_id:'', 
    num: 0,//判断is_default的时候用
    check: false,//默认按钮
    animationAddressMenu: {},//省市县开始
    addressMenuIsShow: false,
    value: [0, 0, 0],
    provinces: [],
    citys: [],
    areas: [],
    province: '',
    city: '',
    area: '',//结束
    check:false,//默认按钮的开关
    boolts:false,//判断默认值的
    diff:'',//判断编辑点击来的  1是点击编辑进来的  2是点击新建地址进来的
    sort:'',//判断是确认订单的 1是商品详情进来的  2 是个人中心进来的 3 购物车来的
    hide_3:false,//这是用来隐藏选择地区的，因为不隐藏的话会把保存挡住
},
  onLoad: function (options) { 
    var that = this;
    that.setData({
      index:options.index,
      diff:options.diff,
      sort:options.sort
    })
    if(that.data.sort == 1){//商品详情过来的
      that.setData({
        pid: options.pid,//商品的id
        rcount: options.rcount,//商品的数量
        sel_pros: options.sel_pros,//商品的规格
        supply_id: options.supply_id,//店铺的id
        cart_ids:options.cart_ids,
      })
    } else if (that.data.sort == 2){
      // console.log('这是个人中心进来的')
    } else if (that.data.sort == 3 ){//购物车过来的额
      that.setData({
        pro_arr: options.pro_arr,
        num: options.num,//这是做支付判断的
        cart_ids: options.cart_ids,
      })
    }
    if(that.data.diff == 1){//1是点击编辑进来的
      that.setData({
        index: options.index,
        address_id: options.id,
      });
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
          if (that.data.index != undefined) {
            that.setData({
              index_data: res.data,
              location_p: res.data[that.data.index].location_p,
              location_c: res.data[that.data.index].location_c,
              location_a: res.data[that.data.index].location_a,
            })
            if (res.data[that.data.index].is_default == 1) {
              that.setData({ check: true, boolts: true })
            } else {
              that.setData({ check: false, boolts: false })
            }
          }
        }
      });
    }

    var animation = wx.createAnimation({
      duration: 500,
      transformOrigin: "50% 50%",
      timingFunction: 'ease',
    })
    this.animation = animation;
    // 默认联动显示北京
    var id = address.provinces[0].id
    this.setData({
      provinces: address.provinces,
      citys: address.citys[id],
      areas: address.areas[address.citys[id][0].id],
    })
  },
  //表单提交
  formSubmit:function(e){
    var that = this;
    if(that.data.boolts){
      that.setData({ num: 1 })
    }else{
      that.setData({ num: 0 })
    }
    var mobile = e.detail.value.phone;//获取手机号
    var mobilePattern = /^1[3456789]\d{9}$/;
    if (e.detail.value.user.length > 12) {
      wx.showModal({
        title: '提示',
        content: '请填写12字以内的姓名',
      })
      return;
    }
    else if (!check(e.detail.value.user)) {
      wx.showModal({
        title: '提示',
        content: '请输入正确的联系人',
      })
      return;
    }
    else if (!mobilePattern.test(mobile)) {
      wx.showModal({
        title: '提示',
        content: '请填写合法的手机号',
        showCancel: false
      })
      return;
    } 
    else if (e.detail.value.address == '') {
      wx.showModal({
        title: '提示',
        content: '请输入正确的详细地址',
        showCancel: false
      })
      return;
    }
    else if (that.data.index == 0) {
      if(that.data.diff == 2){
        set_address(that, e,that.data.sort);
        if (that.data.sort == 1) {
          setTimeout(function () {
            wx.redirectTo({
              url: '/pages/address/address?sort=1' + '&pid=' + that.data.pid + '&rcount=' + that.data.rcount + '&sel_pros=' + that.data.sel_pros + '&supply_id=' + that.data.supply_id + '&num=' + '微信支付' ,
            });
          }, 1000)
        } else if (that.data.sort == 2) {
          setTimeout(function () {
            wx.redirectTo({
              url: '/pages/address/address?sort=2',
            });
          }, 1000)
        } else if (that.data.sort == 3){
          setTimeout(function () {
            wx.redirectTo({
              url: '/pages/address/address?sort=3' + '&pro_arr=' + that.data.pro_arr + '&num=' + '微信支付' + '&cart_ids=' + that.data.cart_ids,
            });
          }, 1000)
        }
      } else if (that.data.diff == 1) {
        wx.request({
          url: getApp().openidData.url + 'save_address.php',
          data: {
            user_id: getApp().openidData.user_id,
            id: that.data.address_id,
            name: e.detail.value.user,
            phone: e.detail.value.phone,
            address: e.detail.value.address,
            is_default: that.data.num,
            location_p: that.data.location_p,
            location_c: that.data.location_c,
            location_a: that.data.location_a,
            op: 'edit',
          },
          method: 'POST',
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          success: function (res) {
            if (res.data.status == 1) {
              wx.showToast({
                title: '成功',
                icon: 'success',
                duration: 2000
              })
            if (that.data.sort == 1) {
              setTimeout(function () {
                wx.redirectTo({
                  url: '/pages/address/address?sort=1' + '&pid=' + that.data.pid + '&rcount=' + that.data.rcount + '&sel_pros=' + that.data.sel_pros + '&supply_id=' + that.data.supply_id + '&num=' + '微信支付',
                });
              }, 1000)
            } else if (that.data.sort == 2) {
              setTimeout(function () {
                wx.redirectTo({
                  url: '/pages/address/address?sort=2',
                });
              }, 1000)
            } else if (that.data.sort == 3) {
              setTimeout(function () {
                wx.redirectTo({
                  url: '/pages/address/address?sort=3' + '&pro_arr=' + that.data.pro_arr + '&num=' + '微信支付' + '&cart_ids=' + that.data.cart_ids,
                });
              }, 1000)
            }
            }else {
               wx.showModal({
                 title: '提示',
                 content: res.errMsg,
               })
             }
          },
          fail: function () {
            // fail
          },
          complete: function () {
            // complete
          }
        })
      }
    } else if (that.data.index != 0){
      if(that.data.diff == 1){
        wx.request({
          url: getApp().openidData.url + 'save_address.php',
          data: {
            user_id: getApp().openidData.user_id,
            id: that.data.address_id,
            name: e.detail.value.user,
            phone: e.detail.value.phone,
            address: e.detail.value.address,
            is_default: that.data.num,
            location_p: that.data.location_p,
            location_c: that.data.location_c,
            location_a: that.data.location_a,
            op: 'edit',
          },
          method: 'POST',
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          success: function (res) {
            if (res.data.status == 1) {
              wx.showToast({
                title: '成功',
                icon: 'success',
                duration: 2000
              })
                setTimeout(function () {
                  wx.redirectTo({
                    url: '/pages/address/address',
                  });
                }, 2000)
            } else {
              wx.showModal({
                title: '提示',
                content: res.errMsg,
              })
            }
          },
          fail: function () {
            // fail
          },
          complete: function () {
            // complete
          }
        })
      } 
    }  
},
//设置默认地址的
  boolts:function(){
    let that = this;
    let a = !that.data.boolts;
    that.setData({ boolts:a })
  },
//关于省市县的方法
  selectDistrict: function (e) {
    var that = this
    if (that.data.addressMenuIsShow) {
      return
    }
    that.startAddressAnimation(true)
    that.setData({
      hide_3:true
    })
  },
  // 执行动画
  startAddressAnimation: function (isShow) {
    var that = this
    if (isShow) {
      that.animation.translateY(0 + 'vh').step()
    } else {
      that.animation.translateY(40 + 'vh').step()
    }
    that.setData({
      animationAddressMenu: that.animation.export(),
      addressMenuIsShow: isShow,
    })
  },
  // 点击地区选择取消按钮
  cityCancel: function (e) {
    this.startAddressAnimation(false)
  },
  // 点击地区选择确定按钮
  citySure: function (e) {
    var that = this
    var city = that.data.city
    var value = that.data.value
    that.startAddressAnimation(false)
    // 将选择的城市信息显示到输入框
    var areaInfo = that.data.provinces[value[0]].name + ',' + that.data.citys[value[1]].name + ',' + that.data.areas[value[2]].name
    that.setData({
      areaInfo: areaInfo,
      location_p: that.data.provinces[value[0]].name,
      location_c: that.data.citys[value[1]].name,
      location_a: that.data.areas[value[2]].name,
      hide_3:false
    })
  },
  hideCitySelected: function (e) {
    this.startAddressAnimation(false)
  },
  // 处理省市县联动逻辑
  cityChange: function (e) {
    var value = e.detail.value
    var provinces = this.data.provinces
    var citys = this.data.citys
    var areas = this.data.areas
    var provinceNum = value[0]
    var cityNum = value[1]
    var countyNum = value[2]
    if (this.data.value[0] != provinceNum) {
      var id = provinces[provinceNum].id
      this.setData({
        value: [provinceNum, 0, 0],
        citys: address.citys[id],
        areas: address.areas[address.citys[id][0].id],
      })
    } else if (this.data.value[1] != cityNum) {
      var id = citys[cityNum].id
      this.setData({
        value: [provinceNum, cityNum, 0],
        areas: address.areas[citys[cityNum].id],
      })
    } else {
      this.setData({
        value: [provinceNum, cityNum, countyNum]
      })
    }
  },
})
//新建地址
function set_address(that, e, sort) {
  wx.request({
    url: getApp().openidData.url + 'save_address.php',
    data: {
      user_id: getApp().openidData.user_id,
      name: e.detail.value.user,
      phone: e.detail.value.phone,
      address: e.detail.value.address,
      is_default: that.data.num,
      location_p: that.data.location_p,
      location_c: that.data.location_c,
      location_a: that.data.location_a,
      op:'insert',
    },
    method: 'POST',
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    success: function (res) {
      if(res.data.status == 1){
        wx.showToast({
           title: '成功',
           icon:'success',
           duration: 2000
        })
      }else{
        wx.showModal({
          title: '提示',
          content: res.errMsg,
        })
      }
    },
    fail: function () {
      // fail
    },
    complete: function () {
      // complete
    }
  })
}
//判断是否是中文数字英文
function check(v) {
  var regex = new RegExp("^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z0-9_]){1,12}$");//不包含“-”
  // var regex = new RegExp("^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z0-9_-]){1,20}$");// 包含“-”
  var res = regex.test(v);
  if (res == true) {
    console.log("包含中英文字母或下划线");
    return true;
  } else {
    console.log("不包含中英文字母或下划线");
    return false;
  }
}