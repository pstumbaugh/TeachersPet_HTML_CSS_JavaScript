#!/usr/bin/env node
var express = require('express');
var bodyparser = require('body-parser');
var fs = require('fs');
var multer = require('multer');
var sharp = require('sharp');
var amqp = require('amqplib/callback_api');

var credentials = require('./credentials.js');


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

            sharp(msg.content.toString())
                .resize(200, 200)
                .toBuffer()
                .then(data => {
                    fs.writeFileSync('newThumbnail.png', data);
                })
                .catch(err => {
                    console.log(err);
                });

        }, {
            noAck: true
        });
    });
});