import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import ListGroup from 'react-bootstrap/ListGroup';

import './Upload.css';
import Button from 'react-bootstrap/Button';
import { IoIosCreate } from 'react-icons/io';
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
  message = {
    INSERTUPLOAD:'INSERTUPLOAD',
    LOADBIDS:'LOADBIDS',
    LOADBIDSRESP:'LOADBIDSRESP',
    LOADAUD:"LOADAUD",
    LOADAUDR:"LOADAUDR"
  }
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
      exportFileComplet:false,
      audianceMap: new Map(AUDIENCETARGETING),
      audiances:[],
      accountFactory: new AccountFactory(),
      uploadType:{
        'MOBILE':'mobile',
        'DESKTOP':'desktop'
      },
      site:'',
      audianceTargets:[],
      activeTargets:0,
      bids:[]
    }
    this._loadBids = this._loadBids.bind(this);
    this.onRemoveFile = this.onRemoveFile.bind(this);
    this.onCreateExportFile = this.onCreateExportFile.bind(this);
    this.onClickItem = this.onClickItem.bind(this);
    this.loadAudianceTargetResp = this.loadAudianceTargetResp.bind(this);
  }
  componentDidMount() {
    window.ipcRenderer.on(this.message.LOADAUDR, this.loadAudianceTargetResp)
    window.ipcRenderer.on(this.message.LOADBIDSRESP, this._loadBids)
    window.ipcRenderer.send(this.message.LOADAUD);
    window.ipcRenderer.send(this.message.LOADBIDS);
  }
  componentWillUnmount() {
    window.ipcRenderer.removeListener(this.message.LOADAUDR, this.loadAudianceTargetResp);
    window.ipcRenderer.removeListener(this.message.LOADBIDSRESP, this._loadBids);
  }
  _loadBids(event,res){
    this.setState({bids:res});
  }
  loadAudianceTargetResp(event,resp){
    const audiances = resp.map(elm=>{
      elm.selected = false;
      return elm;
    });
     this.setState({audiances:audiances});
  }
  onRemoveFile(event){
    document.querySelector('.csv-input').value = '';
    this.setState({inputFile:{}});
    this.setState({uploadComplet:false});
  }
  onFileLoaded(data) {
    data.shift();//REMOVE THE FIRST ROW OF FILE
    this.setState({activeTargets:0})
    this.setState({ inputFile: data });
    this._createCampaigns(data);
  }
  onCreateExportFile(){
    this._createUpload(this.state.uploadType.DESKTOP);
    this._createUpload(this.state.uploadType.MOBILE);
    this._nameExportFile();
    this.setState({exportFileComplet:true});
    window.ipcRenderer.send(this.message.INSERTUPLOAD,this.state.inputFile);
  }
  _nameExportFile(){
    let campaign = this.state.campaigns[0];
    this.setState({filename:`FB Upload File - ${campaign.facebookPage} - ${campaign.headline} - ${campaign.dateAdded}`});
  }
  _createCampaigns(data){
    let campaigns = [];
    const audiances = this.state.audiances;
    for (const row of data) {
      campaigns.push(new Campaign(...row)); //data[row][0] checks that the elem has a line number property.
    }
    const site = campaigns[0].facebookPage;
    this.setState({site:site}); // NEED TO CHECK ALL SITE NAME ARE THE SAME;
    const audianceTargets = audiances.filter(elm=>{
        return elm.site === site;
    })
    this.setState({audianceTargets:audianceTargets}) 
    this.setState({campaigns:campaigns});
    this.setState({uploadComplet:true});
  }
  _createUpload(type){
    let campaigns = this.state.campaigns;
    //let map = this.state.audianceMap;//map.get(campaign.facebookPage);
    for (let campaign of campaigns) {
      const audiance = this.state.audianceTargets.filter((elm) =>{
        return elm.selected === true; 
      })
      for(let i =0; i < audiance.length;i++){
         let props = this._setProps(campaign,type,audiance[i].audience_name);
         this.setState(state => {
          const list = state.csvData.push(props);
          return {list};
        });
      }
    }
  }
  _setProps(campaign,type,audiance){//should be named createUploadTemplate
    const bid = this.state.bids.filter((elm)=>{
      return (elm.site === campaign.facebookPage && elm.platform === type);
    }).shift();
    let device;
    switch(type){ 
      case 'desktop':
        device = new DesktopUpload(campaign.facebookPage,bid);
      break;
     case 'mobile':
        device = new MobileUpload(campaign.facebookPage,bid);
        break;
     default:
    }
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
  onClickItem(e){
    const i = Number(e.currentTarget.getAttribute('item-index'));
    if(i >= 0){
      this.setState(state=>{
        let activeTargets= state.activeTargets;
        const audianceTargets = state.audianceTargets.map((target,j)=>{
            if(i === j){
              target.selected = !target.selected;
              target.selected? activeTargets++:activeTargets--;
            }
            return target;
          });
        return {
          audianceTargets,
          activeTargets
        }
      })
    }
  
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
                this.state.exportFileComplet? <CSVLink data={csvData} filename={`${this.state.filename}.csv`}
                className="btn btn-primary"
                target=""> <IoIosCloudDownload/> Download File</CSVLink>:''
              }
            </Col>
          </Row>
          <Row style={{marginTop:'30px'}}>
            {
              this.state.site?(
                <Col xs={10} md={10} lg={10}>
                 <div style={{width:'100%',height:'30px'}}>
                 <h6 style={{float:'left'}}>Select Audiance Targets for {this.state.site}</h6>
                  {
                    <Button style={{float:'right'}} variant="primary" disabled= {this.state.activeTargets <= 0? true:false} onClick={this.onCreateExportFile}><IoIosCreate/> Create</Button>
                  }
                 </div>
                  <hr/>
                  <ListGroup>
                    {
                      this.state.audianceTargets.map((elm,i)=>{
                      return  <ListGroup.Item key={i} item-index = {i} active = {elm.selected} onClick = {this.onClickItem} style={{cursor:'pointer'}}> {elm.audience_name} </ListGroup.Item>
                      })
                    }
                  </ListGroup>
                </Col>
              ):''
            }
          </Row>
        </Container>
      </section>
    );
  }
}

export default Upload;
