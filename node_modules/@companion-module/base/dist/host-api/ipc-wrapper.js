"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IpcWrapper = void 0;
const tslib_1 = require("tslib");
const util_js_1 = require("../util.js");
const ejson_1 = tslib_1.__importDefault(require("ejson"));
const MAX_CALLBACK_ID = 1 << 28;
class IpcWrapper {
    #handlers;
    #sendMessage;
    #defaultTimeout;
    #nextCallbackId = 1;
    #pendingCallbacks = new Map();
    constructor(handlers, sendMessage, defaultTimeout) {
        this.#handlers = handlers;
        this.#sendMessage = sendMessage;
        this.#defaultTimeout = defaultTimeout;
    }
    async sendWithCb(name, msg, defaultResponse, timeout = 0) {
        if (timeout <= 0)
            timeout = this.#defaultTimeout;
        const callbacks = { timeout: undefined, resolve: () => null, reject: () => null };
        const promise = new Promise((resolve, reject) => {
            callbacks.resolve = resolve;
            callbacks.reject = reject;
        });
        // Reset the id when it gets really high
        if (this.#nextCallbackId > MAX_CALLBACK_ID)
            this.#nextCallbackId = 1;
        const id = this.#nextCallbackId++;
        this.#pendingCallbacks.set(id, callbacks);
        this.#sendMessage({
            direction: 'call',
            name: String(name),
            payload: ejson_1.default.stringify(msg),
            callbackId: id,
        });
        // Setup a timeout, creating the error in the call, so that the stack trace is useful
        const timeoutError = new Error('Call timed out');
        callbacks.timeout = setTimeout(() => {
            callbacks.reject(defaultResponse ? defaultResponse() : timeoutError);
            this.#pendingCallbacks.delete(id);
        }, timeout);
        return promise;
    }
    sendWithNoCb(name, msg) {
        this.#sendMessage({
            direction: 'call',
            name: String(name),
            payload: ejson_1.default.stringify(msg),
            callbackId: undefined,
        });
    }
    receivedMessage(msg) {
        const rawMsg = msg;
        switch (msg.direction) {
            case 'call': {
                const handler = this.#handlers[msg.name];
                if (!handler) {
                    if (msg.callbackId) {
                        this.#sendMessage({
                            direction: 'response',
                            callbackId: msg.callbackId,
                            success: false,
                            payload: ejson_1.default.stringify({ message: `Unknown command "${msg.name}"` }),
                        });
                    }
                    return;
                }
                // TODO - should anything be logged here?
                const data = msg.payload ? ejson_1.default.parse(msg.payload) : undefined;
                handler(data).then((res) => {
                    if (msg.callbackId) {
                        this.#sendMessage({
                            direction: 'response',
                            callbackId: msg.callbackId,
                            success: true,
                            payload: ejson_1.default.stringify(res),
                        });
                    }
                }, (err) => {
                    if (msg.callbackId) {
                        this.#sendMessage({
                            direction: 'response',
                            callbackId: msg.callbackId,
                            success: false,
                            payload: err instanceof Error ? JSON.stringify(err, Object.getOwnPropertyNames(err)) : ejson_1.default.stringify(err),
                        });
                    }
                });
                break;
            }
            case 'response': {
                if (!msg.callbackId) {
                    console.error(`Ipc: Response message has no callbackId`);
                    return;
                }
                const callbacks = this.#pendingCallbacks.get(msg.callbackId);
                this.#pendingCallbacks.delete(msg.callbackId);
                if (!callbacks) {
                    // Likely timed out, we should ignore
                    return;
                }
                clearTimeout(callbacks.timeout);
                const data = msg.payload ? ejson_1.default.parse(msg.payload) : undefined;
                if (msg.success) {
                    callbacks.resolve(data);
                }
                else {
                    let err = data;
                    if (data && typeof data === 'object' && 'message' in data) {
                        err = new Error(data.message);
                        if (data.stack)
                            err.stack = data.stack;
                    }
                    callbacks.reject(err);
                }
                break;
            }
            default:
                (0, util_js_1.assertNever)(msg);
                console.error(`Ipc: Message of unknown direction "${rawMsg.direction}"`);
                break;
        }
    }
}
exports.IpcWrapper = IpcWrapper;
//# sourceMappingURL=ipc-wrapper.js.map