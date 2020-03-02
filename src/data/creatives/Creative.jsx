import {CREATIVEPROPS} from './creative-propertys'

class Creative{
    constructor(device,account,audiance,campaign){
        for(let prop of CREATIVEPROPS){
            this[prop] = "";
        }
        this.AdAccountId = account.adAccountId;
        this.AdAccountName =account.adAccountName;
        this.AdName = `${device.device}${campaign.headline}_${campaign.lineNumber}`;
        this.AdSetName= `${device.device}${campaign.headline}_${audiance}`;
        this.CampaignName =`${device.device}${campaign.headline}`;
        this.DevicePlatforms = `${device.devicePlatforms}`;
        this.PlatformPositions = `${device.platformPositions}`
        this.PublisherPlatforms =  `${device.publisherPlatforms}`;
        this.AdSetTimeStart = new Date().toLocaleDateString();
        this.AttributionSpec = `${device.attributionSpec}`;
        this.BidAmount = `${device.bidAmount}`;
        this.CampaignBidStrategy = `${device.campaignBidStrategy}`;
        this.EnableAdSetsBudgetRebalancing = `${device.enableAdSetsBudgetRebalancing}`;
        this.PaidInitiativeDailyBudget = `${device.paidInitiativeDailyBudget}`;
        this.RelatedPage = `${account.relatedPage}`;
        this.Body = `${campaign.bodyBLURB}`;
        this.DisplayLink = `${account.displayLink}`;
        this.ImageUrl = `${campaign.facebookImage}`;
        this.Link = `${campaign.liveURL}${account.dSKFtag}`;
        this.Description = `${campaign.description}`;
        this.Headline = `${campaign.headline}`;
        this.FacebookPage = `${campaign.facebookPage}`;
        this.AdSetDeliveryLocation = `${device.adSetDeliveryLocation}`;
        this.PaidInitiativeADDeliveryLocation =`${device.paidInitiativeADDeliveryLocation}`;
        this.PaidInitiativeFtagNew = `${device.paidInitiativeFtagNew}`;
        this.AdSetRunStatus = 'Active';
        this.AdStatus = 'Active';
        this.CampaignStatus = 'Active';
        this.CampaignObjective = 'Traffic';
        this.EnableCampaignBudgetOptimization = 'Yes';  
        this.CampaignBidStrategy = 'LOWEST_COST_WITH_BID_CAP';
        this.EnableAdSetsBudgetRebalancing = 'No';
        this.PricingLevel = 'ad_set';
        this.BillingEvent = 'IMPRESSIONS';
        this.OptimizationGoal = 'LINK_CLICKS';
        this.CallToAction = 'LEARN_MORE';
        this.DontPublishDuplicatePost = 'No';
        this.UsePageasActor = 'False';
        this.AgeMax = "65";
        this.AgeMin="18";
        this.Countries='United States';
        this.ExcludedPublisherCategories = 'tragedy_and_conflict,mature_audiences,gambling,debated_social_issues,dating';
        this.ExcludedPublisherIds = '23842800342310509:AD Publisher Block List';
        this.Gender = 'Male, female';
        this.englandnTypes='home,recent';
        this.TargetingOptimization='expansion_all';
        this.DamAlphaEnabled =  'false';
        this.DcmEnabled = 'false';
        this.DcmSetViewTags	='false'
        this.MultiSharedEndCardIncluded ='false';
        this.AdSetDeliveryLocation = 'location';
        this.CampaignBuyingType ='Auction';
        this.PostApproval ='FALSE';
        this.UseAcceleratedDelivery = 'Yes';
    }
}
export default Creative;