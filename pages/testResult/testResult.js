// pages/testResult/testResult.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    enterprise: '',
    isData: false,
    isUserData: false,
    timer: null,
    testEndDate: '',
    testStartDate: ''
  },
  sendResults: function() {
    const that = this;
    if (!that.data.enterprise) {
      wx.showToast({
        title: '请填写企业名称',
        icon: 'loading',
        mask: true,
        duration: 1500
      })
    } else {
      //在这里调接口
      const company = that.data.enterprise;
      const qalist = app.globalData.results;
      const testStartDate = that.data.testStartDate;
      const testEndDate = that.data.testEndDate;
      const data = {
        company,
        qalist,
        testStartDate,
        testEndDate
      }; //发送的数据
      console.log(data);
      wx.showLoading({
        title: '计算中...',
        mask: true
      })
      wx.request({
        url: app.requests.service.saveQuestionnaireMain,
        data: data,
        method: 'POST',
        // header: {
        //   'content-type': 'application/x-www-form-urlencoded' 
        // },
        success: function(res) {
          wx.hideLoading();
          console.log(res);
          if (res.data.code == '0') {
            const data = JSON.parse(res.data.body);
            //const code = res.data.code;
            if (data.code == '1') {
              app.globalData.company = company;
              app.globalData.main_id = data.main_id;
              that.viewQuestionnaireScore();
              that.viewQuestionnaireAverage();
            } else if (data.code == '2') {
              wx.showModal({
                content: data.msg,
                showCancel: false
              })
            } else {
              wx.showToast({
                title: '提交失败，请重试！',
                icon: 'loading',
                mask: true,
                duration: 2000
              })
            }
          }else {
            wx.showModal({
              content: res.data.error || '保存错误，请重试',
              showCancel: false
            })
          }

        },
        fail: function(res) {
          wx.hideLoading();
          console.log(res);
          wx.showModal({
            content: '网络故障，请重试！',
            showCancel: false
          })
        }
      })



    }

  },
  viewQuestionnaireScore: function() {
    const that = this;
    wx.request({
      url: app.requests.service.viewQuestionnaireScore,
      data: {
        main_id: app.globalData.main_id
      },
      success: function(res) {
        console.log(res);
        that.data.isData = true;
        if (that.data.isData && that.data.isUserData) {
          wx.hideLoading();
          clearTimeout(that.data.timer);
          that.data.timer = setTimeout(function() {
            wx.redirectTo({
              url: '../radar/radar?share=0'
            })
          }, 100)
        }
        if (res.data.body.length > 0) {
          app.globalData.companyScore = res.data.body;
        } else {
          wx.showModal({
            content: '缺少必要参数，请重新测试',
            showCancel: false,
            success: function(res) {
              if (res.confirm) {
                wx.reLaunch({
                  url: '../index/index',
                })
              }
            }
          })
        }
      },
      fail: function(res) {
        wx.hideLoading();
        wx.showModal({
          content: '计算失败，点击重新计算',
          showCancel: false,
          success: function(res) {
            if (res.confirm) {
              that.viewQuestionnaireScore();
            }
          }
        })
      },
    })
  },
  viewQuestionnaireAverage: function() {
    const that = this;
    wx.request({
      url: app.requests.service.viewQuestionnaireAverage,
      success: function(res) {
        console.log(res);
        that.data.isUserData = true;
        if (that.data.isData && that.data.isUserData) {
          wx.hideLoading();
          clearTimeout(that.data.timer);
          that.data.timer = setTimeout(function() {
            wx.redirectTo({
              url: '../radar/radar?share=0'
            })
          }, 100)
        }
        if (res.data.body.length > 0) {
          app.globalData.topScore = res.data.body;
        } else {
          wx.showModal({
            content: '缺少必要参数，请重新测试',
            showCancel: false,
            success: function(res) {
              if (res.confirm) {
                wx.reLaunch({
                  url: '../index/index',
                })
              }
            }
          })
        }
      },
      fail: function(res) {
        wx.hideLoading();
        wx.showModal({
          content: '计算失败，点击重新计算',
          showCancel: false,
          success: function(res) {
            if (res.confirm) {
              that.viewQuestionnaireAverage();
            }
          }
        })
      },
    })
  },
  viewQuestionnaireTypeMaxScore: function() {
    const that = this;
    wx.request({
      url: app.requests.service.viewQuestionnaireTypeMaxScore,
      success: function(res) {
        console.log(res);
        app.globalData.baseScore = res.data.body;
      },
      fail: function(res) {
        wx.showModal({
          content: '数据获取失败，请重试',
          showCancel: false,
          success: function(res) {
            if (res.confirm) {
              that.viewQuestionnaireTypeMaxScore();
            }
          }
        })
      }
    })
  },
  userInput: function(e) {
    const that = this;
    that.setData({
      enterprise: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const that = this;
    that.viewQuestionnaireTypeMaxScore();
    that.data.testStartDate = options.testStartDate;
    that.data.testEndDate = options.testEndDate;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    const that = this;
    clearTimeout(that.data.timer);

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    const that = this;
    clearTimeout(that.data.timer);
  }


})