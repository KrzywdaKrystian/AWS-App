var fs = require('fs');
var Consumer = require('sqs-consumer');
var AWS = require('aws-sdk');
var Jimp = require("jimp");

var APP_CONFIG_FILE = "./config.json";
var helper = {
    readJSONFile: readJSONFile
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

        switch (msgBody.type) {
            case "rotate-photo":
                bucket.getObject({
                    Bucket: config.bucket,
                    Key: msgBody.photoKey
                }, function (err, file) {
                    if (!err) {

                        var photoPath = 'rotated/'+ msgBody.photoKey;
                        var transformedPhotoPath = 'rotated/transformed/'+ msgBody.photoKey;

                        // save to rotated folder
                        fs.writeFile(photoPath, file.Body, function(err) {
                            if(err) console.log('>>>>>>>>>>>>', err);
                        });

                        // read file from rotated folder
                        Jimp.read(photoPath, function (err, image) {
                            // rotate
                            image.rotate(90)
                                .write(transformedPhotoPath);

                            // read transformed photo
                            fs.readFile(transformedPhotoPath, 'utf8', function (err,data) {
                                if (err) {
                                    return console.log(err);
                                }
                                //console.log(data);

                                // put to aws
                                var mime = image._originalMime;
                                image.getBuffer( mime, function (err, buffer) {

                                    var params = {
                                        Key: 'transformed_'+msgBody.photoKey,
                                        ContentType: mime,
                                        ContentEncoding: 'base64',
                                        Body: buffer
                                    };

                                    bucket.putObject(params, function (err, data) {
                                        if (err) {
                                            console.log(err.message, err.code);
                                            return false;
                                        }
                                        else {
                                            // Upload Successfully Finished
                                            console.log(data);
                                            console.log('>>>>>>> File Uploaded Successfully', 'Done');
                                        }
                                    });

                                })

                            });
                        });
                    } else {
                        console.error(err);
                    }
                });
                break;
            default:
                console.log("type undefind");
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