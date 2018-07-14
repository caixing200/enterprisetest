import * as echarts from '../../ec-canvas/echarts';

const app = getApp();

let chart = null;

function initChart(canvas, width, height) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);

  var indicatorData = app.globalData.shareData ? JSON.parse(app.globalData.shareData.indicator) : switchData('indicator');
  var seriesData = app.globalData.shareData ? JSON.parse(app.globalData.shareData.series) : switchData('series');
  var option = {
    color: ["#FF9F7F", "#04c38e"],
    backgroundColor: '#fff',
    legend: [{
        left: '10%',
        top: 32,
        selectedMode: false,
        formatter: '{a|{name}}',
        textStyle: {
          rich: {
            a: {
              color: '#ff0000',
              fontWeight: 700,
              fontSize: 14
            }

          }
        },
        data: [{
          name: '自测'
        }]
      },
      {
        right: '10%',
        top: 25,
        selectedMode: false,
        formatter: ['{a|参测企业}', '{a|平均值}'].join('\n'),
        textStyle: {
          rich: {
            a: {
              color: '#000',
              fontWeight: 700,
              fontSize: 14,
              width: 30
            }

          }
        },
        data: [{
          name: '参测企业平均值'
        }]
      }
    ],
    radar: {
      // shape: 'circle',
      indicator: indicatorData
    },
    series: [{
      type: 'radar',
      itemStyle: {
        normal: {
          areaStyle: {
            type: 'default'
          }
        }
      },
      data: seriesData
    }]
  };

  chart.setOption(option);
  setTimeout(function() {

  }, 500)
  return chart;
}

function switchData(str) {
  if (str === 'indicator') {
    const indicator = [];
    const baseScore = app.globalData.baseScore;
    for (let i = 0; i < baseScore.length; i++) {
      const tempObj = {};
      tempObj.name = baseScore[i].type;
      tempObj.max = baseScore[i].score;
      tempObj.color = '#000';
      indicator.push(tempObj);
    }
    console.log(indicator)
    return indicator
  } else if (str === 'series') {
    const series = [];
    let tempObj = {};
    let tempArr = [];
    const topScore = app.globalData.topScore;
    const companyScore = app.globalData.companyScore;
    for (let i = 0; i < topScore.length; i++) {
      tempArr.push(topScore[i].score);
    }
    tempObj.value = tempArr;
    tempObj.name = '参测企业平均值';
    series.push(tempObj);
    tempObj = {};
    tempArr = [];
    for (let i = 0; i < companyScore.length; i++) {
      tempArr.push(companyScore[i].score);
    }
    tempObj.value = tempArr;
    tempObj.name = '自测';
    tempObj.areaStyle = {
      opacity: 0.4
    }
    series.push(tempObj);
    console.log(series);
    return series
  } else {
    return []
  }
}

