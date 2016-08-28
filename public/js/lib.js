var socket = io.connect('http://localhost:3000/');

var loggedInUser;
var roomName;
var counter = 0;


$(function(){
	var timeInterval;
	socket.on('userJoinNotify', function(data) {
	
		$("#loggedInMsg").html('<b>'+ data.userName +"</b> logged in to <b>" + data.roomName + "</b>");
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
			$chat_window = $($('.chat_window').clone().prop('id', data.roomName));
			$('#chat_area').append($chat_window);	
			$('.chat_window#'+data.roomName).show('slow');
			$('.chat_window#'+data.roomName+' .title').eq(0).html(data.roomName);
			$('.chat_window#'+data.roomName).draggable();

			$('.chat_window#'+data.roomName+" .send_message").click(function(){
				socket.emit('sendChatMsg', {
					roomName:data.roomName,
					from:loggedInUser,
					msg: $(".message_input").eq(0).val()
				});	
			});

			$('.chat_window#'+data.roomName+' .message_input').keyup(function(e){
			    if(e.keyCode == 13)
			    {
			        $('.chat_window#'+data.roomName+" .send_message").trigger("click");
			    }
			});	

		}
			
			
		
		
		sendMessage (data.from, data.msg, time, data.roomName);
	});

	var getMessageText, message_side, sendMessage;
    var message_side = 'right';
    var getMessageText = function () {
        var $message_input;
        $message_input = $('.message_input');
        return $message_input.val();
    };
	var sendMessage = function (username, text, time, room) {
        var $messages, message;
        if (text.trim() === '') {
            return;
        }
        $('.message_input').val('');
        $messages = $('.messages');
        message_side = username == loggedInUser ? 'left' : 'right';
        message = new Message({
            text: text,
            message_side: message_side,
            from: username,
            time: time,
            room: room
        });
        message.draw();
       // return message;
        return $messages.animate({ scrollTop: $messages.prop('scrollHeight') }, 300);
    };

	$("#chatSection").hide();
	$('#loginSelectBtn').click(function(event){
		loggedInUser = $("#userSelect").find(":selected").text();
		roomName = $("#roomSelect").find(":selected").text();
		socket.emit('userJoin', {
			userName:loggedInUser,
			roomName:roomName,
			emitEvent:true
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


	$("#chatSelectBtn").click(function(event){
		$("#chatSection").hide('slow');
		


		if($('.chat_window#'+roomName).length == 0) {
			$chat_window = $($('.chat_window').clone().prop('id', roomName));
			$('#chat_area').append($chat_window);	
			$('.chat_window#'+roomName).show('slow');
			$('.chat_window#'+roomName).draggable();
			$('.chat_window#'+roomName+' .title').eq(0).html(roomName);

			$('.chat_window#'+roomName+" .send_message").click(function(){
				socket.emit('sendChatMsg', {
					roomName:roomName,
					from:loggedInUser,
					msg: $(".message_input").eq(0).val()
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


});

