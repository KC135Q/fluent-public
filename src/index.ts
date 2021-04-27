import express, { Request, Response } from 'express';
import { FluentTree } from './FluentTree';
import { FluentFile } from './FluentFile';

const app = express();
const PORT = 8080;

let quickStart = 0; // 0 or 1 -- multiply in Timer to quickstart when not t

const ipTestUrl =
  'https://raw.githubusercontent.com/KC135Q/ip-lists/master/addresses.netset';
const ipUrl =
  'https://raw.githubusercontent.com/ktsaou/blocklist-ipsets/master/firehol_level1.netset';

const fluentFile = new FluentFile();
const fluentTree = new FluentTree();

async function getFirstIp() {
  try {
    await fluentFile.getCurrentFile(ipTestUrl);
    if (fluentFile.lastUpdated !== fluentFile.currentDate) {
      fluentFile.getAddressesToRemove().forEach((address) => {
        console.log(`Remove ${address}`);
        fluentTree.removeIpAddress(address);
      });
      fluentFile.getAddressesToAdd().forEach((address) => {
        console.log(`Add ${address}`);
        fluentTree.addIpAddress(address);
      });
      fluentFile.archiveAddresses();
    }
  } catch (error) {
    console.warn(error);
  }

  startIpUpdate();
}

//  - returns true if blocked, false otherwise
// JSDoc... Create deployment and test
function startIpUpdate() {
  // Get the seed addresses and start the clock

  setTimeout(async () => {
    process.stdout.write('.');
    await fluentFile.getCurrentFile(ipUrl);
    if (fluentFile.lastUpdated !== fluentFile.currentDate) {
      fluentFile.getAddressesToRemove().forEach((address) => {
        console.log(`Remove ${address}`);
        fluentTree.removeIpAddress(address);
      });
      fluentFile.getAddressesToAdd().forEach((address) => {
        console.log(`Add ${address}`);
        fluentTree.addIpAddress(address);
      });
      fluentFile.archiveAddresses();
    }
    // do it again (forever...)
    startIpUpdate();
  }, Math.floor(Math.random() * 1500) + 500);
}

app.get('/api/v1/ip/blocked', (req: Request, res: Response) => {
  console.log(`Getting address ${req.query.ipAddress}`);

  let ipIsBlocked: boolean = fluentTree.findIpAddress(
    <string>req.query.ipAddress
  );
  console.log(`Is ${req.query.ipAddress} blocked?`, ipIsBlocked);
  res.status(200).send(ipIsBlocked);
});

app.get('/walk', () => {
  fluentTree.walkTheTree();
});

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});

console.log(getFirstIp());
