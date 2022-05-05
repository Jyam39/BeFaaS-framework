const lib = require('@befaas/lib')
const {PubSub} = require('@google-cloud/pubsub');


module.exports = lib.serverless.rpcHandler(async (request, ctx) => {
  //null -> include all attributes; 2 -> format using 2 spaces
  console.log("Request: \n" + JSON.stringify(request));
  console.log("Context: \n" + JSON.stringify(ctx));
  console.log("All Vars:" +  JSON.stringify(process.env))
  
  //Build event 
  var topicName = request.fun  
  console.log("topic name is: " + topicName)
  
  var data = JSON.stringify(request.event, null, 2);
  if (data.length == 0) {
	  data = "no message"
  }
  
  const pubSubClient = new PubSub();
  
  async function publishMessage() {
    const dataBuffer = Buffer.from(data);
    const customAttributes = {
      contextId: ctx.contextId,
      xPair: ctx.xPair,
    };

	
    try {
      const messageId = await pubSubClient
        .topic(topicName)
        .publish(dataBuffer, customAttributes);
      console.log(`Message ${messageId} published.`);
    } catch (error) {
      console.error(`Received error while publishing: ${error.message}`);
      process.exitCode = 1;
    }
  }
  await publishMessage();
  
  //Respond ok  
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      result: 'ok',
    }),
  }  
})