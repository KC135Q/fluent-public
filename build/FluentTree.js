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
            currentNode = this.quickSort(currentLevelNodeList, currentNode);
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
        // set left, right and middle index
        var leftIndex = 0;
        var rightIndex = nodeList.length - 1;
        // check left value = value (use that node), check right value = value (use that node)
        if (nodeList[leftIndex].value === node.value) {
            return nodeList[leftIndex];
        }
        if (nodeList[rightIndex].value === node.value) {
            return nodeList[rightIndex];
        }
        // Start while loop until found or left index = right index
        while (rightIndex > leftIndex) {
            // check middle value = value (use that node)
            var middleIndex = Math.floor((leftIndex + rightIndex) / 2);
            if (nodeList[middleIndex].value === node.value) {
                // found so let's get out of here
                return nodeList[middleIndex];
            }
            // if middle value < node value, left index = middle index otherwise right index = middle index
            if (nodeList[middleIndex].value < node.value) {
                leftIndex = middleIndex;
            }
            else {
                rightIndex = middleIndex;
            }
        }
        // Not found, so insert it into the current Node array and return it
        nodeList.splice(leftIndex, 0, node);
        return node;
    };
    FluentTree.prototype.walkTheTree = function (nodes) {
        var _this = this;
        if (nodes === void 0) { nodes = this.aLevelNodes; }
        console.log("Length: " + nodes.length + ": " + nodes);
        nodes.forEach(function (node) {
            console.log("-- node: " + node.value);
        });
        if (nodes.length > 0) {
            nodes.forEach(function (node) {
                _this.walkTheTree(node.childNodes);
            });
        }
    };
    return FluentTree;
}());
exports.FluentTree = FluentTree;
