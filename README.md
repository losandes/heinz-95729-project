1. scripts/deploy.sh zips the workspace and deploys it to S3

2. our webhook url GET: https://u9ofbpxmqd.execute-api.us-east-1.amazonaws.com/prod/resource

3. TODO: set up deploy script for CICD, thoughts: just send new object to S3 as lambda is already hooked up

4. TODO: npm install https://stackoverflow.com/questions/34437900/how-to-load-npm-modules-in-aws-lambda