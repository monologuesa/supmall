// pages/temple/temple.js

var WxParse = require('../../wxParse/wxParse.js');

Page({


  data: {
    hide_2:false,//保存图片
    shouquan: 0,
    collect:0,//判断是否收藏
    index_data:'',//获取数据
    sort: '',//判断是从哪里传过来的数据  1是旅游美食旅游攻略  美食攻略  2是寺庙景点 
    id:'',//传过来的id
    imageUrl:'',//照片要用的
    name:'',//点击二次评论的时候所用到的名字
    level:'',//二级评论中的参数
    pid:'',//二级评论中的id
    judge:1,//判断几级评论应该传什么参数
    bid:'',//二级评论中的user_id
    //轮播图开始
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 500,
    circular: true,
    emoji: '老虎?',
    //轮播图结束
  },
  onLoad: function (options) {
    console.log(options)
    var that = this;
    if (options.scene){//这是扫描二维码进来的
      var scene = decodeURIComponent(options.scene);
      that.setData({
        user: that.getUrlData(scene, 'sharer_id'),
        id: that.getUrlData(scene, 'id'),//景点或者寺庙的id
        sort: that.getUrlData(scene, 'sort'),//1是景点进来的，2是寺庙进来的
        imageUrl: getApp().openidData.urls//域名
      })
      getApp().isShow(that.data.user,'',getdata, that)
    }else if(options.sences){//分享进来的
      that.setData({
        user: options.sences,//用户的user_id
        id: options.id,//景点或者寺庙的id
        sort: options.sort,//1是景点进来的，2是寺庙进来的
        imageUrl: getApp().openidData.urls
      })
      getApp().isShow(that.data.user, '',getdata, that)
    }else{
      that.setData({
        id: options.id,
        sort: options.sort,
        imageUrl: getApp().openidData.urls
      })
      getdata(that)
    }
  },
  //切割options.scene的
  getUrlData: function (vars, variable) {
    vars = vars.split("&");
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      if (pair[0] == variable) { return pair[1]; }
    }
    return (false);
  },
  // 用户登录
  login: function (e) {
    this.setData({ shouquan: 1 });
    let that = this;
    getApp().login(that.data.user, '', getdata, that);

  },
  //用户取消授权
  noGetuserinfo: function () {
    wx.hideLoading();
    this.setData({ shouquan: 0 });
    getApp().login(that.data.user, '', getdata, that);
  },
  //确认登录
  bindgetuserinfo: function () {
    var that = this;
    that.setData({ shouquan: 0 });
    getApp().login(that.data.user, '', getdata, that);
  },
  //取消登录
  noGetuserinfo: function () {
    wx.hideLoading();
    this.setData({ shouquan: 0 });
  },
  //点击出现二维码
  appear:function(){
    var that =this;
    that.setData({
      hide_2:true,
    })
  },
  //关闭
  cancle:function(){
    var that = this;
    that.setData({
      hide_2: false,
    })
  },
  //点击照片变大
  imgYu_1: function (e) {
    var that = this;
    var list = e.currentTarget.dataset.list;
    var index = e.currentTarget.dataset.index;
    for (var i = 0; i < list.length; i++) {
      list[i] = that.data.imageUrl + list[i].img
    }
    wx.previewImage({
      current: list[index], // 当前显示图片的http链接
      urls: list // 需要预览的图片http链接列表
    })
  },
  //点击二次评论
  click:function(e){
    var that = this;
    let name = '@'+e.currentTarget.dataset.name + ':';
    let level = e.currentTarget.dataset.level
    let id = e.currentTarget.dataset.id; 
    let bid = e.currentTarget.dataset.bid; //user_id
    that.setData({ name: name, pid: id, level: level , judge : 2,bid:bid})
  },
  //收藏
  collect:function(){
    var that = this;
    wx.request({
      url: getApp().openidData.url + 'collect.php',
      data: {
        type: 'add',
        user_id: getApp().openidData.user_id,
        pid: that.data.id,
        get_type: that.data.index_data.get_type
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        that.setData({
          collect: 1
        })
      }
    })
  },
  //取消收藏
  cancel: function () {
    var that = this;
    wx.request({
      url: getApp().openidData.url + 'collect.php',
      data: {
        type: 'del',
        user_id: getApp().openidData.user_id,
        pid: that.data.id,
        get_type: that.data.index_data.get_type,
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        that.setData({
          collect: 0
        })
      }
    })
  },
  //导航
  getaddress: function () {
    var that = this;
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        let latitude = Number(that.data.index_data.latitude);
        let longitude = Number(that.data.index_data.longitude);
        wx.openLocation({
          latitude: latitude,
          longitude: longitude,
          name: that.data.index_data.get_address,
          scale: 28
        })
      }, fail: res => {
        //接口调用失败，提示用户打开定位功能
        wx.showModal({
          title: '提示',
          content: '获取定位失败，请打开定位，重新进入！',
        })
      }
    })
  },
  //点赞
  like:function(){
    var that = this;
    console.log('测试id')
    console.log(that.data.id)
    console.log('测试user_id')
    console.log(getApp().openidData.user_id)
    if(that.data.sort == 1){
      wx.request({
        url: getApp().openidData.url + 'update_scenic_like.php',
        data: {
          s_id: that.data.id,
          user_id: getApp().openidData.user_id,
        },
        method: 'POST',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: function (res) {
          console.log(that.data.like)
          if (res.data.status == 1) {
            getdata(that)
          } else if (res.data.status == 2) {
            wx.showModal({
              title: '提示',
              content: res.data.msg,
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击了确认')
                } else if (res.cancel) {
                  console.log('用户点击了取消')
                }
              },
            })
            getdata(that)
          }
        }
      })

    } else if (that.data.sort == 2){
      wx.request({
        url: getApp().openidData.url + 'update_temple_like.php',
        data: {
          s_id: that.data.id,
          user_id: getApp().openidData.user_id,
        },
        method: 'POST',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success:function(res){
          console.log(that.data.like)
          if (res.data.status == 1){
            getdata(that)
          } else if (res.data.status == 2){
            wx.showModal({
              title: '提示',
              content: res.data.msg,
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击了确认')
                } else if (res.cancel) {
                  console.log('用户点击了取消')
                }
              },
            })
            getdata(that)
          }
        }
      })
    }
  },
  //分享微信好友
  onShareAppMessage: function (res) {
    var that = this;
    return {
      title: '精选游玩购',
      path: '/pages/temple/temple?sort=' + that.data.sort + '&id=' + that.data.id + '&sences=' + getApp().openidData.user_id,
    }
  },
  //评论
  formSubmit_1:function(e){
    var that = this;
    let name = e.detail.value.name;
    console.log(name);
    if(name == ''){
      wx.showModal({
        title: '提示',
        content: '请输入内容',
        success: function(res) {
          if(res.confirm){
            console.log('确认')
          }else if(res.cancel){
            console.log('取消')
          }
        },
      })
    }else if(name != ''){
      if (that.data.sort == 1) {
        //先把评论数据转成八进制转给后端存数据库
        name = utf16toEntities(name);
        wx.request({
          url: getApp().openidData.url + 'scenic_discuss_add.php',
          data: {
            s_id: that.data.id,
            customer_id: getApp().openidData.customer_id,
            user_id: getApp().openidData.user_id,
            discuss: name
          },
          method: 'POST',
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          success: function (res) {
            that.setData({
              name_2: ''
            })
            wx.showModal({
              title: '提示',
              content: res.data.msg,
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击了确认')

                } else if (res.cancel) {
                  console.log('用户点击了取消')
                }
                getdata(that)
              },
            })

          }, fail: function (res) {
            wx.showModal({
              title: '提示',
              content: '评论失败',
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击了确认')
                } else if (res.cancel) {
                  console.log('用户点击了取消')
                }
              },
            })
          }
        })

      } else if (that.data.sort == 2) {
        //先把评论数据转成八进制转给后端存数据库
        name = utf16toEntities(name);
        wx.request({
          url: getApp().openidData.url + 'temple_discuss_add.php',
          data: {
            s_id: that.data.id,
            customer_id: getApp().openidData.customer_id,
            user_id: getApp().openidData.user_id,
            discuss: name
          },
          method: 'POST',
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          success: function (res) {
            that.setData({
              name_2: ''
            })
            wx.showModal({
              title: '提示',
              content: res.data.msg,
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击了确认')

                } else if (res.cancel) {
                  console.log('用户点击了取消')
                }
                getdata(that)
              },
            })

          }, fail: function (res) {
            wx.showModal({
              title: '提示',
              content: '评论失败',
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击了确认')
                } else if (res.cancel) {
                  console.log('用户点击了取消')
                }
              },
            })
          }
        })
      }
    }

    
  },
  //回复
  formSubmit_2:function(e){
    var that = this;
    let name = e.detail.value.name;//携带的值
    let eid = e.currentTarget.dataset.eid;//评论的id
    let uid = e.currentTarget.dataset.uid;//user_id
    if(name == ''){
      wx.showModal({
        title: '提示',
        content: '请输入内容',
        success: function(res) {
          if(res.confirm){
            console.log('点击了确认')
          }else if(res.cancel){
            console.log('点击了取消')
          }
        },
      })
    }else if( name != ''){
      if (that.data.sort == 1) {
        if (that.data.judge == 1) {
          //先把评论数据转成八进制转给后端存数据库
          name = utf16toEntities(name);
          console.log(name + '1111111111111111111111')
          let level = e.currentTarget.dataset.level;
          console.log('这是大哥')
          wx.request({
            url: getApp().openidData.url + 'scenic_discuss_add.php',
            data: {
              s_id: that.data.id,
              customer_id: getApp().openidData.customer_id,
              user_id: getApp().openidData.user_id,
              discuss: name,
              write_back_id: eid,
              write_back_level: level,
              write_back_user: uid,
            },
            method: 'POST',
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
              that.setData({
                judge: 1,
                name: '说点什么',
                name_1: ''
              })
              wx.showModal({
                title: '提示',
                content: res.data.msg,
                success: function (res) {
                  if (res.confirm) {
                    console.log('用户点击了确认')

                  } else if (res.cancel) {
                    console.log('用户点击了取消')
                  }
                  getdata(that)
                },
              })

            }, fail: function (res) {
              wx.showModal({
                title: '提示',
                content: '评论失败',
                success: function (res) {
                  if (res.confirm) {
                    console.log('用户点击了确认')
                  } else if (res.cancel) {
                    console.log('用户点击了取消')
                  }
                },
              })
            }
          })
        } else if (that.data.judge == 2) {
          //先把评论数据转成八进制转给后端存数据库
          name = utf16toEntities(name);
          console.log(name)
          console.log('这是二哥')
          wx.request({
            url: getApp().openidData.url + 'scenic_discuss_add.php',
            data: {
              s_id: that.data.id,
              customer_id: getApp().openidData.customer_id,
              user_id: getApp().openidData.user_id,
              discuss: name,
              write_back_id: eid,
              write_back_level: that.data.level,
              write_back_user: that.data.bid,
            },
            method: 'POST',
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
              that.setData({
                judge: 1,
                name: '说点什么',
                name_1: ''
              })
              wx.showModal({
                title: '提示',
                content: res.data.msg,
                success: function (res) {
                  if (res.confirm) {
                    console.log('用户点击了确认')

                  } else if (res.cancel) {
                    console.log('用户点击了取消')
                  }
                  getdata(that)
                },
              })

            }, fail: function (res) {
              wx.showModal({
                title: '提示',
                content: '评论失败',
                success: function (res) {
                  if (res.confirm) {
                    console.log('用户点击了确认')
                  } else if (res.cancel) {
                    console.log('用户点击了取消')
                  }
                },
              })
            }
          })
        }

      } else if (that.data.sort == 2) {
        if (that.data.judge == 1) {
          //先把评论数据转成八进制转给后端存数据库
          name = utf16toEntities(name);
          let level = e.currentTarget.dataset.level;
          console.log('这是大哥')
          wx.request({
            url: getApp().openidData.url + 'temple_discuss_add.php',
            data: {
              s_id: that.data.id,
              customer_id: getApp().openidData.customer_id,
              user_id: getApp().openidData.user_id,
              discuss: name,
              write_back_id: eid,
              write_back_level: level,
              write_back_user: uid,
            },
            method: 'POST',
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
              that.setData({
                judge: 1,
                name: '说点什么',
                name_1: ''
              })
              wx.showModal({
                title: '提示',
                content: res.data.msg,
                success: function (res) {
                  if (res.confirm) {
                    console.log('用户点击了确认')

                  } else if (res.cancel) {
                    console.log('用户点击了取消')
                  }
                  getdata(that)
                },
              })

            }, fail: function (res) {
              wx.showModal({
                title: '提示',
                content: '评论失败',
                success: function (res) {
                  if (res.confirm) {
                    console.log('用户点击了确认')
                  } else if (res.cancel) {
                    console.log('用户点击了取消')
                  }
                },
              })
            }
          })
        } else if (that.data.judge == 2) {
          //先把评论数据转成八进制转给后端存数据库
          name = utf16toEntities(name);
          console.log('这是二哥')
          wx.request({
            url: getApp().openidData.url + 'temple_discuss_add.php',
            data: {
              s_id: that.data.id,
              customer_id: getApp().openidData.customer_id,
              user_id: getApp().openidData.user_id,
              discuss: name,
              write_back_id: eid,
              write_back_level: that.data.level,
              write_back_user: that.data.bid,
            },
            method: 'POST',
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
              that.setData({
                judge: 1,
                name: '说点什么',
                name_1: ''
              })
              wx.showModal({
                title: '提示',
                content: res.data.msg,
                success: function (res) {
                  if (res.confirm) {
                    console.log('用户点击了确认')

                  } else if (res.cancel) {
                    console.log('用户点击了取消')
                  }
                  getdata(that)
                },
              })

            }, fail: function (res) {
              wx.showModal({
                title: '提示',
                content: '评论失败',
                success: function (res) {
                  if (res.confirm) {
                    console.log('用户点击了确认')
                  } else if (res.cancel) {
                    console.log('用户点击了取消')
                  }
                },
              })
            }
          })
        }
      }
    }
  },
  //保存照片
  getImage_1: function () {
    var that = this;
    getApp().getImg();
    var imgSrc = that.data.index_data_1.url_path;
    wx.downloadFile({
      url: imgSrc,
      success: function (res) {
        console.log(res);
        //图片保存到本地
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function (data) {
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 1000
            })
            that.setData({ hide_2:false })
          },
          fail: function (err) {
            console.log(err);
            if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
              console.log("用户一开始拒绝了，我们想再次发起授权")
              console.log('打开设置窗口')
              wx.openSetting({
                success(settingdata) {
                  console.log(settingdata)
                  if (settingdata.authSetting['scope.writePhotosAlbum']) {
                    console.log('获取权限成功，给出再次点击图片保存到相册的提示。')
                  } else {
                    console.log('获取权限失败，给出不给权限就无法正常使用的提示')
                  }
                }
              })
            }
          }
        })
      }
    })
  },
  //点击照片变大
  imgYu: function (e) {
    var that = this;
    let all = [];
    var list = e.currentTarget.dataset.list;
    all.push(list)
    wx.previewImage({
      urls: all // 需要预览的图片http链接列表
    })
  },
})
//获取数据
function getdata(that){
  if(that.data.sort == 1){
    wx.request({
      url: getApp().openidData.url + 'scenic_spot_details.php',
      data:{
        s_id:that.data.id,
        customer_id:getApp().openidData.customer_id,
        get_user_id:getApp().openidData.user_id,
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success:function(res){
        // 获取评论数据转成16进制再渲染
        for (let i = 0; i < res.data.e_content.length; i++) {
          res.data.e_content[i].discuss = entitiesToUtf16(res.data.e_content[i].discuss);
          for (let j = 0; j < res.data.e_content[i].reply_user.length; j++) {
            res.data.e_content[i].reply_user[j].b_discuss = entitiesToUtf16(res.data.e_content[i].reply_user[j].b_discuss);
          }
        }
        that.setData({
          index_data: res.data,
          collect: res.data.c_id
        })
        rendData(res.data.content, that)
      }
    })
  } else if(that.data.sort == 2){
    wx.request({
      url: getApp().openidData.url + 'temple_details.php',
      data: {
        s_id: that.data.id,
        customer_id: getApp().openidData.customer_id,
        get_user_id: getApp().openidData.user_id,
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        // 获取评论数据转成16进制再渲染
        for (let i = 0; i < res.data.e_content.length; i++) {//这边是一级的循坏
          res.data.e_content[i].discuss = entitiesToUtf16(res.data.e_content[i].discuss);
          for (let j = 0; j < res.data.e_content[i].reply_user.length; j++) {//这边是二级的循坏
            res.data.e_content[i].reply_user[j].b_discuss = entitiesToUtf16(res.data.e_content[i].reply_user[j].b_discuss);
          }
        }

        that.setData({
          index_data: res.data,
          collect: res.data.c_id
        })
        rendData(res.data.content,that)
      }
    })
  }
}
//渲染详情
function rendData(data,that){
  
  getImg(that)

  //替换标签中特殊字符
  var infoFlg = "<!--SPINFO#0-->";
  var imgFlg = "<!--IMG#";


  var content = "<div style=\"line-height:25px; font-weight:200; font-size:17px; color:black; word-break:normal\">" + data + "</div>";

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
function getImg(that){
  wx.request({
    url: getApp().openidData.url + 'temple_details_weima.php',
    data: {
      temple_id: that.data.id,
      customer_id: getApp().openidData.customer_id,
      user_id: getApp().openidData.user_id,
    },
    method: 'POST',
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    success: function (res) {
      that.setData({
        index_data_1: res.data,
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

//将编码后的八进制的emoji表情重新解码成十六进制的表情字符
function entitiesToUtf16(str) {
  return str.replace(/&#(\d+);/g, function (match, dec) {
    let H = Math.floor((dec - 0x10000) / 0x400) + 0xD800;
    let L = Math.floor(dec - 0x10000) % 0x400 + 0xDC00;
    return String.fromCharCode(H, L);
  });
}