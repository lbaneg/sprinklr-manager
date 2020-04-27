import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Modal from 'react-bootstrap/Modal';
import Form from'react-bootstrap/Form';
import {IoMdCreate,IoMdOpen,IoMdTrash} from 'react-icons/io';
import {IoIosCloseCircleOutline} from 'react-icons/io';
class Bids extends React.Component {
  message = {
    LOADBIDS:'LOADBIDS',
    LOADBIDSRESP:'LOADBIDSRESP',
    DELETEBIDS:'DELETEBIDS',
    CREATEBID:'CREATEBID',
    EDITBID:"EDITBID"
  }
  buttonId={
    EDIT:'E',
    SAVE:'S',
    NEW:'N'
  }
  constructor(props) {
    super(props);
    this.state = {
      bids:[],
      showNewModel:false,
      showEditModel:false,
      showDeleteModel:false,
      deletedItems:[],
      bid:{
        site:'',
        vendor:'',
        starting_bid:'',
        campaign_budget:'',
        showAlert:false
      },
      selectCount:0,
      editModel:{}
    }
    this._loadBids = this._loadBids.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onItemSelect = this.onItemSelect.bind(this);
    this.onNew = this.onNew.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onSaveChanges = this.onSaveChanges.bind(this);
    this.onCloseAlert = this.onCloseAlert.bind(this);
    this.onEdit = this.onEdit.bind(this);
    this.onEditChange = this.onEditChange.bind(this); 
  }
  componentDidMount() {
    window.ipcRenderer.on(this.message.LOADBIDSRESP, this._loadBids);
    window.ipcRenderer.send(this.message.LOADBIDS);
  }
  componentWillUnmount() {
    window.ipcRenderer.removeListener(this.message.LOADBIDSRESP, this._loadBids);
  }
  _loadBids(event,res){
    this.setState({bids:res.map(elm=>{
      return {selected:false,...elm}
    })});
  }
  onClose(e){
    this.setState({showNewModel:false,showEditModal:false,showDeleteModel:false});
  }
  onItemSelect(e){
      const INDEX = Number(e.currentTarget.getAttribute('bid-index'));
      this.setState(state=>{
        let selectCount = state.selectCount;
        let bids = state.bids.map((elm,j)=>{
            if(INDEX === j){
              elm.selected = !elm.selected;
              elm.selected?selectCount++:selectCount--;
            }
            return elm;
        })
        return {
          bids:bids,
          selectCount:selectCount,
        }
      })
  }
  onDelete(e){
      const deletebids = this.state.bids.filter(elm=>{
        return elm.selected === true;
      });
    window.ipcRenderer.send(this.message.DELETEBIDS,deletebids);
    this.setState({showNewModel:false,showAlert:true,selectCount:0,showEditModal:false});
  }
  onEdit(e){
    const bids = this.state.bids;
    for(let bid of bids){
      if(bid.selected){
        this.setState({editModel:bid,showEditModal:true});
        break;
      }
    }
  }
  onEditChange(e){
    const ID = e.target.id;
    const VALUE = e.target.value;
    const editModel = { ...this.state.editModel};
    editModel[ID] = VALUE;
    this.setState({editModel:editModel});
  }
  onNew(e){
      this.setState({showNewModel:true});
  }
  onSaveChanges(e){
    const EVENTID = e.currentTarget.getAttribute('btnid');

    switch(EVENTID){
      case this.buttonId.EDIT:
        window.ipcRenderer.send(this.message.EDITBID,this.state.editModel);
        this.setState({showNewModel:false,showAlert:true,selectCount:0,showEditModal:false});
      break;
      default:
        const bid = this.state.bid;
        window.ipcRenderer.send(this.message.CREATEBID,bid);
        this.setState({showNewModel:false,showAlert:true,selectCount:0,showEditModal:false});
    }
  }
  handleChange(event){
    var bid = {...this.state.bid};
    const ID = event.target.id;
    let VALUE = event.target.value;
    if(typeof(VALUE)=="number") VALUE+=VALUE.toString();
    bid[ID] = VALUE;
    this.setState({bid});
  }
  onCloseAlert(e){
    this.setState({showAlert:false});
  }

