// pages/exerciseResult/exerciseResult.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    company: ''
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    that.setData({
      company: app.globalData.company
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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },
  sendData: function(e){
    const that = this;
    const data = {};
    let sendState = true;
    data.company = e.detail.value.enterprise;
    data.linkman = e.detail.value.person;
    data.phone = e.detail.value.phone;
    data.requirements = e.detail.value.textarea;
    data.main_id = app.globalData.main_id;
    if (!data.company) {
      wx.showModal({
        content: '请输入企业名称',
        showCancel: false
      })
      sendState = false;
      return
    }
    if (!data.linkman) {
      wx.showModal({
        content: '请输入联系人',
        showCancel: false
      })
      sendState = false;
      return
    }
    if (!data.phone) {
      wx.showModal({
        content: '请输入联系电话',
        showCancel: false
      })
      sendState = false;
      return
    }
    if (sendState){
      const url = app.requests.service.updateQuestionnaireMain;
      console.log(url);
      console.log(data);
      wx.request({
        url: url,
        data: data,
        method: 'POST',
        success: function(res) {
          console.log(res);
          that.updateQuestionnaireMain();
          wx.navigateTo({
            url: '../boon/boon?company=' + data.company,
          })
        },
        fail: function(res) {
          console.log(res);
        }
      })
    }
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
        subscriberate: 1.0,
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