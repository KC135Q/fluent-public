class Node {
    prefix: null | number = null
    childNodes: Node[] = []
    constructor(public value: number, public level: number) {
    }
}

export class FluentTree {
    constructor() {
        console.log("I'm a tree")
    }
    addIpAddress(ipAddress: string): void {

    }

    insertIpAddress(ipAddress: string): void {
        return;
    }
}