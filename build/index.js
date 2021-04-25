"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FluentTree_1 = require("./FluentTree");
var FluentFile_1 = require("./FluentFile");
var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var ipUrl = "https://raw.githubusercontent.com/ktsaou/blocklist-ipsets/master/firehol_level1.netset";
var addressList = [
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
];
// On start, call setup
// Setup should be called every Random (5 - 20) minutes to check the firehol file
// setup updates the Tree with new addresses and removes old ones
// express app listens for an ip check '/api/v1/ip/blocked?ipAddress=1.2.3.4
//  - returns true if blocked, false otherwise
// JSDoc... Create deployment and test
// Get File
var fluentFile = new FluentFile_1.FluentFile();
fluentFile.getCurrentFile(ipUrl);
console.log('Add', fluentFile.getAddressesToAdd());
console.log('Remove', fluentFile.getAddressesToRemove());
console.log("Starting at " + new Date());
var fluentTree = new FluentTree_1.FluentTree();
addressList.forEach(function (address) {
    fluentTree.addIpAddress(address);
});
console.log("Finished at " + new Date());
console.log(fluentTree.findIpAddress("34.225.182.233"));
// fluentTree.walkTheTree()
// fluentTree.removeIpAddress("33.192.24.74")
fluentTree.removeIpAddress("34.225.182.233");
console.log(fluentTree.findIpAddress("34.225.182.233"));
app.get('/api/v1/ip/blocked', function (req, res) {
    var ipIsBlocked = fluentTree.findIpAddress(req.query.ipAddress);
    console.log(req.query.ipAddress);
    res.status(200).send(ipIsBlocked);
});
app.listen(PORT, function () {
    console.log("\u26A1\uFE0F[server]: Server is running at https://localhost:" + PORT);
});
