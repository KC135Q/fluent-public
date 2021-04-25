import axios from 'axios';

export class FluentFile{
    // lastUpdated is a getter
    lastUpdated: Date = new Date();
    previousAddresses: string[] = [];
    currentHeader: string[] = [];
    currentAddresses: string[] = [];

    constructor() {
        if(!this.lastUpdated) {
            this.lastUpdated = new Date();
        }
    }

    setHeader(header: string[]): void {
        this.currentHeader = header;
    }

    setAddresses(addresses: string[]): void {
        this.currentAddresses = addresses
    }

    async getCurrentFile(url: string) {
        try{
            let data = await axios.get(url);
            this.setHeader(data.data.split("\n").filter((line: string) => line.indexOf('#') == 1))
            this.setAddresses(data.data.split("\n").filter((line: string) => line.indexOf('#') != 1))
            return
        } catch (error) {
            throw (error)
        }
    }

    getAddressesToAdd(): string[] {
        let newAddresses = this.currentAddresses.filter((address: string) => !this.previousAddresses.includes(address))
        return newAddresses
    }

    getAddressesToRemove(): string[] {
        let oldAddresses = this.previousAddresses.filter((address: string) => this.previousAddresses.includes(address))
        return oldAddresses
    }

    archiveAddresses(): void {
        this.previousAddresses = this.currentAddresses
        this.currentAddresses = []
    }

    getLastUpdated(): Date {
        return this.lastUpdated;
    }

    setLastUpdated(lastUpdated: Date = new Date()): void {
        this.lastUpdated = lastUpdated;
    }
}