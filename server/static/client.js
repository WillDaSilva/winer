let ws = new WebSocket('ws://' + window.document.location.host);

ws.onopen = function(event) {
    ws.send(JSON.stringify({type: 'fetchChatHistory'}));
};

ws.onmessage = function(messageData) {
    let message = JSON.parse(messageData.data);
    let messageBox = document.getElementsById('messageBox');
    handleMessageUpdate(message)
};

let handleMessageUpdate = function(message) {
    colour = message.playerColour; // Server tells client what colour they are
    let textColour = message.colour || 'black';
    let backgroundColour = message.backgroundColour || 'rgba(255, 255, 255, 0)';
    messageBox = document.getElementById('messageBox');
    if (this.loadedHistory) {
        let messageDiv = document.createElement('div');
        messageDiv.style.color = textColour;
        messageDiv.style.backgroundColor = backgroundColour;
        messageDiv.innerHTML = message.body;
        let needToScroll =  messageBox.scrollTop + messageBox.clientHeight ===
                            messageBox.scrollHeight;
        messageBox.appendChild(messageDiv);
        if (needToScroll) {
            messageBox.scrollTop = messageBox.scrollHeight;
        }
    }
    else {
        for (historyElement of message.history) {
            let messageDiv = document.createElement('div');
            messageDiv.innerHTML = historyElement.body;
            messageDiv.style.color = historyElement.colour || 'black';
            messageDiv.style.backgroundColor = historyElement.backgroundColour || 'rgba(255, 255, 255, 0)';
            messageBox.appendChild(messageDiv);
        }
        // Scroll to the bottom of the message box
        messageBox.scrollTop = messageBox.scrollHeight;
        this.loadedHistory = true;
    }
};
handleMessageUpdate.loadedHistory = false; // Flag to indicate first call


function handleSubmitButton() {
    messageBody = getElementsByName('textBox').trim();
    if(messageBody) {
        ws.send(JSON.stringify({body: messageBody}));
    }
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('textBox').addEventListener('keypress', handleKeyPress);
});
