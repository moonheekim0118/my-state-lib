'use strict';

var react = require('react');

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol */


var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

var Store = /** @class */ (function () {
    function Store(initialState) {
        var _this = this;
        this.listeners = new Set();
        this.getState = function () {
            return _this.state;
        };
        this.setState = function (newState) {
            _this.state = __assign(__assign({}, _this.state), (typeof newState === "function" ? newState(_this.state) : newState));
            _this.notify();
        };
        this.subscribe = function (listener) {
            _this.listeners.add(listener);
            return function () {
                _this.listeners.delete(listener);
            };
        };
        this.notify = function () {
            _this.listeners.forEach(function (listener) { return listener(); });
        };
        this.state = initialState;
    }
    return Store;
}());
var createStore = function (initialState) {
    var store = new Store(initialState);
    var useStore = function (selector) {
        if (selector === void 0) { selector = function (state) { return state; }; }
        return react.useSyncExternalStore(store.subscribe, function () {
            return selector(store.getState());
        });
    };
    return {
        useStore: useStore,
        getState: store.getState,
        setState: store.setState,
    };
};

exports.createStore = createStore;
