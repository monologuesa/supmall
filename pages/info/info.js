// pages/info/info.js
var WxParse = require('../../wxParse/wxParse.js');
Page({
  data: {
   id:'',//问题的id 
   index:'',//问题的索引值
  },
  onLoad: function (options) {
   var that = this;
   that.setData({
     id:options.id,
     index: Number(options.index) + 1
   })
    getdata(that.data.id, that)
  },
})
//获取数据
function getdata(id,that) {
  wx.request({
    url: getApp().openidData.url + 'faq_details.php',
    data: {
      faq_id: id,
    },
    method: 'POST',
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    success: function (res) {
      that.setData({
        index_data: res.data
      })
      //替换标签中特殊字符
      var infoFlg = "<!--SPINFO#0-->";
      var imgFlg = "<!--IMG#";


      var content = "<div>" + res.data.content + "</div>";

      //替换标签中特殊字符
      var infoFlg = "<!--SPINFO#0-->";
      if (content.indexOf(infoFlg) > 0) {
        content = content.replace(/<!--SPINFO#0-->/, "");
      }

      var imgFlg = "<!--IMG#";
      //图片数量
      var imgCount = (content.split(imgFlg)).length - 1;
      if (imgCount > 0) {
        // console.log("有dd" + imgCount + "张图片");

        for (var i = 0; i < imgCount; i++) {
          var imgStr = "<!--IMG#" + i + "-->";
          var imgSrc = "\"" + imgInfoArr[i].src + "\"";
          var imgHTML = "<div> <img style=\"width:100%\" src=" + imgSrc + "> </div>";
          content = content.replace(imgStr, imgHTML);
        }
      }
      var article = content;
      // console.log(article);
      WxParse.wxParse('article', 'html', article, that, imgCount);
    }
  })
}
