const BIDS = [
    ['247Sports',
        {
            site: '24/7 Sports',
            desktop: {
                vendor: 'Facebook',
                startingBid: '0.10',
                campaignBudget: '25.00'
            },
            mobile: {
                vendor: 'Facebook Mobile',
                startingBid: '0.05',
                campaignBudget: '25.00'
            }
        }
    ],
    ['CBSNews',
        {
            site: 'CBS News',
            desktop: {
                vendor: 'Facebook',
                startingBid: '0.08',
                campaignBudget: '20.00'
            },
            mobile: {
                vendor: 'Facebook Mobile',
                startingBid: '0.03',
                campaignBudget: '20.00'
            }


        }
    ],
    ['Chowhound',
        {
            site: 'Chowhound',
            desktop: {
                vendor: 'Facebook',
                startingBid: '0.08',
                campaignBudget: '20.00'
            },
            mobile: {
                vendor: 'Facebook Mobile',
                startingBid: '0.05',
                campaignBudget: '20.00'
            }


        }
    ],
    ['CNET',

        {
            site: 'CNET',
            desktop: {
                vendor: 'Facebook',
                startingBid: '0.12',
                campaignBudget: '25.00'
            },
            mobile: {
                vendor: 'Facebook Mobile',
                startingBid: '0.04',
                campaignBudget: '20.00'
            }


        }

    ],
    ['ET Online',

        {
            site: 'ET Online',
            desktop: {
                vendor: 'Facebook',
                startingBid: '0.05',
                campaignBudget: '20.00'
            },
            mobile: {
                vendor: 'Facebook Mobile',
                startingBid: '0.02',
                campaignBudget: '20.00'
            }


        },

    ],
    ['ComicBook',
        {
            site: 'ComicBook',
            desktop: {
                vendor: 'Facebook',
                startingBid: '0.05',
                campaignBudget: '10.00'
            },
            mobile: {
                vendor: 'Facebook Mobile',
                startingBid: '0.02',
                campaignBudget: '10.00'
            }


        }
    ],
    ['GameSpot',
        {
            site: 'GameSpot',
            desktop: {
                vendor: 'Facebook',
                startingBid: '0.03',
                campaignBudget: '10.00'
            },
            mobile: {
                vendor: 'Facebook Mobile',
                startingBid: '0.06',
                campaignBudget: '10.00'
            }


        },
    ],
    ['Guide',
        {
            site: 'Guide',
            desktop: {
                vendor: 'Facebook',
                startingBid: '0.06',
                campaignBudget: '10.00'
            },
            mobile: {
                vendor: 'Facebook Mobile',
                startingBid: '0.03',
                campaignBudget: '10.00'
            }


        }
    ],
    ['Inside Edition',
        {
            site: 'Inside Edition',
            desktop: {
                vendor: 'Facebook',
                startingBid: '0.06',
                campaignBudget: '10.00'
            },
            mobile: {
                vendor: 'Facebook Mobile',
                startingBid: '0.03',
                campaignBudget: '10.00'
            }


        }
    ],
    ['PopCulture',
        {
            site: 'PopCulture',
            desktop: {
                vendor: 'Facebook',
                startingBid: '0.05',
                campaignBudget: '10.00'
            },
            mobile: {
                vendor: 'Facebook Mobile',
                startingBid: '0.02',
                campaignBudget: '10.00'
            }


        }
    ],
    ['Roadshow',
        {
            site: 'Roadshow',
            desktop: {
                vendor: 'Facebook',
                startingBid: '0.06',
                campaignBudget: '10.00'
            },
            mobile: {
                vendor: 'Facebook Mobile',
                startingBid: '0.02',
                campaignBudget: '10.00'
            }


        },
    ],
    ['TechRepublic',
        {
            site: 'TechRepublic',
            desktop: {
                vendor: 'Facebook',
                startingBid: '0.07',
                campaignBudget: '15.00'
            },
            mobile: {
                vendor: 'Facebook Mobile',
                startingBid: '0.03',
                campaignBudget: '15.00'
            }


        }
    ],
    ['TV GUIDE',
        {
            site: 'TV GUIDE',
            desktop: {
                vendor: 'Facebook',
                startingBid: '0.07',
                campaignBudget: '20.00'
            },
            mobile: {
                vendor: 'Facebook Mobile',
                startingBid: '0.05',
                campaignBudget: '20.00'
            }


        }
    ],
    ['ZDNet',
        {
            site: 'ZDNet',
            desktop: {
                vendor: 'Facebook',
                startingBid: '0.09',
                campaignBudget: '15.00'
            },
            mobile: {
                vendor: 'Facebook Mobile',
                startingBid: '0.03',
                campaignBudget: '15.00'
            }


        }
    ],
    ['CNET Commerce',
        {
            site: 'CNET Commerce',
            desktop: {
                vendor: 'Facebook',
                startingBid: '0.13',
                campaignBudget: '20.00'
            },
            mobile: {
                vendor: 'Facebook Mobile',
                startingBid: '0.05',
                campaignBudget: '20.00'
            }
        }
    ]
]

