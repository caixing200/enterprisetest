//const toast = require('./wxpai.js');
//const host = '';//正式地址
//const host = 'http://192.168.0.114:8080/vmesrest';//本地地址
//const host = 'http://web.deecoop.cn/rest';//测试地址
const host = 'https://vmes.deecoop.cn';//20180723提交审核用URL

const service = {
  getAllQuestions: `${host}/questionnaire/getAllQuestions`,
  saveQuestionnaireMain: `${host}/questionnaire/saveQuestionnaireMain`,
  updateQuestionnaireMain: `${host}/questionnaire/updateQuestionnaireMain`,
  viewQuestionnaireScore: `${host}/questionnaire/viewQuestionnaireScore`,
  viewQuestionnaireRatio: `${host}/questionnaire/viewQuestionnaireRatio`,
  viewQuestionnaireAverage: `${host}/questionnaire/viewQuestionnaireAverage`,
  viewQuestionnaireTypeMaxScore: `${host}/questionnaire/viewQuestionnaireTypeMaxScore`,
  uploadQuestionnaireImg: `${host}/questionnaire/uploadQuestionnaireImg`,
  viewQuestionnaireImg: `${host}/questionnaire/viewQuestionnaireImg`
}

module.exports = {host, service}