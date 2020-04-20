import {CREATIVEPROPS} from './creative-propertys'
import Instagram from '../upload/Instagram';
import InstagramStory from '../upload/InstagramStory';
class Creative{
    constructor(device,account,audiance,campaign){
        for(let prop of CREATIVEPROPS){
            this[prop.toLowerCase()] = '';
        }
        this.adaccountid = account.adAccountId;
        this.adaccountname =account.adAccountName;
        if(device instanceof Instagram){
            this.adname = `${device.device}${campaign.headline}_${campaign.lineNumber}_SQUARE`;
            this.adsetname= `${device.device}${campaign.headline}_${audiance.audience_name}|Feed`;
            this.campaignname =`${device.device}${campaign.headline}_Instagram Feed`;
            this['paidinitiative:ftag_new'] = `${account.iGMOBftag.split('=')[1]}`;
            this.link = `${campaign.liveURL}`.concat(`${account.iGMOBftag}`);
            this.deviceplatforms = `${device.devicePlatforms}`;
            this.platformpositions = `${device.platformPositions}`
            this.publisherplatforms =  `${device.publisherPlatforms}`;  
        }else if(device instanceof InstagramStory){
            this.adname = `${device.device}${campaign.headline}_${campaign.lineNumber}`;
            this.adsetname= `${device.device}${campaign.headline}_${audiance.audience_name}| Stories`;
            this.campaignname =`${device.device}${campaign.headline}_Instagram Stories`;
            this['paidinitiative:ftag_new'] = `${account.iGMOBftag.split('=')[1]}`;
            this.link = `${campaign.liveURL}`.concat(`${account.iGMOBftag}`);
            this.deviceplatforms = `${device.devicePlatforms}`;
            this.platformpositions = `${device.platformPositions}`;
            this.publisherplatforms =  `${device.publisherPlatforms}`;  
        }else{
            this.adname = `${device.device}${campaign.headline}_${campaign.lineNumber}`;
            this.adsetname= `${device.device}${campaign.headline}_${audiance.audience_name}`;
            this.campaignname =`${device.device}${campaign.headline}`;
            this.deviceplatforms = `${device.devicePlatforms}`;
            this.platformpositions = `${device.platformPositions}`
            this.publisherplatforms =  `${device.publisherPlatforms}`;
            this['paidinitiative:ftag_new'] = device.device==='DSK_'? `${account.dSKFtag.split('=')[1]}`:`${account.mOBFtag.split('=')[1]}`;
            this.link = `${campaign.liveURL}`.concat(device.device==='DSK_'? `${account.dSKFtag}`:`${account.mOBFtag}`);
        }
        this.adsettimestart = new Date().toLocaleDateString();
        this.attributionspec = `${device.attributionSpec}`;
        this.bidamount = `${device.bidAmount}`;
        this.campaignbidstrategy = `${device.campaignBidStrategy}`;
        this.enableadsetsbbudgetrebalancing = `${device.enableAdSetsBudgetRebalancing}`;
        this.paidinitiativedailybudget = `${device.paidInitiativeDailyBudget}`;
        this.relatedpage = `${account.relatedPage}`;
        this.body = `${campaign.bodyBLURB}`;
        this.displaylink = `${account.displayLink}`;
        this.imageurl = `${campaign.facebookImage}`;
        this.description = `${campaign.description}`;
        this.headline = `${campaign.headline}`;
        this.facebookpage = `${campaign.facebookPage}`;
        this.adSetdeliverylocation = `${device.adSetDeliveryLocation}`;
        this.paidinitiativeaddeliverylocation =`${device.paidInitiativeADDeliveryLocation}`;
        this.paidinitiativeftagnew = `${device.paidInitiativeFtagNew}`;
        this.adsetrunstatus = 'Active';
        this.adstatus = 'Active';
        this.campaignstatus = 'Active';
        this.campaignobjective = 'Traffic';
        this.enablecampaignbudgetoptimization = 'Yes';  
        this.campaignbidstrategy = 'LOWEST_COST_WITH_BID_CAP';
        this.enableadsetsbudgetrebalancing = 'No';
        this.pricinglevel = 'ad_set';
        this.billingevent = 'IMPRESSIONS';
        this.optimizationgoal = 'LINK_CLICKS';
        this.calltoaction = 'LEARN_MORE';
        this.dontpublishduplicatepost = 'No';
        this.usepageasactor = 'False';
        this.agemax = `${audiance.age_max}`;
        this.agemin=`${audiance.age_min}`;
        this.countries='United States';
        this.excludedpublishercategories = 'tragedy_and_conflict,mature_audiences,gambling,debated_social_issues,dating';
        this.excludedpublisherids = '23842800342310509:AD Publisher Block List';
        this.gender = 'Male, female';
        this.englandntypes='home,recent';
        this.targetingpptimization='expansion_all';
        this.damalphaenabled =  'false';
        this.dcmenabled = 'false';
        this.dcmsetviewtags	='false'
        this.multisharedendcardincluded ='false';
        this.campaignbuyingtype ='Auction';
        this.postapproval ='FALSE';
        this.useaccelerateddelivery = 'Yes';
        this.dcmalphaenabled = 'false';
        this['adset:adbu'] = `${account.adSetADBU}`;
        this.targetingoptimization = `${device.targetingOptimization}`;
        this.dcmalphaenabled = `${device.dcmAlphaEnabled}`;
        this['paidinitiative:addeliverylocation'] = `${device.paidInitiativeADDeliveryLocation}`;
        this['adset:deliverylocation'] = `${device.adSetDeliveryLocation}`;
        this.linkdescription = `${campaign.description}`;
        this.title = `${campaign.headline}`;
        this.locationtypes =  `${device.locationTypes}`;
        this.excludedconnections = `${device.excludedConnections}`;
        this['advariant:adtype'] = '';
        this['advariant:posttype'] = '';
        this.sprinklrtargetingid = `${audiance.sprinklr_targeting_id||''}`
        this.instagramaccountid = `${account.instagramAccountID}`;
    }
}
export default Creative;