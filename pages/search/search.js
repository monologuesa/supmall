// pages/search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    getName:'',//搜索里面的value
    searchRecord: [],//存放搜索历史的数组
    city:'',//市
    name:"",//搜索内容
    datas: '',//数据
    imageurl:'', //地址
    id:0, //跳转的id
    info:false,  //搜索成功显示商品内容
    history:true,
    zhe: true,
  },
  onLoad: function (options) {
    var that = this;
    that.setData({ 
      imageurl:getApp().openidData.urls,
      city:getApp().openidData.city
    });
    that.openHistorySearch();
  },
  //获取储存
  openHistorySearch: function () {
    this.setData({
      searchRecord: wx.getStorageSync('searchRecord') || [],//若无储存则为空
    })
  },
  //点击获取具体地址
  address_1: function () {
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
              city: re.data
            })
          }
        })
      }
    })
  },
  //点击搜索
  form: function (e) {
    var that = this;
    var searchRecord = that.data.searchRecord;
    var name = e.detail.value.text;
    if (name == '') {
      //输入为空时的处理
    }
    else {
      console.log(searchRecord.length)
      if (searchRecord.length < 6 ){
        let a = '';
        for (var i = 0; i < searchRecord.length; i++) {
          if (searchRecord[i].value == name) {
            console.log('删除')
            searchRecord.splice(i, 1)
          } else {
            console.log('不删除')
          }
        }
        searchRecord.unshift({
          value: name,
          id: searchRecord.length
        })
      }else{
        searchRecord.pop()//删掉旧的时间最早的第一条
        searchRecord.unshift(
          {
            value: name,
            id: searchRecord.length
          }
        )
      }

      //将历史记录数组整体储存到缓存中
      wx.setStorageSync('searchRecord', searchRecord);
      that.openHistorySearch();
    }
    that.setData({
      name: e.detail.value.text,
      getName:''
    })
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: getApp().openidData.url + 'local_specialty.php',
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        goods_name:that.data.name,
        customer_id: getApp().openidData.customer_id
      },
      success: function (res) {
        if (res.data.goods.length == 0){
          wx.hideLoading();
          wx.showModal({
            title: '提示',
            content: '没有相关内容',
            success: function(re) {
              if(re.confirm){
                console.log('确认')
              }else if(re.cancel){
                console.log('取消')
              }
            },
          })
        }else{
          wx.hideLoading();
          that.setData({ datas: res.data.goods });
        }

      }
    })
  },
  //点击历史记录能搜索
  click:function(e){
    var that = this;
    let name = e.currentTarget.dataset.name;
    // that.setData({
    //   getName:name
    // })
    wx.request({
      url: getApp().openidData.url + 'local_specialty.php',
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        goods_name: name,
        customer_id: getApp().openidData.customer_id
      },
      success: function (res) {
        if (res.data.goods.length == 0) {
          wx.hideLoading();
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
          wx.hideLoading();
          that.setData({ datas: res.data.goods });
        }

      }
    })
  },
  //跳转商品详情
  list:function(e){
   let that = this;
   let id = e.currentTarget.dataset.id;
   wx.navigateTo({
     url: '/pages/shop/shop?id='+id,
   })
  },
})