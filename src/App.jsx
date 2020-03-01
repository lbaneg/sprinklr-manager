import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './App.css';
import logo from './file_upload.png';
// import Button from 'react-bootstrap/Button';
// import { IoIosCloudUpload } from 'react-icons/io';
import {IoIosCloudDownload} from 'react-icons/io';
import CSVReader from 'react-csv-reader';
import { CSVLink } from "react-csv";
import {EXPORTLABEL} from './data/lables';
import Campaign from './data/campaign/Campaign';
import DesktopUpload from './data/upload/DesktopUpload';
import MobileUpload from './data/upload/MobileUpload';
import AccountFactory from './data/account/AccountFactory';
import {AUDIENCETARGETING} from './data/audience-targeting';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputFile: {},
      exportFile: {},
      campaigns: [],
      csvData: [
        EXPORTLABEL
      ],
      filename:'',
      uploadComplet:false,
      audianceMap: new Map(AUDIENCETARGETING),
      accountFactory: new AccountFactory()
    }
  }
  componentDidMount() {


  }
  onFileLoaded(data) {
    this.setState({ inputFile: data });
    this._createCampaigns(data);
    this._createUpload('desktop');
    this._createUpload('mobile');
    this._nameFile();
    this.setState({uploadComplet:true})
  }
  _nameFile(){
    let campaign = this.state.campaigns[0];
    this.setState({filename:`FB Upload File - ${campaign.facebookPage} - ${campaign.headline} - ${campaign.dateAdded}`})
  }
  _createCampaigns(data){
    let campaigns = [];
    for (let row = 1; row < data.length;row++) {
      if(data[row][0] !== '') campaigns.push(new Campaign(...data[row])); //data[row][0] checks that the elem has a line number property.
    }
    this.setState({campaigns:campaigns})
  }
  _createUpload(type){
    let campaigns = this.state.campaigns;
    let map = this.state.audianceMap;
    for (let campaign of campaigns) {
      const audiance = map.get(campaign.facebookPage);
      for(let i =0; i < audiance.length;i++){
         let props = this._setProps(campaign,type,audiance[i]);
         this.setState(state => {
          const list = state.csvData.push(props);
          return {list};
        });
      }
    }
  }
  _setProps(campaign,type,audiance){//should be named createUploadTemplate
    let today = new Date().toLocaleDateString();
    let device = type === 'desktop'? new DesktopUpload(campaign.facebookPage): new MobileUpload(campaign.facebookPage);
    const account = this.state.accountFactory.getAccount(campaign.facebookPage);
    let props = [
                  account.adAccountId,
                  account.adAccountName,
                  '',
                  '',
                  '',
                  '',
                  '',
                  `${device.device}${campaign.headline}_${campaign.lineNumber}`,
                  `${device.device}${campaign.headline}_${audiance}`,
                  `${device.device}${campaign.headline}`,
                  '',
                  '',
                  'Active',
                  'Active',
                  'Active',
                  '',
                  '',
                  '',
                  'Traffic',
                  'Yes',
                  `${device.devicePlatforms}`,
                  `${device.platformPositions}`,
                  `${device.publisherPlatforms}`,
                  '',
                  `${today}`,
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  `${device.attributionSpec}`,
                  `${device.bidAmount}`,
                  `${device.campaignBidStrategy}`,
                  `${device.enableAdSetsBudgetRebalancing}`,
                  `${device.paidInitiativeDailyBudget}`,
                  '',
                  'ad_set',
                  '',
                  '',
                  'IMPRESSIONS',
                  'LINK_CLICKS',
                  '',
                  `${account.relatedPage}`,
                  '',
                  '',
                  '',
                  `${campaign.bodyBLURB}`,
                  `LEARN_MORE`,
                  '',
                  '',
                  `${account.displayLink}`,
                  '',
                  'No',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  `${campaign.facebookImage}`,
                  '',
                  `${campaign.liveURL}${account.dSKFtag}`,
                  `${campaign.description}`,
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  `${campaign.headline}`,
                  '',
                  '',
                  'FALSE',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '65',
                  '18',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  'United States',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  'tragedy_and_conflict,mature_audiences,gambling,debated_social_issues,dating',
                  '23842800342310509:AD Publisher Block List',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  'Male, female',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  'home,recent',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  'expansion_all',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  '',
                  'false',
                  'false',
                  'false',
                  'false',
                  '',
                  '',
                  '',
                  `${campaign.facebookPage}`,
                  '',
                  `${device.adSetDeliveryLocation}`,
                  '',
                  '',
                  '',
                  '',
                  '',
                  `${device.paidInitiativeADDeliveryLocation}`,
                  '',
                  '',
                  '',
                  '',
                  '',
                  `${device.paidInitiativeFtagNew}`,
                  'Auction',
                  '',
                  '',
                  '',
                  'FALSE',
                  '',
                  '',
                  '',
                  'Yes'
                ]
    return props;
  }
 
  _createExportCSV(data) {
    // let campaigns = this.state.campaigns;
    // let map = this.state.audianceMap;
    // for (let campaign of campaigns) {
    //   const audiance = map.get(campaign.facebookPage);

     
    // }
  }

  render() {
    const csvData = this.state.csvData;
    return (
      <section className="page" id="home-page">
        <Container fluid={true} >
          <Row>
            <Col xs={12}>
              <div className="App-upload-container">
                <Container fluid={false} >
                  <Row>
                    <Col xs={12}>
                      <img src={logo} className="App-upload-img" alt="logo" />
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12}>
                      <div className="App-file-uploader">
                        <CSVReader onFileLoaded={(data) => this.onFileLoaded(data)} />
                      </div>
                      {/*
                      <input type="file" id="myFile" onChange={(e) => this.handleChange(e.target.files)} /> Select Candy Tracker File
                      <Button variant="primary"> <IoIosCloudUpload /> Select Candy Tracker File</Button>
                      */}
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12}>
                      {
                        this.state.uploadComplet? <CSVLink data={csvData} filename={`${this.state.filename}.csv`}
                        className="btn btn-primary"
                        target=""> <IoIosCloudDownload/> Download File</CSVLink>:''
                      }
                      
                    </Col>
                  </Row>
                </Container>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    );
  }
}

export default App;
