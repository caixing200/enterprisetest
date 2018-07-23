// pages/expert/expert.js
const app = getApp();
//const times = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isHide: true,
    newTime: '',
    company: '',
    canvasHide: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const that = this;
    that.setData({
      company: app.globalData.company,
      newTime: that.formatTime(new Date())
    })

  },

  formatTime(date) {
    const that = this
    const year = date.getFullYear() + '年'
    const month = (date.getMonth() + 1) + '月'
    const day = date.getDate() + '日'
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(that.formatNumber).join(' ') + ' ' + [hour, minute, second].map(that.formatNumber).join(':')
  },

  formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  },
  createImg() {
    const that = this;
    that.setData({
      canvasHide: false,
    }, () => {
      //设置宽高
      var pixel = app.globalData.mySystemInfo.pixelRatio || 2;
      var windowWidth = app.globalData.mySystemInfo.windowWidth;
      var windowHeight = app.globalData.mySystemInfo.windowHeight;
      //var windowHeight = windowWidth * 1.6;
      var canvasWidth = windowWidth * pixel;
      var canvasHeight = windowHeight * pixel;
      var rpx = 750 / app.globalData.mySystemInfo.screenWidth;
      //var rpx = pixel;
      var ctx = wx.createCanvasContext('canvasImg');
      var step = app.globalData.mySystemInfo.screenHeight / app.globalData.mySystemInfo.screenWidth;
      step = step > 2 ? (step - 1.03) : (step - 0.9)

      //绘制底色
      ctx.setFillStyle('#FFFFFF')
      ctx.fillRect(0, 0, windowWidth, windowHeight)


      //title
      ctx.setFontSize(40/rpx)
      ctx.setTextAlign('center')
      ctx.setFillStyle('#000')
      ctx.fillText('浙江顶智智能技术有限公司', windowWidth / 2, windowHeight*0.1)
      ctx.setFontSize(40/rpx)
      ctx.setTextAlign('center')
      ctx.setFillStyle('#000')
      ctx.fillText('浙江顶智智能技术有限公司', (windowWidth + 2 / rpx) / 2, windowHeight * 0.1)
      ctx.setFontSize(40/rpx)
      ctx.setTextAlign('center')
      ctx.setFillStyle('#000')
      ctx.fillText('服务预约单', windowWidth / 2, windowHeight * 0.16)
      ctx.setFontSize(40/rpx)
      ctx.setTextAlign('center')
      ctx.setFillStyle('#000')
      ctx.fillText('服务预约单', (windowWidth + 2 / rpx) / 2, windowHeight * 0.16)

      //申请企业
      ctx.setFontSize(34/rpx)
      ctx.setTextAlign('right')
      ctx.setFillStyle('#000')
      ctx.fillText('申请企业：', 230 / rpx, windowHeight * 0.25)
      ctx.setTextAlign('left')
      ctx.fillText(that.data.company, 240 / rpx, windowHeight * 0.25)

      //申请内容
      ctx.setFontSize(34/rpx)
      ctx.setTextAlign('right')
      ctx.setFillStyle('#000')
      ctx.fillText('申请内容：', 230 / rpx, windowHeight * 0.3)
      ctx.setTextAlign('left')
      ctx.fillText('智造云管家', 240 / rpx, windowHeight * 0.3)
      ctx.fillText('100用户版', 240 / rpx, windowHeight * 0.33)
      ctx.fillText('3个月使用权', 240 / rpx, windowHeight * 0.36)

      //申请时间
      ctx.setFontSize(34/rpx)
      ctx.setTextAlign('right')
      ctx.setFillStyle('#000')
      ctx.fillText('申请时间：', 230 / rpx, windowHeight * 0.41)
      ctx.setTextAlign('left')
      ctx.fillText(that.data.newTime, 240 / rpx, windowHeight * 0.41)

      //foot
      ctx.setFontSize(34/rpx)
      ctx.setTextAlign('center')
      ctx.setFillStyle('#000')
      ctx.fillText('我们的服务人员将尽快与您联系', windowWidth / 2, windowHeight * 0.55)

      // //绘制文字
      // var companyArr = that.formatCompany(that.data.company, windowWidth, rpx);
      // console.log(companyArr);
      // var company = that.data.company;
      // var sum = that.data.sum;
      // var percent = that.data.percent;
      // var index = companyArr.length - 1;

      // //公司名称
      // for (let i = 0; i < companyArr.length; i++) {
      //   const index = i + 1;
      //   ctx.setFontSize(26)
      //   ctx.setTextAlign('center')
      //   ctx.setFillStyle('#000')
      //   ctx.fillText(companyArr[i], windowWidth / 2, 70 * index / rpx)
      //   ctx.setFontSize(26)
      //   ctx.setTextAlign('center')
      //   ctx.setFillStyle('#000')
      //   ctx.fillText(companyArr[i], (windowWidth - 1) / 2, 70 * index / rpx)
      //   ctx.setFontSize(26)
      //   ctx.setTextAlign('center')
      //   ctx.setFillStyle('#000')
      //   ctx.fillText(companyArr[i], (windowWidth + 1) / 2, 70 * index / rpx)
      // }
      //绘制
      ctx.draw(false, setTimeout(function() {
        wx.canvasToTempFilePath({
          canvasId: 'canvasImg',
          x: 0,
          y: 0,
          width: windowWidth,
          height: windowHeight,
          destWidth: canvasWidth,
          destHeight: canvasHeight,
          success: function(res) {
            console.log(res);
            // wx.previewImage({
            //   urls: [res.tempFilePath]
            // })
            that.saveImg(res.tempFilePath)
            that.setData({
              canvasHide: true
            })

            // if (state) {
            //   wx.hideLoading()
            //   that.saveImg(res.tempFilePath)
            // } else {
            //   that.uploadQuestionnaireImg(res.tempFilePath)
            // }

          },
          fail: function(re) {
            console.log(re);
          }
        })
      }, 500))
    })
  },

  saveImg(imgPath) {
    const that = this;
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              that.saveImageToPhotosAlbum(imgPath);
            },
            fail() {
              wx.showModal({
                content: '您尚未授权保存该图片，请进行授权后操作',
                confirmText: '授权',
                success: function(state) {
                  if (state.confirm) {
                    wx.openSetting({
                      success: (res) => {
                        console.log(res);
                        if (res.authSetting['scope.writePhotosAlbum']) {
                          that.saveImageToPhotosAlbum(imgPath);
                        } else {
                          wx.showToast({
                            title: '未授权无法保存',
                            mask: true,
                            icon: 'none'
                          })
                        }
                      }
                    })
                  } else {
                    wx.showToast({
                      title: '您已拒绝授权',
                      mask: true,
                      icon: 'none'
                    })
                  }
                }
              })

            }
          })
        } else {
          that.saveImageToPhotosAlbum(imgPath);
        }
      }
    })
  },
  saveImageToPhotosAlbum(imgPath) {
    wx.saveImageToPhotosAlbum({
      filePath: imgPath,
      success: (res) => {
        wx.hideLoading();
        if (res.errMsg == 'saveImageToPhotosAlbum:ok') {
          wx.showToast({
            title: '保存成功',
            mask: true
          })
        } else {
          wx.showToast({
            title: '保存失败',
            mask: true
          })
        }
      },
      fail: (err) => {
        wx.showToast({
          title: '已取消保存',
          mask: true
        })
      }
    })
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

  },

  sendApply: function(e) {
    const that = this;
    that.setData({
      isHide: false
    }, () => {
      that.updateQuestionnaireMain();
    })
  },
  goBack: function() {
    app.globalData.flag = true;
    wx.reLaunch({
      url: '../index/index',
    })
  },
  goIndex: function() {
    app.globalData.flag = true;
    wx.reLaunch({
      url: '../index/index',
    })
  },
  saveThis: function(e) {
    const that = this;
    wx.showLoading({
      title: '保存中...',
    })
    that.lostupdateQuestionnaireMain();
    that.createImg();
  },
  updateQuestionnaireMain: function() {
    const that = this;
    wx.request({
      url: app.requests.service.updateQuestionnaireMain,
      method: 'POST',
      data: {
        promotionrate: 0.666,
        main_id: app.globalData.main_id
      },
      success: function(res) {
        console.log(res);
      },
      fail: function(res) {

      }
    })
  },
  lostupdateQuestionnaireMain: function() {
    const that = this;
    wx.request({
      url: app.requests.service.updateQuestionnaireMain,
      method: 'POST',
      data: {
        promotionrate: 1.0,
        main_id: app.globalData.main_id
      },
      success: function(res) {
      },
      fail: function(res) {
      }
    })
  }
})