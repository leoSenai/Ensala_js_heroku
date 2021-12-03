import React from "react";
import {
  Table, Container, Row, Button, Col, Input
} from "reactstrap";
import { ArrayCompare } from "../componentes/utilidadePublica";
import Paginacao from "../componentes/paginacao";
import { GET, POST } from "../componentes/Request";
import { BarraInicial, ContainerFade, Navegacao, Cabecalho, BarraDePesquisa } from "../componentes/corpo"
import InputDefault from "../componentes/inputsPadroes";

class GerenciarEmailsProfessores extends React.Component {
  state = {
    check: "",
    assunto: "",
    corpoEmail: "",
    loading: false,
    modal: false,
    form: "none",
    desativar: true,
    checkBox: true,

    lista: [],
    listaCorrente: [],
    listaCache: [],
    barraPesquisa: ""

  }
  token = this.props.user.token

  preencheBarraDePesquisa(barraPesquisa) { this.setState({ barraPesquisa }) }

  //fields inserir
  preencheAssunto(assunto) { this.setState({ assunto }) }
  preencheCorpoEmail(corpoEmail) { this.setState({ corpoEmail }) }
  limparFormlulario() {
    this.setState({
      assunto: "",
      corpoEmail: ""
    })
  }

  preencheCheckbox(id, check) {
    let lista = this.state.lista
    let novaLista = []
    for (let i in lista) {
      let o = {};
      o.id = lista[i].id
      o.matricula = lista[i].matricula
      o.tipo = lista[i].tipo
      o.nome = lista[i].nome
      o.email = lista[i].email
      if (lista[i].id === id) {
        if (check === false) {
          o.check = true
        } else if (check === true) {
          o.check = false
        }
      } else o.check = lista[i].check
      novaLista.push(o)
    }
    this.setState({ lista: novaLista })
  }

  componentDidMount() {
    this.buscar();
  }

  enviarEmail = async () => {
    if (this.state.form === "block") {
      if (window.confirm("Deseja mesmo enviar?")) {
        let lista = this.state.lista
        let listaEnviar = []
        let o = {}

        o.assunto = this.state.assunto
        o.corpoEmail = this.state.corpoEmail

        for (let i in lista) {
          if (lista[i].check === true) {
            let o = {};
            o.id = lista[i].id
            o.matricula = lista[i].matricula
            o.tipo = lista[i].tipo
            o.nome = lista[i].nome
            o.email = lista[i].email
            listaEnviar.push(o)
          }
        }

        o.lista = listaEnviar
        if (!o.assunto.isEmpty() && !o.corpoEmail.isEmpty()) {
          if (o.lista.length > 0) {
            await POST("gerenciarEmails/enviarEmail/" + this.token, o)
              .finally(response => {
                console.log(response)
              })
          } else window.alert("Precisa selecionar alguém para enviar.")
        } else window.alert("Precisa preencher assunto e conteúdo, antes de enviar.")
      }
      // this.verificarEmails();
    } else alert("Abra o Corpo do E-mail antes de enviar")
  }

  enviarTodosEmails = async () => {
    if (this.state.form === "block") {
      let o = {}
      o.assunto = this.state.assunto
      o.corpoEmail = this.state.corpoEmail
      o.lista = []
      if (window.confirm("Deseja mesmo enviar?")) {
        await POST("gerenciarEmails/enviarTodosEmails/" + this.token, o)
          .finally(response => {
            console.log(response)
          })
      }
    } else alert("Abra o Corpo do E-mail antes de enviar")
  }

  // atualizar
  buscar = () => {
    // segundo atualiza <----------------------------
    GET("gerenciarEmails/listarProfessores/" + this.token)
      .then(response => {
        if (response === undefined | response.length === 0) throw new Error('Erro lista vazia.')
        this.setState({
          lista: response,
          listaCache: response,
          inicial: false
        })
      })
      .catch(err => {
        console.log(err)
        this.setState({
          lista: [],
          listaCache: [],
          inicial: true
        })
      }).finally(() => {
        this.setState({ loading: false })
      })
  }

