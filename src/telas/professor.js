import React from "react";
import {
  Table, Container, Row, Button, Col, Modal, ModalHeader, ModalBody, ModalFooter,
} from "reactstrap";
import InputDefault from "../componentes/inputsPadroes";
import { ArrayCompare } from "../componentes/utilidadePublica";
import Paginacao from "../componentes/paginacao";
import { BotaoEnviar, BotaoResetar } from "../componentes/botoes";
import { POST, GET, PUT, DELETE, Loading } from "../componentes/Request";
import { EmailDeConfirmacao, BarraInicial, ContainerFade, Navegacao, Cabecalho, LinhaImaginaria, BarraDePesquisa } from "../componentes/corpo"

class Professor extends React.Component {
  state = {
    nome: "",
    email: "",
    telefone: "",
    permissao: "",
    senha: "",
    confirmar: "",
    matricula: "",
    tipo: "",

    id__: "",
    nome__: "",
    email__: "",
    telefone__: "",
    permissao__: "",
    senha__: "",
    confirmar__: "",
    matricula__: "",
    tipo__: "",

    loading: false,
    modal: false,
    inicial: true,
    form: "none",
    mudaSenha: "none",

    lista: [],
    listaCorrente: [],
    listaCache: [],
    barraPesquisa: "",
    inativos: "ATIVO",
    toggleModalConfirmacao: false,
    tokenCadastroCache: ""
  }
  token = this.props.user.token
  toggle = this.toggle.bind(this)


  preencheBarraDePesquisa(barraPesquisa) { this.setState({ barraPesquisa }) }

  //fields inserir
  preencheNome(nome) { this.setState({ nome }) }
  preencheEmail(email) { this.setState({ email: email.toLowerCase().replaceAll(" ", "") }) }
  preencheTelefone(telefone) { this.setState({ telefone: telefone.maskTelefone() }) }
  preenchePermissao(permissao) { this.setState({ permissao }) }
  preencheSenha(senha) { this.setState({ senha }) }
  preencheConfirmar(confirmar) { this.setState({ confirmar }) }
  preencheMatricula(matricula) { this.setState({ matricula }) }
  preencheTipo(tipo) { this.setState({ tipo }) }
  limparFormlulario() {
    this.setState({
      nome: "",
      email: "",
      telefone: "",
      permissao: "",
      senha: "",
      confirmar: "",
      matricula: "",
      tipo: ""
    })
  }
  //fields alterar
  preencheId__(id__) { this.setState({ id__: id__.toString() }) }
  preencheNome__(nome__) { this.setState({ nome__ }) }
  preencheEmail__(email__) { this.setState({ email__: email__.toLowerCase().replaceAll(" ", "") }) }
  preencheTelefone__(telefone__) { this.setState({ telefone__: telefone__.maskTelefone() }) }
  preenchePermissao__(permissao__) { this.setState({ permissao__ }) }
  preencheSenha__(senha__) { this.setState({ senha__ }) }
  preencheConfirmar__(confirmar__) { this.setState({ confirmar__ }) }
  preencheMatricula__(matricula__) { this.setState({ matricula__ }) }
  preencheTipo__(tipo__) { this.setState({ tipo__ }) }
  limparFormlulario__() {
    this.setState({
      nome__: "",
      email__: "",
      telefone__: "",
      permissao__: "",
      senha__: "",
      confirmar__: "",
      matricula__: "",
      tipo__: ""
    })
  }

  componentDidMount() { this.buscar() }
  // inserir
  inserir = async o => {
    this.setState({ loading: true });
    await POST("professor/inserirProfessor/" + this.token + "/" + this.props.user.id, o, undefined, (ok) => {
      this.toggleModalConfirmacaoFunc(true)
    })
      .then(response => {
        this.setState({
          tokenCadastroCache: response
        })
      })
      .finally(() => {
        this.buscar();
      })
  }

  async reenviarEmail() {
    await GET("professor/enviarEmailCadastro/" + this.state.tokenCadastroCache).then(() => {
      alert("Verifique sua caixa de entrada e pasta de span, isso pode levar alguns minutos.")
    })
  }

