import React from 'react';
import logoSENAI from '../img/senai.png';
import logoSESI from '../img/sesi.png';
import { Row, Col, Container, Button, InputGroup, Input } from 'reactstrap';
import { POST } from "../componentes/Request";
import { withRouter } from "react-router-dom";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      usuario: "",
      senha: ""
    }
  }
  setUsuario(usuario) {
    this.setState({ usuario: usuario.target.value });
  }
  setSenha(senha) {
    this.setState({ senha: senha.target.value });
  }
  componentDidMount() {
    this.props.history.push(this.props.user.memoriaUrl())
  }
  logar = async o => {
    let response = await POST('login/autenticacao', o, this.token)

    if (response !== undefined & response !== 0 & response !== "") {

      await this.props.setId(response.professor.id)
      await this.props.setUsuario(response.professor.nome)
      await this.props.setPermissao(response.professor.permissao)
      await this.props.setToken(response.token)
      await this.props.setCookies()
      await this.props.login()

      this.props.history.push("/home")
    }
  }

  handleSubmit(event) {
    var o = {};
    o.usuario = this.state.usuario.toLowerCase().replaceAll(" ", "")
    o.senha = this.state.senha
    this.logar(o);
  }

  handleEnter(event) { 
    if(event.keyCode === 13){
      this.handleSubmit();
    }
  }

  cadastroProfessor() {
    this.props.history.push("/cadastroTelaInicial")
  }
  esqueciMinhaSenha() {
    this.props.history.push("/esqueciMinhaSenha")
  }
  render() {
    return <div className="body">
      <Container>
        <Row>
          <Col sm={{ size: 4, order: 1, offset: 4 }}>
            <form className="linhacontainer formulario" onSubmit={this.handleSubmit}>
              <div align="center">
                <h1 className="txtLogo">Login</h1>
              </div>
              <Row>
                <Col>
                  <img src={logoSESI} className="App-logo" alt="logo" />
                </Col>
                <Col>
                  <img src={logoSENAI} className="App-logo" alt="logo" />
                </Col>
              </Row>
              <InputGroup>
                <Input placeholder="E-mail:" name="usuario" value={this.state.usuario} onChange={this.setUsuario.bind(this)} />
              </InputGroup>
              <InputGroup>
                <Input type="password" className="empurrar" onKeyUp={this.handleEnter.bind(this)} name="senha" placeholder="Senha:" value={this.state.senha} onChange={this.setSenha.bind(this)} />
              </InputGroup>
              <div className="botaoLogin">
                <Button block onClick={this.handleSubmit.bind(this)} className="btn-login">Entrar</Button>
              </div>
              <Row>
                <Col>
                  <button className="btn_telaInicial" type="button" onClick={this.cadastroProfessor.bind(this)}>Cadastre-se</button>
                </Col>
                <Col>
                  <button className="btn_telaInicial" type="button" onClick={this.esqueciMinhaSenha.bind(this)}>Esqueci minha senha</button>
                </Col>
              </Row>
            </form>
          </Col>
        </Row>
      </Container>
    </div>
  }
}
export default withRouter(Login)