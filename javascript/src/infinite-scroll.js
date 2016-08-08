/*!
 * @overview es6-promise - a tiny implementation of Promises/A+.
 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
 * @license   Licensed under MIT license
 *            See https://raw.githubusercontent.com/jakearchibald/es6-promise/master/LICENSE
 * @version   3.1.2
 */

(function() {
    "use strict";
    function lib$es6$promise$utils$$objectOrFunction(x) {
      return typeof x === 'function' || (typeof x === 'object' && x !== null);
    }

    function lib$es6$promise$utils$$isFunction(x) {
      return typeof x === 'function';
    }

    function lib$es6$promise$utils$$isMaybeThenable(x) {
      return typeof x === 'object' && x !== null;
    }

    var lib$es6$promise$utils$$_isArray;
    if (!Array.isArray) {
      lib$es6$promise$utils$$_isArray = function (x) {
        return Object.prototype.toString.call(x) === '[object Array]';
      };
    } else {
      lib$es6$promise$utils$$_isArray = Array.isArray;
    }

    var lib$es6$promise$utils$$isArray = lib$es6$promise$utils$$_isArray;
    var lib$es6$promise$asap$$len = 0;
    var lib$es6$promise$asap$$vertxNext;
    var lib$es6$promise$asap$$customSchedulerFn;

    var lib$es6$promise$asap$$asap = function asap(callback, arg) {
      lib$es6$promise$asap$$queue[lib$es6$promise$asap$$len] = callback;
      lib$es6$promise$asap$$queue[lib$es6$promise$asap$$len + 1] = arg;
      lib$es6$promise$asap$$len += 2;
      if (lib$es6$promise$asap$$len === 2) {
        // If len is 2, that means that we need to schedule an async flush.
        // If additional callbacks are queued before the queue is flushed, they
        // will be processed by this flush that we are scheduling.
        if (lib$es6$promise$asap$$customSchedulerFn) {
          lib$es6$promise$asap$$customSchedulerFn(lib$es6$promise$asap$$flush);
        } else {
          lib$es6$promise$asap$$scheduleFlush();
        }
      }
    }

    function lib$es6$promise$asap$$setScheduler(scheduleFn) {
      lib$es6$promise$asap$$customSchedulerFn = scheduleFn;
    }

    function lib$es6$promise$asap$$setAsap(asapFn) {
      lib$es6$promise$asap$$asap = asapFn;
    }

    var lib$es6$promise$asap$$browserWindow = (typeof window !== 'undefined') ? window : undefined;
    var lib$es6$promise$asap$$browserGlobal = lib$es6$promise$asap$$browserWindow || {};
    var lib$es6$promise$asap$$BrowserMutationObserver = lib$es6$promise$asap$$browserGlobal.MutationObserver || lib$es6$promise$asap$$browserGlobal.WebKitMutationObserver;
    var lib$es6$promise$asap$$isNode = typeof process !== 'undefined' && {}.toString.call(process) === '[object process]';

    // test for web worker but not in IE10
    var lib$es6$promise$asap$$isWorker = typeof Uint8ClampedArray !== 'undefined' &&
      typeof importScripts !== 'undefined' &&
      typeof MessageChannel !== 'undefined';

    // node
    function lib$es6$promise$asap$$useNextTick() {
      // node version 0.10.x displays a deprecation warning when nextTick is used recursively
      // see https://github.com/cujojs/when/issues/410 for details
      return function() {
        process.nextTick(lib$es6$promise$asap$$flush);
      };
    }

    // vertx
    function lib$es6$promise$asap$$useVertxTimer() {
      return function() {
        lib$es6$promise$asap$$vertxNext(lib$es6$promise$asap$$flush);
      };
    }

    function lib$es6$promise$asap$$useMutationObserver() {
      var iterations = 0;
      var observer = new lib$es6$promise$asap$$BrowserMutationObserver(lib$es6$promise$asap$$flush);
      var node = document.createTextNode('');
      observer.observe(node, { characterData: true });

      return function() {
        node.data = (iterations = ++iterations % 2);
      };
    }

    // web worker
    function lib$es6$promise$asap$$useMessageChannel() {
      var channel = new MessageChannel();
      channel.port1.onmessage = lib$es6$promise$asap$$flush;
      return function () {
        channel.port2.postMessage(0);
      };
    }

    function lib$es6$promise$asap$$useSetTimeout() {
      return function() {
        setTimeout(lib$es6$promise$asap$$flush, 1);
      };
    }

    var lib$es6$promise$asap$$queue = new Array(1000);
    function lib$es6$promise$asap$$flush() {
      for (var i = 0; i < lib$es6$promise$asap$$len; i+=2) {
        var callback = lib$es6$promise$asap$$queue[i];
        var arg = lib$es6$promise$asap$$queue[i+1];

        callback(arg);

        lib$es6$promise$asap$$queue[i] = undefined;
        lib$es6$promise$asap$$queue[i+1] = undefined;
      }

      lib$es6$promise$asap$$len = 0;
    }

    function lib$es6$promise$asap$$attemptVertx() {
      try {
        var r = require;
        var vertx = r('vertx');
        lib$es6$promise$asap$$vertxNext = vertx.runOnLoop || vertx.runOnContext;
        return lib$es6$promise$asap$$useVertxTimer();
      } catch(e) {
        return lib$es6$promise$asap$$useSetTimeout();
      }
    }

    var lib$es6$promise$asap$$scheduleFlush;
    // Decide what async method to use to triggering processing of queued callbacks:
    if (lib$es6$promise$asap$$isNode) {
      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useNextTick();
    } else if (lib$es6$promise$asap$$BrowserMutationObserver) {
      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useMutationObserver();
    } else if (lib$es6$promise$asap$$isWorker) {
      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useMessageChannel();
    } else if (lib$es6$promise$asap$$browserWindow === undefined && typeof require === 'function') {
      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$attemptVertx();
    } else {
      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useSetTimeout();
    }
    function lib$es6$promise$then$$then(onFulfillment, onRejection) {
      var parent = this;
      var state = parent._state;

      if (state === lib$es6$promise$$internal$$FULFILLED && !onFulfillment || state === lib$es6$promise$$internal$$REJECTED && !onRejection) {
        return this;
      }

      var child = new this.constructor(lib$es6$promise$$internal$$noop);
      var result = parent._result;

      if (state) {
        var callback = arguments[state - 1];
        lib$es6$promise$asap$$asap(function(){
          lib$es6$promise$$internal$$invokeCallback(state, child, callback, result);
        });
      } else {
        lib$es6$promise$$internal$$subscribe(parent, child, onFulfillment, onRejection);
      }

      return child;
    }
    var lib$es6$promise$then$$default = lib$es6$promise$then$$then;
    function lib$es6$promise$promise$resolve$$resolve(object) {
      /*jshint validthis:true */
      var Constructor = this;

      if (object && typeof object === 'object' && object.constructor === Constructor) {
        return object;
      }

      var promise = new Constructor(lib$es6$promise$$internal$$noop);
      lib$es6$promise$$internal$$resolve(promise, object);
      return promise;
    }
    var lib$es6$promise$promise$resolve$$default = lib$es6$promise$promise$resolve$$resolve;

    function lib$es6$promise$$internal$$noop() {}

    var lib$es6$promise$$internal$$PENDING   = void 0;
    var lib$es6$promise$$internal$$FULFILLED = 1;
    var lib$es6$promise$$internal$$REJECTED  = 2;

    var lib$es6$promise$$internal$$GET_THEN_ERROR = new lib$es6$promise$$internal$$ErrorObject();

    function lib$es6$promise$$internal$$selfFulfillment() {
      return new TypeError("You cannot resolve a promise with itself");
    }

    function lib$es6$promise$$internal$$cannotReturnOwn() {
      return new TypeError('A promises callback cannot return that same promise.');
    }

    function lib$es6$promise$$internal$$getThen(promise) {
      try {
        return promise.then;
      } catch(error) {
        lib$es6$promise$$internal$$GET_THEN_ERROR.error = error;
        return lib$es6$promise$$internal$$GET_THEN_ERROR;
      }
    }

    function lib$es6$promise$$internal$$tryThen(then, value, fulfillmentHandler, rejectionHandler) {
      try {
        then.call(value, fulfillmentHandler, rejectionHandler);
      } catch(e) {
        return e;
      }
    }

    function lib$es6$promise$$internal$$handleForeignThenable(promise, thenable, then) {
       lib$es6$promise$asap$$asap(function(promise) {
        var sealed = false;
        var error = lib$es6$promise$$internal$$tryThen(then, thenable, function(value) {
          if (sealed) { return; }
          sealed = true;
          if (thenable !== value) {
            lib$es6$promise$$internal$$resolve(promise, value);
          } else {
            lib$es6$promise$$internal$$fulfill(promise, value);
          }
        }, function(reason) {
          if (sealed) { return; }
          sealed = true;

          lib$es6$promise$$internal$$reject(promise, reason);
        }, 'Settle: ' + (promise._label || ' unknown promise'));

        if (!sealed && error) {
          sealed = true;
          lib$es6$promise$$internal$$reject(promise, error);
        }
      }, promise);
    }

    function lib$es6$promise$$internal$$handleOwnThenable(promise, thenable) {
      if (thenable._state === lib$es6$promise$$internal$$FULFILLED) {
        lib$es6$promise$$internal$$fulfill(promise, thenable._result);
      } else if (thenable._state === lib$es6$promise$$internal$$REJECTED) {
        lib$es6$promise$$internal$$reject(promise, thenable._result);
      } else {
        lib$es6$promise$$internal$$subscribe(thenable, undefined, function(value) {
          lib$es6$promise$$internal$$resolve(promise, value);
        }, function(reason) {
          lib$es6$promise$$internal$$reject(promise, reason);
        });
      }
    }

    function lib$es6$promise$$internal$$handleMaybeThenable(promise, maybeThenable, then) {
      if (maybeThenable.constructor === promise.constructor &&
          then === lib$es6$promise$then$$default &&
          constructor.resolve === lib$es6$promise$promise$resolve$$default) {
        lib$es6$promise$$internal$$handleOwnThenable(promise, maybeThenable);
      } else {
        if (then === lib$es6$promise$$internal$$GET_THEN_ERROR) {
          lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$GET_THEN_ERROR.error);
        } else if (then === undefined) {
          lib$es6$promise$$internal$$fulfill(promise, maybeThenable);
        } else if (lib$es6$promise$utils$$isFunction(then)) {
          lib$es6$promise$$internal$$handleForeignThenable(promise, maybeThenable, then);
        } else {
          lib$es6$promise$$internal$$fulfill(promise, maybeThenable);
        }
      }
    }

    function lib$es6$promise$$internal$$resolve(promise, value) {
      if (promise === value) {
        lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$selfFulfillment());
      } else if (lib$es6$promise$utils$$objectOrFunction(value)) {
        lib$es6$promise$$internal$$handleMaybeThenable(promise, value, lib$es6$promise$$internal$$getThen(value));
      } else {
        lib$es6$promise$$internal$$fulfill(promise, value);
      }
    }

    function lib$es6$promise$$internal$$publishRejection(promise) {
      if (promise._onerror) {
        promise._onerror(promise._result);
      }

      lib$es6$promise$$internal$$publish(promise);
    }

    function lib$es6$promise$$internal$$fulfill(promise, value) {
      if (promise._state !== lib$es6$promise$$internal$$PENDING) { return; }

      promise._result = value;
      promise._state = lib$es6$promise$$internal$$FULFILLED;

      if (promise._subscribers.length !== 0) {
        lib$es6$promise$asap$$asap(lib$es6$promise$$internal$$publish, promise);
      }
    }

    function lib$es6$promise$$internal$$reject(promise, reason) {
      if (promise._state !== lib$es6$promise$$internal$$PENDING) { return; }
      promise._state = lib$es6$promise$$internal$$REJECTED;
      promise._result = reason;

      lib$es6$promise$asap$$asap(lib$es6$promise$$internal$$publishRejection, promise);
    }

    function lib$es6$promise$$internal$$subscribe(parent, child, onFulfillment, onRejection) {
      var subscribers = parent._subscribers;
      var length = subscribers.length;

      parent._onerror = null;

      subscribers[length] = child;
      subscribers[length + lib$es6$promise$$internal$$FULFILLED] = onFulfillment;
      subscribers[length + lib$es6$promise$$internal$$REJECTED]  = onRejection;

      if (length === 0 && parent._state) {
        lib$es6$promise$asap$$asap(lib$es6$promise$$internal$$publish, parent);
      }
    }

    function lib$es6$promise$$internal$$publish(promise) {
      var subscribers = promise._subscribers;
      var settled = promise._state;

      if (subscribers.length === 0) { return; }

      var child, callback, detail = promise._result;

      for (var i = 0; i < subscribers.length; i += 3) {
        child = subscribers[i];
        callback = subscribers[i + settled];

        if (child) {
          lib$es6$promise$$internal$$invokeCallback(settled, child, callback, detail);
        } else {
          callback(detail);
        }
      }

      promise._subscribers.length = 0;
    }

    function lib$es6$promise$$internal$$ErrorObject() {
      this.error = null;
    }

    var lib$es6$promise$$internal$$TRY_CATCH_ERROR = new lib$es6$promise$$internal$$ErrorObject();

    function lib$es6$promise$$internal$$tryCatch(callback, detail) {
      try {
        return callback(detail);
      } catch(e) {
        lib$es6$promise$$internal$$TRY_CATCH_ERROR.error = e;
        return lib$es6$promise$$internal$$TRY_CATCH_ERROR;
      }
    }

    function lib$es6$promise$$internal$$invokeCallback(settled, promise, callback, detail) {
      var hasCallback = lib$es6$promise$utils$$isFunction(callback),
          value, error, succeeded, failed;

      if (hasCallback) {
        value = lib$es6$promise$$internal$$tryCatch(callback, detail);

        if (value === lib$es6$promise$$internal$$TRY_CATCH_ERROR) {
          failed = true;
          error = value.error;
          value = null;
        } else {
          succeeded = true;
        }

        if (promise === value) {
          lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$cannotReturnOwn());
          return;
        }

      } else {
        value = detail;
        succeeded = true;
      }

      if (promise._state !== lib$es6$promise$$internal$$PENDING) {
        // noop
      } else if (hasCallback && succeeded) {
        lib$es6$promise$$internal$$resolve(promise, value);
      } else if (failed) {
        lib$es6$promise$$internal$$reject(promise, error);
      } else if (settled === lib$es6$promise$$internal$$FULFILLED) {
        lib$es6$promise$$internal$$fulfill(promise, value);
      } else if (settled === lib$es6$promise$$internal$$REJECTED) {
        lib$es6$promise$$internal$$reject(promise, value);
      }
    }

    function lib$es6$promise$$internal$$initializePromise(promise, resolver) {
      try {
        resolver(function resolvePromise(value){
          lib$es6$promise$$internal$$resolve(promise, value);
        }, function rejectPromise(reason) {
          lib$es6$promise$$internal$$reject(promise, reason);
        });
      } catch(e) {
        lib$es6$promise$$internal$$reject(promise, e);
      }
    }

    function lib$es6$promise$promise$all$$all(entries) {
      return new lib$es6$promise$enumerator$$default(this, entries).promise;
    }
    var lib$es6$promise$promise$all$$default = lib$es6$promise$promise$all$$all;
    function lib$es6$promise$promise$race$$race(entries) {
      /*jshint validthis:true */
      var Constructor = this;

      var promise = new Constructor(lib$es6$promise$$internal$$noop);

      if (!lib$es6$promise$utils$$isArray(entries)) {
        lib$es6$promise$$internal$$reject(promise, new TypeError('You must pass an array to race.'));
        return promise;
      }

      var length = entries.length;

      function onFulfillment(value) {
        lib$es6$promise$$internal$$resolve(promise, value);
      }

      function onRejection(reason) {
        lib$es6$promise$$internal$$reject(promise, reason);
      }

      for (var i = 0; promise._state === lib$es6$promise$$internal$$PENDING && i < length; i++) {
        lib$es6$promise$$internal$$subscribe(Constructor.resolve(entries[i]), undefined, onFulfillment, onRejection);
      }

      return promise;
    }
    var lib$es6$promise$promise$race$$default = lib$es6$promise$promise$race$$race;
    function lib$es6$promise$promise$reject$$reject(reason) {
      /*jshint validthis:true */
      var Constructor = this;
      var promise = new Constructor(lib$es6$promise$$internal$$noop);
      lib$es6$promise$$internal$$reject(promise, reason);
      return promise;
    }
    var lib$es6$promise$promise$reject$$default = lib$es6$promise$promise$reject$$reject;

    var lib$es6$promise$promise$$counter = 0;

    function lib$es6$promise$promise$$needsResolver() {
      throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
    }

    function lib$es6$promise$promise$$needsNew() {
      throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
    }

    var lib$es6$promise$promise$$default = lib$es6$promise$promise$$Promise;
    /**
      Promise objects represent the eventual result of an asynchronous operation. The
      primary way of interacting with a promise is through its `then` method, which
      registers callbacks to receive either a promise's eventual value or the reason
      why the promise cannot be fulfilled.

      Terminology
      -----------

      - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
      - `thenable` is an object or function that defines a `then` method.
      - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
      - `exception` is a value that is thrown using the throw statement.
      - `reason` is a value that indicates why a promise was rejected.
      - `settled` the final resting state of a promise, fulfilled or rejected.

      A promise can be in one of three states: pending, fulfilled, or rejected.

      Promises that are fulfilled have a fulfillment value and are in the fulfilled
      state.  Promises that are rejected have a rejection reason and are in the
      rejected state.  A fulfillment value is never a thenable.

      Promises can also be said to *resolve* a value.  If this value is also a
      promise, then the original promise's settled state will match the value's
      settled state.  So a promise that *resolves* a promise that rejects will
      itself reject, and a promise that *resolves* a promise that fulfills will
      itself fulfill.


      Basic Usage:
      ------------

      ```js
      var promise = new Promise(function(resolve, reject) {
        // on success
        resolve(value);

        // on failure
        reject(reason);
      });

      promise.then(function(value) {
        // on fulfillment
      }, function(reason) {
        // on rejection
      });
      ```

      Advanced Usage:
      ---------------

      Promises shine when abstracting away asynchronous interactions such as
      `XMLHttpRequest`s.

      ```js
      function getJSON(url) {
        return new Promise(function(resolve, reject){
          var xhr = new XMLHttpRequest();

          xhr.open('GET', url);
          xhr.onreadystatechange = handler;
          xhr.responseType = 'json';
          xhr.setRequestHeader('Accept', 'application/json');
          xhr.send();

          function handler() {
            if (this.readyState === this.DONE) {
              if (this.status === 200) {
                resolve(this.response);
              } else {
                reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
              }
            }
          };
        });
      }

      getJSON('/posts.json').then(function(json) {
        // on fulfillment
      }, function(reason) {
        // on rejection
      });
      ```

      Unlike callbacks, promises are great composable primitives.

      ```js
      Promise.all([
        getJSON('/posts'),
        getJSON('/comments')
      ]).then(function(values){
        values[0] // => postsJSON
        values[1] // => commentsJSON

        return values;
      });
      ```

      @class Promise
      @param {function} resolver
      Useful for tooling.
      @constructor
    */
    function lib$es6$promise$promise$$Promise(resolver) {
      this._id = lib$es6$promise$promise$$counter++;
      this._state = undefined;
      this._result = undefined;
      this._subscribers = [];

      if (lib$es6$promise$$internal$$noop !== resolver) {
        typeof resolver !== 'function' && lib$es6$promise$promise$$needsResolver();
        this instanceof lib$es6$promise$promise$$Promise ? lib$es6$promise$$internal$$initializePromise(this, resolver) : lib$es6$promise$promise$$needsNew();
      }
    }

    lib$es6$promise$promise$$Promise.all = lib$es6$promise$promise$all$$default;
    lib$es6$promise$promise$$Promise.race = lib$es6$promise$promise$race$$default;
    lib$es6$promise$promise$$Promise.resolve = lib$es6$promise$promise$resolve$$default;
    lib$es6$promise$promise$$Promise.reject = lib$es6$promise$promise$reject$$default;
    lib$es6$promise$promise$$Promise._setScheduler = lib$es6$promise$asap$$setScheduler;
    lib$es6$promise$promise$$Promise._setAsap = lib$es6$promise$asap$$setAsap;
    lib$es6$promise$promise$$Promise._asap = lib$es6$promise$asap$$asap;

    lib$es6$promise$promise$$Promise.prototype = {
      constructor: lib$es6$promise$promise$$Promise,

    /**
      The primary way of interacting with a promise is through its `then` method,
      which registers callbacks to receive either a promise's eventual value or the
      reason why the promise cannot be fulfilled.

      ```js
      findUser().then(function(user){
        // user is available
      }, function(reason){
        // user is unavailable, and you are given the reason why
      });
      ```

      Chaining
      --------

      The return value of `then` is itself a promise.  This second, 'downstream'
      promise is resolved with the return value of the first promise's fulfillment
      or rejection handler, or rejected if the handler throws an exception.

      ```js
      findUser().then(function (user) {
        return user.name;
      }, function (reason) {
        return 'default name';
      }).then(function (userName) {
        // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
        // will be `'default name'`
      });

      findUser().then(function (user) {
        throw new Error('Found user, but still unhappy');
      }, function (reason) {
        throw new Error('`findUser` rejected and we're unhappy');
      }).then(function (value) {
        // never reached
      }, function (reason) {
        // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
        // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
      });
      ```
      If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.

      ```js
      findUser().then(function (user) {
        throw new PedagogicalException('Upstream error');
      }).then(function (value) {
        // never reached
      }).then(function (value) {
        // never reached
      }, function (reason) {
        // The `PedgagocialException` is propagated all the way down to here
      });
      ```

      Assimilation
      ------------

      Sometimes the value you want to propagate to a downstream promise can only be
      retrieved asynchronously. This can be achieved by returning a promise in the
      fulfillment or rejection handler. The downstream promise will then be pending
      until the returned promise is settled. This is called *assimilation*.

      ```js
      findUser().then(function (user) {
        return findCommentsByAuthor(user);
      }).then(function (comments) {
        // The user's comments are now available
      });
      ```

      If the assimliated promise rejects, then the downstream promise will also reject.

      ```js
      findUser().then(function (user) {
        return findCommentsByAuthor(user);
      }).then(function (comments) {
        // If `findCommentsByAuthor` fulfills, we'll have the value here
      }, function (reason) {
        // If `findCommentsByAuthor` rejects, we'll have the reason here
      });
      ```

      Simple Example
      --------------

      Synchronous Example

      ```javascript
      var result;

      try {
        result = findResult();
        // success
      } catch(reason) {
        // failure
      }
      ```

      Errback Example

      ```js
      findResult(function(result, err){
        if (err) {
          // failure
        } else {
          // success
        }
      });
      ```

      Promise Example;

      ```javascript
      findResult().then(function(result){
        // success
      }, function(reason){
        // failure
      });
      ```

      Advanced Example
      --------------

      Synchronous Example

      ```javascript
      var author, books;

      try {
        author = findAuthor();
        books  = findBooksByAuthor(author);
        // success
      } catch(reason) {
        // failure
      }
      ```

      Errback Example

      ```js

      function foundBooks(books) {

      }

      function failure(reason) {

      }

      findAuthor(function(author, err){
        if (err) {
          failure(err);
          // failure
        } else {
          try {
            findBoooksByAuthor(author, function(books, err) {
              if (err) {
                failure(err);
              } else {
                try {
                  foundBooks(books);
                } catch(reason) {
                  failure(reason);
                }
              }
            });
          } catch(error) {
            failure(err);
          }
          // success
        }
      });
      ```

      Promise Example;

      ```javascript
      findAuthor().
        then(findBooksByAuthor).
        then(function(books){
          // found books
      }).catch(function(reason){
        // something went wrong
      });
      ```

      @method then
      @param {Function} onFulfilled
      @param {Function} onRejected
      Useful for tooling.
      @return {Promise}
    */
      then: lib$es6$promise$then$$default,

    /**
      `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
      as the catch block of a try/catch statement.

      ```js
      function findAuthor(){
        throw new Error('couldn't find that author');
      }

      // synchronous
      try {
        findAuthor();
      } catch(reason) {
        // something went wrong
      }

      // async with promises
      findAuthor().catch(function(reason){
        // something went wrong
      });
      ```

      @method catch
      @param {Function} onRejection
      Useful for tooling.
      @return {Promise}
    */
      'catch': function(onRejection) {
        return this.then(null, onRejection);
      }
    };
    var lib$es6$promise$enumerator$$default = lib$es6$promise$enumerator$$Enumerator;
    function lib$es6$promise$enumerator$$Enumerator(Constructor, input) {
      this._instanceConstructor = Constructor;
      this.promise = new Constructor(lib$es6$promise$$internal$$noop);

      if (Array.isArray(input)) {
        this._input     = input;
        this.length     = input.length;
        this._remaining = input.length;

        this._result = new Array(this.length);

        if (this.length === 0) {
          lib$es6$promise$$internal$$fulfill(this.promise, this._result);
        } else {
          this.length = this.length || 0;
          this._enumerate();
          if (this._remaining === 0) {
            lib$es6$promise$$internal$$fulfill(this.promise, this._result);
          }
        }
      } else {
        lib$es6$promise$$internal$$reject(this.promise, this._validationError());
      }
    }

    lib$es6$promise$enumerator$$Enumerator.prototype._validationError = function() {
      return new Error('Array Methods must be provided an Array');
    };

    lib$es6$promise$enumerator$$Enumerator.prototype._enumerate = function() {
      var length  = this.length;
      var input   = this._input;

      for (var i = 0; this._state === lib$es6$promise$$internal$$PENDING && i < length; i++) {
        this._eachEntry(input[i], i);
      }
    };

    lib$es6$promise$enumerator$$Enumerator.prototype._eachEntry = function(entry, i) {
      var c = this._instanceConstructor;
      var resolve = c.resolve;

      if (resolve === lib$es6$promise$promise$resolve$$default) {
        var then = lib$es6$promise$$internal$$getThen(entry);

        if (then === lib$es6$promise$then$$default &&
            entry._state !== lib$es6$promise$$internal$$PENDING) {
          this._settledAt(entry._state, i, entry._result);
        } else if (typeof then !== 'function') {
          this._remaining--;
          this._result[i] = entry;
        } else if (c === lib$es6$promise$promise$$default) {
          var promise = new c(lib$es6$promise$$internal$$noop);
          lib$es6$promise$$internal$$handleMaybeThenable(promise, entry, then);
          this._willSettleAt(promise, i);
        } else {
          this._willSettleAt(new c(function(resolve) { resolve(entry); }), i);
        }
      } else {
        this._willSettleAt(resolve(entry), i);
      }
    };

    lib$es6$promise$enumerator$$Enumerator.prototype._settledAt = function(state, i, value) {
      var promise = this.promise;

      if (promise._state === lib$es6$promise$$internal$$PENDING) {
        this._remaining--;

        if (state === lib$es6$promise$$internal$$REJECTED) {
          lib$es6$promise$$internal$$reject(promise, value);
        } else {
          this._result[i] = value;
        }
      }

      if (this._remaining === 0) {
        lib$es6$promise$$internal$$fulfill(promise, this._result);
      }
    };

    lib$es6$promise$enumerator$$Enumerator.prototype._willSettleAt = function(promise, i) {
      var enumerator = this;

      lib$es6$promise$$internal$$subscribe(promise, undefined, function(value) {
        enumerator._settledAt(lib$es6$promise$$internal$$FULFILLED, i, value);
      }, function(reason) {
        enumerator._settledAt(lib$es6$promise$$internal$$REJECTED, i, reason);
      });
    };
    function lib$es6$promise$polyfill$$polyfill() {
      var local;

      if (typeof global !== 'undefined') {
          local = global;
      } else if (typeof self !== 'undefined') {
          local = self;
      } else {
          try {
              local = Function('return this')();
          } catch (e) {
              throw new Error('polyfill failed because global object is unavailable in this environment');
          }
      }

      var P = local.Promise;

      if (P && Object.prototype.toString.call(P.resolve()) === '[object Promise]' && !P.cast) {
        return;
      }

      local.Promise = lib$es6$promise$promise$$default;
    }
    var lib$es6$promise$polyfill$$default = lib$es6$promise$polyfill$$polyfill;

    var lib$es6$promise$umd$$ES6Promise = {
      'Promise': lib$es6$promise$promise$$default,
      'polyfill': lib$es6$promise$polyfill$$default
    };

    /* global define:true module:true window: true */
    if (typeof define === 'function' && define['amd']) {
      define(function() { return lib$es6$promise$umd$$ES6Promise; });
    } else if (typeof module !== 'undefined' && module['exports']) {
      module['exports'] = lib$es6$promise$umd$$ES6Promise;
    } else if (typeof this !== 'undefined') {
      this['ES6Promise'] = lib$es6$promise$umd$$ES6Promise;
    }

    lib$es6$promise$polyfill$$default();
}).call(this);


