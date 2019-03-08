//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    winHeight: "",//窗口高度
    currentTab: 0, //预设当前项的值
    keyWords: "女装",
    PageNo: 1,
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
      title: '淘宝天猫20元封顶',
      path: '/pages/twenty/twenty',
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
    app.globalData.clounmId = e.detail.current;
    this.setData({
      currentTab: e.detail.current,
      videoList: [
      ],
      PageNo: 1,
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
    this.setData({
      currentTab: e.target.dataset.current,
      videoList: [
      ],
      PageNo: 1,
    });
    if (this.data.isGet) {
      app.globalData.clounmId = e.target.dataset.current;
      console.log(app.globalData.clounmId);
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
        opt: 'taobaoTbkUatmFavoritesItemGet',
        keyWords: app.globalData.keyWords,
        type: 20,
        clounmId: app.globalData.clounmId,
        PageNo: that.data.PageNo++,

      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.data) {
          var list = that.data.videoList;
          var newInfoList = res.data.tbk_uatm_favorites_item_get_response.results.uatm_tbk_item;
          if (newInfoList.length > 0) {
            for (var i in newInfoList) {
              if (newInfoList[i].volume > 0) {
                //长度处理
                if (newInfoList[i].coupon_info != null) {
                  newInfoList[i].coupon_info = newInfoList[i].coupon_info.split('减')[1].replace('元', '');
                  newInfoList[i].user_type = newInfoList[i].user_type == 1 ? false : true;
                  newInfoList[i].commission_rate = (newInfoList[i].zk_final_price - newInfoList[i].coupon_info).toFixed(2);
                  list.push(newInfoList[i]);
                }
              }
            }
          }
          that.setData({
            videoList: list,
            isGet: true,
            hidden: true,
          })
        } else {
          that.setData({
            videoList: list,
            isGet: true,
            hidden: true,
          })
        }

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
    if (val.length > 0) {
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
    else { }
  },
  footerTap: app.footerTap
})
