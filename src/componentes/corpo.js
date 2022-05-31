import React from 'react'
import { UncontrolledPopover, Table, Modal, ModalHeader, ModalBody, ModalFooter, PopoverHeader, PopoverBody, ToastHeader, Spinner, Nav, Fade, Row, Col, Input, InputGroup, InputGroupAddon, Button } from "reactstrap";
import logoSENAI from './../img/senai.png';
import logoSESI from './../img/sesi.png';
import { Link } from "react-router-dom";
import { GET } from "./Request";
import Cookies from 'js-cookie';
import { FaSearch, FaClipboard, FaPlus, FaClipboardCheck, FaPowerOff } from "react-icons/fa";
class ContainerFade extends React.Component {
    render() {
        return (
            <div className="containerCorpo">
                <Fade>
                    {this.props.children}
                </Fade>
            </div>
        )
    }
}

class BarraDePesquisaPlus extends React.Component {
    getPesquisa() {
        const { funcPesquisa, pesquisa, indicadores, lista } = this.props

        let novaLista = []
        novaLista = lista.filter((value) => {
            let ret = false;
            for (let i = 0; i < indicadores.length; i++) {
                ret = (value[indicadores[i]].toString().toLowerCase().includes(pesquisa.toLowerCase()) ? true : false);
                if(ret === true){
                    return true
                }
            }
            return ret;
        })
        funcPesquisa(novaLista)
    }
    handle(e) {
        this.props.attBarra(e.target.value.toString())
    }
    render() {
        return <InputGroup className="w-100">
            <Input value={this.props.pesquisa} onChange={this.handle.bind(this)} name="pesquisa" placeholder="Pesquisar..." />
            <InputGroupAddon addonType="append">
                <Button color="secondary" onClick={() => this.getPesquisa()}>
                    <FaSearch />
                </Button>
            </InputGroupAddon>
        </InputGroup>
    }
}

class BarraDePesquisa extends React.Component {
    getPesquisa() {
        const { funcPesquisa, pesquisa, indicador, lista } = this.props

        let novaLista = []
        novaLista = lista.filter((value) => {

            return value[indicador].toString().includes(pesquisa) ? true : false
        })
        funcPesquisa(novaLista)
    }
    handle(e) {
        this.props.attBarra(e.target.value.toString())
    }
    render() {
        return <InputGroup className="w-100">
            <Input value={this.props.pesquisa} onChange={this.handle.bind(this)} name="pesquisa" placeholder="Pesquisar..." />
            <InputGroupAddon addonType="append">
                <Button color="secondary" onClick={() => this.getPesquisa()}>
                    <FaSearch />
                </Button>
            </InputGroupAddon>
        </InputGroup>
    }
}

class BarraInicialDiv extends React.Component {
    render() {
        const { exec, message } = this.props
        return exec ? (
            <div>{message}</div>
        ) : null
    }
}

class BarraInicial extends React.Component {
    render() {
        const { exec, message, colspan } = this.props
        return exec ? (
            <tr>
                <td colSpan={colspan}>
                    {message}
                </td>
            </tr>
        ) : null
    }
}

class Navegacao extends React.Component {
    cookieUrl = this.cookieUrl.bind(this)
    async cookieUrl(url) {
        await Cookies.set("ultimaPagina", url)
    }

    render() {
        const { backPaste } = this.props
        return <div className="barraNav">
            <Nav vertical>
                <div className="subtituloMenu"><FaPlus />Cadastros</div>
                <Link to={(backPaste ? backPaste : "../") + "cadastro/professor"} onClick={() => this.cookieUrl("../cadastro/professor")}>Professor</Link>
                <LinhaImaginaria permissao={this.props.user.permissao} linha="ADMINISTRADOR">
                    <Link to={(backPaste ? backPaste : "../") + "../cadastro/modalidade"} onClick={() => this.cookieUrl("../cadastro/modalidade")}>Modalidade</Link>
                    <Link to={(backPaste ? backPaste : "../") + "../cadastro/areaConhecimento"} onClick={() => this.cookieUrl("../cadastro/areaConhecimento")}>Segmento Tecnológico</Link>
                    <Link to={(backPaste ? backPaste : "../") + "../cadastro/unidadeCurricular"} onClick={() => this.cookieUrl("../cadastro/unidadeCurricular")}>Unidade curricular</Link>
                </LinhaImaginaria>
                <div className="subtituloMenu"><FaClipboardCheck />Processos</div>
                <LinhaImaginaria permissao={this.props.user.permissao} linha="ADMINISTRADOR">
                    <Link to={(backPaste ? backPaste : "../") + "processo/gerenciaremailsprofessores"} onClick={() => this.cookieUrl("../processo/gerenciaremailsprofessores")}>E-mails</Link>
                </LinhaImaginaria>
                <Link to={(backPaste ? backPaste : "../") + "processo/disponibilidade"} onClick={() => this.cookieUrl("../processo/disponibilidade")}>Disponibilidade</Link>
                <Link to={(backPaste ? backPaste : "../") + "processo/competencia"} onClick={() => this.cookieUrl("../processo/competencia")}>Competência</Link>
                <LinhaImaginaria permissao={this.props.user.permissao} linha="ADMINISTRADOR">
                    <div className="subtituloMenu"><FaSearch />Consultas</div>
                    <Link to={(backPaste ? backPaste : "../") + "consulta/consultadisponibilidade"} onClick={() => this.cookieUrl("../consulta/consultadisponibilidade")}>Disponibilidade</Link>
                    <Link to={(backPaste ? backPaste : "../") + "consulta/consultacompetencia"} onClick={() => this.cookieUrl("../consulta/consultacompetencia")}>Competência</Link>
                </LinhaImaginaria>
                <hr />
                <Link className="linkMenu" to={(backPaste ? backPaste : "../") + "logout"} onClick={() => this.cookieUrl("../logout")}><span style={{ width: "80%", display: "flex", justifyContent: "center" }}><FaPowerOff/>Sair</span></Link>
            </Nav>
        </div>
    };
}