  //modal
  checkToggle() {
    this.setState(prevState => ({
      checkBox: !prevState.checkBox
    }));
    let listaAux = []
    for (let item in this.state.lista) {
      let o = this.state.lista[item]
      if (this.state.checkBox)
        o.check = true
      if (!this.state.checkBox)
        o.check = false

      listaAux.push(o)
    }
    this.setState({
      lista: listaAux
    })
  }
  toggleForm() {
    if (this.state.form === "none") {
      this.setState(prevState => ({
        form: "block",
        desativar: false
      }));
    }
    if (this.state.form === "block") {
      this.setState(prevState => ({
        form: "none",
        desativar: true
      }));
    }
  }

  getRetornaListaCorrente(listaCorrente) {
    if (!ArrayCompare(listaCorrente, this.state.listaCorrente)) {
      this.setState({ listaCorrente });
    }
  }

  async barraPesquisa(listaFiltrada) {
    if (!ArrayCompare(this.state.lista, listaFiltrada)) {
      await this.setState({
        lista: listaFiltrada
      })
    }
  }

  render() {
    const { desativar, checkBox, assunto, corpoEmail, form } = this.state;

    return <div>
      <div>
        <Cabecalho user={this.props.user} />
      </div>
      <div className="corpo">
        <Row>
          <Navegacao user={this.props.user} />
          <ContainerFade>
            <Row>
              <div className="titulo">
                <h1>Gerenciar e-mails dos professores</h1>
              </div>
            </Row>
            <div className="cadastro">
              <Container>
                <Button outline onClick={this.toggleForm.bind(this)}>Corpo do E-mail</Button>
                <Button disabled={desativar} outline onClick={() => this.enviarEmail()} className="enviarTodos">Selecionados</Button>
                <Button disabled={desativar} outline onClick={() => this.enviarTodosEmails()} className="enviarTodos">Para todos</Button>
                <Col style={{ display: form, marginTop: "15px" }}>
                  <form>
                    <Row>
                      <Col xs={{ size: 12 }}>
                        <Col>
                          <InputDefault evento={this.preencheAssunto.bind(this)} valor={assunto} size="70" tipo="text" nome="assunto" titulo="Assunto" descricao="Assunto" />
                        </Col>
                        <Col>
                          <InputDefault evento={this.preencheCorpoEmail.bind(this)} valor={corpoEmail} size="3000" tipo="textarea" nome="corpoEmail" titulo="Conteúdo" descricao="Escreva o aqui..." />
                        </Col>
                      </Col>
                    </Row>
                  </form>
                </Col>
              </Container>
            </div>
            <div className="div_tabela">
              <div className="barra_menu">
                <div className="w-50">
                  <BarraDePesquisa
                    funcPesquisa={this.barraPesquisa.bind(this)}
                    pesquisa={this.state.barraPesquisa}
                    attBarra={this.preencheBarraDePesquisa.bind(this)}
                    indicador="nome"
                    lista={this.state.listaCache} />
                </div>
                <div className="w-50">

                  <Paginacao
                    lista={this.state.lista}
                    total={this.state.lista.length}
                    retornaLista={this.getRetornaListaCorrente.bind(this)}
                  />
                </div>
              </div>
              <Table>
                <thead>
                  <tr>
                    <th className="checkAll" width="7%">
                      <Input checked={!checkBox} type="checkbox" id="check" className="checkmark" name="check" onClick={() => this.checkToggle()} />
                    </th>
                    <th width="10%">Matrícula</th>
                    <th width="10%">Tipo</th>
                    <th width="35%">Professor</th>
                    <th width="35%">E-mail</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.listaCorrente.map(o => {
                    if (o.check === undefined) o.check = false;
                    return (
                      <tr onClick={() => this.preencheCheckbox(o.id, o.check)} key={o.id}>
                        <td className="acao" >
                          <Input checked={o.check} type="checkbox" id="check" className="checkmark" name="check" />
                        </td>
                        <td>{o.matricula}</td>
                        <td>{o.tipo}</td>
                        <td>{o.nome}</td>
                        <td>{o.email}</td>
                      </tr>
                    );
                  })}
                  {
                    this.state.lista.length > 0 ? <BarraInicial exec={false} message='Não possui itens para carregar.' colspan="5" /> : <BarraInicial exec={true} message='Não possui itens para carregar.' colspan="5" />
                  }
                </tbody>
              </Table>
            </div>
          </ContainerFade>
        </Row>
      </div >
    </div >
  };
}
export default GerenciarEmailsProfessores

