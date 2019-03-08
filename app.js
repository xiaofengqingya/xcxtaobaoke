//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  getUserInfo:function(cb){
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  globalData:{
    userInfo:null,
    imgUrl:"https://www.hdleju.com",
    api: "https://www.hdleju.com/api",
    alimamaApi: "https://www.hdleju.com/api/xcx/alimama.aspx",
    keyWords:"女装",
    couponsUrl: "",
    clounmId:"0",
	appKey:"25361527",
	appSecret:"1f0be92342ef8349a227ada663d8166f",
	AdzoneId:"342344731",
  }
})