/**
 * Copyright 2015 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

(function(scope) {
    
    // Number of items to instantiate beyond current view in the scroll direction.
    var RUNWAY_ITEMS = 50;
    
    // Number of items to instantiate beyond current view in the opposite direction.
    var RUNWAY_ITEMS_OPPOSITE = 10;
    
    // The number of pixels of additional length to allow scrolling to.
    var SCROLL_RUNWAY = 2000;
    
    // The animation interval (in ms) for fading in content from tombstones.
    var ANIMATION_DURATION_MS = 200;
    
    scope.InfiniteScrollerSource = function() {
    }

    scope.InfiniteScrollerSource.prototype = {
      /**
       * Fetch more items from the data source. This should try to fetch at least
       * count items but may fetch more as desired. Subsequent calls to fetch should
       * fetch items following the last successful fetch.
       * @param {number} count The minimum number of items to fetch for display.
       * @return {Promise(Array<Object>)} Returns a promise which will be resolved
       *     with an array of items.
       */
      fetch: function(count) {},
    
      /**
       * Create a tombstone element. All tombstone elements should be identical
       * @return {Element} A tombstone element to be displayed when item data is not
       *     yet available for the scrolled position.
       */
      createTombstone: function() {},
    
      /**
       * Render an item, re-using the provided item div if passed in.
       * @param {Object} item The item description from the array returned by fetch.
       * @param {?Element} element If provided, this is a previously displayed
       *     element which should be recycled for the new item to display.
       * @return {Element} The constructed element to be displayed in the scroller.
       */
      render: function(item, div) {},
    };


    /**
     * Construct an infinite scroller.
     * @param {Element} scroller The scrollable element to use as the infinite
     *     scroll region.
     * @param {InfiniteScrollerSource} source A provider of the content to be
     *     displayed in the infinite scroll region.
     */
    scope.InfiniteScroller = function(scroller, source) {
      this.anchorItem = {index: 0, offset: 0};
      this.firstAttachedItem_ = 0;
      this.lastAttachedItem_ = 0;
      this.anchorScrollTop = 0;
      this.tombstoneSize_ = 0;
      this.tombstoneWidth_ = 0;
      this.tombstones_ = [];
      this.scroller_ = scroller;
      this.source_ = source;
      this.items_ = [];
      this.loadedItems_ = 0;
      this.requestInProgress_ = false;
      this.scroller_.addEventListener('scroll', this.onScroll_.bind(this));
      window.addEventListener('resize', this.onResize_.bind(this));
    
      // Create an element to force the scroller to allow scrolling to a certain
      // point.
      this.scrollRunway_ = document.createElement('div');
      // Internet explorer seems to require some text in this div in order to
      // ensure that it can be scrolled to.
      this.scrollRunway_.textContent = ' ';
      this.scrollRunwayEnd_ = 0;
      this.scrollRunway_.style.position = 'absolute';
      this.scrollRunway_.style.height = '1px';
      this.scrollRunway_.style.width = '1px';
      this.scrollRunway_.style.transition = 'transform 0.2s';
      this.scroller_.appendChild(this.scrollRunway_);
      this.onResize_();
    }
    
    scope.InfiniteScroller.prototype = {
    
      /**
       * Called when the browser window resizes to adapt to new scroller bounds and
       * layout sizes of items within the scroller.
       */
      onResize_: function() {
        // TODO: If we already have tombstones attached to the document, it would
        // probably be more efficient to use one of them rather than create a new
        // one to measure.
        var tombstone = this.source_.createTombstone();
        tombstone.style.position = 'absolute';
        this.scroller_.appendChild(tombstone);
        tombstone.classList.remove('invisible');
        this.tombstoneSize_ = tombstone.offsetHeight;
        this.tombstoneWidth_ = tombstone.offsetWidth;
        this.scroller_.removeChild(tombstone);
    
        // Reset the cached size of items in the scroller as they may no longer be
        // correct after the item content undergoes layout.
        for (var i = 0; i < this.items_.length; i++) {
          this.items_[i].height = this.items_[i].width = 0;
        }
        this.onScroll_();
      },
    
      /**
       * Called when the scroller scrolls. This determines the newly anchored item
       * and offset and then updates the visible elements, requesting more items
       * from the source if we've scrolled past the end of the currently available
       * content.
       */
      onScroll_: function() {
        var delta = this.scroller_.scrollTop - this.anchorScrollTop;
        // Special case, if we get to very top, always scroll to top.
        if (this.scroller_.scrollTop == 0) {
          this.anchorItem = {index: 0, offset: 0};
        } else {
          this.anchorItem = this.calculateAnchoredItem(this.anchorItem, delta);
        }
        this.anchorScrollTop = this.scroller_.scrollTop;
        var lastScreenItem = this.calculateAnchoredItem(this.anchorItem, this.scroller_.offsetHeight);
        if (delta < 0)
          this.fill(this.anchorItem.index - RUNWAY_ITEMS, lastScreenItem.index + RUNWAY_ITEMS_OPPOSITE);
        else
          this.fill(this.anchorItem.index - RUNWAY_ITEMS_OPPOSITE, lastScreenItem.index + RUNWAY_ITEMS);
      },
    
      /**
       * Calculates the item that should be anchored after scrolling by delta from
       * the initial anchored item.
       * @param {{index: number, offset: number}} initialAnchor The initial position
       *     to scroll from before calculating the new anchor position.
       * @param {number} delta The offset from the initial item to scroll by.
       * @return {{index: number, offset: number}} Returns the new item and offset
       *     scroll should be anchored to.
       */
      calculateAnchoredItem: function(initialAnchor, delta) {
        if (delta == 0)
          return initialAnchor;
        delta += initialAnchor.offset;
        var i = initialAnchor.index;
        var tombstones = 0;
        if (delta < 0) {
          while (delta < 0 && i > 0 && this.items_[i - 1].height) {
            delta += this.items_[i - 1].height;
            i--;
          }
          tombstones = Math.max(-i, Math.ceil(Math.min(delta, 0) / this.tombstoneSize_));
        } else {
          while (delta > 0 && i < this.items_.length && this.items_[i].height && this.items_[i].height < delta) {
            delta -= this.items_[i].height;
            i++;
          }
          if (i >= this.items_.length || !this.items_[i].height)
            tombstones = Math.floor(Math.max(delta, 0) / this.tombstoneSize_);
        }
        i += tombstones;
        delta -= tombstones * this.tombstoneSize_;
        return {
          index: i,
          offset: delta,
        };
      },
    
      /**
       * Sets the range of items which should be attached and attaches those items.
       * @param {number} start The first item which should be attached.
       * @param {number} end One past the last item which should be attached.
       */
      fill: function(start, end) {
        this.firstAttachedItem_ = Math.max(0, start);
        this.lastAttachedItem_ = end;
        this.attachContent();
      },
    
      /**
       * Creates or returns an existing tombstone ready to be reused.
       * @return {Element} A tombstone element ready to be used.
       */
      getTombstone: function() {
        var tombstone = this.tombstones_.pop();
        if (tombstone) {
          tombstone.classList.remove('invisible');
          tombstone.style.opacity = 1;
          tombstone.style.transform = '';
          tombstone.style.transition = '';
          return tombstone;
        }
        return this.source_.createTombstone();
      },
    
      /**
       * Attaches content to the scroller and updates the scroll position if
       * necessary.
       */
      attachContent: function() {
        // Collect nodes which will no longer be rendered for reuse.
        // TODO: Limit this based on the change in visible items rather than looping
        // over all items.
        var i;
        var unusedNodes = [];
        for (i = 0; i < this.items_.length; i++) {
          // Skip the items which should be visible.
          if (i == this.firstAttachedItem_) {
            i = this.lastAttachedItem_ - 1;
            continue;
          }
          if (this.items_[i].node) {
            if (this.items_[i].node.classList.contains('infinity-scroll__tombstone')) {
              this.tombstones_.push(this.items_[i].node);
              this.tombstones_[this.tombstones_.length - 1].classList.add('invisible');
            } else {
              unusedNodes.push(this.items_[i].node);
            }
          }
          this.items_[i].node = null;
        }
    
        var tombstoneAnimations = {};
        // Create DOM nodes.
        for (i = this.firstAttachedItem_; i < this.lastAttachedItem_; i++) {
          while (this.items_.length <= i)
            this.addItem_();
          if (this.items_[i].node) {
            // if it's a tombstone but we have data, replace it.
            if (this.items_[i].node.classList.contains('infinity-scroll__tombstone') &&
                this.items_[i].data) {
              // TODO: Probably best to move items on top of tombstones and fade them in instead.
              if (ANIMATION_DURATION_MS) {
                this.items_[i].node.style.zIndex = 1;
                tombstoneAnimations[i] = [this.items_[i].node, this.items_[i].top - this.anchorScrollTop];
              } else {
                this.items_[i].node.classList.add('invisible');
                this.tombstones_.push(this.items_[i].node);
              }
              this.items_[i].node = null;
            } else {
              continue;
            }
          }
          var node = this.items_[i].data ? this.source_.render(this.items_[i].data, unusedNodes.pop()) : this.getTombstone();
          // Maybe don't do this if it's already attached?
          node.style.position = 'absolute';
          this.items_[i].top = -1;
          this.scroller_.appendChild(node);
          this.items_[i].node = node;
        }
    
        // Remove all unused nodes
        while (unusedNodes.length) {
          this.scroller_.removeChild(unusedNodes.pop());
        }
    
        // Get the height of all nodes which haven't been measured yet.
        for (i = this.firstAttachedItem_; i < this.lastAttachedItem_; i++) {
          // Only cache the height if we have the real contents, not a placeholder.
          if (this.items_[i].data && !this.items_[i].height) {
            this.items_[i].height = this.items_[i].node.offsetHeight;
            this.items_[i].width = this.items_[i].node.offsetWidth;
          }
        }
    
        // Fix scroll position in case we have realized the heights of elements
        // that we didn't used to know.
        // TODO: We should only need to do this when a height of an item becomes
        // known above.
        this.anchorScrollTop = 0;
        for (i = 0; i < this.anchorItem.index; i++) {
          this.anchorScrollTop += this.items_[i].height || this.tombstoneSize_;
        }
        this.anchorScrollTop += this.anchorItem.offset;
    
        // Position all nodes.
        var curPos = this.anchorScrollTop - this.anchorItem.offset;
        i = this.anchorItem.index;
        while (i > this.firstAttachedItem_) {
          curPos -= this.items_[i - 1].height || this.tombstoneSize_;
          i--;
        }
        while (i < this.firstAttachedItem_) {
          curPos += this.items_[i].height || this.tombstoneSize_;
          i++;
        }
        // Set up initial positions for animations.
        for (var i in tombstoneAnimations) {
          var anim = tombstoneAnimations[i];
          this.items_[i].node.style.transform = 'translateY(' + (this.anchorScrollTop + anim[1]) + 'px) scale(' + (this.tombstoneWidth_ / this.items_[i].width) + ', ' + (this.tombstoneSize_ / this.items_[i].height) + ')';
          // Call offsetTop on the nodes to be animated to force them to apply current transforms.
          this.items_[i].node.offsetTop;
          anim[0].offsetTop;
          this.items_[i].node.style.transition = 'transform ' + ANIMATION_DURATION_MS + 'ms';
        }
        for (i = this.firstAttachedItem_; i < this.lastAttachedItem_; i++) {
          var anim = tombstoneAnimations[i];
          if (anim) {
            anim[0].style.transition = 'transform ' + ANIMATION_DURATION_MS + 'ms, opacity ' + ANIMATION_DURATION_MS + 'ms';
            anim[0].style.transform = 'translateY(' + curPos + 'px) scale(' + (this.items_[i].width / this.tombstoneWidth_) + ', ' + (this.items_[i].height / this.tombstoneSize_) + ')';
            anim[0].style.opacity = 0;
          }
          if (curPos != this.items_[i].top) {
            if (!anim)
              this.items_[i].node.style.transition = '';
            this.items_[i].node.style.transform = 'translateY(' + curPos + 'px)';
          }
          this.items_[i].top = curPos;
          curPos += this.items_[i].height || this.tombstoneSize_;
        }
    
        this.scrollRunwayEnd_ = Math.max(this.scrollRunwayEnd_, curPos + SCROLL_RUNWAY)
        this.scrollRunway_.style.transform = 'translate(0, ' + this.scrollRunwayEnd_ + 'px)';
        this.scroller_.scrollTop = this.anchorScrollTop;
    
        if (ANIMATION_DURATION_MS) {
          // TODO: Should probably use transition end, but there are a lot of animations we could be listening to.
          setTimeout(function() {
            for (var i in tombstoneAnimations) {
              var anim = tombstoneAnimations[i];
              anim[0].classList.add('invisible');
              this.tombstones_.push(anim[0]);
              // Tombstone can be recycled now.
            }
          }.bind(this), ANIMATION_DURATION_MS)
        }
    
        this.maybeRequestContent();
    
      },
    
      /**
       * Requests additional content if we don't have enough currently.
       */
      maybeRequestContent: function() {
        // Don't issue another request if one is already in progress as we don't
        // know where to start the next request yet.
        if (this.requestInProgress_)
          return;
        var itemsNeeded = this.lastAttachedItem_ - this.loadedItems_;
        if (itemsNeeded <= 0)
          return;
        this.requestInProgress_ = true;
        var lastItem = this.items_[this.loadedItems_ - 1];
        this.source_.fetch(itemsNeeded).then(this.addContent.bind(this));
      },
    
      /**
       * Adds an item to the items list.
       */
      addItem_: function() {
        this.items_.push({
          'data': null,
          'node': null,
          'height': 0,
          'width': 0,
          'top': 0,
        })
      },
    
      /**
       * Adds the given array of items to the items list and then calls
       * attachContent to update the displayed content.
       * @param {Array<Object>} items The array of items to be added to the infinite
       *     scroller list.
       */
      addContent: function(items) {
        this.requestInProgress_ = false;
        var startIndex = this.items_.length;
        for (var i = 0; i < items.length; i++) {
          if (this.items_.length <= this.loadedItems_)
            this.addItem_();
          this.items_[this.loadedItems_++].data = items[i];
        }
        this.attachContent();
      }
    }
})(self);

