pipeline {
    agent any
    
    parameters {
        choice(name: 'ENVIRONMENT', choices: ['QA', 'Staging', 'Production'], description: 'Pick Env')
        // The SELECTED_FEATURES comes from the UI checkboxes
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm install'
                bat 'npx playwright install --with-deps'
            }
        }

        stage('Execute Tests') {
            steps {
                script {
                    // Check if any features were selected; if not, run all in the folder
                    def runTarget = ""
                    if (params.SELECTED_FEATURES && params.SELECTED_FEATURES.trim() != "") {
                        // Converts "login.feature,api.feature" to "src/features/login.feature src/features/api.feature"
                        runTarget = params.SELECTED_FEATURES.split(',').collect { "src/features/${it.trim()}" }.join(' ')
                    } else {
                        runTarget = "src/features/"
                    }
                    
                    echo "Running: ${runTarget}"
                    bat "npx cucumber-js ${runTarget} --tags ${params.TEST_TAG ?: '@UI'}"
                }
            }
        }
    }

    post {
        always {
            // This command generates the Allure report inside Jenkins
            allure includeProperties: false, jdk: '', results: [[path: 'allure-results']]
        }
    }
}