//index.js
//获取应用实例
import WxParse from '../../wxParse/wxParse.js';
var app = getApp()
Page({
  data: {
    winHeight: "",//窗口高度
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
    jme:"",
    jhj:"",
    info_item: [
    ],
    img_item: [
    ],
    hidden:false,
    tishi:true,
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    linkUrl: app.globalData.imgUrl,
    
  },
  detailclick: function (e) {
    var that = this; 
    wx.request({
      url: app.globalData.alimamaApi,
      data: {
        opt: 'taobaoTbkItemInfoContentGet',
        NumIids: that.data.id,
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var data = res.data.content;
        that.setData({
          content: WxParse.wxParse('article_content', 'html', data, that),
          
        });
      
      }
    });
    that.setData({
      img_item: that.data.info_item[0].small_images.string,
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

  

  onLoad: function (options) {
    var that = this;
    
    wx.request({
      url: app.globalData.alimamaApi,
      data: {
        opt: 'taobaoTbkItemInfoGet',
        NumIids: options.id,
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var data = res.data.tbk_item_info_get_response.results.n_tbk_item;
        that.setData({
          info_item: data,
          jhj: options.jhj,
          jme: options.jme,
          desc: options.desc,
          hidden: true,
          title: options.title,
          id: data[0].num_iid,
          coupon_click_url: options.linkurl,
          kouling: options.kouling,
        });
        wx.setNavigationBarTitle({ title: data[0].title });
      
      }
    });
    
    
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: this.data.title,
      path: '/pages/content/content?id=' + this.data.id + '&jhj=' + this.data.jhj + '&jme=' + this.data.jme + '&desc=' + this.data.desc + '&linkurl=' + this.data.coupon_click_url + '&title=' + this.data.title + '&kouling=' + this.data.kouling ,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  mytouchstart: function (e) {
    console.log('1')
  }, mytouchend: function (e) {
    console.log('2')
  }, 
  mytap: function (e) {
    this.setData({
      tishi: false,
    });
    wx.showModal({
      title: '温馨提示',
      content: '领取成功,打开手机淘宝查看即可！',
      cancelText:'看看教程',
      confirmText:'我知道了',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        }else if(res.cancel)
        {
          wx.navigateTo({
            url: '/pages/tutorial/tutorial',
            
          })
        }
      }
    })
    wx.setClipboardData({
      data: this.data.kouling,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            console.log(res.data) // data
          }
        })
      }
    });
   
    
  },
  footerTap: app.footerTap
})
