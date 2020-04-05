import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './Home.css';

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

class Home extends React.Component {
  message={
    LOADPIEDATA:'LOADPIEDATA',
    LOADPIEDATARESP:'LOADPIEDATARESP'
  }
  constructor(props) {
    super(props);
    this.state = {
      options:{
        credits: {
          enabled: false
        },
        chart:{
          type:'pie'
        },
        title: {
          text: 'Sprinklr Site AD Volume'
        },
        series: []
      }
    }
    this._loadPieData = this._loadPieData.bind(this);
  }
  componentDidMount(){
    window.ipcRenderer.on(this.message.LOADPIEDATARESP, this._loadPieData);
    window.ipcRenderer.send(this.message.LOADPIEDATA);
  }
  componentWillUnmount() {
    window.ipcRenderer.removeListener(this.message.LOADPIEDATARESP, this._loadPieData)
  }
  _loadPieData(event,res){
    if(res.status === 'ok'){
          this.setState(state=>{
            const options = this.state.options;
            options.series[0]={data: res.data};
            return {
              options,
            }
        })
    }else{
      console.log(`${res.message}`);
      console.log(`${res.data}`);
    }
   
  }

  render() {
    return (
      <section className="page" id="home-page">
        <Container fluid>
          <Row>
            <Col sm={12} md={12} lg={12}>
              <h1>Home</h1>
              <hr/>
            </Col>
          </Row>
          <Row>
            <Col sm={12} md={12} lg={12}>
              {
               this.state.options.series.length > 0?<HighchartsReact highcharts={Highcharts} options={this.state.options} />:' No Data Available'
              }
            </Col>
          </Row>
        </Container>
      </section>
    );
  }
}

export default Home;
