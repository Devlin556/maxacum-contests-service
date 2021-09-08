import type { Serverless } from 'serverless/aws';

const serverlessConfiguration: Serverless = {
  service: {
    name: 'maxaspirt-contest-service',
    // app and org for use with dashboard.serverless.com
    // app: your-app-name,
    // org: your-org-name,
  },
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true
    }
  },
  // Add the serverless-webpack plugin
  plugins: ['serverless-webpack', 'serverless-dotenv-plugin'],
  provider: {
    name: 'aws',
    region: 'eu-central-1',
    runtime: 'nodejs12.x',
    apiGateway: {
      minimumCompressionSize: 1024,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      BASE_API_URL: '${env:BASE_API_URL}',
      ADMIN_TOKEN: '${env:ADMIN_TOKEN}'
    },
  },
  functions: {
    join: {
      handler: './src/handlers/join.joinHandler',
      events: [
        {
          http: {
            method: 'post',
            path: 'join'
          }
        }
      ]
    },
    getContestants: {
      handler: './src/handlers/getContestants.getContestantsHandler',
      events: [
        {
          http: {
            method: 'get',
            path: 'getContestants'
          }
        }
      ]
    },
    shuffle: {
      handler: './src/handlers/shuffle.shuffleHandler',
      events: [
        {
          http: {
            method: 'get',
            path: 'shuffle'
          }
        }
      ]
    }
  }
}

module.exports = serverlessConfiguration;
