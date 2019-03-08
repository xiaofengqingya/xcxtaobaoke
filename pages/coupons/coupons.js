//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    winHeight: "",//窗口高度
    currentTab: 0, //预设当前项的值
    keyWords: "女装",
    PageNo: 0,
    scrollLeft: 0, //tab标题的滚动条位置
    isGet: true,
    hidden: true,
    videoList: [

    ],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    linkUrl: app.globalData.imgUrl,
  },

  navigator: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var jhj = e.currentTarget.dataset.jhj;
    var jme = e.currentTarget.dataset.jme;
    var desc = e.currentTarget.dataset.desc;
    var linkurl = e.currentTarget.dataset.linkurl;
    var title = e.currentTarget.dataset.title;
    var coupon_click_url = '';
    wx.request({//淘口令
      url: app.globalData.alimamaApi,
      data: {
        opt: 'taobaoTbkTpwdCreate',
        Url: linkurl,
        Text: title,
        Logo: e.currentTarget.dataset.imgurl,
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        coupon_click_url = res.data.tbk_tpwd_create_response.data.model;
        wx.navigateTo({
          url: '/pages/content/content?id=' + id + '&jhj=' + jhj + '&jme=' + jme + '&desc=' + desc + '&title=' + title + '&kouling=' + coupon_click_url + '&linkurl=' + linkurl
        })
      }
    });

  },
  calling: function (e) {
    var that = this;
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.mobile, //此号码并非真实电话号码，仅用于测试
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
        console.log("拨打电话失败！")
      }
    })
  },

  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '淘宝天猫优惠券',
      path: '/pages/coupons/coupons',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },

  // 滚动切换标签样式
  switchTab: function (e) {
    var clounmId = e.detail.current;
    switch (clounmId) {
      case 0:
        app.globalData.keyWords = '女装';
        break;
      case 1:
        app.globalData.keyWords = '家居家装';
        break;
      case 2:
        app.globalData.keyWords = '数码家电';
        break;
      case 3:
        app.globalData.keyWords = '母婴';
        break;
      case 4:
        app.globalData.keyWords = '食品';
        break;
      case 5:
        app.globalData.keyWords = '鞋包配饰';
        break;
      case 6:
        app.globalData.keyWords = '美妆个护';
        break;
      case 7:
        app.globalData.keyWords = '男装';
        break;
      case 8:
        app.globalData.keyWords = '内衣';
        break;
      case 9:
        app.globalData.keyWords = '运动户外';
        break;

    }
    this.setData({
      currentTab: e.detail.current,
      videoList: [
      ],
      PageNo: 0,
    });
    if (this.data.isGet) {
      this.onLoad();
    }

    this.checkCor();
  },
  // 点击标题切换当前页时改变样式
  swichNav: function (e) {
    var cur = e.target.dataset.current;
    if (this.data.currentTaB == cur) { return false; }
    else {
      this.setData({
        currentTab: cur
      })
    }
    var clounmId = e.target.dataset.current;
    if (clounmId == 0) {
      console.log(clounmId);
      app.globalData.keyWords = '女装';
    } else if (clounmId == 1) {
      app.globalData.keyWords = '家居家装';
    } else if (clounmId == 2) {
      app.globalData.keyWords = '数码家电';
    } else if (clounmId == 3) {
      app.globalData.keyWords = '母婴';
    } else if (clounmId == 4) {
      app.globalData.keyWords = '食品';
    } else if (clounmId == 5) {
      app.globalData.keyWords = '鞋包配饰';
    } else if (clounmId == 6) {
      app.globalData.keyWords = '美妆个护';
    } else if (clounmId == 7) {
      app.globalData.keyWords = '男装';
    } else if (clounmId == 8) {
      app.globalData.keyWords = '内衣';
    } else if (clounmId == 9) {
      app.globalData.keyWords = '运动户外';
    } else { app.globalData.keyWords = '家居家装';}

    this.setData({
      currentTab: e.target.dataset.current,
      videoList: [
      ],
      PageNo: 0,
    });
    if (this.data.isGet) {
      console.log(app.globalData.keyWords);
      this.onLoad();
    }
  },
  //判断当前滚动超过一屏时，设置tab标题滚动条。
  checkCor: function () {
    if (this.data.currentTab > 4) {
      this.setData({
        scrollLeft: 300
      })
    } else {
      this.setData({
        scrollLeft: 0
      })
    }
  },
  onLoad: function () {
    var that = this;
    //  高度自适应
    wx.getSystemInfo({
      success: function (res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR - 180;

        that.setData({
          winHeight: calc,
          scrollHeight: res.windowHeight,
          linkUrl: app.globalData.imgUrl,
        });
      }
    });
    wx.request({
      url: app.globalData.alimamaApi,
      data: {
        opt: 'setNavbar',
        type: 1,
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.data.status == "1") {
          that.setData({
            navbar: res.data.content,
          })
        }
      }
    });//控制底部导航
    this.loadMore();
  },
  //页面滑动到底部
  bindDownLoad: function () {
    if (this.data.isGet) {
      this.loadMore();
    }
  },
  loadMore: function () {
    var that = this;
    this.setData({
      hidden: false,
      isGet: false
    });
    wx.request({
      url: app.globalData.alimamaApi,
      data: {
        opt: 'taobaoTbkDgItemCouponGet',
        keyWords: app.globalData.keyWords,
        PageNo: that.data.PageNo++,

      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.data.tbk_dg_item_coupon_get_response.results) {
          var list = that.data.videoList;
          var newInfoList = res.data.tbk_dg_item_coupon_get_response.results.tbk_coupon;
          if (newInfoList.length > 0) {
            for (var i in newInfoList) {
              //长度处理
              var title = newInfoList[i].coupon_info;
              newInfoList[i].coupon_info = title.split('减')[1].replace('元', '');
              newInfoList[i].user_type = newInfoList[i].user_type == 1 ? false : true;
              newInfoList[i].commission_rate = (newInfoList[i].zk_final_price - newInfoList[i].coupon_info).toFixed(2);
              list.push(newInfoList[i]);
            }
          }
        }
        that.setData({
          videoList: list,
          isGet: true,
          hidden: true,
        })
      }
    });
  },
  //输入内容时
  searchActiveChangeinput: function (e) {
    const val = e.detail.value;
    app.globalData.keyWords = val;

    this.setData({
      'search.showClearBtn': val != '' ? true : false,
      'search.searchValue': val,
    })
  },
  //点击清除搜索内容
  searchActiveChangeclear: function (e) {
    this.setData({
      'search.showClearBtn': false,
      'search.searchValue': ''
    })
  },
  
  //搜索提交
  searchSubmit: function () {
    const val = app.globalData.keyWords;
    console.log('456');
    this.setData({
      videoList: [
      ],
      PageNo: 0,
    });
    app.globalData.keyWords = val;
    if (val.length>0) {
      const that = this,
        app = getApp();
      if (this.data.isGet) {
        console.log(app.globalData.keyWords);
        this.onLoad();
      }
    }
  },
  bindChange: function (e) {
    const val = e.detail.value;
    this.setData({
      videoList: [
      ],
      PageNo: 0,
    });
    app.globalData.keyWords = val;
    console.log(val);
    if (val.length > -1) {
      const that = this,
        app = getApp();
      if (this.data.isGet) {
        console.log(app.globalData.keyWords);
        this.onLoad();
      }
    }
    else{}
  },
  footerTap: app.footerTap
})
