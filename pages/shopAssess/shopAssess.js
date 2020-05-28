
Page({

  data: {
    id:0, //产品id
    imageurl: '', //地址

  },
  onLoad: function (options) {
    var that = this;
    that.setData({
      id:options.id,
      imageurl:getApp().openidData.urls,
    })
    getdata(that, that.data.id)
    console.log(that.data.id);
  },
  //点击照片变大
  imgYu:function(e){
    var that = this;
    var list = e.currentTarget.dataset.list;
    var index = e.currentTarget.dataset.index;
    for (var i = 0; i < list.length; i++){
      list[i] = that.data.imageurl + list[i]
    }
    wx.previewImage({
        current: list[index], // 当前显示图片的http链接
        urls: list // 需要预览的图片http链接列表
    })
  },
})
//获取数据
function getdata(that, id) {
  wx.request({
    url: getApp().openidData.url + 'get_discuss.php',
    data: {
      customer_id: getApp().openidData.customer_id,//customer_id
      pid: id,//产品id
      // pid:194
    },
    method: 'POST',
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    success: function (res) {
      // 获取评论数据转成16进制再渲染
      for (let i = 0; i < res.data.length; i++) {
        res.data[i].discuss = entitiesToUtf16(res.data[i].discuss);
      }
      that.setData({
        index_data: res.data,
      })
    }
  })
}
//将编码后的八进制的emoji表情重新解码成十六进制的表情字符
function entitiesToUtf16(str) {
  return str.replace(/&#(\d+);/g, function (match, dec) {
    let H = Math.floor((dec - 0x10000) / 0x400) + 0xD800;
    let L = Math.floor(dec - 0x10000) % 0x400 + 0xDC00;
    return String.fromCharCode(H, L);
  });
}

