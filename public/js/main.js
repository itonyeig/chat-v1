const chatForm = document.getElementById('chat-form')
const chatMessageS = document.querySelector('.chat-messages')
const roomName = document.getElementById('room-name')
const userList = document.getElementById('users')

//get username and room from URL
const { username, room } = Qs.parse(location.search, {ignoreQueryPrefix: true})


const socket = io()


//join chatroom
socket.emit('joinRoom', { username, room })

//Get room and users 
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room)
    roomUsers(users)
})


//message from server
socket.on('message', (message) => {
  console.log(message);
  outputMessage(message)

  // scroll down everytime a new message comes in
    chatMessageS.scrollTop = chatMessageS.scrollHeight;
})

//eventListner for submisstion of messgae
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  //to get test input
  const msg = e.target.elements.msg.value

  
  //send message to server
  socket.emit('chatMessage', msg)

  //clear input box
  e.target.elements.msg.value=''
  e.target.elements.msg.focus();
})

// Output message to DOM
const outputMessage = (message) => {
    const div = document.createElement('div')
    div.classList.add('message')
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
	<p class="text">
		${message.text}
	</p>`;
    //whenever we create a message, it should add a new div to chat-messages
    document.querySelector('.chat-messages').appendChild(div)

}


//Add room name to DOM
const outputRoomName = (room) => {
    roomName.innerHTML = room;
}

//Add Users to Dom
const roomUsers = (users) => {
    userList.innerHTML = `
        ${users.map(user => `<li>${user.username}</li>`).join('')}
    `
}


