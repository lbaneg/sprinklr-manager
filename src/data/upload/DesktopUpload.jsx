import Upload from "./Upload";
import {BIDS} from './bids';
class DesktopUpload extends Upload{
    constructor(campaignstr){
        const bids = new Map(BIDS);
        const camp = bids.get(campaignstr);
        const startingBid = camp? camp.desktop.startingBid:'';
        const campaignBudget = camp? camp.desktop.campaignBudget:'';
        super('DSK_','','Yes','','','','','','','','','','','','','Active','Active',
        'Active','','','','Traffic','Yes','Desktop','Feeds;Right Column','Facebook',
        '','2/18/20 0:00','','','','','','','','','','','[{"eventType":"CLICK_THROUGH""windowDays":1}]',
        `${startingBid}`,'LOWEST_COST_WITH_BID_CAP','No',`${campaignBudget}`,'','ad_set','','','IMPRESSIONS','LINK_CLICKS','','','','','','',
        'LEARN_MORE','','', '','No','','','','','','','','','','','','','','','','','','','','','','','FALSE','',
        '','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','',
        '','','','','','','United States','','','','','','','','','','','','','','','',
        'tragedy_and_conflict,mature_audiences,gambling,debated_social_issues,dating',
        '23842800342310509:AD Publisher Block List','','','','','','','','','','','','','','','','','','','','',
        'home,recent','','','','','','','','','','','expansion_all','','','','','','','','','','','','','','','',
        'false','false','false','false','','','','','','Desktop','','','','','','Facebook','','','','','','','Auction',
        '','','','FALSE','','','','Yes');
    }
}
export default DesktopUpload;