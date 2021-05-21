Thumbnail transformer service:
This service takes in an incoming image (URL or image type) as a message (through the "PatQueue" queue) through RabbitMQ. 
    It then transforms it into a thumbnail size (200x200) and sends the new image (saved as "thumbnail.jpg") as a message 
    back through RabbitMQ (in the "thumbnailTransformer" exchange). Be sure to be listening to that exchange before sending
    any pictures for processing, as if the pics aren't picked up by a listening client, they will be discared immediately. 
Basically ... send your pictures to the "PatQueue" queue. Listen to the "thumbnailTransformer" exchange to get the pictures 
    back as thumbnails. 

HOW THE SERVICE WORKS:
(service is in the "Service" folder in this repo)
1. Once a message is received from that queue, it is processed (transformed into a thumbnail, if possible)
    *- If the message is a URL or acceptable picture type, the message will be transformed to a thumbnail
    *- If the message is not transformable via the service, a generic (leopard picture) will be used in it's place
2. The new thumbnail will then be sent to the "thumbnailTransformer" exchange for pickup by a consumer.
3. If you are the consumer as well (which is expeted in most cases), assert the "thumbnailTransformer" exchange and consume messages from there (in your own queue if needed)
    *- see example of consuming from the exchange in the file named "receiveTest.js" (see below for startup instructions)
    *- be sure to only consume while you are waiting for your pictures. If you leave your consumer running, you may also get
        pics from other users who use the service after you


STARTING THE SERVICE (and the test sending and receiving services too!):
    **Service is currently running "forever" on the OSU server, public_html folder, so you should be able to use it 
(Below are instructions to test start the service, if needed)
1. Navigate into "Service" folder
2. run the thumbnail transofrmation service by entering in console: "node service.js"
    *- you may need to install node modules if needed
    *- The service will continue running until manually stopped. Please hit CTRL+C to stop service 
To Test the service, I have two js files to use:
1. In the same "SERVICE" folder, enter on console: "node sendToQueue"
    *- This will send a message to the queue "PatQueue", which the service above is looking at for incoming messsages
    *- There are multiple other messages commented out. Please feel free to test with the other messages 
2. In the same "SERVICE" folder, enter on console: "node receiveTest.js"
    *- This will consume message from the service (where the messages have been sent to the exchange).
    *- When a message is received, you'll see it save your files as "NewUrlThumbnail.jpg"