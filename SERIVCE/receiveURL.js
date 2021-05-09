#!/usr/bin/env node
var express = require('express');
var bodyparser = require('body-parser');
var fs = require('fs');
var sharp = require('sharp');
const fetch = require('node-fetch');
var multer = require('multer');
var amqp = require('amqplib/callback_api');
var https = require('https');
const request = require('request')

var credentials = require('./credentials.js');


makeThumbnail()

function makeThumbnail() {
    amqp.connect(credentials.AMPQserver, function (error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel(function (error1, channel) {
            if (error1) {
                throw error1;
            }

            var queue = 'thumbnail';

            channel.assertQueue(queue, {
                durable: false
            });

            console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

            channel.consume(queue, function (msg) {
                console.log(" [x] Received %s", msg.content.toString());

                var url = msg.content.toString()
                path = "./urlImage.jpg"

                saveImageToDisk(url, path)



            }, {
                noAck: true
            });
        });
    });
}


//Node.js Function to save image from External URL.
function saveImageToDisk(url, localPath) {
    var fullUrl = url;
    var file = fs.createWriteStream(localPath);
    var request = https.get(url, function (response) {
        response.pipe(file);
    });
    sharp('./urlImage.jpg')
        .resize(200, 200)
        .toBuffer()
        .then(data => {
            fs.writeFileSync('urlThumbnail.jpg', data);
            console.log("thumbnail created successfully!");
        })
        .catch(err => {
            console.log(err);
        });
}


async function download(url, path) {
    const response = await fetch(url);
    const buffer = await response.buffer();
    fs.writeFile(path, buffer, () => {
    });
    console.log('finished downloading!');
}
