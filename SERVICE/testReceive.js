var fs = require('fs');
var amqp = require('amqplib/callback_api');
const request = require('request')

var credentials = require('./credentials.js');

getThumbnail();

function getThumbnail() {
    amqp.connect(credentials.AMPQserver, function (error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel(function (error1, channel) {
            if (error1) {
                throw error1;
            }

            var queue = 'thumbnailReturn';

            channel.assertQueue(queue, {
                durable: false
            });

            channel.consume(queue, function (msg) {
                console.log(" [x] Received image");
                fs.writeFileSync('NewUrlThumbnail.jpg', msg.content);
            }, {
                noAck: true
            })
        });

    });
};


/*
        setTimeout(function () {
        connection.close();
        process.exit(0);
    }, 500);
    */