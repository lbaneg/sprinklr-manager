import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';

import './Upload.css';
// import Button from 'react-bootstrap/Button';
// import { IoIosCloudUpload } from 'react-icons/io';
import {IoIosCloudDownload} from 'react-icons/io';
import CSVReader from 'react-csv-reader';
import { CSVLink } from "react-csv";
import {HEADERVALUES} from '../../data/header-values';
import Campaign from '../../data/campaign/Campaign';
import DesktopUpload from '../../data/upload/DesktopUpload';
import MobileUpload from '../../data/upload/MobileUpload';
import Creative from '../../data/creatives/Creative';
import AccountFactory from '../../data/account/AccountFactory';
import {AUDIENCETARGETING} from '../../data/audience-targeting';


class Upload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputFile: {},
      exportFile: {},
      campaigns: [],
      csvData: [HEADERVALUES],
      error: false,
      filename:'',
      uploadComplet:false,
      audianceMap: new Map(AUDIENCETARGETING),
      accountFactory: new AccountFactory(),
      uploadType:{
        'MOBILE':'mobile',
        'DESKTOP':'desktop'
      }
    }
    this.test = this.test.bind(this);
    this.onRemoveFile = this.onRemoveFile.bind(this);
    this._loadFileListener = this._loadFileListener.bind(this)
  }
  componentDidMount() {
    window.ipcRenderer.on('getAll-reply', this._loadFileListener)
  }
  componentWillUnmount() {
    window.ipcRenderer.removeListener('getAll-reply', this._loadFileListener)
  }
  _loadFileListener(event){
    console.log('Runaujn!!!'+ event);
  }
  test(){
  //<button onClick={this.test}>
  //Test
  //</button>
    const res = window.ipcRenderer.send('getAll',{name:'hello!'});
    for(let r in res){
      console.log(`${r}`);
    }
  }
  
  onRemoveFile(event){
    document.querySelector('.csv-input').value = '';
    this.setState({inputFile:{}});
    this.setState({uploadComplet:false});
  }
  onFileLoaded(data) {
    this.setState({ inputFile: data });
    this._createCampaigns(data);
    this._createUpload(this.state.uploadType.DESKTOP);
    this._createUpload(this.state.uploadType.MOBILE);
    this._nameFile();
    this.setState({uploadComplet:true});
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
      props.push(`${fprop}`);
    }
    return props;
  }

  render() {
    const csvData = this.state.csvData;
    const errorMessage = 'Format Error! First row in file must match: LINE NUMBER,	DATE ADDED,	FACEBOOK PAGE,	HEADLINE,	DESCRIPTION (DEK)	BODY -  BLURB,	LIVE URL,	FACEBOOK IMAGE - 1200 X 627';
    return (
      <section className="page" id="upload-page">
        <Container fluid={true} >
          <Row>
            <Col xs={12} md={12} lg={12}>
              <h1>Upload</h1>
              <hr/>
            </Col>
          </Row>
          <Row>
            <Col xs={12} md={12} lg ={12}>
              {
                 this.state.error? <Alert variant={'danger'}>{errorMessage}</Alert>:''  
              }
            </Col>
          </Row>
          <Row>
            <Col xs={6} md={6} lg={6}>
                <CSVReader onFileLoaded={(data) => this.onFileLoaded(data)} ref={this.csvRef} />                       
              
              {/*
              <input type="file" id="myFile" onChange={(e) => this.handleChange(e.target.files)} /> Select Candy Tracker File
              <Button variant="primary"> <IoIosCloudUpload /> Select Candy Tracker File</Button>
              this.state.uploadComplet?<div className="clickable" id="remove-file" onClick={this.onRemoveFile}> <IoIosCloseCircleOutline/> </div>:''  
              */}
            </Col>
            <Col xs={6} md={6} lg={6}>
              {
                this.state.uploadComplet? <CSVLink data={csvData} filename={`${this.state.filename}.csv`}
                className="btn btn-primary"
                target=""> <IoIosCloudDownload/> Download File</CSVLink>:''
              }
            </Col>
          </Row>
        </Container>
      </section>
    );
  }
}

export default Upload;
