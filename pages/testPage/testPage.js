// pages/testPage.js
//const testList = require('../../utils/testList.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    testList: [],
    testListLength: 0,
    step: 0,
    testIndex: 0,
    styleState: [],
    percent: 0,
    answerList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    clearTimeout(that.data.navTimer);
    const list = app.globalData.testList;
    that.setData({
      testList: list,
      testListLength: list.length,
      step: 100 / list.length,
      styleState: that.createStyleState(list),
      percent: parseInt(100 / list.length) * that.data.testIndex
    }, () => {
      console.log(that.data.step)
    })
  },
  createStyleState: function (list) {
    const that = this;
    const tempArr = [];
    for (let i = 0; i < list.length; i++) {
      tempArr.push(false);
    }
    return tempArr
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
    clearTimeout(that.data.navTimer);
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

  forbid: function () {
    return
  },
  nextTest: function (e) {
    const that = this;
    const question = e.currentTarget.dataset.questid;
    const answer = e.currentTarget.dataset.answerid;
    const answerObj = { question, answer };
    let index = e.currentTarget.dataset.index;
    const barState = ((index + 1) === that.data.testList.length)?true:false;
    that.data.answerList.push(answerObj)
    that.setData({
      testIndex: barState ? index : (index + 1),
      styleState: that.changeStyleState(e.currentTarget.dataset.index),
      percent: ((100 / that.data.testList.length) * (e.currentTarget.dataset.index + 1)).toFixed(2)
    },()=>{
      if (barState){
        clearTimeout(that.data.navTimer);
        that.data.navTimer = setTimeout(function(){
          app.globalData.results = that.data.answerList
          wx.redirectTo({
            url: '../testResult/testResult',
            //url: '../radar/radar',
          },500)
        })
      }
    })
  },
  changeStyleState: function (index) {
    const that = this;
    that.data.styleState[index] = true;
    return that.data.styleState;
  }
})