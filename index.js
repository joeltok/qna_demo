var path = require('path')
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') });
var server = require('http').createServer();
var io = require('socket.io')(server);
var rp = require('request-promise-native');

let qnaHost = process.env.QNA_HOST;
let qnaPath = process.env.QNA_PATH;
let qnaKey = process.env.QNA_KEY;

const guiltySpark1stGreeting = "Greetings. I am the Monitor of Installation 04. I am 343 Guilty Spark."
const guiltySpark2ndGreeting = "I can help you to answer any questions related to Alexa."
// const smartAlecAddons = ["I am a genius. Hehehehe."]
const notRecognizedAnswer = ["I'm afraid I have not been programmed to answer that question. Let me contact a human operator for you."]
const guiltySparkServerDown = ["Pardon me. A plasma conduit breach in Section 5-5-2-4 has disrupted power flow to a gravity maintenance assembly. Repairs require my attention. I will return soon.", "Odd. That wasn't supposed to happen. Something has happened to my internal circuits. Give me a moment."]
const guiltySparkPromptToTryAgain = ["Okay, please try again."]

Array.prototype.sample = function () {
  return this[Math.floor(Math.random()*this.length)]
}

io.on('connection', (client) => {

  // send a hi enquiry
  console.log('client connected')
  client.emit('greeting', guiltySpark1stGreeting);
  setTimeout(function() {
    client.emit('greeting', guiltySpark2ndGreeting);
  }, 1500)


  client.on('question', (data) => {
    console.log(`question: ${data}`)

    // send the message to the QnA api
    rp({
      method: 'POST',
      uri: qnaHost + qnaPath,
      headers: {
        'Ocp-Apim-Subscription-Key': qnaKey,
        'Content-Type': 'application/json',
      },
      body: {
        question: data
      },
      json: true,
      resolveWithFullResponse: true
    })
    .then(({statusCode, body}) => {
      if (statusCode === 200) {
        body.answers.forEach((answer) => {
          if (answer.score > 90) {
            client.emit('answer', answer.answer);
          } else {
            client.emit('answer', notRecognizedAnswer.sample())
          }
        })
      } else {
        client.emit('answer', guiltySparkServerDown.sample())
        setTimeout(function() {
          client.emit('answer', guiltySparkPromptToTryAgain.sample());
        }, 2000)
      }
    })
    .catch((err) => {
      console.log(err)
    })

  });
  client.on('disconnect', () => {
    console.log(`${client} disconnected`)
  });
});
server.listen(9000, () => {
  console.log('Server listening on port 9000')
});
