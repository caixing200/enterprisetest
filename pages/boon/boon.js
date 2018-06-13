// pages/boon/boon.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    company: '',
    ispromotion: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    that.setData({
      company: options.company
    })
    app.globalData.company = options.company;
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
    const that = this;
    if (!that.data.ispromotion){
      console.log('onUnload');
      that.updateQuestionnaireMain(false);
    }
  
  },
  goExpert: function(){
    const that = this;
    that.data.ispromotion = true;
    that.updateQuestionnaireMain(that.data.ispromotion);
    wx.navigateTo({
      url: '../expert/expert',
    })
  },
  updateQuestionnaireMain: function (state) {
    const that = this;
    wx.request({
      url: app.requests.service.updateQuestionnaireMain,
      method: 'POST',
      data: {
        ispromotion: state?1:0,
        promotionrate: state?0.333:0,
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