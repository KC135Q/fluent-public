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
 * FluentTree module
 * @module FluentTree
 * @description Primary data structure storing current blacklisted ip addresses. It is a variant of a Radix tree to decrease depth while still maintaining an efficient lookup time
 * @property {Array} aLevelNodes Contains all values for the first ip octet
 * @method addIpAddress
 * @method insertIpAddress
 */
var FluentTree = /** @class */ (function () {
    function FluentTree() {
        this.aLevelNodes = [];
        this.searchAvailable = true; // Change this to false when removing a Node
        console.log("I'm a tree");
    }
    FluentTree.prototype.addIpAddress = function (ipAddress) {
        console.log("Adding " + ipAddress);
        // If validation on incoming address is required, add it here
        var ipParts = this.parseIp(ipAddress);
        var node = new Node(ipParts[0], 0);
        console.log('Quickly sorting');
        this.insertIpAddress(node, this.aLevelNodes, ipParts);
    };
    FluentTree.prototype.removeIpAddress = function (ipAddress) {
        console.log("Removing " + ipAddress);
        // If validation on incoming address is required, add it here
        var ipParts = this.parseIp(ipAddress);
        if (this.aLevelNodes && this.aLevelNodes.length > 0) {
            var success = this.searchAndDestroy(this.aLevelNodes, ipIndex.octA, ipParts);
        }
        return;
    };
    FluentTree.prototype.searchAndDestroy = function (levelNodes, levelNumber, ipParts, nodeTuple) {
        if (nodeTuple === void 0) { nodeTuple = []; }
        for (var i = 0; i < levelNodes.length; i++) {
            if (levelNodes[i].value === ipParts[levelNumber]) {
                nodeTuple.push([i, levelNodes[i]]);
                if (levelNumber < ipIndex.octD) {
                    return this.searchAndDestroy(levelNodes[i].childNodes, levelNumber + 1, ipParts, nodeTuple);
                }
            }
        }
        // if it is less than 4 entries then that IP was not found so disregard removal
        if (nodeTuple.length < 4) {
            return false;
        }
        else {
            var removed = false;
            var level = ipIndex.octD;
            while (!removed && level > -1) {
                // if childNodes.length = zero, then remove it (go to parent and remove it from the array)
                if (nodeTuple[level][1].childNodes.length === 0) {
                    nodeTuple[level - 1][1].childNodes.splice(nodeTuple[level][0], 1);
                }
                else {
                    // no children = zero means we can stop moving up levels
                    removed = true;
                }
                level--;
            }
            return true;
        }
    };
    FluentTree.prototype.findIpAddress = function (ipAddress) {
        // let vertexValues: number[] = []
        // Parse IP
        var ipParts = this.parseIp(ipAddress);
        // quickSearch (prefix later)
        console.log("Finding: " + ipParts);
        if (this.aLevelNodes && this.aLevelNodes[0].value > ipParts[ipIndex.octA]) {
            return false;
        }
        else {
            return this.quickSearch(this.aLevelNodes, ipIndex.octA, ipParts);
        }
    };
    FluentTree.prototype.insertIpAddress = function (currentNode, currentLevelNodeList, ipParts) {
        var nextLevel = currentNode.level + 1;
        // Sort pseudocode :)
        // - non-existent array -- something has gone horribly wrong :( There is an issue to review this in the future
        if (!currentLevelNodeList) {
            console.log("This should never happen - Twilight Zone baby");
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
    FluentTree.prototype.parseIp = function (ipString) {
        var ipParse = ipString.split("/")[0].split(".").map(function (octet) { return parseInt(octet); });
        // Get the prefix from the end of the string and use 32 if no prefix is found
        ipParse.push(parseInt(ipString.split("/")[1]) || 32);
        return ipParse;
    };
    FluentTree.prototype.quickSearch = function (levelNodes, levelNumber, ipParts, nodeTrail) {
        if (nodeTrail === void 0) { nodeTrail = []; }
        // return of false means not found
        var found = false;
        // set leftIndex = 0
        var leftIndex = 0;
        console.log("trail: " + nodeTrail);
        if (ipParts[levelNumber] < levelNodes[leftIndex].value) {
            return false;
        }
        // set rightIndex = length of array - 1
        var rightIndex = levelNodes.length - 1;
        var nextNode;
        if (levelNodes[leftIndex].value === ipParts[levelNumber]) {
            nextNode = levelNodes[leftIndex];
        }
        else if (levelNodes[rightIndex].value === ipParts[levelNumber]) {
            nextNode = levelNodes[rightIndex];
        }
        else if (ipParts[levelNumber] < levelNodes[leftIndex].value) {
            nextNode = levelNodes[leftIndex];
        }
        else {
            while (leftIndex < rightIndex && !found) {
                var middleIndex = Math.floor((leftIndex + rightIndex) / 2);
                if (ipParts[levelNumber] > levelNodes[rightIndex].value) {
                    // Value is higher than the highest value in the current Node array so just return it in case
                    //  it is captured by the nearest prefix :)
                    nextNode = levelNodes[rightIndex];
                    found = true;
                }
                else if (ipParts[levelNumber] === levelNodes[middleIndex].value) {
                    nextNode = levelNodes[middleIndex];
                    found = true;
                }
                else if (levelNodes[middleIndex].value > ipParts[levelNumber]) {
                    leftIndex = middleIndex;
                }
                else {
                    rightIndex = middleIndex;
                }
            }
            if (!found)
                nextNode = levelNodes[leftIndex];
        }
        nodeTrail.push(nextNode.value);
        // Do it again?
        if (levelNumber < ipIndex.octD) {
            levelNumber++;
            return this.quickSearch(nextNode.childNodes, levelNumber, ipParts, nodeTrail);
        }
        else {
            // if trail = ipParts 0 - 3 then found = true
            found = nodeTrail.reduce(function (acc, cv, index) {
                return (acc && (cv === ipParts[index]));
            }, true);
            if (found) {
                return true;
            }
            else {
                // Look at prefix
                return false;
            }
        }
    };
    FluentTree.prototype.quickSort = function (nodeList, node) {
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
