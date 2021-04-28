/**
 * Class representing a Node in the tree
 */
class Node {
  prefix: null | number = null;
  childNodes: Node[] = [];
  constructor(public value: number, public level: number) {}
}

const ipIndex = {
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
export class FluentTree {
  aLevelNodes: Node[] = [];
  // searchAvailable: boolean = true; // Change this to false when removing a Node
  constructor() {
    console.log("I'm a tree :)");
  }

  /**
    - addIpAddress
    @description 
    @method addIpAddress
    @param
    @returns
   */
  addIpAddress(ipAddress: string): void {
    console.log(`Adding ${ipAddress}`);
    // If validation on incoming address is required, add it here
    const ipParts = this.parseIp(ipAddress);

    // Check for NaN
    if (ipParts[0] != ipParts[0]) {
      return;
    }
    const node = new Node(ipParts[0], 0);
    console.log(`Quickly sorting ${ipParts}`);
    this.insertIpAddress(node, this.aLevelNodes, ipParts);
  }

  /**
    - removeIpAddress
    @description 
    @method removeIpAddress
    @param
    @returns
   */
  removeIpAddress(ipAddress: string): void {
    console.log(`Removing ${ipAddress}`);
    // If validation on incoming address is required, add it here
    const ipParts = this.parseIp(ipAddress);
    if (this.aLevelNodes && this.aLevelNodes.length > 0) {
      this.searchAndDestroy(this.aLevelNodes, ipIndex.octA, ipParts, -1);
    }
    return;
  }

  /**
    - searchAndDestroy
    @description 
    @method searchAndDestroy
    @param
    @returns
   */
  searchAndDestroy(
    levelNodes: Node[],
    levelNumber: number,
    ipParts: number[],
    levelAIndex: number,
    nodeTuple: [number, Node][] = []
  ): boolean {
    for (let i = 0; i < levelNodes.length; i++) {
      if (levelNodes[i].value === ipParts[levelNumber]) {
        if (levelNumber === ipIndex.octA) {
          levelAIndex = i;
        }
        nodeTuple.push([i, levelNodes[i]]);
        if (levelNumber < ipIndex.prefix) {
          return this.searchAndDestroy(
            levelNodes[i].childNodes,
            levelNumber + 1,
            ipParts,
            levelAIndex,
            nodeTuple
          );
        }
      }
    }

    // if it is less than 4 entries then that IP was not found so disregard removal
    if (nodeTuple.length < 4) {
      return false;
    } else {
      let removed: boolean = false;
      let level: number = ipIndex.octD;
      while (!removed && level > ipIndex.octA) {
        // if childNodes.length = zero, then remove it (go to parent and remove it from the array)
        if (nodeTuple[level][1].childNodes.length === 0) {
          nodeTuple[level - 1][1].childNodes.splice(nodeTuple[level][0], 1);
        } else {
          // no children = zero means we can stop moving up levels
          removed = true;
        }
        level = level - 1;
      }
      // special case for level a nodes :)
      let sneezing = 0;
      if (
        levelAIndex > -1 &&
        this.aLevelNodes[levelAIndex].childNodes.length === 0
      ) {
        this.aLevelNodes.splice(levelAIndex, 1);
      }

      return true;
    }
  }

  /**
   *  findIpAddress
   *  @description - Accepts an ipv4 address as a string and returns a boolean. The
   *    return is true if the ip is found in the list (so block it) or false if it isn't
   *  @param {string} ipAddress - the ipv4 address being checked (as a string)
   *  @return {boolean} - true if found in the list, false if not
   */
  findIpAddress(ipAddress: string): boolean {
    try {
      // Use ipParts to turn the ip string into an array representing dotted decimal values and prefix
      const ipParts = this.parseIp(ipAddress);
      // Console logs for testing purposes - remove before production
      console.log(`Finding: ${ipParts}`);
      if (
        this.aLevelNodes &&
        this.aLevelNodes[0].value > ipParts[ipIndex.octA]
      ) {
        return false;
      } else {
        return this.quickSearch(this.aLevelNodes, ipIndex.octA, ipParts);
      }
    } catch (error) {
      console.log(error);
      // Nothing in the list so nothing blocked at this point in time
      return false;
    }
  }

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
  insertIpAddress(
    currentNode: Node,
    currentLevelNodeList: Node[],
    ipParts: number[]
  ): void {
    let nextLevel = currentNode.level + 1;
    // Sort pseudocode :)
    // - non-existent array -- something has gone horribly wrong :( There is an issue to review this in the future
    if (!currentLevelNodeList) {
      console.log('This should never happen - Twilight Zone baby');
      return;
    }
    // - level empty, so new node gets pushed
    if (currentLevelNodeList.length < 1) {
      currentLevelNodeList.push(currentNode);
    } else if (currentNode.value < currentLevelNodeList[0].value) {
      // - value less than first entry or greater than last entry, just add in the right place (splice 0 or push)
      currentLevelNodeList.splice(0, 0, currentNode);
    } else if (
      currentLevelNodeList[currentLevelNodeList.length - 1].value <
      currentNode.value
    ) {
      currentLevelNodeList.push(currentNode);
    } else {
      // - otherwise quick sort
      currentNode = this.quickSort(currentLevelNodeList, currentNode);
    }
    // - if not on final level than call yourself (what?)

    if (nextLevel < ipIndex.prefix) {
      const nextNode = new Node(ipParts[nextLevel], nextLevel);
      this.insertIpAddress(nextNode, currentNode.childNodes, ipParts);
    } else {
      currentNode.prefix = ipParts[ipIndex.prefix];
    }
    return;
  }

  /**
   * parseIp - converts an ipv4 address from string format to array of each dotted decimal section
   *   and the prefix
   * @method parseIp
   * @param  {string} ipString - ipv4 address in string format with prefix
   * @return {number<Array>} - array in the form of [dotted-decimal, dotted-decimal, dotted-decimal, dotted-decimal, prefix]. Default prefix (if none is passed in) is 32
   * @example - These are sent in from the ip file on GitHub
   * ipString of "5.44.248.0/21" returns [5, 44, 24, 0, 21]
   */
  parseIp(ipString: string): number[] {
    const ipParse = ipString
      // dotted decimal portion is the first (zero) index of the split string
      .split('/')[0]
      .split('.')
      .map((dottedDecimal) => parseInt(dottedDecimal));
    // Get the prefix from the end of the string and use 32 if no prefix is found
    ipParse.push(parseInt(ipString.split('/')[1]) || 32);

    return ipParse;
  }

  /**
    - quickSearch
    @description 
    @method quickSearch
    @param
    @returns
   */
  quickSearch(
    levelNodes: Node[],
    levelNumber: number,
    ipParts: number[],
    nodeTrail: number[] = []
  ): boolean {
    // Used for CIDR range determination later on - based on lowest possible ip match
    //  in the blocked list, not the one sent in for checking
    let trailPrefix: null | number = null;
    // return of false means not found
    let found: boolean = false;
    // set leftIndex = 0
    let leftIndex = 0;
    if (
      ipParts[levelNumber] > 255 ||
      ipParts[levelNumber] < levelNodes[leftIndex].value
    ) {
      return false;
    }
    // set rightIndex = length of array - 1
    let rightIndex = levelNodes.length - 1;
    // nextNode will be used to
    let nextNode!: Node;
    if (levelNodes[leftIndex].value === ipParts[levelNumber]) {
      nextNode = levelNodes[leftIndex];
    } else if (levelNodes[rightIndex].value === ipParts[levelNumber]) {
      nextNode = levelNodes[rightIndex];
    } else if (ipParts[levelNumber] < levelNodes[leftIndex].value) {
      nextNode = levelNodes[leftIndex];
    } else {
      while (leftIndex < rightIndex && !found) {
        let middleIndex = Math.floor((leftIndex + rightIndex) / 2);

        if (ipParts[levelNumber] > levelNodes[rightIndex].value) {
          // Value is higher than the highest value in the current Node array so just return it in case
          //  it is captured by the nearest prefix :)
          nextNode = levelNodes[rightIndex];
          found = true;
        } else if (ipParts[levelNumber] === levelNodes[middleIndex].value) {
          nextNode = levelNodes[middleIndex];
          found = true;
        } else if (levelNodes[middleIndex].value < ipParts[levelNumber]) {
          leftIndex = middleIndex;
        } else {
          rightIndex = middleIndex;
        }
      }

      if (!found) nextNode = levelNodes[leftIndex];

      if (levelNumber >= ipIndex.octD) {
        trailPrefix = nextNode.prefix || null;
      }
    }
    nodeTrail.push(nextNode.value);
    // Do it again?

    if (levelNumber < ipIndex.octD) {
      levelNumber++;
      return this.quickSearch(
        nextNode.childNodes,
        levelNumber,
        ipParts,
        nodeTrail
      );
    } else {
      // if trail = ipParts 0 - 3 then found = true
      found = nodeTrail.reduce(
        (acc: boolean, cv: number, index: number): boolean => {
          return acc && cv === ipParts[index];
        },
        true
      );
      if (!found && trailPrefix) {
        if (ipParts.length > 4) ipParts.pop();
        // Add prefix check here
        let addressesRequired = ipParts.reduce((acc, cv, idx, ary) => {
          return (
            (cv - nodeTrail[idx]) * Math.pow(256, ary.length - 1 - idx) + acc
          );
        }, 0);
        let calculatedPrefix =
          addressesRequired === 1
            ? 31
            : 32 - Math.ceil(Math.log2(addressesRequired));
        if (calculatedPrefix >= trailPrefix) found = true;
      }
      return found;
    }
  }

  /**
    - quickSort
    @description 
    @method quickSort
    @param
    @returns
   */
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
      let middleIndex = Math.floor((leftIndex + rightIndex) / 2);
      if (nodeList[middleIndex].value === node.value) {
        // found so let's get out of here
        return nodeList[middleIndex];
      }
      // if middle value < node value, left index = middle index otherwise right index = middle index
      if (nodeList[middleIndex].value < node.value) {
        leftIndex = middleIndex;
      } else {
        rightIndex = middleIndex;
      }
    }
    // Not found, so insert it into the current Node array and return it
    nodeList.splice(leftIndex, 0, node);
    return node;
  }

  /**
    - isAddressInRange
    @description 
    @method isAddressInRange
    @param
    @returns
   */
  isAddressInRange(
    ipToCheck: number[],
    ipBase: number[],
    prefix: null | number
  ): boolean {
    return true;
  }

  /**
    - walkTheTree
    @description 
    @method walkTheTree
    @param
    @returns
   */
  walkTheTree(nodes: Node[] = this.aLevelNodes): void {
    let listOfNodeValues = nodes.reduce(
      (acc: string, cv: Node) => acc + cv.value + ' ',
      ''
    );
    console.log(`Length: ${nodes.length}: ${listOfNodeValues}`);
    nodes.forEach((node) => {
      console.log(`-- node: ${node.value}`);
    });

    if (nodes.length > 0) {
      nodes.forEach((node) => {
        this.walkTheTree(node.childNodes);
      });
    }
  }
}
