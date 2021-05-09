
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
        var msg = 'https://web-city-pages.s3.amazonaws.com/or/portland/images/760x760.jpg?v=1566263946516'
        //var msg = 'https://cdn.mos.cms.futurecdn.net/VSy6kJDNq2pSXsCzb6cvYF.jpg'

        channel.assertQueue(queue, {
            durable: false
        });
        channel.sendToQueue(queue, Buffer.from(msg));

        console.log(" [x] Sent %s", msg);
    });
    setTimeout(function () {
        connection.close();
        process.exit(0);
    }, 500);
});