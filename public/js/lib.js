'use strict';

var loggedInUser;
var roomName;
var counter = 0;
var $chat_window;

$(function(){
	var timeInterval;
	$("#chatSection").hide();
	var socket = io.connect('http://localhost:3000/');
	var roomName = $(".roomSelect:visible").find(":selected").text();
	$('#loginSelectBtn').click(function(event){
		loggedInUser = $("#userSelect").find(":selected").text();
		socket.emit('userJoin', {
			userName:loggedInUser,
			roomName:roomName,
			emitEvent:true
		});
	});

	$("#chatSelectBtn").click(function(event){
		var roomName = $(".roomSelect:visible").find(":selected").text();
		socket.emit('userJoin', {
			userName:loggedInUser,
			roomName:roomName,
			emitEvent:true
		});
		

		if($('.chat_window#'+roomName).length == 0) {
			$chat_window = $($('#chat_wrapper .chat_window').clone().prop('id', roomName));
			$('#chat_area').append($chat_window);	
			$('.chat_window#'+roomName).show('slow');
			$('.chat_window#'+roomName).draggable();
			$('.chat_window#'+roomName+' .title').eq(0).html(roomName);

			$('.chat_window#'+roomName+' .send_message').click(function(){
				console.log('.chat_window#' +roomName+ ' .message_input --- HELLO');
				socket.emit('sendChatMsg', {
					roomName:roomName,
					from:loggedInUser,
					msg: $('.chat_window#' +roomName+ ' .message_input').eq(0).val()
				});	
			});

			$('.chat_window#'+roomName+' .message_input').keyup(function(e){
			    if(e.keyCode == 13)
			    {
			        $('.chat_window#'+roomName+" .send_message").trigger("click");
			    }
			});
		}
		
		var users = $("#userChatSelect").find(":selected");
		var chatWith = users.map(function() { 
                                       return this.value; 
                                   }).get().join(',');


		var usersArray = []; 
		$('#userChatSelect :selected').each(function(i, selected){ 
	  		usersArray[i] = $(selected).text(); 
		});

		
		socket.emit('addUsersToChat', {
			from: [loggedInUser],
			to: usersArray,
			roomName: roomName
		});
	});

	$('#socketSelectBtn').click(function(event) {
		$("#loginSection").hide('slow');
		loggedInUser = $("#userSelect").find(":selected").text();
		$("#loggedInMsg").html('<b>'+ loggedInUser +"</b> is listening for chats now.");
		if (typeof timeInterval === 'undefined') {
			timeInterval = setInterval(function() {
			    socket.emit('userJoin', {
					userName:loggedInUser,
					emitEvent: false
				}); 
			}, 5000);
		}
	})

	socket.on('userJoinNotify', function(data) {
	
		$("#loggedInMsg").html('<b>'+ data.userName +"</b> is logged in.");
		$("#loginSection").hide('slow');

		$("#chatSection").show();
		$("#userChatSelect option[value='"+data.userName+"']").hide();

		if (typeof timeInterval === 'undefined') {
			timeInterval = setInterval(function() {
			    socket.emit('userJoin', {
					userName:loggedInUser,
					emitEvent: false
				}); 
			}, 5000);
		}
		
	});

	socket.on('sendChatMsgNotify', function(time, data) {
		
		if($('.chat_window#'+data.roomName).length == 0) {
			$chat_window = $($('#chat_wrapper .chat_window').clone().prop('id', data.roomName));
			$('#chat_area').append($chat_window);	
			$('.chat_window#'+data.roomName).show('slow');
			$('.chat_window#'+data.roomName+' .title').eq(0).html(data.roomName);
			$('.chat_window#'+data.roomName).draggable();

			$('.chat_window#'+data.roomName+" .send_message").click(function(){
				socket.emit('sendChatMsg', {
					roomName:data.roomName,
					from:loggedInUser,
					msg: $('.chat_window#' +data.roomName+ ' .message_input').eq(0).val()
				});	
			});

			$('.chat_window#'+data.roomName+' .message_input').keyup(function(e){
			    if(e.keyCode == 13)
			    {
			        $('.chat_window#'+data.roomName+' .send_message').trigger("click");
			    }
			});	

		}
		
		sendMessage (data.from, data.msg, time, data.roomName);
	});

	var message_side;
	var sendMessage;
    var message_side = 'right';


	var sendMessage = function (username, text, time, room) {
        var $messages, message;
        if (text.trim() === '') {
            return;
        }
        $('.chat_window#'+room+' .message_input').val('');
        $messages = $('.chat_window#'+room+' .messages');
        message_side = username == loggedInUser ? 'left' : 'right';
        message = new Message({
            text: text,
            message_side: message_side,
            from: username,
            time: time,
            room: room
        });
        message.draw();
        return $messages.animate({ scrollTop: $messages.prop('scrollHeight') }, 0);
    };

});

