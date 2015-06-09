# TagPro Bot Talk

This library facilitates communication between bots for the game TagPro. Load with your favorite CommonJS or AMD loader, or include/`@include` the script directly into your page/userscript and access the functions using the exposed `BotMessenger` object.

To start, you need to initialize the `BotMessenger`. The constructor takes the game socket (or socket-like object) to communicate over.

```javascript
var messenger = new BotMessenger(tagpro.socket);
```

To send a message, just `emit` an event:

```javascript
messenger.emit('gotpup', { x: 14, y: 5, type: 1 });
```

Use `on` to listen for messages:

```javascript
messenger.on('gotpup', function (event) {
    
})
```

`BotMessenger` inherits from [`EventEmitter`](https://nodejs.org/api/events.html#events_class_events_eventemitter), so check out that documentation for additional methods and details. The only deviation is in the exception-handling cases listed below.

Messages passed to the callback include the following keys in addition to the ones passed:
* `name` {string} the name of the event that occurred.
* `player` {integer} the id of the player that sent the message.
* `time` {integer} ms timestamp corresponding to the time that the message was received.
* `data` {*} the data associated with the event, or `null` if no data was passed.

The chat protocol is especially 
If a message exceeds 71 characters, an exception is thrown.

If a message includes a prohibited key, an exception is thrown.

If a 
