import React from "react";
import {
  Table, Container, Row, Button, Col, Modal, ModalHeader, ModalBody, ModalFooter
} from "reactstrap";
import InputDefault from "../componentes/inputsPadroes";
import { ArrayCompare } from "../componentes/utilidadePublica";
import Paginacao from "../componentes/paginacao";
import { BotaoEnviar, BotaoResetar } from "../componentes/botoes";
import { BarraInicial, ContainerFade, Navegacao, Cabecalho, BarraDePesquisa } from "../componentes/corpo"
import { POST, GET, PUT, DELETE, Loading } from "../componentes/Request";
import {
  withRouter
} from "react-router-dom";

class AreaConhecimento extends React.Component {
  state = {
    id: "",
    descricao: "",
    nome: "",
    id__: "",
    descricao__: "",
    nome__: "",
    loading: false,
    modal: false,
    inicial: true,
    form: "none",
    listaCache: [],
    lista: [],
    listaCorrente: [],
    barraPesquisa: ""
  }
  token = this.props.user.token
  toggle = this.toggle.bind(this)

  preencheBarraDePesquisa(barraPesquisa) { this.setState({ barraPesquisa }) }

  //fields inserir
  preencheNome(nome) { this.setState({ nome }) }
  preencheDescricao(descricao) { this.setState({ descricao }) }
  limparFormlulario() {
    this.setState({
      nome: "",
      descricao: ""
    })
  }
  //fields alterar
  preencheId__(id__) { this.setState({ id__ }) }
  preencheNome__(nome__) { this.setState({ nome__ }) }
  preencheDescricao__(descricao__) { this.setState({ descricao__ }) }
  limparFormlulario__() {
    this.setState({
      nome__: "",
      descricao__: ""
    })
  }

  async componentDidMount() {
    await this.buscar();
  }
  // inserir
  inserir = async o => {
    this.setState({ loading: true });
    await POST("areaConhecimento/inserir/" + this.token, o)
    this.buscar();
  }
  enviaFormulario(event) {
    if (this.state.nome.isEmpty()) {
      alert("Insira o nome para enviar")
      return
    }
    let o = {};
    o.descricao = this.state.descricao
    o.nome = this.state.nome
    this.inserir(o);
  }
  // atualizar
  buscar = async () => {
    // segundo atualiza <----------------------------
    await GET("areaConhecimento/listar/" + this.token)
      .then(response => {
        if (response === undefined | response.length === 0) throw new Error('Erro lista vazia.')
        this.setState({
          lista: response,
          listaCache: response,
          inicial: false,
        })
      })
      .catch(err => {
        console.log(err)
        this.setState({
          lista: [],
          listaCache: [],
          inicial: true,
        })
      }).finally(() => {
        this.setState({
          loading: false,
        })
      })

  }
  // remover
  removerLinha = async (id) => {
    this.setState({ loading: true });
    await DELETE("areaConhecimento/remover/" + id + "/" + this.token)
    this.buscar();
  }
  //alterar
  enviaFormulario__(event) {
    if (this.state.nome__.isEmpty()) {
      alert("Insira o nome para enviar")
      return
    }
    let o = {};
    o.descricao = this.state.descricao__;
    o.nome = this.state.nome__;
    o.id = this.state.id__;
    this.alterar(o);
  }
  alterar = async o => {
    this.setState({ loading: true });
    await PUT("areaConhecimento/alterar/" + this.token, o)
    this.setState({ modal: false })
    this.buscar();
  }
  buscarPorId = async (id) => {
    this.limparFormlulario__();
    // segundo atualiza <----------------------------
    this.setState({ loading: true })
    let response = await GET("areaConhecimento/buscar/" + id + "/" + this.token)
    this.preencheId__(response.id)
    this.preencheNome__(response.nome)
    this.preencheDescricao__(response.descricao)
    this.setState({
      modal: true
    })
    this.setState({ loading: false })
  }

