# Demo Microsoft QnA Chat Interface repo

This is a simple chatbot demo that pings Microsoft's QnA Maker API. Question-answer pairs are obtained from Alexa's FAQ page.

## Setup and Installation

```sh
git clone https://github.com/joeltok/qna_demo.git
yarn
cp .env.local.example .env.local
```

## Usage

### Start Backend

The backend consists of a simple http node.js server, which
1. establishes WebSocket connections from the frontend chat,
2. receives messages from these connections and relays them to the QnA Maker API,
3. receives the answers from the QnA Maker API,
4. then sends back an appropriate response to the frontend chat based on the response and confidence level from the QnA Maker API.

WebSocket is chosen over HTTP/HTTPS because its capabilities more closely mimic real life chat interface expectations. For example, in chat interfaces, it can be common for human participants to request for other chat participants to wait while they complete a task. Once a task is completed, the human participant then updates the other participants about progress. Such behaviour is easily implemented using WebSockets - and is something we make use of in one of our error-handling scenarios.

Answering rules:
1. If an answer is received, and the confidence of the answer exceeds 90, the answer is relayed to the frontend chat.
2. If an answer is received, but the confidence of the answer is less than or equal to 90, the bot simulates a fallback to a human operator.
3. If no answer is received, a server error is assumed, and a reply is returned indicating this. A callback is then invoked using setTimout to indicate to the user to try again after 2 seconds are up.

```sh
node index.js
```

### Start Frontend App

The frontend consists of a simple React app with basic chat interface. Nothing fancy.

```sh
npm start
```

Then access the page at http://localhost:3000

## Resources
- FAQ Page: https://www.amazon.com/gp/help/customer/display.html?nodeId=201602230
- Simple Bot Persona Responses: http://halo.wikia.com/wiki/343_Guilty_Spark/Quotes
