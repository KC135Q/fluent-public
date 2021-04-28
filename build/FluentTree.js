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
    prefix: 4,
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
    // searchAvailable: boolean = true; // Change this to false when removing a Node
    function FluentTree() {
        this.aLevelNodes = [];
        console.log("I'm a tree :)");
    }
    /**
      - addIpAddress
      @description
      @method addIpAddress
      @param
      @returns
     */
    FluentTree.prototype.addIpAddress = function (ipAddress) {
        console.log("Adding " + ipAddress);
        // If validation on incoming address is required, add it here
        var ipParts = this.parseIp(ipAddress);
        // Check for NaN
        if (ipParts[0] != ipParts[0]) {
            return;
        }
        var node = new Node(ipParts[0], 0);
        console.log("Quickly sorting " + ipParts);
        this.insertIpAddress(node, this.aLevelNodes, ipParts);
    };
    /**
      - removeIpAddress
      @description
      @method removeIpAddress
      @param
      @returns
     */
    FluentTree.prototype.removeIpAddress = function (ipAddress) {
        console.log("Removing " + ipAddress);
        // If validation on incoming address is required, add it here
        var ipParts = this.parseIp(ipAddress);
        if (this.aLevelNodes && this.aLevelNodes.length > 0) {
            this.searchAndDestroy(this.aLevelNodes, ipIndex.octA, ipParts, -1);
        }
        return;
    };
    /**
      - searchAndDestroy
      @description
      @method searchAndDestroy
      @param
      @returns
     */
    FluentTree.prototype.searchAndDestroy = function (levelNodes, levelNumber, ipParts, levelAIndex, nodeTuple) {
        if (nodeTuple === void 0) { nodeTuple = []; }
        for (var i = 0; i < levelNodes.length; i++) {
            if (levelNodes[i].value === ipParts[levelNumber]) {
                if (levelNumber === ipIndex.octA) {
                    levelAIndex = i;
                }
                nodeTuple.push([i, levelNodes[i]]);
                if (levelNumber < ipIndex.prefix) {
                    return this.searchAndDestroy(levelNodes[i].childNodes, levelNumber + 1, ipParts, levelAIndex, nodeTuple);
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
            while (!removed && level > ipIndex.octA) {
                // if childNodes.length = zero, then remove it (go to parent and remove it from the array)
                if (nodeTuple[level][1].childNodes.length === 0) {
                    nodeTuple[level - 1][1].childNodes.splice(nodeTuple[level][0], 1);
                }
                else {
                    // no children = zero means we can stop moving up levels
                    removed = true;
                }
                level = level - 1;
            }
            // special case for level a nodes :)
            var sneezing = 0;
            if (levelAIndex > -1 &&
                this.aLevelNodes[levelAIndex].childNodes.length === 0) {
                this.aLevelNodes.splice(levelAIndex, 1);
            }
            return true;
        }
    };
    /**
     *  findIpAddress
     *  @description - Accepts an ipv4 address as a string and returns a boolean. The
     *    return is true if the ip is found in the list (so block it) or false if it isn't
     *  @param {string} ipAddress - the ipv4 address being checked (as a string)
     *  @return {boolean} - true if found in the list, false if not
     */
    FluentTree.prototype.findIpAddress = function (ipAddress) {
        try {
            // Use ipParts to turn the ip string into an array representing dotted decimal values and prefix
            var ipParts = this.parseIp(ipAddress);
            // Console logs for testing purposes - remove before production
            console.log("Finding: " + ipParts);
            if (this.aLevelNodes &&
                this.aLevelNodes[0].value > ipParts[ipIndex.octA]) {
                return false;
            }
            else {
                return this.quickSearch(this.aLevelNodes, ipIndex.octA, ipParts);
            }
        }
        catch (error) {
            console.log(error);
            // Nothing in the list so nothing blocked at this point in time
            return false;
        }
    };
    /**
      @method insertIpAddress
      @description Uses the value of the current dotted decimal section (aka octet level).
        General approach is if it is less than the first then splice, the first in the array or
        greater than the last, then push. Otherwise, use a QuickSort algorithm to put it in the
        proper location with a Splice method
      @param {Node} currentNode - Node that has the value of the current octet level
      @param {Node<Array>} currentLevelNodeList - Array of nodes at the current octet level
      @param {number<Array>} ipParts - Array of dotted decimal values for each of the four octet levels
     */
    FluentTree.prototype.insertIpAddress = function (currentNode, currentLevelNodeList, ipParts) {
        var nextLevel = currentNode.level + 1;
        // Sort pseudocode :)
        // - non-existent array -- something has gone horribly wrong :( There is an issue to review this in the future
        if (!currentLevelNodeList) {
            console.log('This should never happen - Twilight Zone baby');
            return;
        }
        // - level empty, so new node gets pushed
        if (currentLevelNodeList.length < 1) {
            currentLevelNodeList.push(currentNode);
        }
        else if (currentNode.value < currentLevelNodeList[0].value) {
            // - value less than first entry or greater than last entry, just add in the right place (splice 0 or push)
            currentLevelNodeList.splice(0, 0, currentNode);
        }
        else if (currentLevelNodeList[currentLevelNodeList.length - 1].value <
            currentNode.value) {
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
    /**
     * parseIp - converts an ipv4 address from string format to array of each dotted decimal section
     *   and the prefix
     * @method parseIp
     * @param  {string} ipString - ipv4 address in string format with prefix
     * @return {number<Array>} - array in the form of [dotted-decimal, dotted-decimal, dotted-decimal, dotted-decimal, prefix]. Default prefix (if none is passed in) is 32
     * @example - These are sent in from the ip file on GitHub
     * ipString of "5.44.248.0/21" returns [5, 44, 24, 0, 21]
     */
    FluentTree.prototype.parseIp = function (ipString) {
        var ipParse = ipString
            // dotted decimal portion is the first (zero) index of the split string
            .split('/')[0]
            .split('.')
            .map(function (dottedDecimal) { return parseInt(dottedDecimal); });
        // Get the prefix from the end of the string and use 32 if no prefix is found
        ipParse.push(parseInt(ipString.split('/')[1]) || 32);
        return ipParse;
    };
    /**
      - quickSearch
      @description
      @method quickSearch
      @param
      @returns
     */
    FluentTree.prototype.quickSearch = function (levelNodes, levelNumber, ipParts, nodeTrail) {
        if (nodeTrail === void 0) { nodeTrail = []; }
        // Used for CIDR range determination later on - based on lowest possible ip match
        //  in the blocked list, not the one sent in for checking
        var trailPrefix = null;
        // return of false means not found
        var found = false;
        // set leftIndex = 0
        var leftIndex = 0;
        if (ipParts[levelNumber] > 255 ||
            ipParts[levelNumber] < levelNodes[leftIndex].value) {
            return false;
        }
        // set rightIndex = length of array - 1
        var rightIndex = levelNodes.length - 1;
        // nextNode will be used to
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
                else if (levelNodes[middleIndex].value < ipParts[levelNumber]) {
                    leftIndex = middleIndex;
                }
                else {
                    rightIndex = middleIndex;
                }
            }
            if (!found)
                nextNode = levelNodes[leftIndex];
            if (levelNumber >= ipIndex.octD) {
                trailPrefix = nextNode.prefix || null;
            }
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
                return acc && cv === ipParts[index];
            }, true);
            if (!found && trailPrefix) {
                if (ipParts.length > 4)
                    ipParts.pop();
                // Add prefix check here
                var addressesRequired = ipParts.reduce(function (acc, cv, idx, ary) {
                    return ((cv - nodeTrail[idx]) * Math.pow(256, ary.length - 1 - idx) + acc);
                }, 0);
                var calculatedPrefix = addressesRequired === 1
                    ? 31
                    : 32 - Math.ceil(Math.log2(addressesRequired));
                if (calculatedPrefix >= trailPrefix)
                    found = true;
            }
            return found;
        }
    };
    /**
      - quickSort
      @description
      @method quickSort
      @param
      @returns
     */
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
    /**
      - isAddressInRange
      @description
      @method isAddressInRange
      @param
      @returns
     */
    FluentTree.prototype.isAddressInRange = function (ipToCheck, ipBase, prefix) {
        return true;
    };
    /**
      - walkTheTree
      @description
      @method walkTheTree
      @param
      @returns
     */
    FluentTree.prototype.walkTheTree = function (nodes) {
        var _this = this;
        if (nodes === void 0) { nodes = this.aLevelNodes; }
        var listOfNodeValues = nodes.reduce(function (acc, cv) { return acc + cv.value + ' '; }, '');
        console.log("Length: " + nodes.length + ": " + listOfNodeValues);
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
