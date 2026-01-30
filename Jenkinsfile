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
                    // This converts your checkbox selections into a command
                    def featureList = params.SELECTED_FEATURES.replace(',', ' ')
                    bat "npx cucumber-js src/features/${featureList} --tags @UI"
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