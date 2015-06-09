var util = require('util'),
    EventEmitter = require('events').EventEmitter;

var emit = EventEmitter.prototype.emit;

/**
 * Function exposed
 * @param {integer} id - The id of the player 
 * @param {Socket} socket - The `tagpro.socket` object, or an object
 *   with the same interface.
 */
var Messenger = function (id, socket) {
  EventEmitter.call(this);
  // Original event emitter.
  this._emit = emit.bind(this);
  this.socket = socket;
  this.id = id;
  socket.on("chat", function (msg) {
    if (this.validMessage(msg)) {
      // Ignore own messages.
      if (msg.from === this.id) return;
      try {
        var data = {};
        var message = JSON.parse(msg.message);
        if (!message.e) {
          throw "No event name provided.";
        } else {
          data.name = message.e;
        }
        if (typeof msg.from !== "number") {
          throw "Message is not from another player!";
        } else {
          data.player = msg.from;
        }
        data.data = message.a || null;
        this._emit(data.name, data);
      } catch (err) {
        console.warn("Error parsing communication: %o\nMessage: %o", err, msg);
      }
    }
  }.bind(this));
};

util.inherits(Messenger, EventEmitter);

module.exports = Messenger;

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
    this.socket.emit("chat", {
      message: out,
      toAll: false
    });
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
  return chat.to == "team" &&
    chat.message.length &&
    chat.message[0] == "{" &&
    chat.message[chat.message.length - 1] == "}";
};
