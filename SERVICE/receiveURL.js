#!/usr/bin/env node
var fs = require("fs");
var sharp = require("sharp");
var amqp = require("amqplib/callback_api");
var https = require("https");

var credentials = require("./credentials.js");

makeThumbnail();

function makeThumbnail() {
    amqp.connect(credentials.AMPQserver, function (error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel(function (error1, channel) {
            if (error1) {
                throw error1;
            }

            var queue = "sendToThumbnailServiceQueue";

            channel.assertQueue(queue, {
                durable: true,
            });

            console.log(
                " [*] Waiting for messages in %s. To exit press CTRL+C",
                queue
            );

            channel.consume(
                queue,
                function (msg) {
                    console.log(" [x] Received %s", msg.content.toString());

                    //get our image
                    var imageToProcess = msg.content.toString();
                    localPath = "./urlImage.jpg"; //where we are going to temporarily save the image

                    //find out the type of image and route it to the correct transformer service
                    if (imageToProcess.includes("http") == true) {
                        console.log(" # Image is a URL");
                        saveImageFromURL(imageToProcess, localPath);
                    } else if (
                        //if the image is one of the acceptable sharp format files:
                        imageToProcess.includes(".jpg") == true ||
                        imageToProcess.includes(".jpeg") == true ||
                        imageToProcess.includes(".png") == true ||
                        imageToProcess.includes(".webp") == true ||
                        imageToProcess.includes(".avif") == true ||
                        imageToProcess.includes(".tiff") == true ||
                        imageToProcess.includes(".gif") == true ||
                        imageToProcess.includes(".svg") == true
                    ) {
                        console.log(" # Image is an acceptable picture file");
                        saveImageAcceptablePic(imageToProcess, localPath);
                    } else {
                        //not a url or acceptable format, sending back a generic
                        console.log(
                            " # Image is not able to process, sending generic thumbnail"
                        );
                        saveImageGeneric(imageToProcess, localPath);
                    }
                 
                    localPath = "";
                    imageToProcess = "";
                },
                {
                    noAck: true,
                }
            );
        });
    });
}

//saves an image from a URL and sends it to queue
function saveImageFromURL(url, localPath) {
    var file = fs.createWriteStream(localPath, { flags: "w" });
    var request = https.get(url, function (response) {
        response.pipe(file);
        file.on("close", () =>
            sharp(localPath)
                .resize(200, 200) //thumbnail size
                .toBuffer()
                .then((data) => {
                    fs.writeFileSync("thumbnail.jpg", data);
                    console.log("URL - thumbnail created successfully!");
                    sendThumbnailToQueue(); //send it to the queue
                })
                //error handle:
                .catch((err) => {
                    console.log(err);
                })
        );
    });
}

//saves an "acceptable file format" for local images and sends it to queue
function saveImageAcceptablePic(imageToProcess, localPath) {
    sharp(imageToProcess)
        .resize(200, 200) //thumbnail size
        .toBuffer()
        .then((data) => {
            fs.writeFileSync("thumbnail.jpg", data);
            console.log("Accp Image - thumbnail created successfully!");
            sendThumbnailToQueue(); //send it to the queue
        });
}

//saves a generic image and sends it to the rabbitMQ queue.
function saveImageGeneric(url, localPath) {
    sharp("./generic.jpg")
        .resize(200, 200) //thumbnail size
        .toBuffer()
        .then((data) => {
            fs.writeFileSync("thumbnail.jpg", data);
            console.log("!! GENERIC !! thumbnail created successfully!");
            //send it to the queue
            sendThumbnailToQueue();
        });
}

//takes the saved local thumbnail image ("thumbnail.jpg") and sends it to the rabbitmq queue
function sendThumbnailToQueue() {
    //connect to server
    amqp.connect(credentials.AMPQserver, function (error0, newConnection) {
        if (error0) {
            throw error0;
        }
        //create a new channel
        newConnection.createChannel(function (error1, channel) {
            if (error1) {
                throw error1;
            }
            //setup our queue
            var queue = "getFromThumbnailQueue";
            //read the file and send it to the queue
            fs.readFile("./thumbnail.jpg", function (err, data) {
                if (err) throw err; // Fail if the file can't be read.
                channel.assertQueue(queue, {
                    durable: true,
                });
                channel.sendToQueue(queue, Buffer.from(data)); //send it to queue
                console.log(' [x] Sent image to "thumbnailReturn" queue');
                return;
            });
        });
    });
}
