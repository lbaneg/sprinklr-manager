import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
//import Col from 'react-bootstrap/Col';



class Bids extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
    
  }
 

  render() {
    return (
      <section className="page" id="bids-page">
        <Container fluid>
          <Row>
            <h1>Bids</h1>
          </Row>

        </Container>
      </section>
    );
  }
}

export default Bids;
