var fs = require('fs');
var Consumer = require('sqs-consumer');
var AWS = require('aws-sdk');
var Jimp = require("jimp");

var APP_CONFIG_FILE = "./config.json";
var helper = {
    readJSONFile : readJSONFile,
    encode: encode
};
var config = helper.readJSONFile(APP_CONFIG_FILE);
AWS.config.update({
    accessKeyId: config.access_key,
    secretAccessKey: config.secret_key,
    region: config.region
});

console.log('start Rotate Image worker');

var bucket = new AWS.S3({params: {Bucket: config.bucket}});

var app = Consumer.create({
    queueUrl: config.QUEUE_URL,
    region: config.region,
    batchSize: 10,
    handleMessage: function (message, done) {
        // do some work with `message`
        var msgBody = JSON.parse(message.Body);
        console.log(msgBody);

        switch (msgBody.type) {
            case "rotate-photo":
                bucket.getObject({
                    Bucket: config.bucket,
                    Key: msgBody.photoKey
                }, function (err, file) {
                    if (!err) {

                        Jimp.read(file.Body, function (err, image) {
                            if(err) {
                                console.log(err);
                            }
                            else {
                                console.log(image);
                                var mime = image._originalMime;
                                var newImage = image.rotate( 90 );

                                var body = newImage.getBuffer(mime, function () {
                                    console.log('>>>>>>>>', 'getBufferEnd');
                                });
                                console.log('putObject2');
                                var params = {
                                    Key: 'test_' + new Date().getTime() + '.jpg',
                                    ContentType: mime,
                                    Body: image.Body,
                                    ServerSideEncryption: 'AES256'
                                };

                                bucket.putObject(params, function (err, data) {
                                    if (err) {
                                        console.log(err.message, err.code);
                                        return false;
                                    }
                                    else {
                                        // Upload Successfully Finished
                                        console.log('>>>>>>> File Uploaded Successfully', 'Done');
                                    }
                                });
                            }
                            // do stuff with the image (if no exception)
                        });

                        console.log(file);
                    } else {
                        console.error(err);
                    }
                });
                break;
            default:
                console.log("bad type");
        }
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
    return JSON.parse(data);
}

function encode(data) {
    var str = data.reduce(function (a, b) {
        return a + String.fromCharCode(b)
    }, '');
    return btoa(str).replace(/.{76}(?=.)/g, '$&\n');
}