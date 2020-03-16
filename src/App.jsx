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
import Creative from './data/creatives/Creative';
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
    let device = type === 'desktop'? new DesktopUpload(campaign.facebookPage): new MobileUpload(campaign.facebookPage);
    const account = this.state.accountFactory.getAccount(campaign.facebookPage);
    const creativ = new Creative(device,account,audiance,campaign);
    const props = [];
    const labels = this.state.csvData[0];
    for(let label of labels){
      let fprop = creativ[label.replace(/\s/g, "").replace('`','').toLowerCase()];
      switch(label){
        case 'Dcm Alpha Enabled':
        case 'Dcm Enabled':
        case 'Dcm Set View Tags':
        case 'Multi Shared End Card Included':  
          props.push(`'${fprop}'`);
          break;
        default:
          props.push(`${fprop}`);
      }
    }
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
