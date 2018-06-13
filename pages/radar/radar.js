import * as echarts from '../../ec-canvas/echarts.min';

const app = getApp();

function initChart(canvas, width, height) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);

  var indicatorData = app.globalData.shareData ? JSON.parse(app.globalData.shareData.indicator) : switchData('indicator');
  var seriesData = app.globalData.shareData ? JSON.parse(app.globalData.shareData.series) : switchData('series');
  var option = {
    backgroundColor: "#ffffff",
    color: ["#FF9F7F", "#04c38e"],
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
      data: [{ name: '自测' }]
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
      data: [{ name: '参测企业平均值' }]
    }],
    radar: {
      // shape: 'circle',
      indicator: indicatorData
    },
    series: [{
      type: 'radar',
      itemStyle: { normal: { areaStyle: { type: 'default' } } },
      data: seriesData
    }]
  };

  chart.setOption(option);
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
    isshared: false
  },
  onLoad: function (ops) {
    const that = this;
    wx.hideShareMenu();
    console.log(app.globalData);
    console.log(ops);
    if (ops.share == '0') {
      if (app.globalData.company) {
        that.viewQuestionnaireRatio();
        that.setData({
          company: app.globalData.company
        })
      }
    } else {//分享进入
      app.globalData.shareData = ops;
      that.setData({
        footBtn: false,
        sum: ops.sum,
        percent: ops.percent,
        company: ops.company
      })
    }


  },
  onShow: function (ops) {

  },
  onShareAppMessage: function (ops) {
    const that = this;
    const indicatorData = JSON.stringify(switchData('indicator'));
    const seriesData = JSON.stringify(switchData('series'));
    if (ops.from === 'button') {
      const shareObj = {};
      shareObj.title = that.data.company + '的运营效率超过了' + that.data.percent + '%的参测企业。';
      shareObj.path = 'pages/radar/radar?share=1&indicator=' + indicatorData + '&series=' + seriesData + '&sum=' + that.data.sum + '&percent=' + that.data.percent + '&company=' + that.data.company;
      shareObj.success = function(res){
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
  goExercise: function () {
    const that = this;
    if (!that.data.isshared){
      that.updateQuestionnaireMain(that.data.isshared);
    }
    wx.navigateTo({
      url: '../exercise/exercise',
    })
  },
  goIndex: function () {
    wx.reLaunch({
      url: '../index/index',
    })
  },
  viewQuestionnaireRatio: function(){
    const that = this;
    wx.request({
      url: app.requests.service.viewQuestionnaireRatio,
      data: {
        main_id: app.globalData.main_id
      },
      success: function(res) {
        console.log(res);
        that.setData({
          sum: res.data.body[0].totalnum,
          percent: res.data.body[0].ratio
        })
      },
      fail: function(res) {
      
      }
    })
  },
  updateQuestionnaireMain: function(state){
    const that = this;
    wx.request({
      url: app.requests.service.updateQuestionnaireMain,
      method: 'POST',
      data: {
        isshared: state?1:0,
        subscriberate: state?0:0.25,
        main_id: app.globalData.main_id
      },
      success: function(res) {
        console.log(res);
      },
      fail: function(res) {

      }
    })
  }
});
