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
      'allure-cucumberjs/reporter'
    ],
    formatOptions: {
      resultsDir: 'allure-results'
    },
    publishQuiet: true
  }
};