"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FluentTree = void 0;
/**
 * Class representing a Node in the tree
 */
var Node = /** @class */ (function () {
    function Node(value, level) {
        this.value = value;
        this.level = level;
        this.prefix = null;
        this.childNodes = [];
    }
    return Node;
}());
var ipIndex = {
    octA: 0,
    octB: 1,
    octC: 2,
    octD: 3,
    prefix: 4
};
/**
 * FluentTrue module
 * @module FluentTree
 * @description Primary data structure storing current blacklisted ip addresses. It is a variant of a Radix tree to decrease depth while still maintaining an efficient lookup time
 * @property {Array} aLevelNodes Contains all values for the first ip octet
 * @method addIpAddress
 * @method insertIpAddress
 */
var FluentTree = /** @class */ (function () {
    function FluentTree() {
        this.aLevelNodes = [];
        console.log("I'm a tree");
    }
    FluentTree.prototype.addIpAddress = function (ipAddress) {
        console.log("Adding " + ipAddress);
        // If validation on incoming address is required, add it here
        var ipParts = ipAddress.split("/")[0].split(".").map(function (octet) { return parseInt(octet); });
        // Get the prefix from the end of the string and use 32 if no prefix is found
        ipParts.push(parseInt(ipAddress.split("/")[1]) || 32);
        var node = new Node(ipParts[0], 0);
        this.insertIpAddress(node, this.aLevelNodes, ipParts);
    };
    FluentTree.prototype.insertIpAddress = function (currentNode, currentLevelNodeList, ipParts) {
        // console.log(ipNode)
        var nextLevel = currentNode.level + 1;
        // console.log("nextLevel", nextLevel)
        // console.log(`Level ${ipNode.level}: ${ipNode.value}`)
        // Sort pseudocode :)
        // - non-existent array -- something has gone horribly wrong :( There is an issue to review this in the future
        console.log("current level list: " + (currentLevelNodeList.length < 1 ? "empty" : "not empty"));
        if (!currentLevelNodeList) {
            console.log("This should never happen");
            return;
        }
        // - level empty, just push new node
        if (currentLevelNodeList.length < 1) {
            currentLevelNodeList.push(currentNode);
        }
        else if (currentNode.value < currentLevelNodeList[0].value) {
            // - value less than first entry or greater than last entry, just add in the right place (splice 0 or push)
            currentLevelNodeList.splice(0, 0, currentNode);
        }
        else if (currentLevelNodeList[currentLevelNodeList.length - 1].value < currentNode.value) {
            currentLevelNodeList.push(currentNode);
        }
        else {
            // - otherwise quick sort
            this.quickSort(currentLevelNodeList, currentNode);
        }
        // - if not on final level than call yourself (what?)
        if (nextLevel < ipIndex.prefix) {
            var nextNode = new Node(ipParts[nextLevel], nextLevel);
            this.insertIpAddress(nextNode, currentNode.childNodes, ipParts);
        }
        else {
            currentNode.prefix = ipParts[ipIndex.prefix];
        }
        return;
    };
    FluentTree.prototype.quickSort = function (nodeList, node) {
        console.log('Quickly sorting');
        console.log("Level: " + node.level + ", Length " + nodeList.length + ", Value: " + node.value);
        return nodeList;
    };
    FluentTree.prototype.walkTheTree = function (nodes) {
        if (nodes === void 0) { nodes = this.aLevelNodes; }
        console.log("Length: " + nodes.length + ": " + nodes);
        console.log(nodes[0].childNodes);
        console.log(nodes[0].childNodes[0].childNodes);
        console.log(nodes[0].childNodes[0].childNodes[0].childNodes);
    };
    return FluentTree;
}());
exports.FluentTree = FluentTree;
