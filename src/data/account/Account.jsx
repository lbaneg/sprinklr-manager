
class Account {
    constructor() {
        this.facebookPageUniqueLookup = arguments[0];
        this.adAccountId = arguments[1];
        this.adAccountName = arguments[2];
        this.displayLink = arguments[3];
        this.relatedPage = arguments[4];
        this.dSKFtag =arguments[5];
        this.mOBFtag = arguments[6];
        this.adSetADBU = arguments[7];
        this.paidInitiativeADInitiative = arguments[8];
        this.excludedConnections = arguments[9];
        this.excludedCountries = arguments[10];
        this.notes = arguments[11];
    }
}


export default Account;