Prereqs:
1. install node.js v12.18.4
2. try to use git bash instead of powershell or command prompt
3. install aws cli: https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html
4. run `npm install -g prettier`
5. run `npm ci`
6. set up aws configs - ask Ahmad for credentials


Directions:
1. scripts/deploy.sh zips the workspace and deploys it to S3
2. our webhook url POST: https://u9ofbpxmqd.execute-api.us-east-1.amazonaws.com/Prod/resource
3. TODO: set up deploy script for CICD, thoughts: just send new object to S3 as lambda is already hooked up
4. TODO: npm install https://stackoverflow.com/questions/34437900/how-to-load-npm-modules-in-aws-lambda
5. #use proper credentials ==> export AWS_DEFAULT_PROFILE=ecomm