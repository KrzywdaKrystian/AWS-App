# AWS-App
AWS, Amazon, S3, SQS, Node.js Express App with worker

Example app of Node.js Express App that connects a client application with Amazon Web Services. 
The application allows you to add, delete, and view the list of photos.

Uses S3 and SQS:
- putObject
- deleteObject
- listObjects
- sendMessage

In ./workers you can find a example of worker which rotate image

Helpful links:
- https://github.com/aws/aws-sdk-js
- http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html
- http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SQS.html
- http://www.cheynewallace.com/uploading-to-s3-with-angularjs/
- http://stackoverflow.com/questions/32702431/display-images-fetched-from-s3
