//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    btnState: 0
  },
  //事件处理函数
  goTestPage: function () {
    const that = this;
    if (that.data.btnState === 0) {
      that.data.btnState = 1;
      if (app.globalData.testList){
        wx.navigateTo({
          url: '../testPage/testPage'
          //url: '../expert/expert'
          //url: '../expert/expert'
          //url: '../expert/expert'
          //url: '../exercise/exercise'
        })
      }else {
        wx.showLoading({
          title: '加载中...',
        })
        that.getTest(true);
      }
    }
  },
  onLoad: function () {
    const that = this;
    if(app.globalData.flag){
      wx.navigateBack();
    }
    that.getTest(false);
  },
  onShow: function (opt) {
    const that = this;
    that.data.btnState = 0;
    app.globalData.results = null;
    app.globalData.main_id = null;
    app.globalData.company = null;
    app.globalData.companyScore = null;
    app.globalData.topScore = null;
    app.globalData.baseScore = null;
    app.globalData.shareData = null;
  },
  getTest: function (state) {
    const that = this;
    if (!app.globalData.testList) {
      wx.request({
        url: app.requests.service.getAllQuestions,
        success: function (res) {
          console.log(res);
          if (res.statusCode == 200) {
            app.globalData.testList = that.packageTest(res.data.body);
            if(state){
              wx.hideLoading(); 
              wx.navigateTo({
                url: '../testPage/testPage'
              })
            }
          }
        },
        fail: function (res) {
          that.data.btnState = 0;
          if(state){
            wx.hideLoading();
            wx.showModal({
              content: '网络错误，请重试',
              showCancel: false
            })
          }
        }
      })
    }
  },
  packageTest: function (data) {
    const that = this;
    const tempArr = [];
    const tempObj = {};
    for (let i = 0; i < data.length; i++) {
      if (tempObj[data[i].question_id]){
        tempObj[data[i].question_id].push(data[i]);
      }else {
        tempObj[data[i].question_id] = [];
        tempObj[data[i].question_id].push(data[i]);
      }
    }
    for(let k in tempObj){
      tempArr.push(tempObj[k]);
    }
    console.log(tempArr);
    return tempArr;
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