const DESKTOPVALUES = {
    device:'DSK_',
    filter:'Yes',
    adSetRunStatus:'Active',
    adStatus:'Active',
    campaignStatus:'Active',
    campaignObjective:'Traffic',
    enableCampaignBudgetOptimization:'Yes',
    devicePlatforms:'Desktop',
    platformPositions:'Feeds;Right Column',
    publisherPlatforms:'Facebook',
    adSetTimeStart:'2/18/20 0:00',
    attributionSpec:'[{""eventType"":""CLICK_THROUGH"",""windowDays"":1}]',
    campaignBidStrategy: 'LOWEST_COST_WITH_BID_CAP',
    enableAdSetsBudgetRebalancing:'No',
    pricingLevel:'ad_set',
    billingEvent:'IMPRESSIONS',
    callToAction:'LEARN_MORE',
    dontPublishDuplicatePost:'No',
    usePageasActor:'FALSE',
    countries:'United States',
    excludedPublisherCategories:'tragedy_and_conflict,mature_audiences,gambling,debated_social_issues,dating',
    excludedPublisherIds:'23842800342310509:AD Publisher Block List',
    locationTypes:'home,recent',
    targetingOptimization:'expansion_all',
    dcmAlphaEnabled:'false',
    dcmEnabled:'false',
    dcmSetViewTags:'false',
    adSetDeliveryLocation:'Desktop',
    paidInitiativeADDeliveryLocation:'Facebook',
    campaignBuyingType:'Auction',
    postApproval:'FALSE',
    useAcceleratedDelivery:'Yes',
}
const MOBILEVALUES = {
    device:'MOB_',
    filter:'Yes',
    adSetRunStatus:'Active',
    adStatus:'Active',
    campaignStatus:'Active',
    campaignObjective:'Traffic',
    enableCampaignBudgetOptimization:'Yes',
    devicePlatforms:'Mobile',
    platformPositions:'Inbox;Instant Articles;Native, Banner and Interstitial;Feeds',
    publisherPlatforms:'Facebook,Audience Network,Messenger',
    adSetTimeStart:'3/7/20 0:00',
    attributionSpec:'[{""eventType"":""CLICK_THROUGH"",""windowDays"":1}]',
    campaignBidStrategy: 'LOWEST_COST_WITH_BID_CAP',
    enableAdSetsBudgetRebalancing:'No',
    pricingLevel:'ad_set',
    billingEvent:'IMPRESSIONS',
    callToAction:'LEARN_MORE',
    dontPublishDuplicatePost:'No',
    usePageasActor:'FALSE',
    countries:'United States',
    excludedPublisherCategories:'tragedy_and_conflict,mature_audiences,gambling,debated_social_issues,dating',
    excludedPublisherIds:'23842800342310509:AD Publisher Block List',
    locationTypes:'home,recent',
    targetingOptimization:'expansion_all',
    dcmAlphaEnabled:'false',
    dcmEnabled:'false',
    dcmSetViewTags:'false',
    adSetDeliveryLocation:'Mobile',
    paidInitiativeADDeliveryLocation:'Facebook Mobile',
    campaignBuyingType:'Auction',
    postApproval:'FALSE',
    useAcceleratedDelivery:'Yes',
    optimizationGoal:'LINK_CLICKS'
}


export {BIDS, DESKTOPVALUES, MOBILEVALUES}