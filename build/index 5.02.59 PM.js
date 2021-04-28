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
var PORT = process.env.PORT || 8080;
var ipUrl = 'https://raw.githubusercontent.com/ktsaou/blocklist-ipsets/master/firehol_level1.netset';
var fluentFile = new FluentFile_1.FluentFile();
var fluentTree = new FluentTree_1.FluentTree();
// JSDoc... Create deployment and test
function startIpUpdate() {
    // Get the seed addresses and start the clock
    var _this = this;
    setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    process.stdout.write('.');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, fluentFile.getCurrentFile(ipUrl)];
                case 2:
                    _a.sent();
                    if (fluentFile.lastUpdated !== fluentFile.currentDate) {
                        fluentFile.getAddressesToRemove().forEach(function (address) {
                            console.log("Remove " + address);
                            fluentTree.removeIpAddress(address);
                        });
                        fluentFile.getAddressesToAdd().forEach(function (address) {
                            console.log("Add " + address);
                            fluentTree.addIpAddress(address);
                        });
                        fluentFile.archiveAddresses();
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    // TODO
                    console.log(error_1);
                    return [3 /*break*/, 4];
                case 4:
                    // do it again (forever...)
                    startIpUpdate();
                    return [2 /*return*/];
            }
        });
    }); }, Math.floor(Math.random() * 1500) + 500);
}
app.get('/api/v1/ip/blocked', function (req, res) {
    var ipIsBlocked = fluentTree.findIpAddress(req.query.ipAddress);
    console.log("Is " + req.query.ipAddress + " blocked?", ipIsBlocked);
    res.status(200).send(ipIsBlocked);
});
app.get('/walk', function () {
    fluentTree.walkTheTree();
});
app.listen(PORT, function () {
    console.log("\u26A1\uFE0F[server]: Server is running on port " + PORT + ".");
});
console.log(startIpUpdate());