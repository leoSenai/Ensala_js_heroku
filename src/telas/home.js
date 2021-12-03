import React from "react";
import { Row, Col, Fade } from "reactstrap";
import { Navegacao, Cabecalho } from "../componentes/corpo"
import { withRouter } from "react-router-dom";
import Cookies from 'js-cookie';

class Home extends React.Component {
  componentDidMount() {
    Cookies.set("ultimaPagina", "/home")
  }
  render() {
    return <div>
      <div>
        <Cabecalho user={this.props.user} />
      </div>
      <div className="corpo">
        <Row>
          <Navegacao user={this.props.user} />
          <Fade>
            <div className="containerCorpo">
              <Col>
                <div className="titulo">
                  <h1>Bem vindo!</h1>
                </div>
              </Col>
            </div>
          </Fade>
        </Row>
      </div>
    </div>
  };
}

export default withRouter(Home);
