module.exports = {
  default: {
    require: [
      'src/step_definitions/**/*.js',
      'src/hooks/**/*.js'
    ],
    paths: [
      'src/features/**/*.feature'
    ],
    // Simplified format array to avoid schema validation errors
    format: [
      'progress-bar',
      'allure-cucumberjs/reporter'
    ],
    formatOptions: {
      resultsDir: 'allure-results',
      snippetInterface: 'async-await'
    },
    publishQuiet: true
  }
}