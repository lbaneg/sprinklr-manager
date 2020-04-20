import Upload from './Upload';
import {INSTAGRAM} from './upload-data';
class Instagram extends Upload{
    constructor(campaignstr,bid) {
        super();
        for(let [key,value] of Object.entries(INSTAGRAM) ){
            this[key] = value;
        }
        if(bid){
            this.bidAmount = bid.starting_bid;
            this.campaignBidStrategy = bid.campaign_budget;
            this.paidInitiativeDailyBudget = bid.campaign_budget;
        }
        if(campaignstr === 'CNET')  super.excludedConnections = "c:145802748959745,c:7155422274"; //edgecase 
   
    }

}
export default Instagram;