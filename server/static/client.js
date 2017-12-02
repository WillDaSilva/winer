var xhttp = new XMLHttpRequest();
function sendMessage(){

}
function handleSubmitButton(){
    var message = JSON.stringify({body:getElementsByName('textBox').trim()});
    if(message != "{}"){
        xhttp.open("POST","/message",true);
        xhttp.send(message);
        }
    }
}
