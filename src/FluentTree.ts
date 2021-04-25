/**
 * Class representing a Node in the tree
 */
class Node {
    prefix: null | number = null
    childNodes: Node[] = []
    constructor(public value: number, public level: number) {
    }
}

const ipIndex = {
    octA: 0,
    octB: 1,
    octC: 2,
    octD: 3,
    prefix: 4
}
/**
 * FluentTree module
 * @module FluentTree
 * @description Primary data structure storing current blacklisted ip addresses. It is a variant of a Radix tree to decrease depth while still maintaining an efficient lookup time
 * @property {Array} aLevelNodes Contains all values for the first ip octet
 * @method addIpAddress
 * @method insertIpAddress
 */
export class FluentTree {
    aLevelNodes: Node[] = []
    searchAvailable: boolean = true // Change this to false when removing a Node
    constructor() {
        console.log("I'm a tree")
    }
    addIpAddress(ipAddress: string): void {
        console.log(`Adding ${ipAddress}`)
        // If validation on incoming address is required, add it here
        const ipParts = this.parseIp(ipAddress)

        const node = new Node(ipParts[0], 0)
        console.log('Quickly sorting');
        this.insertIpAddress(node, this.aLevelNodes, ipParts)
    }

    removeIpAddress(ipAddress: string): void {
        console.log(`Removing ${ipAddress}`)
        // If validation on incoming address is required, add it here
        const ipParts = this.parseIp(ipAddress)
        if(this.aLevelNodes && this.aLevelNodes.length > 0) {
            let success = this.searchAndDestroy(this.aLevelNodes, ipIndex.octA, ipParts);
        }
        return
    }

    searchAndDestroy(levelNodes: Node[], levelNumber: number, ipParts: number[], nodeTuple: [number, Node][] = []): boolean {

        for (let i = 0; i < levelNodes.length; i++) {

            if (levelNodes[i].value === ipParts[levelNumber]) {
                nodeTuple.push([i, levelNodes[i]])
                if (levelNumber < ipIndex.octD) {
                    return this.searchAndDestroy(levelNodes[i].childNodes, levelNumber + 1, ipParts, nodeTuple)
                }
            }
        }

        // if it is less than 4 entries then that IP was not found so disregard removal
        if (nodeTuple.length < 4) {
            return false
        } else {
            let removed: boolean = false
            let level: number = ipIndex.octD;
            while (!removed && level > -1) {
                // if childNodes.length = zero, then remove it (go to parent and remove it from the array)
                if (nodeTuple[level][1].childNodes.length === 0) {
                    nodeTuple[level -1][1].childNodes.splice(nodeTuple[level][0], 1)

                } else {
                    // no children = zero means we can stop moving up levels
                    removed = true;
                }
                level--
            }
            return true;

        }
    }

    findIpAddress(ipAddress: string): boolean {
        // let vertexValues: number[] = []
        // Parse IP
        const ipParts = this.parseIp(ipAddress)
        // quickSearch (prefix later)
        console.log(`Finding: ${ipParts}`)
        if (this.aLevelNodes && this.aLevelNodes[0].value > ipParts[ipIndex.octA]){
            return false;
        } else {
            return this.quickSearch(this.aLevelNodes, ipIndex.octA, ipParts)
        }
    }

    insertIpAddress(currentNode: Node, currentLevelNodeList: Node[], ipParts: number[]): void {
        let nextLevel = currentNode.level + 1
        // Sort pseudocode :)
        // - non-existent array -- something has gone horribly wrong :( There is an issue to review this in the future
        if (!currentLevelNodeList) {
            console.log("This should never happen - Twilight Zone baby")
            return
        }
        // - level empty, just push new node
        if (currentLevelNodeList.length < 1) {
            currentLevelNodeList.push(currentNode)
        } else if (currentNode.value < currentLevelNodeList[0].value) {
            // - value less than first entry or greater than last entry, just add in the right place (splice 0 or push)
            currentLevelNodeList.splice(0,0, currentNode)
        } else if (currentLevelNodeList[currentLevelNodeList.length - 1].value < currentNode.value) {
            currentLevelNodeList.push(currentNode)
        } else {
            // - otherwise quick sort
            currentNode = this.quickSort(currentLevelNodeList, currentNode);
        }
        // - if not on final level than call yourself (what?)

        if (nextLevel < ipIndex.prefix) {
            const nextNode = new Node(ipParts[nextLevel], nextLevel)
            this.insertIpAddress(nextNode, currentNode.childNodes, ipParts)
        } else {
            currentNode.prefix = ipParts[ipIndex.prefix]
        }
        return;
    }

