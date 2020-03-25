import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';


class Audience extends React.Component {
  message = {
    LOADAUD:'LOADAUD',
    LOADAUDR:'LOADAUDR'
  }
  constructor(props) {
    super(props);
    this.state = {
      audience: []
    }
    
    this._loadAudiences = this._loadAudiences.bind(this);
    
  }
  componentDidMount() {
    window.ipcRenderer.on(this.message.LOADAUDR, this._loadAudiences);
    const res = window.ipcRenderer.send(this.message.LOADAUD);
    console.log('RESPONSE', res);
  }
  componentWillUnmount() {
    window.ipcRenderer.removeListener(this.message.LOADAUDR, this._loadAudiences)
  }
  _loadAudiences(event,res){
    this.setState({audience:res});
  }

  render() {
    return (
      <section className="page" id="audience-page">
        <Container fluid>
          <Row>
            <Col sm={12} md={12} lg={12}>
              <h1>Audience</h1>
              <hr/>
            </Col>
          </Row>
          <Row>
            <Col xs={12} md={12} lg={12}>
            <Table responsive className='tfonts'>
                    <thead>
                      <tr>
                        <th>Page</th>
                        <th>Target</th>
                        <th>Age Min</th>
                        <th>Age Max</th>
                        <th>Gender</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        this.state.audience.map((aud,i)=>{
                          return (
                            <tr key = {i}>
                            <td>{aud.page}</td>
                            <td>{aud.target}</td>
                            <td>{aud.age_min}</td>
                            <td>{aud.age_max}</td>
                            <td>{aud.gender}</td>
                          </tr>
                          )
                        })
                      }
                    </tbody>
              </Table>
            </Col>
          </Row>
        </Container>
      </section>
    );
  }
}

export default Audience;
