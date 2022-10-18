@Library('jenkins-libs') _

pipeline {
    agent { label 'java17-dind' }

    options{
      ansiColor('xterm')
      buildDiscarder(
        logRotator(
          artifactDaysToKeepStr: '10',
          artifactNumToKeepStr: '10',
          daysToKeepStr: '5',
          numToKeepStr: '5'
        )
      )
      disableConcurrentBuilds()
      timeout(time: 20, unit: 'MINUTES')
    }

    environment {
      ECR_URL = getEcrUrl()
      ECR_REGION = "$ECR_URL".find(/\w{2}\-\w{4}\-\d{1}/)
      IMAGE_REPO = "$ECR_URL/$IMAGE_NAME"
      IMAGE_NAME = "odd-platform"
      GIT_SHA7 = "${GIT_COMMIT[0..6]}"
      JENKINS_ENVIRONMENT = "${System.getenv('JENKINS_ENVIRONMENT') ?: 'none'}"
    }

    stages {

      stage('Start Docker in Docker') {
        steps {
          sh "dockerd &> dockerd-logfile &"
        }
      }

      stage('ECR auth'){
        steps{
          sh """
            su - jenkins
            set +x
            \$(aws ecr get-login --no-include-email --region ${ECR_REGION})
          """
        }
      }

      stage('Build image') {
        steps {
          echo 'Building image'
          sh """
            su - jenkins
            ./gradlew jib --no-daemon --image ${ECR_URL}/${IMAGE_NAME} -Pversion=${GIT_SHA7}
          """
        }
      }
}
