var fs = require("fs");
var amqp = require("amqplib/callback_api");
const request = require("request");

var credentials = require("./credentials.js");

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
            var exchange = "logs";

            channel.assertExchange(exchange, "fanout", {
                durable: false,
            });

            channel.assertQueue(
                "",
                {
                    exclusive: true,
                },
                function (error2, q) {
                    if (error2) {
                        throw error2;
                    }
                    console.log(
                        " [*] Waiting for messages in %s. To exit press CTRL+C",
                        q.queue
                    );
                    console.log("QUEUE: ", q.queue);
                    console.log("EXCHANGE: ", exchange);

                    channel.bindQueue(q.queue, exchange, "");

                    channel.consume(
                        q.queue,
                        function (msg) {
                            console.log(" [x] Received image");
                            fs.writeFileSync(
                                "NewUrlThumbnail.jpg",
                                msg.content
                            );
                        },
                        {
                            noAck: true,
                        }
                    );
                }
            );
        });
    });
}
