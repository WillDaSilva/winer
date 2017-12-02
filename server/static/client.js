let ws = new WebSocket('ws://' + window.document.location.host);

ws.onopen = function(event) {
    ws.send(JSON.stringify({type: 'fetchChatHistory'}));
};

ws.onmessage = function(messageData) {
    let message = JSON.parse(messageData.data);
    // TODO: render message on page
};

function handleSubmitButton() {
    messageBody = getElementsByName('textBox').trim();
    if(messageBody) {
        ws.send(JSON.stringify({body: messageBody}));
    }
}
