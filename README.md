# TagPro Bot Talk

This library facilitates communication between bots for the game TagPro.

## Usage

To use in a userscript, add

```
// @require https://raw.githubusercontent.com/chrahunt/tagpro-bot-talk/master/dist/messenger.js
```

to your header and access the library using the global `BotMessenger` object. You may also include the script directly in a page, where it will behave the same (creating a `BotMessenger` global).

The library can also be used as an AMD/CommonJS module. Download or `npm install tagpro-bot-talk` and `require('tagpro-bot-talk')` for CommonJS or add as a dependency to your `define` or `require` calls in AMD.

To start, you need to initialize the `BotMessenger`. The constructor takes the id of the current player, and the game socket (or socket-like object) to be communicated over.

```javascript
var messenger = new BotMessenger(tagpro.playerId, tagpro.socket);
```

To send a message, just `emit` an event:

```javascript
messenger.emit('gotpup', { x: 14, y: 5, type: 1 });
```

**Careful**: if the resulting message exceeds 71 characters, an exception is thrown.

Use `on` to listen for messages:

```javascript
messenger.on('gotpup', function (event) {
  var location = {
    x: event.data.x,
    y: event.data.y
  };
  var type = event.data.type;
  var whoSawIt = event.player;
});
```

Messages passed to the listener function are an object with the following properties:
* `name` {string} the name of the event that occurred.
* `player` {integer} the id of the player that sent the message.
* `data` {*} the data associated with the event, or `null` if no data was passed.

`BotMessenger` inherits from [`EventEmitter`](https://nodejs.org/api/events.html#events_class_events_eventemitter), so check out that documentation for additional methods and details (`removeListener` and `once` may be helpful). The only deviation is in the exception-handling case mentioned below.

## Development

1. Download the repository.
2. `npm install` to install development dependencies.
3. `npm install -g gulp` if gulp is not installed.
4. `gulp watch` for build and quick rebuilds to `build`.
5. `gulp build-prod` for building final version to `dist`.