class Cabecalho extends React.Component {

    render() {

        return <header className="cabecalho">
            <Row>
                <Col>
                    <Row style={{ width: "382px" }}>
                        <Col>
                            <Link to="../home">
                                <img src={logoSESI} className="App-logo" alt="logo" />
                            </Link>
                        </Col>
                        <Col>
                            <Link to="../home">
                                <img src={logoSENAI} className="App-logo" alt="logo" />
                            </Link>
                        </Col>
                    </Row>
                </Col>
                <LinhaImaginaria permissao={this.props.user.permissao} linha="ADMINISTRADOR">
                    <Status />
                </LinhaImaginaria>
            </Row>
        </header>

    };
}
class Status extends React.Component {
    state = {
        spin: true,
        foo: true,
        inicial: true,
        pop: "none",
        texto: ""
    }
    componentDidMount() {
        this.verificaEmail()
        this.timer = setInterval(
            () => {
                this.verificaEmail()
            },
            5000
        );
    }
    verificaEmail() {
        GET("gerenciarEmails/verificarEmails", false)
            .then(response => {
                if (response === undefined) response = "ERRO"
                this.TimerEmail(response)
            })
    }
    componentWillUnmount() {
        clearInterval(this.timer)
    }

    verificaEstadoEmail = {
        ANDAMENTO: () => {
            this.setState({
                spin: true,
                foo: false,
                texto: "Em andamento."
            })
        },
        ACABOU: () => {
            this.setState({
                spin: false,
                foo: true,
                texto: "Sem atividade."
            })
        },
        ERRO: () => {
            this.setState({
                spin: false,
                foo: false,
                texto: "Problemas com a conexão, aguarde um momento."
            })
        }
    }

    TimerEmail = (f) => {
        if (f !== undefined) this.setState({ inicial: false })
        this.verificaEstadoEmail[f]()
    }
    render() {
        const { foo, spin, inicial, texto } = this.state
        const ic = spin ? <Spinner size="sm" color="success" /> : null
        const f = foo ? "statusGreen" : "statusOrange"
        const t = !foo && !spin ? "statusRed" : null
        const color = "status " + (inicial ? "statusGray" : (t ? t : f))

        return (
            <ToastHeader id="PopoverLegacy" icon={ic} >
                <div className={color} /> E-mails
                <UncontrolledPopover trigger="legacy" placement="bottom" target="PopoverLegacy">
                    <PopoverHeader>Situação</PopoverHeader>
                    <PopoverBody>
                        <ul style={{ padding: "0" }} >
                            <li style={{ padding: "0", display: "inline", float: "left" }}>{color.includes("statusGray") ? "..." : texto}</li>
                        </ul>
                    </PopoverBody>
                </UncontrolledPopover>
            </ToastHeader>

        )
    }
}

class LinhaImaginaria extends React.Component {
    render() {
        return this.props.permissao === this.props.linha ? (<>{this.props.children}</>) : null
    }
}

