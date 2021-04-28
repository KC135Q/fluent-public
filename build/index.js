"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var FluentTree_1 = require("./FluentTree");
var FluentFile_1 = require("./FluentFile");
var app = express_1.default();
var PORT = 8080;
var quickStart = 0; // 0 or 1 -- multiply in Timer to quickstart when not t
var ipTestUrl = 'https://raw.githubusercontent.com/KC135Q/ip-lists/master/addresses.netset';
var ipTestUrl2 = 'https://raw.githubusercontent.com/KC135Q/ip-lists/master/addresses3.netset';
var ipUrl = 'https://raw.githubusercontent.com/ktsaou/blocklist-ipsets/master/firehol_level1.netset';
var fluentFile = new FluentFile_1.FluentFile();
var fluentTree = new FluentTree_1.FluentTree();
/**
  Uses the test file to get a sample of the ip address list.
  This will be moved to a test before going to production with the code.
  @function getFirstIp
  @params none
  @return none
 */
function getFirstIp() {
    return __awaiter(this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, fluentFile.getCurrentFile(ipTestUrl)];
                case 1:
                    _a.sent();
                    // Check to see if the file date has changed. No need to process the file if it hasn't
                    if (fluentFile.lastUpdated !== fluentFile.currentDate) {
                        // Get an array of addresses that are no longer on the list and remove them from the tree
                        fluentFile.getAddressesToRemove().forEach(function (address) {
                            console.log("Remove " + address);
                            fluentTree.removeIpAddress(address);
                        });
                        // Get an array of addresses that are new to the list and add them to the tree
                        fluentFile.getAddressesToAdd().forEach(function (address) {
                            console.log("Add " + address);
                            fluentTree.addIpAddress(address);
                        });
                        // Move the current address list to the 'previous' list to compare to for adding and removing
                        //  next time.
                        fluentFile.archiveAddresses();
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.warn(error_1);
                    return [3 /*break*/, 3];
                case 3:
                    startIpUpdate();
                    return [2 /*return*/];
            }
        });
    });
}
/**
 *   @description Uses a random interval between 5 minutes
 *   @function startIpUpdate
 *   @params none
 */
function startIpUpdate() {
    var _this = this;
    try {
        setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        process.stdout.write('.');
                        return [4 /*yield*/, fluentFile.getCurrentFile(ipTestUrl2)];
                    case 1:
                        _a.sent();
                        // Only process the file if the udpated date line has changed
                        if (fluentFile.lastUpdated !== fluentFile.currentDate) {
                            fluentFile.getAddressesToRemove().forEach(function (address) {
                                console.log("Remove " + address);
                                fluentTree.removeIpAddress(address);
                            });
                            fluentFile.getAddressesToAdd().forEach(function (address) {
                                console.log("Add " + address);
                                fluentTree.addIpAddress(address);
                            });
                            // Move this address list to 'previous' list so we can use it to compare the new list to
                            //  on the next import
                            fluentFile.archiveAddresses();
                        }
                        // do it again (like, forever...)
                        startIpUpdate();
                        return [2 /*return*/];
                }
            });
        }); }, Math.floor(Math.random() * 9000) + 3000);
    }
    catch (error) {
        console.warn(error);
    }
}
/**
 * Route checking to see if the provided ip address is blocked..
 * @name get/api/v1/ip/blocked
 * @param {string} path - Express path
 * @param {string} ipAddress - Query parameter in ipv4 format
 * @example - Localhost example
 * // returns true if ip
 * https://localhost:8080/api/v1/ip/blocked?ipAddress=5.5.5.17
 * @param {callback} middleware - Express middleware.
 */
app.get('/api/v1/ip/blocked', function (req, res) {
    // Validate ip address here
    console.log("Getting address " + req.query.ipAddress);
    // Key action in the app - calls findIpAddress and passes the ipv4 address to it
    var ipIsBlocked = fluentTree.findIpAddress(req.query.ipAddress);
    console.log("Is " + req.query.ipAddress + " blocked?", ipIsBlocked);
    res.status(200).json({ blocked: ipIsBlocked });
});
/**
 * Express 'walk' route to show some of the tree structure
 * @description
 * @name get/walk
 * @param
 * @returns
 */
app.get('/walk', function (req, res) {
    fluentTree.walkTheTree();
    res.status(200).json({ message: 'Walk complete' });
});
app.get('/test', function (req, res) {
    var testArray = [
        '0.0.0.0',
        '1.10.16.0',
        '1.19.0.0',
        '1.32.128.0',
        '2.56.192.0',
        '2.58.176.0',
        '2.59.200.0',
        '3.90.198.217',
        '5.44.248.0',
        '5.57.208.0',
        '5.63.155.65',
        '5.79.79.211',
        '5.134.128.0',
        '5.157.84.170',
        '5.172.176.0',
        '5.180.4.0',
        '5.180.102.147',
        '5.183.60.0',
        '5.188.10.0',
        '5.188.206.0',
    ].forEach(function (element) {
        console.log("Testing element " + element);
        console.log(fluentTree.findIpAddress(element));
    });
    res.status(200).json({ message: 'hello, world' });
});
app.listen(PORT, function () {
    console.log("\u26A1\uFE0F[server]: Server is running at https://localhost:" + PORT);
});
getFirstIp();
