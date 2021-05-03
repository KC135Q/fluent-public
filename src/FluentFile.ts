import axios from 'axios';

/**
 * Class for file operations. These are the files containing the IP addresses used for blocked fraudulent access
 */
export class FluentFile {
  // lastUpdated is a getter
  lastUpdated: string = '';
  currentDate: string = '';
  previousAddresses: string[] = [];
  currentHeader: string[] = [];
  currentAddresses: string[] = [];
  whichList: string = '';

  /**
   * create file object
   * @param {void} none - no params
   */
  constructor() {
    if (!this.lastUpdated) {
      this.lastUpdated = 'yesterday';
    }
  }

  /**
   * Sets the header array
   * @param {string<Array>} header Array of header values (lines) passed in from the initial file access
   * @description No return but does update the current date
   */
  setHeader(header: string[]): void {
    this.currentHeader = header;
    header.forEach((headline) => {
      if (headline.indexOf(this.whichList === 'spamhaus' ? 'Last-Modified' : 'This File Date') > -1) {
        this.currentDate = headline.split(':')[1];
      }
    });
  }

  /**
   * Sets the array of IP addresses by value using the spread operator
   * @param {string<Array>} addresses - Array of blacklisted IP addresses from initial file access in the
   *  dotted decimal/prefix form (CIDR) 0.1.2.3/20
   */
  setAddresses(addresses: string[]): void {
    this.currentAddresses = [...addresses];
  }

  /**
   * getCurrentFile
   * @description Reads the file located at the url address and parses it into Header content and Address content
   * @param {string} url
   * @return {void} none - No return but does update the address and header arrays associated with this Class
   */
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
      console.warn(error)
      return
    }
  }

  /**
   * getAddressesToAdd
   * @description - Takes the 'new' (current) list and compares it to the existing (previous) address list.
   *  Anything on the new list that was not on the previous list is added to the return array
   *  @params {void} none
   *  @return {string<Array>} anonymous array of ip addresses that will be added to the Tree structure
   */
  getAddressesToAdd(): string[] {
    return this.currentAddresses.filter(
      (address: string) => !this.previousAddresses.includes(address)
    );
  }

  /**
   * getAddressesToRemove - These are removed from the tree before the new addresses are added
   * @description - Takes the 'new' (current) list and compares it to the existing (previous) address list.
   *  Anything not on the new list that was on the previous list is added to the return array
   *  @params {void} none
   *  @return {string<Array>} anonymous array of ip addresses that will be removed to the Tree structure
   */
  getAddressesToRemove(): string[] {
    let oldAddresses = this.previousAddresses.filter(
      (address: string) => !this.currentAddresses.includes(address)
    );

    return oldAddresses;
  }

  /**
   * archiveAddresses
   * @description - moves the most recently processed address arrays to previousAddresses by value and empties the
   *  currentAddress array
   *  @params {void} none
   *  @return {void} none
   */
  archiveAddresses(): void {
    this.previousAddresses = [...this.currentAddresses] || [];
    this.currentAddresses.length = 0;
  }

}
