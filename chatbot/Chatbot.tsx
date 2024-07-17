import React from 'react';
import { Widget } from 'rasa-webchat';

function Chatbot() {
  return (
    <div>
      <Widget
        initPayload="/greet"
        socketUrl="http://localhost:5055"
        socketPath="/socket.io/"
        customData={{ language: "fr" }}
        title="Chatbot"
        subtitle=""
      />
    </div>
  );
}

export default Chatbot;
