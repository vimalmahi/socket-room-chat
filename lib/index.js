
var app = require('./../');
var addUser = require('./events/addUser')
var dateFormat = require('dateformat');

// usernames which are currently connected to the chat
var roomInfo = []; // Need to fetch room information from DB, every time when the server is started.

module.exports = {
	init: function() {
		var io = app.io;
		app.io.sockets.on('connection', function(socket){

			socket.on('userJoin', function(data) {
				if (data.emitEvent) {
					socket.emit('userJoinNotify', data);
				}
				
				userName = data.userName;
				if (typeof roomInfo[userName] == "undefined") {
					roomInfo[userName] = [];
				}
				roomInfo[userName].forEach(function(room){
					socket.join(room);
				});
			});

			socket.on('addUsersToChat', function(data) {
				var roomName = data.roomName;
				socket.room = roomName;
				socket.username = data.from[0];//.concat(data.to);
				socket.join(roomName); 
				
				//Push all users to room
				var usersToRoom = data.to.concat(data.from[0]);
				usersToRoom.forEach(function(user){
					
					//If user is already present in server & not available in room; add the user to roomInfo
					if (typeof roomInfo[user] != "undefined" && roomInfo[user].indexOf(roomName) === -1 ) {
						roomInfo[user].push(roomName);

					//If user is not present in the server yet; add the user to the server and then to roomInfo
					} else if (typeof roomInfo[user] == "undefined") {
						roomInfo[user] = [];
						roomInfo[user].push(roomName);
					
					// For all other conditions	
					} else {
						//Do nothing
					}
					
				});

			});

			socket.on('sendChatMsg', function(data){
				var now = new Date();
				console.log(roomInfo);
				io.sockets.in(data.roomName).emit('sendChatMsgNotify', dateFormat(new Date()), data);
				
			});


			// when the client emits 'sendchat', this listens and executes
			socket.on('typing', function (data) {
				// we tell the client to execute 'updatechat' with 2 parameters
				socket.broadcast.to(socket.room).emit('typing', socket.username, ' is typing');
			})

			socket.on('typingStop', function (data) {
				// we tell the client to execute 'updatechat' with 2 parameters
				socket.broadcast.to(socket.room).emit('typingStop', socket.username);
			})


			// when the user disconnects.. perform this
			socket.on('disconnect', function(){
				// remove the username from global usernames list
				/*delete usernames[socket.username];
				// update list of users in chat, client-side
				io.sockets.emit('updateusers', usernames);
				// echo globally that this client has left
				socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
				socket.leave(socket.room);*/
			});

		});
	}
}