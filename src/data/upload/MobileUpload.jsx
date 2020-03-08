import Upload from './Upload';
import {MOBILEVALUES} from './upload-data';
import {BIDS} from './upload-data';
class MobileUpload extends Upload{
    constructor(campaignstr) {
        super();
        const bids = new Map(BIDS);
        for(let [key,value] of Object.entries(MOBILEVALUES) ){
            this[key] = value;
        }
        if(bids.has(campaignstr)){
            const camp = bids.get(campaignstr);
            this.bidAmount = camp.desktop.startingBid;
            this.campaignBidStrategy = camp.desktop.campaignBudget;
        }
   
    }
}
export default MobileUpload;