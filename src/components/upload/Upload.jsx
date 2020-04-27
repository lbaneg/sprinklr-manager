import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import ListGroup from 'react-bootstrap/ListGroup';

import './Upload.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import {IoIosCloudDownload,IoIosCloseCircleOutline,IoIosCreate} from 'react-icons/io';
import CSVReader from 'react-csv-reader';
import { CSVLink } from "react-csv";
import {HEADERVALUES} from '../../data/header-values';
import Campaign from '../../data/campaign/Campaign';
import DesktopUpload from '../../data/upload/DesktopUpload';
import MobileUpload from '../../data/upload/MobileUpload';
import Instagram from '../../data/upload/Instagram';
import InstagramStory from '../../data/upload/InstagramStory';
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
        'MOBILE':'Facebook Mobile',
        'FACEBOOK':'Facebook',
        'INSTAGRAM':'Instagram',
        'INSTAGRAMSTORY':'Instagram Feed'
      },
      bidType:{
        DESKTOP:'Facebook',
        MOBILE:'Facebook Mobile',
        INSTAGRAM:'Instagram'
      },
      accountType:{
        FACEBOOK:'F',
        FACEBOOKMOBILE:'FM',
        INSTAGRAM:'IG',
        INSTAGRAMSTORY:'IGS'
      },
      uploadIG:false,
      uploadIGStory:false,
      site:'',
      audianceTargets:[],
      activeTargets:0,
      bids:[],
      isInstagramable:false,
      isInstagramStoryable:false,
      errorMessage:''
    }
    this._loadBids = this._loadBids.bind(this);
    this.onRemoveFile = this.onRemoveFile.bind(this);
    this.onCreateExportFile = this.onCreateExportFile.bind(this);
    this.onClickItem = this.onClickItem.bind(this);
    this.loadAudianceTargetResp = this.loadAudianceTargetResp.bind(this);
    this.onIGSelect = this.onIGSelect.bind(this);
    this.onIGStorySelect = this.onIGStorySelect.bind(this);
    this.onCloseError = this.onCloseError.bind(this);
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
  onCloseError(){
    this.setState({errorMessage:''});
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
    this._createUpload(this.state.bidType.DESKTOP,this.state.accountType.FACEBOOK);
    this._createUpload(this.state.bidType.MOBILE,this.state.accountType.FACEBOOKMOBILE);
    if(this.state.uploadIG) this._createUpload(this.state.bidType.INSTAGRAM,this.state.accountType.INSTAGRAM);
    if(this.state.uploadIGStory) this._createUpload(this.state.bidType.INSTAGRAM,this.state.accountType.INSTAGRAMSTORY);
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
    if(audianceTargets.length <= 0){
      this.setState({errorMessage:`No audiance found for ${site}; Check the Audiance section and create or edit a audiance for site ${site}`});
      return
    }
    for(let bid of this.state.bids){ 
      if(bid.vendor === 'Instagram' && bid.site === site) this.setState({isInstagramable:true})
    }
    this.setState({audianceTargets:audianceTargets}) 
    this.setState({campaigns:campaigns});
    this.setState({uploadComplet:true});
  }
  _createUpload(bidType,accountType){
    let campaigns = this.state.campaigns;
    //let map = this.state.audianceMap;//map.get(campaign.facebookPage);
    for (let campaign of campaigns) {
      const audiance = this.state.audianceTargets.filter((elm) =>{
        return elm.selected === true; 
      })
      for(let i =0; i < audiance.length;i++){
         let props = this._setProps(campaign,bidType,accountType,audiance[i]);//bidtype accounttype
         this.setState(state => {
          const list = state.csvData.push(props);
          return {list};
        });
      }
    }
  }
  _setProps(campaign,bidType,accountType,audiance){//should be named createUploadTemplate
    
    // const bid = this.state.bids.filter((elm)=>{
    //   return (elm.site === campaign.facebookPage && elm.platform === type);
    // }).shift();
    let bid;
    for(let elm of this.state.bids){
        if(elm.site === campaign.facebookPage && elm.vendor === bidType){
          bid = elm;
          break;
        }
    }
    if(bid === undefined){
      this.setState({errorMessage:`No bids found for site ${campaign.facebookPage}; check if the Bid tab has bid values for site ${campaign.facebookPage}`})
      return 
    } 
    let device;
    switch(accountType){ 
      case this.state.accountType.FACEBOOK:
        device = new DesktopUpload(campaign.facebookPage,bid);
      break;
     case this.state.accountType.FACEBOOKMOBILE:
        device = new MobileUpload(campaign.facebookPage,bid);
        break;
      case this.state.accountType.INSTAGRAM:
        device = new Instagram(campaign.facebookPage,bid);
        break;
      case this.state.accountType.INSTAGRAMSTORY:
        device = new InstagramStory(campaign.facebookPage,bid);
        break;
     default:
    }
    if(device === undefined){
      this.setState({errorMessage:`Account type not found as Facebook,Facebook Mobile,Instagram or Instagram Story`});
      return 
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
  onIGSelect(e){
    this.setState({uploadIG:!this.state.uploadIG});
  }
  onIGStorySelect(e){
    this.setState({uploadIGStory:!this.state.uploadIGStory});
  }

  render() {
    const csvData = this.state.csvData;
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
                 this.state.errorMessage.length>1? <Alert variant={'danger'}>{this.state.errorMessage} <IoIosCloseCircleOutline onClick={this.onCloseError}/></Alert>:''  
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
            <Col xs={6} md={6} lg={6}>
                {
                  this.state.audianceTargets.length > 0 ?(
                    <Col xs={10} md={10} lg={10}>
                    <div style={{width:'100%',height:'30px'}}>
                    <h6 style={{float:'left'}}>Select Audiance Targets for {this.state.site}</h6>
                      {
                        <Button style={{float:'right'}} size='sm' variant="primary" disabled= {this.state.activeTargets <= 0? true:false} onClick={this.onCreateExportFile}><IoIosCreate/> Create</Button>
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
            </Col>
            <Col xs={6} md={6} lg={6}>
              <Row>
                    {
                        this.state.isInstagramable?(
                          <div id='ig-select'>
                              <h6>Do you want to add Instagram Campaign?</h6> 
                              <Form>
                                  <Form.Check 
                                    type="switch"
                                    id="ig-switch"
                                    label=""
                                    onChange={this.onIGSelect}
                                  />
                              </Form>
                          </div>
                        ):''
                    }
              </Row>
              <Row>
                  {
                        this.state.isInstagramable?(
                          <div id='ig-select'>
                              <h6>Do you want to add Instagram Story?</h6> 
                              <Form>
                                  <Form.Check 
                                    type="switch"
                                    id="ig-story-switch"
                                    label=""
                                    onChange={this.onIGStorySelect}
                                  />
                              </Form>
                          </div>
                        ):''
                    }
              </Row>
            </Col>
          </Row>
        </Container>
      </section>
    );
  }
}

export default Upload;
