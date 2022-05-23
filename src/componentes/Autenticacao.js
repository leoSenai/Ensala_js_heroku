import React from 'react'
import Login from '../telas/login';
import TelaInicial from '../telas/home';
import Modalidade from '../telas/modalidade';
import Professor from '../telas/professor';
import AreaConhecimento from '../telas/areaConhecimento';
import UnidadeCurricular from '../telas/unidadeCurricular';
import GerenciarEmailsProfessores from '../telas/gerenciarEmailsProfessores';
import Disponibilidade from '../telas/disponibilidade';
import Competencia from '../telas/gerenciarCompetencia';
import CadastroTelaInicial from '../telas/cadastroTelaInicial';
import RelacionamentoUnidadeCurricular from '../telas/componentes/relacionamentoUnidadeCurricular';
import RelacionamentoSegmentoTecnologico from '../telas/componentes/relacionamentoSegmentoTecnologico';
import EsqueciMinhaSenha from '../telas/esqueciMinhaSenha';
import FinalizarCadastro from '../telas/finalizarCadastro';
import { AlterarSenha, AlterarSenhaFail } from '../telas/alterarSenha';
import ConsultaDisponibilidade from '../telas/ConsultaDisponibilidade';
import ConsultaCompetencia from '../telas/ConsultaCompetencia';
import Logout from '../telas/logout';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import Cookies from 'js-cookie';

const userContext = React.createContext({
  id: '',
  usuario: '',
  permissao: '',
  token: ''
});

class Autenticacao extends React.Component {
  state = {
    id: "",
    usuario: "",
    permissao: "",
    token: "",
    inOut: false,
    memoriaUrl: () => {
      return Cookies.get("ultimaPagina")
    },
  }

  async componentDidMount() {
    await this.setUserWithCookies()
  }

  async setId(id) {
    await this.setState({ id })
  }
  async setUsuario(usuario) {
    await this.setState({ usuario })
  }
  async setPermissao(permissao) {
    await this.setState({ permissao })
  }
  async setToken(token) {
    await this.setState({ token })
  }

  login() {
    this.setState({
      inOut: true
    })
  }

  logout() {
    this.setState({
      id: "",
      usuario: "",
      permissao: "",
      token: "",
      inOut: false,
    })
    Cookies.remove("id")
    Cookies.remove("usuario")
    Cookies.remove("permissao")
    Cookies.remove("token")
    Cookies.remove("ultimaPagina")
  }

  async setCookies() {
    await Cookies.set("id", this.state.id)
    await Cookies.set("usuario", this.state.usuario)
    await Cookies.set("permissao", this.state.permissao)
    await Cookies.set("token", this.state.token)
  }

  async setUserWithCookies() {
    if (Cookies.get("id") === undefined ||
      Cookies.get("usuario") === undefined ||
      Cookies.get("permissao") === undefined ||
      Cookies.get("token") === undefined)
      return false;

    await this.setState({
      id: Cookies.get("id"),
      usuario: Cookies.get("usuario"),
      permissao: Cookies.get("permissao"),
      token: Cookies.get("token"),
      inOut: true,
    })
  }

  render() {
    const { inOut } = this.state
    return (
      <>
        <userContext.Provider value={this.state}>
          <userContext.Consumer>
            {
              (value) => (
                <Router>
                  <Switch>
                    <Route path="/" exact={true} >
                      <Login
                        user={value}
                        setId={this.setId.bind(this)}
                        setUsuario={this.setUsuario.bind(this)}
                        setPermissao={this.setPermissao.bind(this)}
                        setToken={this.setToken.bind(this)}
                        login={this.login.bind(this)}
                        setCookies={this.setCookies.bind(this)} />
                    </Route>
                    <Route path="/cadastroTelaInicial">
                      <CadastroTelaInicial user={value} />
                    </Route>
                    <Route path="/esqueciMinhaSenha" >
                      <EsqueciMinhaSenha user={value} />
                    </Route>
                    <Route path="/alterarSenha/:token">
                      <AlterarSenha user={value} />
                    </Route>
                    <Route path="/alterarSenha">
                      <AlterarSenhaFail user={value} />
                    </Route>
                    <Route path="/finalizarCadastro/:token">
                      <FinalizarCadastro user={value} />
                    </Route>
                    <Route path="/logout">
                      <Logout user={value} logout={this.logout.bind(this)} />
                    </Route>
                    <RotaPrivada inOut={inOut} path="/home" >
                      <TelaInicial user={value} />
                    </RotaPrivada>
                    <RotaPrivada inOut={inOut} path="/relacionamentoUnidadeCurricular/:id/:token" >
                      <RelacionamentoUnidadeCurricular user={value} />
                    </RotaPrivada>
                    <RotaPrivada inOut={inOut} path="/relacionamentoSegmentoTecnologico/:id/:token" >
                      <RelacionamentoSegmentoTecnologico user={value} />
                    </RotaPrivada>
                    <RotaPrivada inOut={inOut} path="/cadastro/professor">
                      <Professor user={value} />
                    </RotaPrivada>
                    <RotaPrivada inOut={inOut} path="/cadastro/modalidade">
                      <Modalidade user={value} />
                    </RotaPrivada>
                    <RotaPrivada inOut={inOut} path="/cadastro/areaConhecimento">
                      <AreaConhecimento user={value} />
                    </RotaPrivada>
                    <RotaPrivada inOut={inOut} path="/cadastro/unidadeCurricular">
                      <UnidadeCurricular user={value} />
                    </RotaPrivada>
                    <RotaPrivada inOut={inOut} path="/processo/gerenciaremailsprofessores">
                      <GerenciarEmailsProfessores user={value} />
                    </RotaPrivada>
                    <RotaPrivada inOut={inOut} path="/processo/disponibilidade">
                      <Disponibilidade user={value} />
                    </RotaPrivada>
                    <RotaPrivada inOut={inOut} path="/processo/competencia">
                      <Competencia user={value} />
                    </RotaPrivada>
                    <RotaPrivada inOut={inOut} path="/consulta/consultadisponibilidade">
                      <ConsultaDisponibilidade user={value} />
                    </RotaPrivada>
                    <RotaPrivada inOut={inOut} path="/consulta/consultacompetencia">
                      <ConsultaCompetencia user={value} />
                    </RotaPrivada>
                  </Switch>
                </ Router>
              )
            }
          </userContext.Consumer>
        </userContext.Provider>
      </>
    );
  }
}
export default Autenticacao
export class RotaPrivada extends React.Component {
  render() {
    const { inOut, path } = this.props
    return (
      <Route path={path} >
        {
          inOut ? (this.props.children) :
            (
              <Redirect
                to={{
                  pathname: "/",
                }}
              />
            )
        }
      </Route>

    )
  }
}
