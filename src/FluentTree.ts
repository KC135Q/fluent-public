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
 * FluentTrue module
 * @module FluentTree
 * @description Primary data structure storing current blacklisted ip addresses. It is a variant of a Radix tree to decrease depth while still maintaining an efficient lookup time
 * @property {Array} aLevelNodes Contains all values for the first ip octet
 * @method addIpAddress
 * @method insertIpAddress
 */
export class FluentTree {
    aLevelNodes: Node[] = []
    constructor() {
        console.log("I'm a tree")
    }
    addIpAddress(ipAddress: string): void {
        console.log(`Adding ${ipAddress}`)
        // If validation on incoming address is required, add it here
        const ipParts = ipAddress.split("/")[0].split(".").map(octet => parseInt(octet));
        // Get the prefix from the end of the string and use 32 if no prefix is found
        ipParts.push(parseInt(ipAddress.split("/")[1]) || 32 )
        const node = new Node(ipParts[0], 0)
        this.insertIpAddress(node, this.aLevelNodes, ipParts)
    }

    insertIpAddress(currentNode: Node, currentLevelNodeList: Node[], ipParts: number[]): void {
        // console.log(ipNode)
        let nextLevel = currentNode.level + 1
        // console.log("nextLevel", nextLevel)
        // console.log(`Level ${ipNode.level}: ${ipNode.value}`)
        // Sort pseudocode :)
        // - non-existent array -- something has gone horribly wrong :( There is an issue to review this in the future
        console.log(`current level list: ${currentLevelNodeList.length < 1 ? "empty" : "not empty"}`)
        if (!currentLevelNodeList) {
            console.log("This should never happen")
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
            this.quickSort(currentLevelNodeList, currentNode);
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


    quickSort(nodeList: Node[], node: Node): Node[] {
        console.log('Quickly sorting');
        console.log(`Level: ${node.level}, Length ${nodeList.length}, Value: ${node.value}`)
        return nodeList
    }

    walkTheTree(nodes: Node[] = this.aLevelNodes): void {
        console.log(`Length: ${nodes.length}: ${nodes}`)
        console.log(nodes[0].childNodes)
        console.log(nodes[0].childNodes[0].childNodes)
        console.log(nodes[0].childNodes[0].childNodes[0].childNodes)
    }
}