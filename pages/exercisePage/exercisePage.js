// pages/exercisePage/exercisePage.js

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    persons: 33
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



  goBack: function(){
    wx.navigateBack();
  },
  goExerciseResult: function(){
    const that = this;
    that.updateQuestionnaireMain();
    wx.navigateTo({
      url: '../exerciseResult/exerciseResult',
    })
  },
  updateQuestionnaireMain: function () {
    const that = this;
    wx.request({
      url: app.requests.service.updateQuestionnaireMain,
      method: 'POST',
      data: {
        subscriberate: 0.75,
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