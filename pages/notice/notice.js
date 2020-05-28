// pages/notice/notice.js
Page({

  data: {
   type:-1,//点击切换状态
   imageUrl:'',
  },
  onLoad: function (options) {
    var that = this;
    that.setData({
      type:options.type,
      imageUrl:getApp().openidData.urls,
    })
    getdata(that,that.data.type);
  },
  //一键复制
  copy:function(e){
  var that = this;
  let index = e.currentTarget.dataset.index;
  let data = that.data.index_data.msg;
    wx.setClipboardData({
      data: data[index].content,
      success: function (res) {
      }
    });
  },
  //点击切换
  top:function(e){
  let that = this;
  let index = e.currentTarget.dataset.index;
  that.setData({
    type:index,
    index_data:''
  })
  getdata(that,that.data.type);
},
//长按删除
  longPress:function(e){
    var that =this;
    let id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '是否删除此条消息',
      success: function(res) {
        if(res.confirm){
          wx.request({
            url: getApp().openidData.url + 'del_content.php',
            data: {
              type: 'msg',
              id:id
            },
            method: 'POST',
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
              getdata(that, that.data.type);
            }
          })
        }else if(res.cancel){
          console.log('取消')
        }
      },
    })
  },
  //景点回复
  formSubmit:function(e){
    var that = this;
    let name = e.detail.value.name;
    let id = e.currentTarget.dataset.id;
    let bid = e.currentTarget.dataset.bid;
    let blev = e.currentTarget.dataset.blev;
    let buser = e.currentTarget.dataset.buser;
    let type = e.currentTarget.dataset.type;
    if(name == ''){
      wx.showModal({
        title: '提示',
        content: '请输入内容',
      })
      return;
    }
    if(type == 1){
      //先把评论数据转成八进制转给后端存数据库
      name = utf16toEntities(name);
      wx.request({
        url: getApp().openidData.url + 'scenic_discuss_add.php',
        data: {
          s_id:id,
          user_id: getApp().openidData.user_id,//用户id
          customer_id:getApp().openidData.customer_id,
          discuss:name,
          write_back_id: bid,
          write_back_level: blev,
          write_back_user: buser,
        },
        method: 'POST',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: function (res) {
          if (res.data.status == 1){
            wx.showModal({
              title: '提示',
              content: res.data.msg,
            })
            that.setData({
              name:''
            })
          }else{
            wx.showModal({
              title: '提示',
              content: res.data.msg,
            })
          }
        }
      })
    }else if(type == 0){
      console.log('不回复')
    }
  }
})
//获取数据
function getdata(that,type) {
  wx.request({
    url: getApp().openidData.url + 'get_user_msg.php',
    data: {
      user_id: getApp().openidData.user_id,//用户id
      // user_id: 4387,//用户id
      type:type
    },
    method: 'POST',
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    success: function (res) {
      that.setData({
        index_data: res.data
      })
    }
  })
}
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