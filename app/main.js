var userId = localStorage.getItem('userId') || randomId();
localStorage.setItem('userId', userId);
console.log("User #" + userId);
var messagesCache;

function randomId () {
  return Math.floor( Math.random() * 1e11 );
}

var socket = io.connect('http://localhost:9292/', { 'forceNew': true });

socket.on('messages', function(data) {
  console.info(data);
  messagesCache = data;
  render();
});

function render () {
  var html = messagesCache.map(function(data, index) {
    return(`
      <form class="message" onsubmit="return likeMessage(messagesCache[${index}])">
        <div class='name'>
          ${ data.userName }
        </div>
        <a href=${ data.content.link } class='message' target='blank'>${ data.content.text }</a>
        <input type='submit' class='like-count' value='${ data.likedBy.length } likes'></input>
      </form>
    `);
  }).join(' ');
   
  document.getElementById('messages').innerHTML = html;

}

function likeMessage (message) {
  var index = message.likedBy.indexOf(userId);
  if (index < 0) {
    message.likedBy.push(userId);
  } else {
    message.likedBy.splice(index, 1);
  }
  
  socket.emit('update-message', message);
  render();
  return false;
}

function addMessage(e) {
  var payload = {
    messageId: randomId(),
    userName: document.getElementById('username').value,
    content: {
      text: document.getElementById('message').value,
      text: document.getElementById('linkAddress').value
    },
    likedBy: [],
    ts: Date.now()
  }
  
  socket.emit('new-message', payload);
  return false;
}