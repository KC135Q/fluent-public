import axios from 'axios';

export class FluentFile {
  // lastUpdated is a getter
  lastUpdated: string = '';
  currentDate: string = '';
  previousAddresses: string[] = [];
  currentHeader: string[] = [];
  currentAddresses: string[] = [];
  whichList: string = '';

  constructor() {
    if (!this.lastUpdated) {
      this.lastUpdated = 'yesterday';
    }
  }

  setHeader(header: string[]): void {
    this.currentHeader = header;
    header.forEach((headline) => {
      if (headline.indexOf(this.whichList === 'spamhaus' ? 'Last-Modified' : 'This File Date') > -1) {
        this.currentDate = headline.split(':')[1];
      }
    });
  }

  setAddresses(addresses: string[]): void {
    this.currentAddresses = [...addresses];
  }

  async getCurrentFile(url: string) {
    try {
      let data = await axios.get(url);
      this.setHeader(
        data.data.split('\n').filter((line: string) => line.indexOf('#') > -1)
      );
      this.setAddresses(
          this.whichList === 'spamhaus' ?
            data.data.split('\n').filter((line: string) => {
              line.indexOf('#') < 0
              return line.split(";")[0].trim()
            }) :
              data.data.split('\n').filter((line: string) => line.indexOf('#') < 0)
      );
      return
    } catch (error) {
      throw error;
    }
  }

  getAddressesToAdd(): string[] {
    return this.currentAddresses.filter(
      (address: string) => !this.previousAddresses.includes(address)
    );
  }

  getAddressesToRemove(): string[] {
    let oldAddresses = this.previousAddresses.filter(
      (address: string) => !this.currentAddresses.includes(address)
    );

    return oldAddresses;
  }

  archiveAddresses(): void {
    this.previousAddresses = [...this.currentAddresses] || [];
    this.currentAddresses.length = 0;
  }

  // getLastUpdated(): string {
  //   return this.lastUpdated;
  // }
  //
  // setLastUpdated(lastUpdated: string = ''): void {
  //   this.lastUpdated = lastUpdated;
  // }
}
