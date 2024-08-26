pipeline {
    agent any
    
    environment {
        EC2_HOST = 'i11d206.p.ssafy.io'
        DOCKER_HUB_CREDENTIALS = credentials('docker-hub-credentials')
        FRONTEND_IMAGE = 'msr980929/frontend:latest'
        BACKEND_IMAGE = 'msr980929/backend:latest'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    sh 'docker build -t ${FRONTEND_IMAGE} .'
                }
            }
        }
        
        stage('Build Backend') {
            steps {
                dir('backend') {
                    sh 'docker build -t ${BACKEND_IMAGE} .'
                }
            }
        }
        
        stage('Push to Docker Hub') {
            steps {
                sh 'echo $DOCKER_HUB_CREDENTIALS_PSW | docker login -u $DOCKER_HUB_CREDENTIALS_USR --password-stdin'
                sh 'docker push ${FRONTEND_IMAGE}'
                sh 'docker push ${BACKEND_IMAGE}'
            }
        }
        
        stage('Deploy to EC2') {
            steps {
                sshagent(credentials: ['ec2-ssh-key']) {
                    sh '''
                        ssh ubuntu@${EC2_HOST} '
                            docker-compose down
                            docker pull ${FRONTEND_IMAGE}
                            docker pull ${BACKEND_IMAGE}
                            docker-compose up -d
                        '
                    '''
                }
            }
        }
        
        stage('SSL Certification') {
            steps {
                sshagent(credentials: ['ec2-ssh-key']) {
                    sh '''
                        ssh ubuntu@${EC2_HOST} '
                            sudo certbot --nginx -d i11d206.p.ssafy.io --non-interactive --agree-tos -m your-email@example.com
                        '
                    '''
                }
            }
        }
    }
    
    post {
        always {
            sh 'docker logout'
        }
    }
}