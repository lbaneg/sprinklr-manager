import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Alert from 'react-bootstrap/Alert';
import {IoMdCreate} from 'react-icons/io';
import {IoMdTrash} from 'react-icons/io';
import {IoIosCloseCircleOutline} from 'react-icons/io';

class audiences extends React.Component {
  message = {
    LOADAUD:'LOADAUD',
    LOADAUDR:'LOADAUDR',
    CREATEAUD:'CREATEAUD',
    DELETEAUD:'DELETEAUD'
  }
  constructor(props) {
    super(props);
    this.state = {
      audiences: [],
      show:false,
      audience:{},
      showAlert:false
    }
    
    this._loadaudiences = this._loadaudiences.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onNew = this.onNew.bind(this);
    this.onSaveChanges = this.onSaveChanges.bind(this);
    this.onItemSelect = this.onItemSelect.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onCloseAlert = this.onCloseAlert.bind(this); 
  }
  componentDidMount() {
    window.ipcRenderer.on(this.message.LOADAUDR, this._loadaudiences);
    window.ipcRenderer.send(this.message.LOADAUD);
  }
  componentWillUnmount() {
    window.ipcRenderer.removeListener(this.message.LOADAUDR, this._loadaudiences)
  }
  _loadaudiences(event,res){
    this.setState({audiences:res});
  }
  onDelete(e){
    const audiences = this.state.audiences.filter(elm=>{
      return elm.selected === true;
    });
   window.ipcRenderer.send(this.message.DELETEAUD,audiences);
   window.ipcRenderer.send(this.message.LOADAUD);
   this.setState({showAlert:true});
 }
 onNew(e){
     this.setState({show:true})
 }
  onChange(event){
    let VALUE = event.target.value;
    const ID = event.target.id;
    if(typeof(VALUE) === 'number') VALUE+='';
      this.setState(state=>{
        var audience = {...state.audience}
        audience[`${ID}`] = VALUE;
        return{
          audience,
        }
      });
  }
  onSaveChanges(){
    const audience = this.state.audience;
    window.ipcRenderer.send(this.message.CREATEAUD,audience);
    window.ipcRenderer.send(this.message.LOADAUD);
    this.setState({show:false});
    this.setState({showAlert:true});
  }
  onClose(e){
    this.setState({show:false});
  }
  onItemSelect(e){
      const INDEX = Number(e.currentTarget.getAttribute('aud-index'));
      this.setState(state=>{
        let audiences = state.audiences.map((elm,j)=>{
            if(INDEX === j){
              elm.selected = !elm.selected;
            }
            return elm;
        })
        return {
          bids:audiences,
        }
      })
  }
  onCloseAlert(e){
    this.setState({showAlert:false});
  }
  render() {
    return (
      <section className="page" id="audiences-page">
        <Container fluid>
          <Row>
            <Col sm={12} md={12} lg={12}>
              <h1>Audiences</h1>
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
          <Row>
            <Col>
                <Modal show={this.state.show} onHide={this.onClose}>
                    <Modal.Header closeButton>
                      <Modal.Title>Create new Audience</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <input type="text" id="site" placeholder="Site Name" value={this.state.value} onChange={this.onChange}/>
                    <input type="text" id="audience_name" placeholder="Audience Name" value={this.state.value} onChange={this.onChange} />
                    <input type="number" id="age_min" placeholder="Age Min" value={this.state.value} onChange={this.onChange} />
                    <input type="number" id="age_max" placeholder="Age Max" value={this.state.value} onChange={this.onChange} />
                    <input type="text" id="gender" placeholder="Gender" value={this.state.value} onChange={this.onChange} />
                    <input type="text" id="sprinklr_targeting_id" placeholder="Sprinklr Targeting ID" value={this.state.value} onChange={this.onChange} />
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
            <Col xs={12} md={12} lg={12}>
            <div style={{height:'400px',overflowY:'scroll'}}>

            <Table responsive className='tfonts'>
                    <thead>
                      <tr>
                        <th>Site</th>
                        <th>Audience Name</th>
                        <th>Age Min</th>
                        <th>Age Max</th>
                        <th>Gender</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        this.state.audiences.map((aud,i)=>{
                          return (
                            <tr key = {i} aud-index={i} style={{cursor:'pointer',backgroundColor:aud.selected?'red':''}} onClick={this.onItemSelect}>
                            <td>{aud.site}</td>
                            <td>{aud.audience_name}</td>
                            <td>{aud.age_min}</td>
                            <td>{aud.age_max}</td>
                            <td>{aud.gender}</td>
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

export default audiences;