function ContentSource() {
    // Collect template nodes to be cloned when needed.
    this.tombstone_ = document.querySelector(".infinity-scroll__templates > .infinity-scroll__item.infinity-scroll__tombstone");
    this.messageTemplate_ = document.querySelector(".infinity-scroll__templates > .infinity-scroll__item:not(.infinity-scroll__tombstone)");
    this.nextItem_ = 0;
};

/**
* Constructs a random item with a given id.
* @param {number} id An identifier for the item.
* @return {Object} A randomly generated item.
*/
function getItem(id) {
    function pickRandom(a) {
        return a[Math.floor(Math.random() * a.length)];
    }  
    return new Promise(function(resolve) {
      var item = {
        id: id,
        message: pickRandom(MESSAGES)
      }
      resolve(item);
    });
};

ContentSource.prototype = {
    fetch: function(count) {
        // Fetch at least 30 or count more objects for display.
        count = Math.max(30, count);
        return new Promise(function(resolve, reject) {
            // Assume 50 ms per item.
            setTimeout(function() {
                var items = [];
                for (var i = 0; i < Math.abs(count); i++) {
                    items[i] = getItem(this.nextItem_++);
                }
                resolve(Promise.all(items));
            }.bind(this), 1000 /* Simulated 1 second round trip time */ );
        }.bind(this));
    },
  
    createTombstone: function() {
        return this.tombstone_.cloneNode(true);
    },
  
    render: function(item, div) {
        div = div || this.messageTemplate_.cloneNode(true);
        div.dataset.id = item.id;
        div.querySelector('.infinity-scroll__content').innerHTML = item.message;
        return div;
    }

};

function numDomNodes(node) {
    if(!node.children || node.children.length == 0) {
        return 0;
    };
    var childrenCount = Array.from(node.children).map(numDomNodes);
    return node.children.length + childrenCount.reduce((p, c) => p + c, 0);
};

if (document.querySelector('.infinity-scroll')) {
    document.addEventListener('DOMContentLoaded', function() {
        window.scroller =
          new InfiniteScroller(
            document.querySelector('.infinity-scroll__list'),
            new ContentSource()
          );
    
    });
};