  relacionar(id) {
    this.props.history.push("/relacionamentoUnidadeCurricular/" + id + "/" + this.token);
  }
  //modal
  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }
  toggleForm() {
    if (this.state.form === "none") {
      this.setState(() => ({
        form: "block"
      }));
    }
    if (this.state.form === "block") {
      this.setState(() => ({
        form: "none"
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
    console.log(this.props);
    const { loading, nome__, descricao__, nome, descricao } = this.state

    return <div>
      <Loading loading={loading} message='Carregando ...' />
      <div>
        <Cabecalho user={this.props.user} />
      </div>
      <div className="corpo">
        <Row>
          <Navegacao user={this.props.user} />
          <ContainerFade>
            <Row>
              <div className="titulo">
                <h1>Segmento Tecnológico</h1>
              </div>
            </Row>
            <div className="cadastro">
              <Container>
                <Button outline onClick={this.toggleForm.bind(this)}>Formulário</Button>
                <Col style={{ display: this.state.form }}>
                  <form>
                    <Row>
                      <Col xs={{ size: 6, offset: 3 }}>
                        <Col>
                          <InputDefault evento={this.preencheNome.bind(this)} valor={nome} size="255" tipo="text" nome="nome" titulo="Nome" descricao="Digite um nome" />
                        </Col>
                        <Col>
                          <InputDefault evento={this.preencheDescricao.bind(this)} valor={descricao} size="255" tipo="textarea" nome="descricao" titulo="Observação" descricao="Descreva..." />
                        </Col>
                        <Col>
                          <div className="botao" align="right">
                            <BotaoResetar resetar={this.limparFormlulario.bind(this)} />
                            <BotaoEnviar enviar={this.enviaFormulario.bind(this)} />
                          </div>
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
                    <th>#</th>
                    <th>Nome</th>
                    <th>Observação</th>
                    <th className="acao" colspan='3' width="5%">Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.listaCorrente.map(o => {
                    return (
                      <tr key={o.id}>
                        <td>{o.id}</td>
                        <td>{o.nome}</td>
                        <td>{o.descricao.isEmpty() ? " - " : o.descricao}</td>
                        <td className="acao" ><Button onClick={() => this.relacionar(o.id)}>Relacionar</Button></td>
                        <td className="acao" ><Button onClick={() => this.buscarPorId(o.id)}>Alterar</Button></td>
                        <td className="acao" ><Button onClick={() => { if (window.confirm("Deseja remover esse item? \n#" + o.id)) this.removerLinha(o.id) }}>Deletar</Button></td>
                      </tr>
                    );
                  })}

                  {
                    this.state.lista.length > 0 ? <BarraInicial exec={false} message='Não possui itens para carregar.' colspan="5" /> : <BarraInicial exec={true} message='Não possui itens para carregar.' colspan="5" />
                  }
                </tbody>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                  <ModalHeader toggle={this.toggle}>Alterar</ModalHeader>
                  <form>
                    <ModalBody>
                      <Row>
                        <Col>
                          <Col>
                            <InputDefault evento={this.preencheNome__.bind(this)} valor={nome__} size="70" tipo="text" nome="descricao" titulo="Nome" descricao="Digite um nome" />
                          </Col>
                          <Col>
                            <InputDefault evento={this.preencheDescricao__.bind(this)} valor={descricao__} size="255" tipo="textarea" nome="descricao" titulo="Observação" descricao="Descreva..." />
                          </Col>
                        </Col>
                      </Row>
                    </ModalBody>
                    <ModalFooter>
                      <BotaoResetar resetar={this.limparFormlulario__.bind(this)} />
                      <BotaoEnviar enviar={this.enviaFormulario__.bind(this)} />
                    </ModalFooter>
                  </form>
                </Modal>
              </Table>
            </div>
          </ContainerFade>
        </Row>
      </div>
    </div>
  };
}

export default withRouter(AreaConhecimento)

