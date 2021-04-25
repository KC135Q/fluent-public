import Express, { Request, Response} from 'express'
import { FluentTree } from "./FluentTree";
import { FluentFile} from "./FluentFile";

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const ipUrl = "https://raw.githubusercontent.com/ktsaou/blocklist-ipsets/master/firehol_level1.netset";

const addressList: string[] = [
    "33.192.24.74/30",
    "34.197.76.50",
    "34.197.76.51",
    "34.197.77.50",
    "34.206.12.234",
    "34.225.182.233",
    "35.169.58.188",
    "35.186.238.101",
    "35.187.36.248",
    "35.209.70.88",
    "35.214.186.61",
    "35.224.11.86",
    "35.226.69.129",
    "36.0.8.0/21",
    "36.37.48.0/20",
    "36.50.0.0/16",
    "36.116.0.0/16",
    "36.119.0.0/16"
]

// On start, call setup
// Setup should be called every Random (5 - 20) minutes to check the firehol file
// setup updates the Tree with new addresses and removes old ones
// express app listens for an ip check '/api/v1/ip/blocked?ipAddress=1.2.3.4

//  - returns true if blocked, false otherwise
// JSDoc... Create deployment and test

// Get File
const fluentFile = new FluentFile();
fluentFile.getCurrentFile(ipUrl);
console.log('Add', fluentFile.getAddressesToAdd())
console.log('Remove', fluentFile.getAddressesToRemove())

console.log(`Starting at ${new Date()}`)
const fluentTree = new FluentTree();
addressList.forEach(address => {
    fluentTree.addIpAddress(address)
})
console.log(`Finished at ${new Date()}`)
console.log(fluentTree.findIpAddress("34.225.182.233"))

// fluentTree.walkTheTree()
// fluentTree.removeIpAddress("33.192.24.74")
fluentTree.removeIpAddress("34.225.182.233")
console.log(fluentTree.findIpAddress("34.225.182.233"))

app.get('/api/v1/ip/blocked', (req: Request ,res: Response) => {
    let ipIsBlocked: boolean = fluentTree.findIpAddress(<string>req.query.ipAddress);
    console.log(req.query.ipAddress);
    res.status(200).send(ipIsBlocked)
});

app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});