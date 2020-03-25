import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';



class Bids extends React.Component {
  message = {
    GETBIDS:'GETBIDS',
    GETBIDSRESP:'GETBIDSRESP'
  }
  constructor(props) {
    super(props);
    this.state = {
      bids:[]
    }
    this._loadBids = this._loadBids.bind(this);
    
  }
  componentDidMount() {
    window.ipcRenderer.on(this.message.GETBIDSRESP, this._loadBids)
    const res = window.ipcRenderer.send(this.message.GETBIDS);
    console.log('RESPONSE', res);
  }
  componentWillUnmount() {
    window.ipcRenderer.removeListener(this.message.GETBIDSRESP, this._loadBids)
  }
  _loadBids(event,res){
    this.setState({bids:res});
  }

  render() {
    return (
      <section className="page" id="bids-page">
        <Container fluid>
          <Row>
            <Col sm={12} md={12} lg={12}>
              <h1>Bids</h1>
              <hr/>
            </Col>
          </Row>
          <Row>
            <Col xs={12} md={12} lg={12}>
            <Table responsive className='tfonts'>
                    <thead>
                      <tr>
                        <th>Site</th>
                        <th>Vendor</th>
                        <th>Starting Bid</th>
                        <th>Campaign Budget</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        this.state.bids.map((bid,i)=>{
                          return (
                            <tr key = {i}>
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
            </Col>
          </Row>
        </Container>
      </section>
    );
  }
}

export default Bids;
