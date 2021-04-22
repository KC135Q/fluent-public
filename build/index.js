"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FluentTree_1 = require("./FluentTree");
var addressList = [
    "34.197.76.50",
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
console.log("Starting at " + new Date());
var fluentTree = new FluentTree_1.FluentTree();
addressList.forEach(function (address) {
    fluentTree.addIpAddress(address);
});
console.log("Finished at " + new Date());
fluentTree.walkTheTree();
