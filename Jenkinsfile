@Library('jenkins-libs') _

dockerJavaPipeline {
    app_name           = 'odd-platform'
    build_deploy_image = './gradlew jib --no-daemon --image ${ECR_URL}/${IMAGE_NAME} -Pversion=${GIT_SHA7}'
    docker_label_agent = 'java17'
}
