
var address = require('../../utils/city.js')
const innerAudioContext = wx.createInnerAudioContext()
if (wx.setInnerAudioOption) {
  wx.setInnerAudioOption({
    obeyMuteSwitch: false,
    autoplay: true
  })
} else {
  innerAudioContext.obeyMuteSwitch = false;
  innerAudioContext.autoplay = true;
}
//监听各个阶段
innerAudioContext.onCanplay(() => {
  console.log(1111)
  console.log('可以播放');
});
innerAudioContext.onPlay(() => {
  console.log(22222)
  console.log('监听到音频开始播放');
});
innerAudioContext.onEnded(() => {
  console.log(33333)
  console.log('音频自然播放结束事件');
});
innerAudioContext.onStop(() => {
  console.log(4444)
  console.log('音频停止事件');
});
innerAudioContext.onError((res) => {
  console.log(55)
  console.log(res.errMsg);
  console.log(66)
  console.log(res.errCode);
});
innerAudioContext.onWaiting((res) => {
  console.log(77)
  console.log('音频加载中事件，当音频因为数据不足，需要停下来加载时会触发')
});
innerAudioContext.onError((res) => {
  console.log(88)
  console.log(res);
})

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
    hide:false,//隐藏寺庙的
    hide_1:false,//
    id: '',//寺庙的id
    pname: "",//寺庙
    bgm: false,//控制音乐
    music: '',//音乐地址
    change: '',//默认第一个祈福签添加样式
    location_p:'',//选择的省
    location_c:'',//选择的市
    imageUrl:'',//域名
    img_id:'',//祈福签的id 
  },
  onLoad: function (options) {
    var that = this;
   that.setData({
     change: options.change,//默认第一个祈福签添加样式
     imageUrl:getApp().openidData.urls//域名
   })
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
    getdata(that.data.location_c, that.data.location_p,that);
  },
  onUnload: function () {
    //离开页面是停止播放音乐
    innerAudioContext.pause();
  },
  //选择第几个祈福签
  photo:function(e){
     var that =this;
    let id = e.currentTarget.dataset.id;//祈福签
     let index = e.currentTarget.dataset.index;//索引值
     that.setData({
       img_id:id,
       change:index + 1
     })
  },
  // 背景音乐
  BGM: function () {
    let that = this;
    console.log(that.data.music)
    if (that.data.bgm) {
      that.setData({
        bgm: false,
      })
      innerAudioContext.pause(); /**  暂停音乐 */

    } else {
      that.setData({
        bgm: true,
        bgmImgAni: "bgmImgAni"
      })      // 播放音乐
      innerAudioContext.title = ' '
      innerAudioContext.autoplay = true
      innerAudioContext.loop = true
      innerAudioContext.src = that.data.music;
      innerAudioContext.play()
    }
  },
  //开启寺庙
  click: function () {
    var that = this;
    let data = that.data.index_data.list;//获取寺庙的数据
    that.setData({ hide_1:false })
    if (that.data.location_c == '' || that.data.location_p == '') {
      wx.showModal({
        title: '提示',
        content: '你还未选择地区',
        success: function (res) {
          if (res.confirm) {
            console.log('确认呢')
          } else if (res.cancel) {
            console.log('取消')
          }
        },
      })
    } else if (that.data.location_c != '' && that.data.location_p != '' && data.length == 0) {
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
    else if (that.data.location_c != '' || that.data.location_p != '' || data.length != 0) {
      that.setData({
        hide: true,
        hide_1:false,
      })
    }
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
  //选择地区，寺庙
  choose: function (e) {
    var that = this;
    let id = e.currentTarget.dataset.id;//寺庙id
    let pname = e.currentTarget.dataset.pname;//寺庙名称
    that.setData({
      id: id,
      pname: pname,
    })
  },
  //点击祈福
  formSubmit:function(e){
    console.log(e)
    var that = this;
    let name = e.detail.value.name;//祈福人
    let comment = e.detail.value.comment;//祈福愿
    if (e.detail.value.name == ''){
      wx.showModal({
        title: '提示',
        content: '您还未输入祈福人',
        success: function(res) {
          if(res.confirm){
            console.log('用户点击了确认')
          }else if(res.cancel){
            console.log('用户点击了取消')
          }
        },
      })
    } else if (e.detail.value.comment == ''){
      wx.showModal({
        title: '提示',
        content: '您还未输入祈福愿',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击了确认')
          } else if (res.cancel) {
            console.log('用户点击了取消')
          }
        },
      })
    } else if (that.data.pname == ''){
      wx.showModal({
        title: '提示',
        content: '您还选择寺庙',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击了确认')
          } else if (res.cancel) {
            console.log('用户点击了取消')
          }
        },
      })
    } else if (that.data.img_id == '') {
      wx.showModal({
        title: '提示',
        content: '您还选择祈福签',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击了确认')
          } else if (res.cancel) {
            console.log('用户点击了取消')
          }
        },
      })
    }
    else {
      wx.navigateTo({
        url: '/pages/blesspay/blesspay?id=' + that.data.id + '&type=0' + '&sort=2' + '&name=' + name + '&comment=' + comment + '&img_id=' + that.data.img_id,
      })
    }
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
    this.setData({
      hide_1: false
    })
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
      hide_1:false,
    })
    getdata(that.data.location_c,that.data.location_p,that)
  },
  hideCitySelected: function (e) {
    console.log(e)
    this.setData({
      hide_1:false
    })
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
function getdata(location_c,location_p,that) {
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
        music: res.data.musicurl2,
        bgm: true,
        bgmImgAni: "bgmImgAni"
      })
      // 播放音乐
      innerAudioContext.title = ' '
      innerAudioContext.autoplay = true
      innerAudioContext.loop = true
      innerAudioContext.src = that.data.music;
      innerAudioContext.play()
     
      // player(that)

      
    }
  })
}
// function player(that) {
//   const backgroundAudioManager = wx.getBackgroundAudioManager()
//   backgroundAudioManager.title = '此时此刻'
//   backgroundAudioManager.src = that.data.music
//   backgroundAudioManager.onEnded(() => {
//     player()
//   })
// }