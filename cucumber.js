module.exports = {
  default: {
    require: [
      'src/step_definitions/**/*.js',
      'src/hooks/**/*.js'
    ],
    paths: [
      'src/features/**/*.feature'
    ],
    format: [
      'progress-bar',
      'allure-cucumberjs/reporter',
      '@reportportal/agent-js-cucumber'
    ],
    formatOptions: {
      resultsDir: 'allure-results'
    },
    publishQuiet: true
  }
};