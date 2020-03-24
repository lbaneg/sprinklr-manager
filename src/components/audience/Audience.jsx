import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
//import Col from 'react-bootstrap/Col';



class Audience extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
    
  }
 

  render() {
    return (
      <section className="page" id="audience-page">
        <Container fluid>
          <Row>
            <h1>Audience</h1>
          </Row>

        </Container>
      </section>
    );
  }
}

export default Audience;