  enviaFormulario(event) {
    let st = this.state
    if (
      !st.nome.isEmpty() &&
      !st.email.isEmpty() &&
      (
        (!st.telefone.isEmpty() && st.telefone.length >= 14 && st.telefone.length <= 15) ||
        st.telefone.isEmpty()
      ) &&
      (!st.permissao.isEmpty() && !st.permissao.equals("SELECIONE")) &&
      (!st.tipo.isEmpty() && !st.tipo.equals("SELECIONE")) &&
      !st.senha.isEmpty() &&
      !st.confirmar.isEmpty()
    ) {
      if (st.email.isEmail()) {
        if (st.senha.length > 4) {
          if (st.senha.equals(st.confirmar)) {
            let o = {};
            o.nome = st.nome;
            o.email = st.email;
            o.tipo = st.tipo;
            o.matricula = st.matricula;
            o.telefone = st.telefone;
            o.permissao = st.permissao;
            o.senha = st.senha;
            this.inserir(o);
          } else alert("\"Confirmar\" precisa ser exatamente igual a senha.")
        } else alert("A senha precisa ter pelo menos 5 letras, e no máximo 10 letras.")
      } else alert("Digite um e-mail válido.")
    } else alert("Insira os dados para enviar")

  }
  // atualizar

  tipoLista = {
    PROFESSOR: () => {
      GET("professor/buscar/" + this.props.user.id + "/" + this.token)
        .then(response => {
          let o = {}
          let novaLista = []
          o.id = response.id
          o.nome = response.nome
          o.email = response.email
          o.telefone = response.telefone
          o.permissao = response.permissao

          novaLista.push(o)
          this.setState({
            lista: novaLista,
            listaCache: novaLista,
            listaCorrente: novaLista,
            inicial: false
          })
        }).catch(err => {
          console.log(err)
          this.setState({
            lista: [],
            listaCache: [],
            listaCorrente: [],
            inicial: true
          })
        }).finally(() => {
          this.setState({ loading: false })
        })
    },
    ADMINISTRADOR: () => {
      GET("professor/listar/" + this.state.inativos + "/" + this.token)
        .then(response => {
          if (response === undefined | response.length === 0) throw new Error('Erro lista vazia.')
          this.setState({
            lista: response,
            listaCache: response,
            inicial: false
          })
        }).catch(err => {
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
  }

  buscar = () => {
    // segundo atualiza <----------------------------
    this.tipoLista[this.props.user.permissao]()
  }
  // remover
  removerLinha = async (id) => {
    this.setState({ loading: true });
    await DELETE("professor/remover/" + id + "/" + this.token)
      .finally(response => {
        this.buscar();
      })
  }
  //alterar

  enviaFormulario__(event) {
    let st = this.state
    if (
      !st.nome__.isEmpty() &&
      !st.email__.isEmpty() &&
      (
        (!st.telefone.isEmpty() && st.telefone.length >= 14 && st.telefone.length <= 15) ||
        st.telefone.isEmpty()
      ) &&
      (!st.tipo__.isEmpty() && !st.tipo__.equals("SELECIONE")) &&
      (!st.permissao__.isEmpty() && !st.permissao__.equals("SELECIONE"))
    ) {
      if (st.email__.isEmail()) {
        let f = true;
        let o = {};
        o.id = st.id__;
        o.nome = st.nome__;
        o.email = st.email__;
        o.tipo = st.tipo__;
        o.matricula = st.matricula__;
        o.telefone = st.telefone__;
        o.permissao = st.permissao__;
        if (st.mudaSenha !== "none") {
          if (!st.senha__.isEmpty()) {
            if (st.senha__.length > 4) {
              if (st.senha__.equals(st.confirmar__)) {
                o.senha = st.senha__;
              } else { f = false; alert("\"Confirmar\" precisa ser exatamente igual a senha.") }
            } else { f = false; alert("A senha precisa ter pelo menos 5 letras, e no máximo 10 letras.") }
          } else o.senha = ""
        } else o.senha = ""
        if (f) this.alterar(o);
      } else alert("Digite um e-mail válido.")
    } else alert("Insira os dados para enviar")
  }

  async reativarProfessor(id) {
    this.setState({ loading: true });
    await GET("professor/reativarProfessor/" + id + "/" + this.token + "/" + this.props.user.id)
      .finally(() => {
        this.buscar();
      })
  }

  alterar = async o => {
    this.setState({ loading: true });
    await PUT("professor/alterarProfessor/" + this.token + "/" + this.props.user.id, o)
      .finally(() => {
        this.setState({ modal: false })
        this.buscar();
      })
  }
  buscarPorId = async (id) => {
    // segundo atualiza <----------------------------
    this.limparFormlulario__();
    this.setState({ loading: true })
    await GET("professor/buscar/" + id + "/" + this.token)
      .then(response => {

        this.preencheId__(response.id)
        this.preencheNome__(response.nome)
        this.preencheEmail__(response.email)
        this.preencheTelefone__(response.telefone)
        this.preenchePermissao__(response.permissao)
        this.preencheTipo__(response.tipo)
        this.preencheMatricula__(response.matricula)

        this.setState({
          modal: true
        })
      }).finally(() => {
        this.setState({ loading: false })
      })
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
    } else if (this.state.form === "block") {
      this.setState(() => ({
        form: "none"
      }));
    }
  }
  async toggleInativos() {
    if (this.state.inativos === "ATIVO") {
      await this.setState(() => ({
        inativos: "INATIVO"
      }));
    } else if (this.state.inativos === "INATIVO") {
      await this.setState(() => ({
        inativos: "ATIVO"
      }));
    }
    this.buscar()
  }
  toggleMudaSenha() {
    if (this.state.mudaSenha === "none") {
      this.setState(() => ({
        mudaSenha: "flex"
      }));
    } else if (this.state.mudaSenha === "flex") {
      this.setState(() => ({
        mudaSenha: "none"
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

  toggleModalConfirmacaoFunc(callback) {
    if (callback !== undefined)
      this.setState({
        toggleModalConfirmacao: callback,
      });
  }

  render() {
    const { loading, nome, email, telefone, permissao, senha, confirmar, matricula, tipo, toggleModalConfirmacao,
      nome__, email__, telefone__, permissao__, senha__, confirmar__, matricula__, tipo__, inativos } = this.state;

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
                <h1>Professor</h1>
              </div>
            </Row>
            <LinhaImaginaria permissao={this.props.user.permissao} linha="ADMINISTRADOR">
              <div className="cadastro">
                <Container>
                  <Button outline onClick={this.toggleForm.bind(this)}>Formulário</Button>
                  <Col style={{ display: this.state.form }}>
                    <form>
                      <Row>
                        <Col xs={{ size: 8, offset: 2 }}>
                          <Col>
                            <InputDefault obrigatorio evento={this.preencheNome.bind(this)} valor={nome} size="70" tipo="text" nome="nome" titulo="Nome" descricao="Digite um nome" />
                          </Col>
                          <Row>
                            <Col md={{ size: 6 }}>
                              <InputDefault obrigatorio evento={this.preencheMatricula.bind(this)} valor={matricula} size="10" tipo="text" nome="matricula" titulo="Matrícula" descricao="Digite a sua matrícula" />
                            </Col>
                            <Col md={{ size: 6 }}>
                              <InputDefault obrigatorio evento={this.preencheTipo.bind(this)} valor={tipo} tipo="select" name="tipo" titulo="Modalidade">
                                <option value="SELECIONE">Selecione...</option>
                                <option>HORISTA</option>
                                <option>MENSALISTA</option>
                              </InputDefault>
                            </Col>
                          </Row>
                          <Col>
                            <InputDefault obrigatorio evento={this.preencheEmail.bind(this)} valor={email} size="255" tipo="text" nome="email" titulo="Email" descricao="Digite um email" />
                          </Col>
                          <Row>
                            <Col md={{ size: 6 }}>
                              <InputDefault obrigatorio evento={this.preenchePermissao.bind(this)} valor={permissao} tipo="select" name="permissao" titulo="Permissao">
                                <option value="SELECIONE">Selecione...</option>
                                <option>ADMINISTRADOR</option>
                                <option>PROFESSOR</option>
                              </InputDefault>
                            </Col>
                            <Col md={{ size: 6 }}>
                              <InputDefault evento={this.preencheTelefone.bind(this)} valor={telefone} tipo="text" nome="telefone" titulo="Telefone" descricao="Digite um telefone" />
                            </Col>
                          </Row>
                          <Row>
                            <Col md={{ size: 6 }}>
                              <InputDefault obrigatorio evento={this.preencheSenha.bind(this)} size="10" valor={senha} tipo="password" nome="senha" titulo="Senha" descricao="Digite uma senha" />
                            </Col>
                            <Col md={{ size: 6 }}>
                              <InputDefault obrigatorio evento={this.preencheConfirmar.bind(this)} size="10" valor={confirmar} tipo="password" nome="confirmar" titulo="Confirmar" descricao="Confirme a senha" />
                            </Col>
                          </Row>
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
            </LinhaImaginaria>
            <div className="div_tabela">
              <LinhaImaginaria permissao={this.props.user.permissao} linha="ADMINISTRADOR">
                <div className="barra_inatividade">
                  <Button outline onClick={this.toggleInativos.bind(this)}>{inativos === "ATIVO" ? "Ativos" : "Inativos"}</Button>
                </div>
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
              </LinhaImaginaria>
              <Table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Matrícula</th>
                    <th>Nome</th>
                    <th>Tipo</th>
                    <th>Email</th>
                    <th>Telefone</th>
                    <th>Permissao</th>
                    <th className="acao" colSpan='2' width="5%">Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.listaCorrente.map(o => {
                    return (
                      <tr key={o.id}>
                        <td>{o.id}</td>
                        <td>{o.matricula}</td>
                        <td>{o.nome}</td>
                        <td>{o.tipo}</td>
                        <td>{o.email}</td>
                        <td>{o.telefone}</td>
                        <td>{o.permissao}</td>
                        {inativos === "ATIVO" ?
                          (<>
                            <td className="acao" ><Button onClick={() => this.buscarPorId(o.id)}>Alterar</Button></td>
                            <LinhaImaginaria permissao={this.props.user.permissao} linha="ADMINISTRADOR">
                              <td className="acao" ><Button onClick={() => { if (window.confirm("Deseja inativar esse item? \n#" + o.id)) this.removerLinha(o.id) }}>Inativar</Button></td>
                            </LinhaImaginaria>
                          </>) :
                          (<>
                            <td className="acao" ><Button onClick={() => this.reativarProfessor(o.id)}>Reativar</Button></td>
                          </>)
                        }

                      </tr>
                    );
                  })}
                  {
                    this.state.lista.length > 0 ? <BarraInicial exec={false} message='Não possui itens para carregar.' colspan="5" /> : <BarraInicial exec={true} message='Não possui itens para carregar.' colspan="5" />
                  }
                </tbody>
                <Loading loading={loading} message='Carregando ...' />
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                  <ModalHeader toggle={this.toggle}>Alterar</ModalHeader>
                  <form>
                    <ModalBody>
                      <form>
                        <Row>
                          <Col xs={{ size: 12 }}>
                            <Col>
                              <InputDefault obrigatorio evento={this.preencheNome__.bind(this)} valor={nome__} size="70" tipo="text" nome="nome" titulo="Nome" descricao="Digite um nome" />
                            </Col>
                            <Row>
                              <Col md={{ size: 6 }}>
                                <InputDefault obrigatorio evento={this.preencheMatricula__.bind(this)} valor={matricula__} size="255" tipo="text" nome="matricula" titulo="Matrícula" descricao="Digite a sua matrícula" />
                              </Col>
                              <Col md={{ size: 6 }}>
                                <InputDefault obrigatorio evento={this.preencheTipo__.bind(this)} valor={tipo__} tipo="select" name="tipo" titulo="Modalidade">
                                  <option value="SELECIONE">Selecione...</option>
                                  <option>HORISTA</option>
                                  <option>MENSALISTA</option>
                                </InputDefault>
                              </Col>
                            </Row>
                            <Col>
                              <InputDefault disabled obrigatorio evento={this.preencheEmail__.bind(this)} valor={email__} size="255" tipo="text" nome="email" titulo="Email" descricao="Digite um email" />
                            </Col>
                            <Row>
                              <Col md={{ size: 6 }}>
                                <InputDefault obrigatorio evento={this.preenchePermissao__.bind(this)} valor={permissao__} tipo="select" name="permissao" titulo="Permissao">
                                  <option value="SELECIONE">Selecione...</option>
                                  <LinhaImaginaria permissao={this.props.user.permissao} linha="ADMINISTRADOR">
                                    <option>ADMINISTRADOR</option>
                                  </LinhaImaginaria>
                                  <option>PROFESSOR</option>
                                </InputDefault>
                              </Col>
                              <Col md={{ size: 6 }}>
                                <InputDefault obrigatorio evento={this.preencheTelefone__.bind(this)} valor={telefone__} tipo="text" nome="telefone" titulo="Telefone" descricao="Digite um telefone" />
                              </Col>
                            </Row>
                            <Col>
                              <Button outline onClick={this.toggleMudaSenha.bind(this)}>Mudar senha</Button>
                            </Col>
                            <div><br /></div>
                            <Row style={{ display: this.state.mudaSenha }}>
                              <Col md={{ size: 6 }}>
                                <InputDefault obrigatorio evento={this.preencheSenha__.bind(this)} valor={senha__} size="10" tipo="password" nome="senha" titulo="Senha" descricao="Digite uma senha" />
                              </Col>
                              <Col md={{ size: 6 }}>
                                <InputDefault obrigatorio evento={this.preencheConfirmar__.bind(this)} valor={confirmar__} size="10" tipo="password" nome="confirmar" titulo="Confirmar" descricao="Confirme a senha" />
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </form>
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
      <EmailDeConfirmacao toggle={toggleModalConfirmacao} callback={this.toggleModalConfirmacaoFunc.bind(this)} email={email} reenviar={this.reenviarEmail.bind(this)}>
        É necessário a confirmação de e-mail para prosseguir!
      </EmailDeConfirmacao>
    </div>
  };
}

export default Professor

