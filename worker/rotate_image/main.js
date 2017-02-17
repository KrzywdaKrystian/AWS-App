var fs = require('fs');
var Consumer = require('sqs-consumer');
var AWS = require('aws-sdk');

var APP_CONFIG_FILE = "./config.json";
var helper = {
    readJSONFile : readJSONFile
};
var config = helper.readJSONFile(APP_CONFIG_FILE);
AWS.config.update({
    accessKeyId: config.access_key,
    secretAccessKey: config.secret_key,
    region: config.region
});
var s3 = new AWS.S3();

var app = Consumer.create({
    queueUrl: config.QUEUE_URL,
    region: config.region,
    batchSize: 10,
    handleMessage: function (message, done) {
        // do some work with `message`
        console.log(message);
        done();
    },
    sqs: new AWS.SQS()
});

app.on('error', function (err) {
    console.log('error: ', err);
});

app.start();

// functions
function readJSONFile(fileName) {
    if (!fs.existsSync(fileName)) {
        console.log("unable to open file: " + fileName);
        throw new Error("unable to open file: " + fileName);
    }
    var data = fs.readFileSync(fileName, {encoding: 'utf8'});
    console.log('Config:', data);
    return JSON.parse(data);
};