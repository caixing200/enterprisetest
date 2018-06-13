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
  sendData: function (e) {
    const that = this;
    const data = {};
    let sendState = true;
    data.company = that.strTrim(e.detail.value.enterprise,'g');
    data.linkman = that.strTrim(e.detail.value.person, 'g');
    data.phone = that.strTrim(e.detail.value.phone, 'g');
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
    if (!that.checkPhoneNum(data.phone)) {
      wx.showModal({
        content: '请输入正确的手机号码',
        showCancel: false
      })
      sendState = false;
      return
    }
    if (sendState) {
      const url = app.requests.service.updateQuestionnaireMain;
      console.log(url);
      console.log(data);
      wx.request({
        url: url,
        data: data,
        method: 'POST',
        success: function (res) {
          console.log(res);
          that.updateQuestionnaireMain();
          wx.navigateTo({
            url: '../boon/boon?company=' + data.company,
          })
        },
        fail: function (res) {
          console.log(res);
        }
      })
    }
  },
  checkPhoneNum: function (num) {
    const reg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (reg.test(num)) {
      return true
    } else {
      return false
    }
  },
  strTrim: function (str, glo) {
    var result;
    result = str.replace(/(^\s+)|(\s+$)/g, '');
    if (glo.toLowerCase() === 'g') {
      result = str.replace(/\s/g, "");
    }
    return result
  },
  goIndex: function () {
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