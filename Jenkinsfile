pipeline {
  agent any

  environment {
    BACKEND_IMAGE = "gunnu007/backend"
    FRONTEND_IMAGE = "gunnu007/frontend"
    TAG = "${env.BUILD_NUMBER}"
    AKS_NAME = "myaks"
    AKS_RG = "myaks_group"
    NAMESPACE = "three-tier"
  }
//stages
  stages {

    stage('Checkout') {
      steps {
        git url: 'https://github.com/Gaurav22020/k8s-3tier-application-CICD', branch: 'main'
      }
    }

    stage('Build Images') {
      steps {
        sh '''
          set -e
          docker build -t $BACKEND_IMAGE:$TAG backend/
          docker build -t $FRONTEND_IMAGE:$TAG frontend/
        '''
      }
    }

    stage('Push Images') {
      steps {
        withCredentials([
          usernamePassword(credentialsId: 'docker-hub-cred', usernameVariable: 'U', passwordVariable: 'P')
        ]) {
          sh '''
            set -e
            echo $P | docker login -u $U --password-stdin
            docker push $BACKEND_IMAGE:$TAG
            docker push $FRONTEND_IMAGE:$TAG
          '''
        }
      }
    }

    stage('Login to Azure') {
      steps {
        withCredentials([
          string(credentialsId: 'AZ_CLIENT_ID', variable: 'AZ_CLIENT_ID'),
          string(credentialsId: 'AZ_CLIENT_SECRET', variable: 'AZ_CLIENT_SECRET'),
          string(credentialsId: 'AZ_TENANT_ID', variable: 'AZ_TENANT_ID')
        ]) {
          sh '''
            set -e
            az login --service-principal \
              -u $AZ_CLIENT_ID \
              -p $AZ_CLIENT_SECRET \
              --tenant $AZ_TENANT_ID

            az aks get-credentials \
              --resource-group $AKS_RG \
              --name $AKS_NAME \
              --overwrite-existing
          '''
        }
      }
    }

    stage('Ensure Namespace Exists') {
      steps {
        sh '''
          kubectl get namespace $NAMESPACE || kubectl create namespace $NAMESPACE
        '''
      }
    }

    stage('Create / Update Mongo Secret') {
      steps {
        withCredentials([
          string(credentialsId: 'mongo-uri', variable: 'MONGO_URI')
        ]) {
          sh '''
            set -e
            kubectl create secret generic backend-secrets \
              --from-literal=MONGO_URI="$MONGO_URI" \
              -n $NAMESPACE \
              --dry-run=client -o yaml | kubectl apply -f -
          '''
        }
      }
    }

    stage('Deploy Application') {
      steps {
        sh '''
          set -e
          git checkout -- kubernetes/backend-deployment.yaml kubernetes/frontend-deployment.yaml

          sed -i "s|gunnu007/backend:__TAG__|$BACKEND_IMAGE:$TAG|g" kubernetes/backend-deployment.yaml
          sed -i "s|gunnu007/frontend:__TAG__|$FRONTEND_IMAGE:$TAG|g" kubernetes/frontend-deployment.yaml

          kubectl apply -f kubernetes/
        '''
      }
    }

    stage('Deploy Gateway API') {
      steps {
        sh '''
          set -e
          kubectl apply -f kubernetes/gatewayclass.yaml
          kubectl apply -f kubernetes/gateway.yaml
          kubectl apply -f kubernetes/httproute.yaml
        '''
      }
    }

    stage('Verify Rollout') {
      steps {
        sh '''
          kubectl rollout status deployment/backend -n $NAMESPACE
          kubectl rollout status deployment/frontend -n $NAMESPACE
          kubectl get gateway -n ingress-nginx
          kubectl get httproute -n $NAMESPACE
        '''
      }
    }
  }
}
