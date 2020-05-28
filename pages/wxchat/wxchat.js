// pages/wxchat/wxchat.js
Page({


  data: {
    type:'',//3是银行卡提现。0是微信提现跳转所携带的值
  },
  onLoad: function (options) {
    var that = this ;
    that.setData({
      type:options.type
    })
      wx.request({
        url: getApp().openidData.url + 'my_alipay2.php',
        data: {
          user_id: getApp().openidData.user_id,//用户id
          // user_id: 3063,
        },
        method: 'POST',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: function (res) {
          console.log(res.data)
          that.setData({
            index_data: res.data[0],
          })
        }
      })

  },
  formSubmit:function(e){
    var that = this;
    console.log(e);
    var mobile = e.detail.value.phone;//获取手机号
    var mobilePattern = /^1[3456789]\d{9}$/;
    if (!check(e.detail.value.name)) {
      wx.showModal({
        title: '提示',
        content: '请输入正确的联系人',
      })
      return;
    } else if (!mobilePattern.test(mobile)) {

      wx.showModal({
        title: '提示',
        content: '请填写合法的手机号',
        showCancel: false
      })
      return;
    }else{
      wx.request({
        url: getApp().openidData.url + 'save_pay_account2.php',
        data: {
          user_id: getApp().openidData.user_id,//用户id
          // user_id: 3063,
          phone: mobile,
          real_name: e.detail.value.name,
        },
        method: 'POST',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: function (res) {
          console.log("获取成功");
          console.log(res.data);
          if (res.data.status == 1) {
            wx.showToast({
              title: '成功',
              icon: 'success',
              duration: 2000
            })
            setTimeout(function () {
              wx.redirectTo({
                url: '/pages/money/money?index=' + that.data.type,
              });
            }, 500)
          } else {
            wx.showModal({
              title: '提示',
              content: res.errMsg,
            })
          }

        }
      })
    }

  }
})
//获取数据

//验证名字
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