// pages/post/post.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //星级评价所需参数
    one_1: 0,//这是点击的状态
    two_1: 5,//这是没有点击的状态
    noe_2:0,
    two_2:5,
    noe_3:0,
    two_3:5,
    //星级评价结束
    batchcode:'',//订单编号
    index_data:'',//获取数据
    imageUrl:'',//域名
    imgArr: [],//存放照片的数组
    all: [],//存放照片的数组
  },

  onLoad: function (options) {
    var that = this;
    that.setData({
      batchcode: options.batchcode,
      imageUrl:getApp().openidData.urls,
    })
    wx.request({
      url: getApp().openidData.url + 'get_goods_details.php',
      data:{
        batchcode: that.data.batchcode
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success:function(res){
        that.setData({
          index_data:res.data
        })
      }
    })

  },
  //表单提交，提交评论
  formSubmit:function(e){
    console.log(e)
    var that = this;
    let content = e.detail.value.name;
    if (that.data.one_1 == 0){
      wx.showModal({
        title: '提示',
        content: '你还未选择描述相符',
        success: function(res) {
          if(res.confirm){
            console.log('确认')
          }else if(res.cancel){
            console.log('取消')
          }
        },
      })
    } else if (that.data.noe_2 == 0){
      wx.showModal({
        title: '提示',
        content: '你还未选择物流服务',
        success: function (res) {
          if (res.confirm) {
            console.log('确认')
          } else if (res.cancel) {
            console.log('取消')
          }
        },
      })
    } else if (that.data.noe_3 == 0) {
      wx.showModal({
        title: '提示',
        content: '你还未选择服务态度',
        success: function (res) {
          if (res.confirm) {
            console.log('确认')
          } else if (res.cancel) {
            console.log('取消')
          }
        },
      })
    } else{
      let newimgArr = '';//存照片的地方
      for (var i = 0; i < that.data.imgArr.length; i++) {
        newimgArr += that.data.imgArr[i] + ',';
      }
      newimgArr = newimgArr.slice(0, -1);
      //先把评论数据转成八进制转给后端存数据库
      content = utf16toEntities(content);
      console.log(content + '111111111111111111111');
      wx.request({
        url: getApp().openidData.url + 'appraise.php',
        data: {
          customer_id: getApp().openidData.customer_id,
          user_id: getApp().openidData.user_id,
          batchcode: that.data.batchcode,
          description: that.data.one_1,
          logistics: that.data.noe_2,
          serve: that.data.noe_3,
          content: content,
          discussimg: newimgArr,
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
              success: function (res) {
                setTimeout(function () {
                  wx.redirectTo({
                    url: '/pages/my/my?type=5',
                  });
                }, 1000)
              },
              fail: function (res) {
                console.log('用户点击了取消')
              },
            })
          }
        },
      })
    }

  },
  //描述相符的星级评价
  in_xin:function(e){
    var that = this;
    var in_xin = e.currentTarget.dataset.in;
    var one_1;
    if(in_xin == 1){
      one_1 = Number(e.currentTarget.id)
    }else{
      one_1 = Number(e.currentTarget.id) + that.data.one_1;
    }
    that.setData({
      one_1: one_1,
      two_1: 5 - one_1
    })
  },
  //物流服务的星级评价
  achieve:function(e){ 
  let id = e.currentTarget.id;
  var that = this;
  let index = e.currentTarget.dataset.in;
  var eve;
  if( index == 3){
    eve = Number(id)
  }else{
    eve = Number(id)  + that.data.noe_2
  }
  that.setData({
    noe_2:eve,
    two_2: 5 - eve
  })
  },
  //服务态度的星级评价
  get_xin:function(e){
    var that = this;
    let id = e.currentTarget.id;
    let index = e.currentTarget.dataset.in;
    let num;
    if( index == 5){
      num = Number(id);
    }else{
      num = Number(id) + that.data.noe_3
    }
    that.setData({
      noe_3:num,
      two_3: 5 - num
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
//把utf16的emoji表情字符进行转码成八进制的字符
function utf16toEntities(str) {
  var patt = /[\ud800-\udbff][\udc00-\udfff]/g; // 检测utf16字符正则  
  return str.replace(patt, function (char) {
    var H, L, code;
    if (char.length === 2) {
      H = char.charCodeAt(0); // 取出高位  
      L = char.charCodeAt(1); // 取出低位  
      code = (H - 0xD800) * 0x400 + 0x10000 + L - 0xDC00; // 转换算法  
      return "&#" + code + ";";
    } else {
      return char;
    }
  });
}

//将编码后的八进制的emoji表情重新解码成十六进制的表情字符
function entitiesToUtf16(str) {
  return str.replace(/&#(\d+);/g, function (match, dec) {
    let H = Math.floor((dec - 0x10000) / 0x400) + 0xD800;
    let L = Math.floor(dec - 0x10000) % 0x400 + 0xDC00;
    return String.fromCharCode(H, L);
  });
}