import axios from 'axios';

export class FluentFile{
    // lastUpdated is a getter
    lastUpdated: Date = new Date();
    previousFile: string = '';
    currentFile: string = '';
    constructor(public fileLocation: string) {
        if(!this.lastUpdated) {
            this.lastUpdated = new Date();
        }
    }

    getCurrentFile(url): string {

        return 'Hello'
    }

    getLastUpdated(): Date {
        return this.lastUpdated;
    }

    setLastUpdated(lastUpdated: Date = new Date()): void {
        this.lastUpdated = lastUpdated;
    }
}