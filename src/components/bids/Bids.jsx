import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Modal from 'react-bootstrap/Modal';
import {IoMdCreate} from 'react-icons/io';
import {IoMdTrash} from 'react-icons/io';
import {IoIosCloseCircleOutline} from 'react-icons/io';
class Bids extends React.Component {
  message = {
    LOADBIDS:'LOADBIDS',
    LOADBIDSRESP:'LOADBIDSRESP',
    DELETEBIDS:'DELETEBIDS',
    CREATEBID:'CREATEBID'
  }
  constructor(props) {
    super(props);
    this.state = {
      bids:[],
      show:false,
      deletedItems:[],
      bid:{
        site:'',
        vendor:'',
        starting_bid:'',
        campaign_budget:'',
        showAlert:false
      }
    }
    this._loadBids = this._loadBids.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onItemSelect = this.onItemSelect.bind(this);
    this.onNew = this.onNew.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onSaveChanges = this.onSaveChanges.bind(this);
    this.onCloseAlert = this.onCloseAlert.bind(this); 
  }
  componentDidMount() {
    window.ipcRenderer.on(this.message.LOADBIDSRESP, this._loadBids)
    window.ipcRenderer.send(this.message.LOADBIDS);
  }
  componentWillUnmount() {
    window.ipcRenderer.removeListener(this.message.LOADBIDSRESP, this._loadBids)
  }
  _loadBids(event,res){
    this.setState({bids:res.map(elm=>{
      return {selected:false,...elm}
    })});
  }
  onClose(e){
    this.setState({show:false});
  }
  onItemSelect(e){
      const INDEX = Number(e.currentTarget.getAttribute('bid-index'));
      this.setState(state=>{
        let bids = state.bids.map((elm,j)=>{
            if(INDEX === j){
              elm.selected = !elm.selected;
            }
            return elm;
        })
        return {
          bids:bids,
        }
      })
  }
  onDelete(e){
    //  const bids = this.state.bids.filter(elm=>{
    //     return elm.selected === false;
    //   });
      const deletebids = this.state.bids.filter(elm=>{
        return elm.selected === true;
      });
    //this.setState({bids:bids});
    window.ipcRenderer.send(this.message.DELETEBIDS,deletebids);
    window.ipcRenderer.send(this.message.LOADBIDS);
    this.setState({showAlert:true});
  }
  onNew(e){
      this.setState({show:true})
  }
  onSaveChanges(){
    //var bids = this.state.bids;
    const bid = this.state.bid
    // bids.push(bid);
    // this.setState({bids});
    window.ipcRenderer.send(this.message.CREATEBID,bid);
    window.ipcRenderer.send(this.message.LOADBIDS);
    this.onClose();
    this.setState({showAlert:true});
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
                <Modal show={this.state.show} onHide={this.onClose}>
                    <Modal.Header closeButton>
                      <Modal.Title>Create new Bid</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <input type="text" id="site" placeholder="Site" value={this.state.value} onChange={this.handleChange}/>
                    <input type="text" id="vendor" placeholder="Vendor" value={this.state.value} onChange={this.handleChange} />
                    <input type="number" id="starting_bid" placeholder="Starting Bid" value={this.state.value} onChange={this.handleChange} />
                    <input type="number" id="campaign_budget" placeholder="Campaign Budget" value={this.state.value} onChange={this.handleChange} />
                    </Modal.Body>
                    <Modal.Footer>
                      <Button variant="secondary" onClick={this.onClose}>
                        Close
                      </Button>
                      <Button variant="primary"id="save" onClick={this.onSaveChanges}>
                        Save Changes
                      </Button>
                    </Modal.Footer>
                  </Modal>
            </Col>
          </Row>
          <Row>
            <Col xs={12} md={12} lg={12}>
              <div style={{float:'rigth',width:'200px',height:'50px'}}>

                    <Button variant="primary" style={{float:'left'}} onClick={this.onNew}>
                     <IoMdCreate/> New
                    </Button>
                 
                    <Button variant="danger" style={{float:"rigth",marginLeft:'10px'}} onClick={this.onDelete}>
                      <IoMdTrash/> Delete
                    </Button>
                  
              </div>
            </Col>
          </Row>
          <Row>
            <Col xs={12} md={12} lg={12} >
              <div style={{height:'400px',overflowY:'scroll'}}>
              <Table responsive className='tfonts'>
                    <thead>
                      <tr>
                        <th>Site</th>
                        <th>Vendor</th>
                        <th>Starting Bid</th>
                        <th>Campaign Budget</th>
                      </tr>
                    </thead>
                    <tbody style={{height: '1200px',overflowY:'scroll'}}>
                      {
                        this.state.bids.map((bid,i)=>{
                          return (
                            <tr key = {i} bid-index={i} style={{cursor:'pointer',backgroundColor:bid.selected?'red':''}} onClick={this.onItemSelect}>
                            <td>{bid.site}</td>
                            <td>{bid.vendor}</td>
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
