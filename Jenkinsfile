@Library('jenkins-libs') _

dockerJavaPipeline {
  app_name           = 'odd-platform'
  build_deploy_image = './gradlew jib --no-daemon --image ${ECR_URL}/${IMAGE_NAME} -Pversion=${TAG}'
  docker_label_agent = 'jenkins-agent'

  container_names_images = 'odd-platform'
}
