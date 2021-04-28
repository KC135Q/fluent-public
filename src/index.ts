import express, { Request, Response } from 'express';
import { FluentTree } from './FluentTree';
import { FluentFile } from './FluentFile';

const app = express();
const PORT = 8080;

// fluentFile for file operations
const fluentFile = new FluentFile();
// fluentTree is a radix tree representing the current blocked ip addresses
const fluentTree = new FluentTree();

async function getFile(fileUrl: string =
    'https://raw.githubusercontent.com/ktsaou/blocklist-ipsets/master/firehol_level1.netset') {
  try{
    await fluentFile.getCurrentFile(fileUrl);
    // Check to see if the file date has changed. No need to process the file if it hasn't
    if (fluentFile.lastUpdated !== fluentFile.currentDate) {
      // Get an array of addresses that are no longer on the list and remove them from the tree
      fluentFile.getAddressesToRemove().forEach((address) => {
        console.log(`Remove ${address}`);
        fluentTree.removeIpAddress(address);
      });
      // Get an array of addresses that are new to the list and add them to the tree
      fluentFile.getAddressesToAdd().forEach((address) => {
        console.log(`Add ${address}`);
        fluentTree.addIpAddress(address);
      });
      // Move the current address list to the 'previous' list to compare to for adding and removing
      //  next time.
      fluentFile.archiveAddresses();
    }
  } catch (error) {
    console.warn(error);
  }
  return;
}

/**
 *   @description Uses a random interval between 5 minutes
 *   @function startIpUpdate
 *   @params none
 */
function startIpUpdate() {
  try {
    setTimeout(async () => {
      process.stdout.write('.');
      await getFile()
      // do it again (like, forever...)
      startIpUpdate();
    }, Math.floor(Math.random() * 9000) + 3000);
  } catch (error) {
    console.warn(error);
  }
}

/**
 * Route checking to see if the provided ip address is blocked..
 * @name "get/api/v1/ip/blocked"
 * @param {string} path - Express path
 * @param {string} ipAddress - Query parameter in ipv4 format
 * @example - Localhost example
 * // returns true if ip
 * https://localhost:8080/api/v1/ip/blocked?ipAddress=5.5.5.17
 * @param {callback} middleware - Express middleware.
 */
app.get('/api/v1/ip/blocked', (req: Request, res: Response) => {
  // Validate ip address here
  console.log(`Getting address ${req.query.ipAddress}`);
  // Key action in the app - calls findIpAddress and passes the ipv4 address to it
  let ipIsBlocked: boolean = fluentTree.findIpAddress(
    <string>req.query.ipAddress
  );
  console.log(`Is ${req.query.ipAddress} blocked?`, ipIsBlocked);
  res.status(200).json({ blocked: ipIsBlocked });
});

/**
 * Express 'walk' route to show some of the tree structure
 * @description
 * @name "get/walk"
 * @param {string} route - Express walk route
 * @returns {number} status - http response code of 200 when complete
 * @returns {json} message - Message to requester
 */
app.get('/walk', (req: Request, res: Response) => {
  fluentTree.walkTheTree();
  res.status(200).json({ message: 'Walk complete' });
});

app.get('/test', (req: Request, res: Response) => {
  [
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
  ].forEach((element) => {
    console.log(`Testing element ${element}`);
    console.log(fluentTree.findIpAddress(element));
  });
  res.status(200).json({ message: 'hello, world' });
});

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});

let starterFile = getFile();
console.log("Started!", starterFile)
startIpUpdate();
