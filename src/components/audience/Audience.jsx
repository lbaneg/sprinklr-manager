import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';
import {IoMdCreate,IoMdOpen,IoMdTrash} from 'react-icons/io';
import {IoIosCloseCircleOutline} from 'react-icons/io';

class audiences extends React.Component {
  message = {
    LOADAUD:'LOADAUD',
    LOADAUDR:'LOADAUDR',
    CREATEAUD:'CREATEAUD',
    DELETEAUD:'DELETEAUD',
    EDITAUD:'EDITAUD'
  }
  buttonId={
    EDIT:'E',
    NEW:'N'
  }
  constructor(props) {
    super(props);
    this.state = {
      audiences: [],
      showNewModel:false,
      audience:{},
      showAlert:false,
      selectCount:0,
      showEditModal:false,
      showDeleteModal:false,
      editModel:{}
    }

    this._loadaudiences = this._loadaudiences.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onNew = this.onNew.bind(this);
    this.onSaveChanges = this.onSaveChanges.bind(this);
    this.onItemSelect = this.onItemSelect.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onCloseAlert = this.onCloseAlert.bind(this);
    this.onEdit = this.onEdit.bind(this);
    this.onEditChange = this.onEditChange.bind(this);
  }
  componentDidMount() {
    window.ipcRenderer.on(this.message.LOADAUDR, this._loadaudiences);
    window.ipcRenderer.send(this.message.LOADAUD);
  }
  componentWillUnmount() {
    window.ipcRenderer.removeListener(this.message.LOADAUDR, this._loadaudiences)
  }
  _loadaudiences(event,res){
    this.setState({audiences:res.map(elm=>{
      return {selected:false,...elm}
    })});
  }
  onDelete(e){
    const audiences = this.state.audiences.filter(elm=>{
      return elm.selected === true;
    });
   window.ipcRenderer.send(this.message.DELETEAUD,audiences);
   this.setState({showNewModel:false,showAlert:true,selectCount:0,showEditModal:false});
 }
 onNew(e){
     this.setState({showNewModel:true})
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
  onSaveChanges(e){
    const EVENTID = e.currentTarget.getAttribute('btnid');

    switch(EVENTID){
      case this.buttonId.EDIT:
        window.ipcRenderer.send(this.message.EDITAUD,this.state.editModel);
        this.setState({showNewModel:false,showAlert:true,selectCount:0,showEditModal:false});
      break;
      default:
        const audience = this.state.audience;
        window.ipcRenderer.send(this.message.CREATEAUD,audience);
        this.setState({showNewModel:false,showAlert:true,selectCount:0,showEditModal:false});
    }
  
  }
  onClose(e){
    this.setState({showNewModel:false});
    this.setState({showEditModal:false});
  }
  onItemSelect(e){
      const INDEX = Number(e.currentTarget.getAttribute('aud-index'));
      this.setState(state=>{
        let selectCount = state.selectCount;
        let audiences = state.audiences.map((elm,j)=>{
            if(INDEX === j){
              elm.selected = !elm.selected;
              elm.selected?selectCount++:selectCount--;
            }
            return elm;
        })
        return {
          audiences:audiences,
          selectCount:selectCount,
        }
      })
  }
  onCloseAlert(e){
    this.setState({showAlert:false});
  }
  onEdit(e){
    const audiences = this.state.audiences;
    for(let aud of audiences){
      if(aud.selected){
        this.setState({editModel:aud,showEditModal:true});
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
            <Col>
                <Modal show={this.state.showNewModel} onHide={this.onClose}>
                    <Modal.Header closeButton>
                      <Modal.Title>Create new Audience</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <Form>
                    <Form.Group>
                      <Form.Label>Site</Form.Label>
                      <Form.Control type="text" id="site" placeholder="CNET" value={this.state.value} onChange={this.onChange}/>
                    </Form.Group> 
                    <Form.Group>
                      <Form.Label>Audience Name</Form.Label>
                      <Form.Control type="text" id="audience_name" placeholder="DEMO 16+" value={this.state.value} onChange={this.onChange} />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Min Age</Form.Label>
                      <Form.Control type="number" min="0" step="1" id="age_min" placeholder="16" value={this.state.value} onChange={this.onChange} />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Max Age</Form.Label>
                      <Form.Control type="number" min="0" step="1" id="age_max" placeholder="65" value={this.state.value} onChange={this.onChange}  />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Gender</Form.Label>
                      <Form.Control type="text" id="gender" placeholder="Male,Female" value={this.state.value} onChange={this.onChange}/>
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Sprinklr Targeting ID</Form.Label>
                      <Form.Control type="text" id="sprinklr_targeting_id" placeholder="5628347" value={this.state.value} onChange={this.onChange} />
                    </Form.Group>
                   </Form>
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
                <Modal show={this.state.showEditModal} onHide={this.onClose}>
                    <Modal.Header closeButton>
                      <Modal.Title>Edit  Audience</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <Form>    
                    <Form.Group>
                      <Form.Label>Site</Form.Label>
                      <Form.Control type="text" id="site" placeholder="CNET" value={this.state.editModel.site} onChange={this.onEditChange} />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Audience Name</Form.Label>
                      <Form.Control type="text" id="audience_name" placeholder="DEMO 16+" value={this.state.editModel.audience_name} onChange={this.onEditChange}/>
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Min Age</Form.Label>
                      <Form.Control type="number" min="0" step="1" id="age_min" placeholder="16" value={this.state.editModel.age_min} onChange={this.onEditChange} />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Max Age</Form.Label>
                      <Form.Control type="number" min="0" step="1" id="age_max" placeholder="65" value={this.state.editModel.age_max} onChange={this.onEditChange}/>
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Gender</Form.Label>
                      <Form.Control type="text" id="gender" placeholder="Male,Female" value={this.state.editModel.gender} onChange={this.onEditChange}/>
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Sprinklr Targeting ID</Form.Label>
                      <Form.Control type="text" id="sprinklr_targeting_id" placeholder="39879812" value={this.state.editModel.sprinklr_targeting_id} onChange={this.onEditChange} />
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

                    <Button variant="primary" style={{float:'left'}} onClick={this.onNew} size="sm">
                     <IoMdCreate/> Create
                    </Button>
                   
                    <Button variant="warning" style={{float:"rigth",marginLeft:'10px'}} onClick={this.onEdit} size="sm" disabled={this.state.selectCount === 1?false:true}>
                      <IoMdOpen/> Edit
                    </Button>
                    <Button variant="danger" style={{float:"rigth",marginLeft:'10px'}} onClick={this.onDelete} size='sm' disabled={this.state.selectCount >= 1?false:true}>
                      <IoMdTrash/> Delete
                    </Button>
                      
              </div>
            </Col>
          </Row>
          <Row style={{marginTop:'20px'}}>
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
                          <th>Sprinklr Targeting ID</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          this.state.audiences.map((aud,i)=>{
                            return (
                            <tr key = {i} aud-index={i} style={{cursor:'pointer',backgroundColor:aud.selected?'#ff2f56':''}} onClick={this.onItemSelect}>
                              <td>{aud.site}</td>
                              <td>{aud.audience_name}</td>
                              <td>{aud.age_min}</td>
                              <td>{aud.age_max}</td>
                              <td>{aud.gender}</td>
                              <td>{aud.sprinklr_targeting_id}</td>
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
