"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FluentTree = void 0;
var Node = /** @class */ (function () {
    function Node(value, level) {
        this.value = value;
        this.level = level;
        this.prefix = null;
        this.childNodes = [];
    }
    return Node;
}());
var FluentTree = /** @class */ (function () {
    function FluentTree() {
        console.log("I'm a tree");
    }
    FluentTree.prototype.addIpAddress = function (ipAddress) {
    };
    FluentTree.prototype.insertIpAddress = function (ipAddress) {
        return;
    };
    return FluentTree;
}());
exports.FluentTree = FluentTree;
