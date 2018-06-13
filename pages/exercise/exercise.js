// pages/exercise/exercise.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  goExercisePage: function(){
    const that = this;
    that.updateQuestionnaireMain();
    wx.navigateTo({
      url: '../exercisePage/exercisePage',
    })
  },
  goIndex: function(){
    app.globalData.flag = true;
    wx.reLaunch({
      url: '../index/index',
    })
  },
  updateQuestionnaireMain: function () {
    const that = this;
    wx.request({
      url: app.requests.service.updateQuestionnaireMain,
      method: 'POST',
      data: {
        subscriberate: 0.5,
        main_id: app.globalData.main_id
      },
      success: function (res) {
        console.log(res);
      },
      fail: function (res) {

      }
    })
  }
})