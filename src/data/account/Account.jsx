
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
// class Account {
//     constructor(facebookPageUniqueLookup, adAccountId, adAccountName, displayLink, relatedPage, dSKFtag, mOBFtag,
//         adSetADBU, paidInitiativeADInitiative, excludedConnections, excludedCountries, notes) {
//         this.facebookPageUniqueLookup = facebookPageUniqueLookup;
//         this.adAccountId = adAccountId;
//         this.adAccountName = adAccountName;
//         this.displayLink = displayLink;
//         this.relatedPage = relatedPage;
//         this.dSKFtag = dSKFtag;
//         this.mOBFtag = mOBFtag;
//         this.adSetADBU = adSetADBU;
//         this.paidInitiativeADInitiative = paidInitiativeADInitiative;
//         this.excludedConnections = excludedConnections;
//         this.excludedCountries = excludedCountries;
//         this.notes = notes;
//     }
// }

export default Account;