var Message;
Message = function (arg) {
    this.text = arg.text, this.message_side = arg.message_side, this.from = arg.from, this.time = arg.time, this.room = arg.room;
    this.draw = function (_this) {
        return function () {
            var $message;
            $message = $($('#chat_wrapper .message_template').clone().html());
            $message.addClass(_this.message_side).find('.text').html(_this.text);
            $message.find('.sender').html(_this.from+' ['+this.time+']');
            $('.chat_window#'+this.room+' .messages').append($message);
            return setTimeout(function () {
                return $message.addClass('appeared');
            }, 0);
        };
    }(this);
    return this;
};
