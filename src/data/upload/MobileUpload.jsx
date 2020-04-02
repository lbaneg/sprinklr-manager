import Upload from './Upload';
import {MOBILEVALUES} from './upload-data';
import {BIDS} from './upload-data';
class MobileUpload extends Upload{
    constructor(campaignstr,bid) {
        super();
        const map = new Map(BIDS);
        for(let [key,value] of Object.entries(MOBILEVALUES) ){
            this[key] = value;
        }
        if(bid){
            this.bidAmount = bid.starting_bid;
            this.campaignBidStrategy = bid.campaign_budget;
            this.paidInitiativeDailyBudget = bid.campaign_budget;
        }else{//IF NO INTERNET ACCESS READ FROM FILE
            const camp = map.get(campaignstr);
            this.bidAmount = camp.mobile.startingBid;
            this.campaignBidStrategy = camp.mobile.campaignBudget;
            this.paidInitiativeDailyBudget = camp.mobile.campaignBudget;
        }
        if(campaignstr === 'CNET') super.excludedConnections = "c:145802748959745,c:7155422274"; //edgecase 
   
    }
}
export default MobileUpload;