class ModalDetalhe extends React.Component {
    state = {
        modal: false,
        modalTabela: false
    }
    toggleTabela = this.toggleTabela.bind(this)
    toggle = this.toggle.bind(this)
    redirect = (id) => {
        this.props.redirect(id)
        this.toggle(this.props.toggle)
    }
    toggle() {
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
    }
    toggleTabela() {
        this.setState(prevState => ({
            modalTabela: !prevState.modalTabela
        }));
    }
    render() {
        const { professor, manha, tarde, noite, modalidade, areaConhecimento, unidadeCurricular, id, destaque } = this.props
        return <>
            <FaClipboard onClick={() => this.redirect(id)} />

            <Modal isOpen={this.state.modal} toggle={this.toggle}>
                <ModalHeader toggle={this.toggle}>Detalhe</ModalHeader>
                <ModalBody>
                    <div className="disponivelDescriptionBox">
                        <div className="flexbox">
                            <div className="w-25">
                                Nome:
                            </div>
                            <div className="w-75">
                                {professor.nome}
                            </div>
                        </div>
                        <div className="flexbox">
                            <div className="w-25">
                                E-mail:
                            </div>
                            <div className="w-75">
                                {professor.email}
                            </div>
                        </div>
                        <div className="flexbox">
                            <div className="w-25">
                                Matrícula:
                            </div>
                            <div className="w-75">
                                {professor.matricula}
                            </div>
                        </div>
                        <div className="flexbox">
                            <div className="w-25">
                                Tipo:
                            </div>
                            <div className="w-75">
                                {professor.tipo}
                            </div>
                        </div>
                        <div className="flexbox">
                            <div className="w-25">
                                Telefone:
                            </div>
                            <div className="w-75">
                                {professor.telefone}
                            </div>
                        </div>
                    </div>
                    <div className="disponivelBox">
                        <b>Disponível</b>
                        <div className="flexbox manha">
                            <div className="w-25 fontSmall ">
                                Manha:
                            </div>
                            <div className="w-75">
                                {manha}
                            </div>
                        </div>
                        <div className="flexbox tarde">
                            <div className="w-25 fontSmall">
                                Tarde:
                            </div>
                            <div className="w-75">
                                {tarde}
                            </div>
                        </div>
                        <div className="flexbox noite">
                            <div className="w-25 fontSmall">
                                Noite:
                            </div>
                            <div className="w-75">
                                {noite}
                            </div>
                        </div>
                    </div>
                    <div className="disponivelBox">
                        <b>Competências</b>
                        <div className="flexbox competencia">
                            <div className="w-25 fontSmall ">
                                Modalidade:
                            </div>
                            <div className="w-75">
                                {modalidade.map((res, i) => {
                                    if ((i + 1) === modalidade.length) {
                                        return res
                                    }
                                    return res + ", "
                                })}
                            </div>
                        </div>
                        <div className="flexbox competencia">
                            <div className="w-25 fontSmall">
                                Segmento tecnológico:
                            </div>
                            <div className="w-75">
                                {areaConhecimento.map((res, i) => {
                                    if ((i + 1) === areaConhecimento.length) {
                                        return res
                                    }
                                    return res + ", "
                                })}
                            </div>
                        </div>
                        <div className="flexbox competencia">
                            <div className="w-25 fontSmall">
                                Unidade curricular:
                            </div>
                            <div className="w-75">
                                <button className={"btn_modal_unidadeCurricular"} onClick={this.toggleTabela}>ver lista</button>

                            </div>
                        </div>
                    </div>

                </ModalBody>
                <ModalFooter>
                    <button onClick={this.toggle}>Fechar</button>
                </ModalFooter>
            </Modal>
            <Modal style={{ width: "100%" }} isOpen={this.state.modalTabela} toggle={this.toggleTabela}>
                <ModalHeader toggle={this.toggleTabela}>Unidade curricular do {professor.nome}</ModalHeader>
                <ModalBody>
                    <div style={{ marginTop: 0 }} className="div_tabela">
                        <Table >
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Nome</th>
                                    <th>Observação</th>
                                </tr>
                            </thead>
                            <tbody>
                                {unidadeCurricular.map(o => {
                                    let focus = {}
                                    if (destaque !== undefined && destaque !== null) {
                                        for (let i in destaque) {
                                            if (o.id === destaque[i].id) {
                                                focus = { backgroundColor: '#0047B6', color: "white" }
                                                break
                                            }
                                        }
                                    }
                                    return (
                                        <tr style={focus} key={o.id}>
                                            <td>{o.id}</td>
                                            <td>{o.nome}</td>
                                            <td>{o.descricao === "" ? " - " : o.descricao}</td>
                                        </tr>
                                    );
                                })}
                                {
                                    unidadeCurricular.length > 0 ? <BarraInicial exec={false} message='Não possui itens para carregar.' colspan="5" /> : <BarraInicial exec={true} message='Não possui itens para carregar.' colspan="5" />
                                }
                            </tbody>
                        </Table>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <button onClick={this.toggleTabela}>Fechar</button>
                </ModalFooter>
            </Modal>
        </>
    }
}

const EmailDeConfirmacao = (props) => {
    const { toggle, callback, email, reenviar } = props
    return (<>
        <div id="EmailDeConfirmacao">
            <Modal isOpen={toggle} toggle={() => callback(false, false)}>
                <ModalHeader>Confirmação de e-mail</ModalHeader>
                <ModalBody>
                    <div className="caixa_alerta" style={{ borderColor: "#00dc00" }}>
                        <p className="p_alerta">Enviamos um e-mail para este endereço: {email}</p>
                        <p className="p_alerta">{props.children}</p>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <button onClick={() => reenviar(false, false)}>Reenviar e-mail</button>
                    <button onClick={() => callback(false, false)}>Fechar</button>
                </ModalFooter>
            </Modal>
        </div>
    </>)
}

class CampoObrigatorio extends React.Component {
    render() {
        return <>
            <span style={{ color: "red" }}>*</span>
        </>
    }
}

export { EmailDeConfirmacao, BarraInicial, ContainerFade, Navegacao, Cabecalho, LinhaImaginaria, BarraDePesquisa, BarraDePesquisaPlus, ModalDetalhe, CampoObrigatorio, BarraInicialDiv }
