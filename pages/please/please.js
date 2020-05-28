// pages/please/please.js
var address = require('../../utils/city.js')
const innerAudioContext = wx.createInnerAudioContext()

Page({
  data: {
    animationData: {},//开始
    animationAddressMenu: {},
    addressMenuIsShow: false,
    value: [0, 0, 0],
    provinces: [],
    citys: [],
    areas: [],
    province: '',
    city: '',
    area: '',//结束
    location_p: '',//选择的省
    location_c: '',//选择的市
    hide_1:false,

    hide:false,//寺庙
    id:'',//省 id
    pname:"",//寺庙名称
    bgm: false,//控制音乐
    music:'',//音乐地址
  },
  onLoad: function (options) {
    var that = this;
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
    })
    getdata(that.data.location_c, that.data.location_p, that);
  },
  onUnload: function () {
    //离开页面是停止播放音乐
    innerAudioContext.pause();
  },
  //点击寺庙开启
  click_1:function(){
    var that = this;
    let data = that.data.index_data.list;//获取寺庙的数据
    if (that.data.location_c == '' || that.data.location_p == ''){
      wx.showModal({
        title: '提示',
        content: '你还未选择地区',
        success: function(res) {
          if(res.confirm){
            console.log('确认呢')
          }else if(res.cancel){
            console.log('取消')
          }
        },
      })
    } else if (that.data.location_c != '' && that.data.location_p != '' && data.length == 0){
      wx.showModal({
        title: '提示',
        content: '该地区尚未有能选择的寺庙',
        success: function (res) {
          if (res.confirm) {
            console.log('确认呢')
          } else if (res.cancel) {
            console.log('取消')
          }
        },
      })
    }
    else if (that.data.location_c != '' || that.data.location_p != '' || data.length != 0){
      that.setData({
        hide: true
      })
    }
  },
  //选择地区
  choose:function(e){
   var that = this ;
   let id = e.currentTarget.dataset.id;//寺庙的id
   let pname = e.currentTarget.dataset.pname;//寺庙的名称
   that.setData({
     id:id,
     pname:pname,
   })
  },
  // 背景音乐
  BGM: function () {
    let that = this;
    if (that.data.bgm) {
      that.setData({
        bgm: false,
      })
      innerAudioContext.pause(); /**  暂停音乐 */

    } else {
      that.setData({
        bgm: true,
        bgmImgAni: "bgmImgAni"
      })
      // 播放音乐
      innerAudioContext.autoplay = true
      innerAudioContext.loop = true
      innerAudioContext.src = that.data.music;
      innerAudioContext.play()
    }
  },
  //点击跳转
  jump:function(){
    var that = this;
    if (that.data.pname == ''){
      wx.showModal({
        title: '提示',
        content: '你还未选择寺庙',
        success: function(res) {
          if(res.confirm){
            console.log('用户点击了确认')
          }else if(res.cancel){
            console.log('用户点击了取消')
          }
        },
      })
    }else{
      wx.navigateTo({
        url: '/pages/blesspay/blesspay?id=' + that.data.id + '&type=0' +'&sort=1',
      })
    }


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
        hide_1:false,
        hide_2:false,
      })
    }.bind(this), 200)
  },
  // 点击所在地区弹出选择框
  selectDistrict: function (e) {
    var that = this
    if (that.data.addressMenuIsShow) {
      return
    }
    that.startAddressAnimation(true)
    that.setData({
      hide_1:true
    })
  },
  // 执行动画
  startAddressAnimation: function (isShow) {
    console.log(isShow)
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
    this.setData({ hide_1:false })
    this.startAddressAnimation(false)
  },
  // 点击地区选择确定按钮
  citySure: function (e) {
    var that = this
    var city = that.data.city
    var value = that.data.value
    that.startAddressAnimation(false)
    that.setData({
      location_p: that.data.provinces[value[0]].name,
      location_c: that.data.citys[value[1]].name,
      pname:'',
      hide_1: false,
    })
    getdata(that.data.location_c, that.data.location_p, that)
  },
  hideCitySelected: function (e) {
    console.log(e)
    this.setData({ hide_1:false })
    this.startAddressAnimation(false)
  },
  // 处理省市县联动逻辑
  cityChange: function (e) {
    console.log(e)
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

    }
    else if (this.data.value[1] != cityNum) {
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
    console.log(this.data)
  },
})
//获取数据
function getdata(location_c, location_p, that) {
  wx.request({
    url: getApp().openidData.url + 'temple_list.php',
    data: {
      customer_id: getApp().openidData.customer_id,
      location_p: location_p,
      location_c: location_c,
    },
    method: 'POST',
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    success: function (res) {

      that.setData({
        index_data: res.data,
        music: res.data.musicurl
      })
      that.setData({
        bgm: true,
        bgmImgAni: "bgmImgAni"
      })
      // 播放音乐
      innerAudioContext.autoplay = true
      innerAudioContext.loop = true
      innerAudioContext.src = that.data.music;
      innerAudioContext.play()
      
    }
  })
}