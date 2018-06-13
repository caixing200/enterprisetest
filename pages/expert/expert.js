// pages/expert/expert.js
const app = getApp();
const times = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isHide: true,
    newTime: '',
    company: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    that.setData({
      company: app.globalData.company,
      newTime: times.formatTime(new Date())
    })

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

  sendApply: function (e) {
    const that = this;
    that.setData({
      isHide: false
    }, () => {
      that.updateQuestionnaireMain();
    })
  },
  goBack: function () {
    app.globalData.flag = true;
    wx.reLaunch({
      url: '../index/index',
    })
  },
  goIndex: function () {
    app.globalData.flag = true;
    wx.reLaunch({
      url: '../index/index',
    })
  },
  saveThis: function (e) {
    const that = this;
    that.lostupdateQuestionnaireMain();
  },
  updateQuestionnaireMain: function () {
    const that = this;
    wx.request({
      url: app.requests.service.updateQuestionnaireMain,
      method: 'POST',
      data: {
        promotionrate: 0.666,
        main_id: app.globalData.main_id
      },
      success: function (res) {
        console.log(res);
      },
      fail: function (res) {

      }
    })
  },
  lostupdateQuestionnaireMain: function () {
    const that = this;
    wx.request({
      url: app.requests.service.updateQuestionnaireMain,
      method: 'POST',
      data: {
        promotionrate: 1.0,
        main_id: app.globalData.main_id
      },
      success: function (res) {
        console.log(res);
        wx.showModal({
          content: '保存成功',
          confirmText: '回首页',
          cancelText: '关闭',
          success: function (res) {
            if (res.confirm) {
              wx.reLaunch({
                url: '../index/index',
              })
            } else if (res.cancel) {
              app.globalData.flag = true;
              wx.reLaunch({
                url: '../index/index',
              })
            }
          }
        })
      },
      fail: function (res) {

      }
    })
  }
})