  render() {
    return (
      <section className="page" id="bids-page" style={{overflowY: 'hidden'}}>
        <Container fluid>
          <Row>
            <Col sm={12} md={12} lg={12}>
              <h1>Bids</h1>
              <hr/>
            </Col>
          </Row>
          <Row>
            <Col xs={12} md={12} lg ={12}>
              {
                 this.state.showAlert? <Alert variant={'success'}>Done! <IoIosCloseCircleOutline onClick={this.onCloseAlert}/></Alert>:''  
              }
            </Col>
          </Row>
          <Row>
            <Col>
                <Modal show={this.state.showNewModel} onHide={this.onClose}>
                    <Modal.Header closeButton>
                      <Modal.Title>Create new Bid</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <Form>
                    <Form.Group>
                      <Form.Label>Site</Form.Label>
                      <Form.Control type="text" id="site" placeholder="CNET" value={this.state.value} onChange={this.handleChange} />
                    </Form.Group> 
                    <Form.Group>
                      <Form.Label>Vendor</Form.Label>
                      <Form.Control type="text" id="vendor" placeholder="Facebook" value={this.state.value} onChange={this.handleChange} />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Starting Bid</Form.Label>
                      <Form.Control type="number" id="starting_bid" placeholder="0.1" value={this.state.value} onChange={this.handleChange} />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Campaign Budget</Form.Label>
                      <Form.Control type="number" id="campaign_budget" placeholder="30" value={this.state.value} onChange={this.handleChange}  />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Platform</Form.Label>
                      <Form.Control type="text" id="platform" placeholder="Desktop" value={this.state.platform} onChange={this.handleChange}/>
                    </Form.Group>
                    </Form>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button variant="secondary" onClick={this.onClose}>
                        Close
                      </Button>
                      <Button variant="primary"id="save" btnid="N" onClick={this.onSaveChanges}>
                        Save Changes
                      </Button>
                    </Modal.Footer>
                  </Modal>
                <Modal show={this.state.showEditModal} onHide={this.onClose}>
                  <Modal.Header closeButton>
                    <Modal.Title>Edit Bid</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                  <Form>    
                    <Form.Group>
                      <Form.Label>Site</Form.Label>
                      <Form.Control type="text" id="site" placeholder="CNET" value={this.state.editModel.site} onChange={this.onEditChange} />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Vendor</Form.Label>
                      <Form.Control type="text" id="vendor" placeholder="Facebook Mobile" value={this.state.editModel.vendor} onChange={this.onEditChange}/>
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Starting Bid</Form.Label>
                      <Form.Control type="number" id="starting_bid" placeholder="0.5" value={this.state.editModel.starting_bid} onChange={this.onEditChange} />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Campaign Budget</Form.Label>
                      <Form.Control type="number" id="campaign_budget" placeholder="25" value={this.state.editModel.campaign_budget} onChange={this.onEditChange}/>
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Platform</Form.Label>
                      <Form.Control type="text" id="platform" placeholder="Desktop" value={this.state.editModel.platform} onChange={this.onEditChange}/>
                    </Form.Group>
                  </Form>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={this.onClose}>
                      Close
                    </Button>
                    <Button variant="primary"id="save" btnid="E" onClick={this.onSaveChanges}>
                      Save 
                    </Button>
                  </Modal.Footer>
                </Modal>   
            
            </Col>
          </Row>
          <Row>
            <Col xs={12} md={12} lg={12}>
              <div style={{float:'rigth',width:'500px',height:'50px'}}>

                    <Button variant="primary" style={{float:'left'}} size="sm" onClick={this.onNew}>
                     <IoMdCreate/> Create
                    </Button>
                    <Button variant="warning" style={{float:"rigth",marginLeft:'10px'}} onClick={this.onEdit} size="sm" disabled={this.state.selectCount === 1?false:true}>
                      <IoMdOpen/> Edit
                    </Button>
                    <Button variant="danger" style={{float:"rigth",marginLeft:'10px'}} onClick={this.onDelete} size="sm" disabled={this.state.selectCount >= 1?false:true}>
                      <IoMdTrash/> Delete
                    </Button>
              </div>
            </Col>
          </Row>
          <Row style={{marginTop:'20px'}}>
            <Col xs={12} md={12} lg={12} >
              <div style={{height:'400px',overflowY:'scroll'}}>
              <Table responsive className='tfonts'>
                    <thead>
                      <tr>
                        <th>Site</th>
                        <th>Vendor</th>
                        <th>Platform</th>
                        <th>Starting Bid</th>
                        <th>Campaign Budget</th>
                      </tr>
                    </thead>
                    <tbody style={{height: '1200px',overflowY:'scroll'}}>
                      {
                        this.state.bids.map((bid,i)=>{
                          return (
                            <tr key = {i} bid-index={i} style={{cursor:'pointer',backgroundColor:bid.selected?'#ff2f56':''}} onClick={this.onItemSelect}>
                            <td>{bid.site}</td>
                            <td>{bid.vendor}</td>
                            <td>{bid.platform}</td>
                            <td>{bid.starting_bid}</td>
                            <td>{bid.campaign_budget}</td>
                          </tr>
                          )
                        })
                      }
                    </tbody>
              </Table>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    );
  }
}

export default Bids;