Page({
  data: {
    ec: {
      onInit: initChart
    },
    company: '',
    percent: 0,
    sum: 0,
    footBtn: true,
    isshared: false,
    // showSelects: true
    canvasHide: true,
    saveState: false,
    tempFilePath: null,
    intoState: false
  },
  countSum: function() {
    const that = this;
    let sum = 0;
    const numArr = switchData('series')[1].value;
    for (let i = 0; i < numArr.length; i++) {
      sum += parseFloat(numArr[i]);
    }
    return sum
  },
  onLoad: function(ops) {
    const that = this;
    wx.hideShareMenu();
    console.log(app.globalData);
    console.log(ops);
    if (ops.share == '0') {
      that.data.intoState = false;
      if (app.globalData.company) {
        that.viewQuestionnaireRatio();
        that.setData({
          company: app.globalData.company,
          sum: that.countSum(),
        })
        wx.showLoading({
          title: '加载中...',
          mask: true
        })
      }
    } else { //分享进入
      app.globalData.shareData = ops;
      that.data.intoState = true;
      that.setData({
        footBtn: false,
        sum: ops.sum,
        percent: ops.percent,
        company: ops.company
      })
    }


  },
  onShow: function(ops) {

  },
  onReady: function() {
    const that = this;
    if (!that.data.intoState) {
      setTimeout(function() {
        that.save(false);
      }, 1000)
    }

  },
  onShareAppMessage: function(ops) {
    const that = this;
    const indicatorData = JSON.stringify(switchData('indicator'));
    const seriesData = JSON.stringify(switchData('series'));
    if (ops.from === 'button') {
      const shareObj = {};
      shareObj.title = that.data.company + '的运营效率超过了' + that.data.percent + '%的参测企业。';
      shareObj.path = 'pages/radar/radar?share=1&indicator=' + indicatorData + '&series=' + seriesData + '&sum=' + that.data.sum + '&percent=' + that.data.percent + '&company=' + that.data.company;
      shareObj.success = function(res) {
        that.data.isshared = true;
        that.updateQuestionnaireMain(that.data.isshared);
        wx.showToast({
          title: '分享成功',
          mask: true,
          duration: 1000
        })
      };
      return shareObj


    } else {
      return false
    }
  },
  goExercise: function() {
    const that = this;
    // if (that.data.saveState){

    // }else {
    //   that.save(false)
    // }
    if (!that.data.isshared) {
      that.updateQuestionnaireMain(that.data.isshared);
    }
    wx.navigateTo({
      url: '../exercise/exercise',
    })

  },
  goIndex: function() {
    wx.reLaunch({
      url: '../index/index',
    })
  },
  viewQuestionnaireRatio: function() {
    const that = this;
    wx.request({
      url: app.requests.service.viewQuestionnaireRatio,
      data: {
        main_id: app.globalData.main_id
      },
      success: function(res) {
        console.log(res);
        that.setData({
          percent: res.data.body[0].ratio
        })
      },
      fail: function(res) {

      }
    })
  },
  updateQuestionnaireMain: function(state) {
    const that = this;
    wx.request({
      url: app.requests.service.updateQuestionnaireMain,
      method: 'POST',
      data: {
        isshared: state ? 1 : 0,
        subscriberate: state ? 0 : 0.25,
        main_id: app.globalData.main_id
      },
      success: function(res) {
        console.log(res);
      },
      fail: function(res) {

      }
    })
  },
  // showSelects: function() {
  //   const that = this;
  //   that.setData({
  //     showSelects: false
  //   })

  // },
  // closeSelects: function() {
  //   const that = this;
  //   that.setData({
  //     showSelects: true
  //   })
  // },
  imgShare: function() {
    const that = this;
    if (that.data.tempFilePath) {
      that.saveImg(that.data.tempFilePath);
    } else {
      that.save(true);
    }
  },
  save(state) {
    const that = this;
    const ecComponent = that.selectComponent('#mychart-dom-graph');
    ecComponent.canvasToTempFilePath({
      success: res => {
        console.log(res.tempFilePath)
        if (state) {
          wx.showLoading({
            title: '载入中...',
            mask: true
          })
        }
        that.createImg(res.tempFilePath, state);
      },
      fail: res => console.log(res)
    });
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
  createImg(imgPath, state) {
    const that = this;
    let firstImg = imgPath;
    let qcodeImg = '';
    wx.downloadFile({
      url: 'http://p9jd05hzv.bkt.clouddn.com/qcode.jpg',
      success: function(res) {
        qcodeImg = res.tempFilePath;
        that.setData({
          canvasHide: false,
        })
        //设置宽高
        var pixel = app.globalData.mySystemInfo.pixelRatio || 2;
        var windowWidth = app.globalData.mySystemInfo.windowWidth;
        // var windowHeight = app.globalData.mySystemInfo.windowHeight;
        var windowHeight = windowWidth * 1.6;
        var canvasWidth = windowWidth * pixel;
        var canvasHeight = windowHeight * pixel;
        var rpx = 750 / app.globalData.mySystemInfo.screenWidth;
        var ctx = wx.createCanvasContext('canvasImg');
        var step = app.globalData.mySystemInfo.screenHeight / app.globalData.mySystemInfo.screenWidth;
        step = step>2?(step-1.03):(step-0.9)
        //绘制底色
        ctx.setFillStyle('#FFFFFF')
        ctx.fillRect(0, 0, windowWidth, windowHeight)

        //绘制文字
        var companyArr = that.formatCompany(that.data.company, windowWidth, rpx);
        console.log(companyArr);
        var company = that.data.company;
        var sum = that.data.sum;
        var percent = that.data.percent;
        var index = companyArr.length - 1;

        //公司名称
        for (let i = 0; i < companyArr.length; i++) {
          const index = i + 1;
          ctx.setFontSize(26)
          ctx.setTextAlign('center')
          ctx.setFillStyle('#000')
          ctx.fillText(companyArr[i], windowWidth / 2, 70 * index / rpx)
          ctx.setFontSize(26)
          ctx.setTextAlign('center')
          ctx.setFillStyle('#000')
          ctx.fillText(companyArr[i], (windowWidth - 1) / 2, 70 * index / rpx)
          ctx.setFontSize(26)
          ctx.setTextAlign('center')
          ctx.setFillStyle('#000')
          ctx.fillText(companyArr[i], (windowWidth + 1) / 2, 70 * index / rpx)
        }


        //得分
        ctx.setFontSize(16)
        ctx.setTextAlign('left')
        ctx.setFillStyle('#000')
        ctx.fillText('运营效率自测综合得分', 30 / rpx, (150 + (70 * index)) / rpx)

        ctx.setFontSize(28)
        ctx.setTextAlign('left')
        ctx.setFillStyle('#000')
        ctx.fillText(sum + '分', windowWidth / 1.3, (150 + (70 * index)) / rpx)
        ctx.setFontSize(28)
        ctx.setTextAlign('left')
        ctx.setFillStyle('#000')
        ctx.fillText(sum + '分', (windowWidth - 1) / 1.3, (150 + (70 * index)) / rpx)
        ctx.setFontSize(28)
        ctx.setTextAlign('left')
        ctx.setFillStyle('#000')
        ctx.fillText(sum + '分', (windowWidth + 1) / 1.3, (150 + (70 * index)) / rpx)

        //胜率
        ctx.setFontSize(16)
        ctx.setTextAlign('left')
        ctx.setFillStyle('#000')
        ctx.fillText('运营效率超过了', 30 / rpx, (230 + (70 * index)) / rpx)

        ctx.setFontSize(24)
        ctx.setTextAlign('center')
        ctx.setFillStyle('#000')
        ctx.fillText(percent + '%', windowWidth / 1.8, (230 + (70 * index)) / rpx)
        ctx.setFontSize(24)
        ctx.setTextAlign('center')
        ctx.setFillStyle('#000')
        ctx.fillText(percent + '%', (windowWidth + 1) / 1.8, (230 + (70 * index)) / rpx)

        ctx.setFontSize(16)
        ctx.setTextAlign('right')
        ctx.setFillStyle('#000')
        ctx.fillText('的参测企业', windowWidth - (30 / rpx), (230 + (70 * index)) / rpx)

        //绘制图片
        ctx.drawImage(firstImg, 0, (260 + (70 * index)) / rpx, windowWidth, windowWidth * step)
        ctx.drawImage(qcodeImg, windowWidth - (150 / rpx), windowHeight - (250 / rpx), 128 / rpx, 128 / rpx)

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
              that.setData({
                canvasHide: true,
                tempFilePath: res.tempFilePath
              })
              if (state) {
                wx.hideLoading()
                that.saveImg(res.tempFilePath)
              } else {
                that.uploadQuestionnaireImg(res.tempFilePath)
              }

            },
            fail: function(re) {
              console.log(re);
            }
          })
        }, 500))

      }
    })
  },
  formatCompany(txt, windowWidth, rpx) {
    const that = this;
    if (txt) {
      const txtWidth = txt.length * (60 / rpx);
      console.log(txtWidth);
      console.log(windowWidth);
      if (txtWidth >= windowWidth) {
        const tempArr = [];
        const step = Math.ceil(txtWidth / txt.length);
        const sum = Math.floor(windowWidth / step);
        const arrLength = Math.ceil(txtWidth / windowWidth);
        for (let i = 0; i < arrLength; i++) {
          const str = txt.substr(i * sum, sum)
          tempArr.push(str)
        }
        return tempArr
      } else {
        return [txt]
      }
    } else {
      return []
    }
  },
  uploadQuestionnaireImg(imgPath) {
    const that = this;
    wx.uploadFile({
      url: app.requests.service.uploadQuestionnaireImg,
      filePath: imgPath,
      name: 'img_file',
      formData: {
        main_id: app.globalData.main_id
      },
      success: function(res) {
        console.log(res);
        if (res.statusCode == 200) {
          that.setData({
            saveState: true
          })
        }

      }
    })
  },

});