"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiException = void 0;
class ApiException extends Error {
    constructor(code, body) {
        super("HTTP-Code: " + code + "\nMessage: " + JSON.stringify(body));
        this.code = code;
        this.body = body;
    }
}
exports.ApiException = ApiException;
//# sourceMappingURL=exception.js.map