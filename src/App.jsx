import React from 'react';
import './App.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Upload from './components/upload/Upload';
import Home from './components/home/Home';
import Sidebar from './components/sidebar/Sidebar';
import Bids from './components/bids/Bids';
import Audience from './components/audience/Audience';
import { Route, withRouter } from 'react-router-dom';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab:0
    }

    this.onTabClick = this.onTabClick.bind(this); 
  }
  onTabClick(event){
   
    const id = Number(event.currentTarget.id);
    switch(id){
      case 0:
        this.props.history.push(`/`);
        break;
      case 1:
       this.props.history.push('/upload');
      break;
      case 2:
        this.props.history.push('/bids');
        break;
      case 3:
        this.props.history.push('/audience');
        break;    
      default:
        //history.push(`/`);
    }
    
    this.setState({activeTab:id})
  }

  render() {
    return (
      <section id="app">
        <Container fluid>
          <Row>
            <Col xs = {1} md ={1} lg = {1}>
              <Sidebar onTabClick = {this.onTabClick} activeTab = {this.state.activeTab} />
            </Col>
            <Col  xs = {11} md = {11} lg = {11}>
              
                        <Route exact={true}  path='/' component={Home}/>
                        <Route exact={true}  path='/upload' component={Upload}/>
                        <Route exact={true}  path='/bids' component={Bids}/>
                        <Route exact={true}  path='/audience' component={Audience}/>    
              
            </Col>
          </Row>
        </Container>
      </section>
    );
  }
}

export default withRouter(App);
