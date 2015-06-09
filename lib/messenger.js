var util = require('util'),
    EventEmitter = require('events').EventEmitter;

var emit = EventEmitter.prototype.emit;

/**
 * Messenger re
 * @param {Socket} socket - The 
 */
var Messenger = function (socket) {
  EventEmitter.call(this);
  // Original event emitter.
  this._emit = emit.bind(this);
  this.socket = socket;
  socket.on("chat", function (msg) {
    if (this.validMessage(msg)) {
      try {
        var data = {};
        var message = JSON.parse(message);
        if (!message.e) {
          throw "No event name provided.";
        } else {
          data.name = message.e;
        }
        if (typeof message.from !== "number") {
          throw "Message is not from another player!";
        } else {
          data.player = message.from;
        }
        data.data = message.a || null;
        this._emit(data.name, data);
      } catch (err) {
        console.warn("Error parsing communication: %o\nMessage: %o", err, msg);
      }
    }
  }.bind(this));
};

util.inherits(BotMessenger, EventEmitter);

/**
 * Send a named event to any listening bots. Throws an exception if
 * the resulting text is over 71 characters.
 * @param {string} name - The name of the event to send.
 * @param {*} [data] - The data to send, optional.
 * @return {Messenger} - The messenger, for chaining.
 */
Messenger.prototype.emit = function(name, data) {
  var message = {
    e: name
  };
  if (typeof data !== "undefined") {
    message.a = data;
  }
  var out = JSON.stringify(message);
  if (out.length > 71) {
    throw "Message too long!";
  } else {
    this.socket.emit("chat", out);
  }
};

/**
 * Checks whether the provided chat is a valid bot communication
 * message.
 * @private
 * @param {ChatObject} chat - The chat object received.
 * @return {boolean} - Whether this is a valid bot communication.
 */
Messenger.prototype.validMessage = function(chat) {
  return msg.to == "team" &&
    msg.message.length &&
    msg.message[0] == "{" &&
    msg.message[msg.message.length - 1] == "}";
};
