#!/usr/bin/env node
var fs = require("fs");
var sharp = require("sharp");
const fetch = require("node-fetch");
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

                    var url = msg.content.toString();
                    path = "./urlImage.png";

                    saveImageToDisk(url, path);
                },
                {
                    noAck: true,
                }
            );
        });
    });
}

//Node.js Function to save image from External URL.
function saveImageToDisk(url, localPath) {
    var file = fs.createWriteStream(localPath);
    var request = https.get(url, function (response) {
        response.pipe(file);
        file.on("close", () =>
            sharp("./urlImage.png")
                .resize(200, 200)
                .toBuffer()
                .then((data) => {
                    fs.writeFileSync("urlThumbnail.jpg", data);
                    console.log("thumbnail created successfully!");
                    sendThumbnailToQueue();
                })
                .catch((err) => {
                    console.log(err);
                })
        );
    });
}

function sendThumbnailToQueue() {
    amqp.connect(credentials.AMPQserver, function (error0, newConnection) {
        if (error0) {
            throw error0;
        }
        newConnection.createChannel(function (error1, channel) {
            if (error1) {
                throw error1;
            }
            var queue = "getFromThumbnailQueue";

            fs.readFile("./urlThumbnail.jpg", function (err, data) {
                if (err) throw err; // Fail if the file can't be read.

                channel.assertQueue(queue, {
                    durable: true,
                });
                channel.sendToQueue(queue, Buffer.from(data));

                console.log(' [x] Sent image to "thumbnailReturn" queue');
                return;
            });
        });
    });
}