    parseIp(ipString: string): number[] {
        const ipParse = ipString.split("/")[0].split(".").map(octet => parseInt(octet));
        // Get the prefix from the end of the string and use 32 if no prefix is found
        ipParse.push(parseInt(ipString.split("/")[1]) || 32 )

        return ipParse
    }

    quickSearch(levelNodes: Node[], levelNumber: number, ipParts: number[], nodeTrail: number[] = []): boolean {
        // return of false means not found
        let found: boolean = false
        // set leftIndex = 0
        let leftIndex = 0;
        console.log(`trail: ${nodeTrail}`)
        if (ipParts[levelNumber] < levelNodes[leftIndex].value) {
            return false
        }
        // set rightIndex = length of array - 1
        let rightIndex = levelNodes.length - 1

        let nextNode!: Node;
        if (levelNodes[leftIndex].value === ipParts[levelNumber]) {
            nextNode = levelNodes[leftIndex];
        } else if (levelNodes[rightIndex].value === ipParts[levelNumber]){
            nextNode = levelNodes[rightIndex];
        } else if(ipParts[levelNumber] < levelNodes[leftIndex].value) {
            nextNode = levelNodes[leftIndex]
        } else {
            while(leftIndex < rightIndex && !found) {
                let middleIndex = Math.floor((leftIndex + rightIndex) / 2)
                if (ipParts[levelNumber] > levelNodes[rightIndex].value) {
                    // Value is higher than the highest value in the current Node array so just return it in case
                    //  it is captured by the nearest prefix :)
                    nextNode = levelNodes[rightIndex]
                    found = true
                }
                else if (ipParts[levelNumber] === levelNodes[middleIndex].value) {
                    nextNode = levelNodes[middleIndex]
                    found = true;
                } else if (levelNodes[middleIndex].value > ipParts[levelNumber]) {
                    leftIndex = middleIndex
                } else {
                    rightIndex = middleIndex
                }
            }
            if (!found) nextNode = levelNodes[leftIndex]
        }
        nodeTrail.push(nextNode.value)
        // Do it again?

        if (levelNumber < ipIndex.octD) {
            levelNumber++
            return this.quickSearch(nextNode.childNodes, levelNumber, ipParts, nodeTrail)
        } else {
            // if trail = ipParts 0 - 3 then found = true
            found = nodeTrail.reduce((acc: boolean, cv: number, index: number): boolean => {
                return (acc && (cv === ipParts[index]));
            }, true)
            if (found) {
                return true;
            } else {
                // Look at prefix
                return false;
            }
        }
    }

    quickSort(nodeList: Node[], node: Node): Node {
        // set left, right and middle index
        let leftIndex = 0;
        let rightIndex = nodeList.length - 1;
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
            let middleIndex = Math.floor((leftIndex + rightIndex) / 2)
            if (nodeList[middleIndex].value === node.value) {
                // found so let's get out of here
                return nodeList[middleIndex];
            }
            // if middle value < node value, left index = middle index otherwise right index = middle index
            if(nodeList[middleIndex].value  < node.value) {
                leftIndex = middleIndex
            } else {
                rightIndex = middleIndex
            }
        }
        // Not found, so insert it into the current Node array and return it
        nodeList.splice(leftIndex, 0, node)
        return node
    }

    walkTheTree(nodes: Node[] = this.aLevelNodes): void {
        console.log(`Length: ${nodes.length}: ${nodes}`)
        nodes.forEach(node => {
            console.log(`-- node: ${node.value}`)
        })

        if (nodes.length > 0) {nodes.forEach(node => {
            this.walkTheTree(node.childNodes)
        })}

    }
}