//const toast = require('./wxpai.js');
//const host = '';//正式地址
const host = 'http://192.168.0.112:8080/vmesrest';//测试地址

const service = {
  getAllQuestions: `${host}/questionnaire/getAllQuestions`,
  saveQuestionnaireMain: `${host}/questionnaire/saveQuestionnaireMain`,
  updateQuestionnaireMain: `${host}/questionnaire/updateQuestionnaireMain`,
  viewQuestionnaireScore: `${host}/questionnaire/viewQuestionnaireScore`,
  viewQuestionnaireRatio: `${host}/questionnaire/viewQuestionnaireRatio`,
  viewQuestionnaireAverage: `${host}/questionnaire/viewQuestionnaireAverage`,
  viewQuestionnaireTypeMaxScore: `${host}/questionnaire/viewQuestionnaireTypeMaxScore`
}

module.exports = {host, service}