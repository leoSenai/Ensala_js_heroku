import React from "react";
import {
    Input, Table, Row
} from "reactstrap";
import { ArrayCompare } from "../componentes/utilidadePublica";
import Paginacao from "../componentes/paginacao";
import { POST, GET, Loading } from "../componentes/Request";
import { BarraInicial, ContainerFade, Navegacao, Cabecalho, LinhaImaginaria, BarraDePesquisa } from "../componentes/corpo"

class Disponibilidade extends React.Component {
    state = {
        lista: [],
        html: [],
        loading: false,
        id: 0,
        matricula: "",
        tipo: "",
        nome: "",
        data: "",
        email: "",
        disableCheckbox: true,
        item: {
            segM: false, segT: false, segN: false,
            terM: false, terT: false, terN: false,
            quaM: false, quaT: false, quaN: false,
            quiM: false, quiT: false, quiN: false,
            sexM: false, sexT: false, sexN: false,
            sabM: false, sabT: false, sabN: false,
            domM: false, domT: false, domN: false
        },
        listaCorrente: [],
        listaCache: [],
        barraPesquisa: ""

    }
    token = this.props.user.token
    attItem = this.attItem.bind(this)

    preencheBarraDePesquisa(barraPesquisa) { this.setState({ barraPesquisa }) }

    permissaoStatus = {
        PROFESSOR: () => {
            this.buscaItem(this.props.user.id)
        },
        ADMINISTRADOR: () => {
            this.buscar()
        }
    }

    componentDidMount() { this.permissaoStatus[this.props.user.permissao](); this.limpaItem() }

    limpaDescricao() {
        this.setState({
            id: 0,
            matricula: "",
            tipo: "",
            nome: "",
            data: "",
            email: ""
        })
    }

    buscaItem(id) {
        this.setState({
            loading: true,
            disableCheckbox: true
        })
        this.limpaDescricao()
        this.setState({
            id: id
        })
        GET("disponibilidade/buscarItem/" + id + "/" + this.token)
            .then(response => {
                if (response.disponibilidade !== undefined) {
                    this.setState({
                        id: response.id,
                        nome: response.nome,
                        matricula: response.matricula,
                        tipo: response.tipo,
                        email: response.email,
                        data: response.data
                    })
                    let it = Object.keys(response.disponibilidade)
                    for (let i in it) {
                        this.compoemTabela(it[i], response.disponibilidade[it[i]])
                    }
                } else this.limpaItem()
            }).catch(() => {
                console.log(" errroooooooooooooooooooooooooooo ")
                this.setState({
                    id: 0
                })
            }).finally(() => {
                this.setState({
                    loading: false,
                    disableCheckbox: false
                })
            })

    }

    altItem(b, v) {
        let items = this.state.item;
        items[b] = v;
        this.setState({
            item: items
        })
    }

    compoemTabela(b, v) {
        if (typeof v !== 'object') {
            this.setState({
                html: []
            })
            let auxilar = false;
            let aProps = Object.getOwnPropertyNames(this.state.item);
            for (let i = 0; i < aProps.length; i++) {
                auxilar = false;
                if (aProps[i] === b) {
                    auxilar = true;
                    this.altItem(b, v);
                }
            }
            if (this.state.html.length !== 0) {
                this.setStatbe(html => ({
                    html: html.html.splice(0, 1),
                }))
            }
            if (auxilar)
                this.state.html.push(this.state.item)
        }
    }
    limpaItem() {
        this.setState({
            item: {
                segM: false, segT: false, segN: false,
                terM: false, terT: false, terN: false,
                quaM: false, quaT: false, quaN: false,
                quiM: false, quiT: false, quiN: false,
                sexM: false, sexT: false, sexN: false,
                sabM: false, sabT: false, sabN: false,
                domM: false, domT: false, domN: false
            }
        })
    }

    attItem(v, e) {
        this.altItem(e, !v)
        this.setState(html => ({
            html: html.html.splice(0, 1),
        }))
        this.state.html.push(this.state.item)
        this.enviaItem()
    }

    enviaItem() {
        let o = {}
        o.id = this.state.id
        o.disponibilidade = this.state.item
        POST("disponibilidade/inserirCheck/" + this.token, o, false)
    }

    buscar = () => {
        // segundo atualiza <----------------------------
        this.setState({ loading: true })
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
        const { disableCheckbox, loading, id, matricula, tipo, nome, email, data } = this.state
        const { segM, segT, segN,
            terM, terT, terN,
            quaM, quaT, quaN,
            quiM, quiT, quiN,
            sexM, sexT, sexN,
            sabM, sabT, sabN,
            domM, domT, domN } = this.state.item

        return <div>
            <Loading loading={loading} message='Carregando ...' />
            <div>
                <Cabecalho user={this.props.user} />
            </div>
            <div className="corpo" id="corpo">
                <Row>
                    <Navegacao user={this.props.user} />
                    <ContainerFade>
                        <Row>
                            <div className="titulo">
                                <h1>Disponibilidade</h1>
                            </div>
                        </Row>
                        <Table>
                            <thead>
                                <tr>
                                    <td>id: {id === 0 ? "#" : id}</td>
                                    <td>Matrícula: {matricula === "" ? "#" : matricula}</td>
                                    <td>Nome: {nome === "" ? "#" : nome}</td>
                                </tr>
                                <tr style={{ backgroundColor: "transparent", color: "black" }}>
                                    <td style={{ width: "15%" }}>Tipo: {tipo === "" ? "#" : tipo}</td>
                                    <td>Ultima Alteração: {data === "" ? "#" : data.formatDate()}</td>
                                    <td>E-mail: {email === "" ? "#" : email}</td>
                                </tr>
                                <tr>
                                    <th className="acao" width="5%">#</th>
                                    <th style={{ textAlign: "center" }} width="31.66666%">Manhã</th>
                                    <th style={{ textAlign: "center" }} width="31.66666%">Tarde</th>
                                    <th style={{ textAlign: "center" }} width="31.66666%">Noite</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th>Segunda</th>
                                    <td className="acao" onClick={disableCheckbox === false ? () => this.attItem(segM, "segM") : null}>
                                        <Input disabled={disableCheckbox} checked={segM} type="checkbox" name="segM" className="checkmark" />
                                    </td>
                                    <td className="acao" onClick={disableCheckbox === false ? () => this.attItem(segT, "segT") : null}>
                                        <Input disabled={disableCheckbox} checked={segT} type="checkbox" name="segT" className="checkmark" />
                                    </td>
                                    <td className="acao" onClick={disableCheckbox === false ? () => this.attItem(segN, "segN") : null}>
                                        <Input disabled={disableCheckbox} checked={segN} type="checkbox" name="segN" className="checkmark" />
                                    </td>
                                </tr>
                                <tr>
                                    <th>Terça</th>
                                    <td className="acao" onClick={disableCheckbox === false ? () => this.attItem(terM, "terM") : null}>
                                        <Input disabled={disableCheckbox} checked={terM} type="checkbox" name="terM" className="checkmark" />
                                    </td>
                                    <td className="acao" onClick={disableCheckbox === false ? () => this.attItem(terT, "terT") : null}>
                                        <Input disabled={disableCheckbox} checked={terT} type="checkbox" name="terT" className="checkmark" />
                                    </td>
                                    <td className="acao" onClick={disableCheckbox === false ? () => this.attItem(terN, "terN") : null}>
                                        <Input disabled={disableCheckbox} checked={terN} type="checkbox" name="terN" className="checkmark" />
                                    </td>
                                </tr>
                                <tr>
                                    <th>Quarta</th>
                                    <td className="acao" onClick={disableCheckbox === false ? () => this.attItem(quaM, "quaM") : null}>
                                        <Input disabled={disableCheckbox} checked={quaM} type="checkbox" name="quaM" className="checkmark" />
                                    </td>
                                    <td className="acao" onClick={disableCheckbox === false ? () => this.attItem(quaT, "quaT") : null}>
                                        <Input disabled={disableCheckbox} checked={quaT} type="checkbox" name="quaT" className="checkmark" />
                                    </td>
                                    <td className="acao" onClick={disableCheckbox === false ? () => this.attItem(quaN, "quaN") : null}>
                                        <Input disabled={disableCheckbox} checked={quaN} type="checkbox" name="quaN" className="checkmark" />
                                    </td>
                                </tr>
                                <tr>
                                    <th>Quinta</th>
                                    <td className="acao" onClick={disableCheckbox === false ? () => this.attItem(quiM, "quiM") : null}>
                                        <Input disabled={disableCheckbox} checked={quiM} type="checkbox" name="quiM" className="checkmark" />
                                    </td>
                                    <td className="acao" onClick={disableCheckbox === false ? () => this.attItem(quiT, "quiT") : null}>
                                        <Input disabled={disableCheckbox} checked={quiT} type="checkbox" name="quiT" className="checkmark" />
                                    </td>
                                    <td className="acao" onClick={disableCheckbox === false ? () => this.attItem(quiN, "quiN") : null}>
                                        <Input disabled={disableCheckbox} checked={quiN} type="checkbox" name="quiN" className="checkmark" />
                                    </td>
                                </tr>
                                <tr>
                                    <th>Sexta</th>
                                    <td className="acao" onClick={disableCheckbox === false ? () => this.attItem(sexM, "sexM") : null}>
                                        <Input disabled={disableCheckbox} checked={sexM} type="checkbox" name="sexM" className="checkmark" />
                                    </td>
                                    <td className="acao" onClick={disableCheckbox === false ? () => this.attItem(sexT, "sexT") : null}>
                                        <Input disabled={disableCheckbox} checked={sexT} type="checkbox" name="sexT" className="checkmark" />
                                    </td>
                                    <td className="acao" onClick={disableCheckbox === false ? () => this.attItem(sexN, "sexN") : null}>
                                        <Input disabled={disableCheckbox} checked={sexN} type="checkbox" name="sexN" className="checkmark" />
                                    </td>
                                </tr>
                                <tr>
                                    <th>Sabado</th>
                                    <td className="acao" onClick={disableCheckbox === false ? () => this.attItem(sabM, "sabM") : null}>
                                        <Input disabled={disableCheckbox} checked={sabM} type="checkbox" name="sabM" className="checkmark" />
                                    </td>
                                    <td className="acao" onClick={disableCheckbox === false ? () => this.attItem(sabT, "sabT") : null}>
                                        <Input disabled={disableCheckbox} checked={sabT} type="checkbox" name="sabT" className="checkmark" />
                                    </td>
                                    <td className="acao" onClick={disableCheckbox === false ? () => this.attItem(sabN, "sabN") : null}>
                                        <Input disabled={disableCheckbox} checked={sabN} type="checkbox" name="sabN" className="checkmark" />
                                    </td>
                                </tr>
                                <tr>
                                    <th>Domingo</th>
                                    <td className="acao" onClick={disableCheckbox === false ? () => this.attItem(domM, "domM") : null}>
                                        <Input disabled={disableCheckbox} checked={domM} type="checkbox" name="domM" className="checkmark" />
                                    </td>
                                    <td className="acao" onClick={disableCheckbox === false ? () => this.attItem(domT, "domT") : null}>
                                        <Input disabled={disableCheckbox} checked={domT} type="checkbox" name="domT" className="checkmark" />
                                    </td>
                                    <td className="acao" onClick={disableCheckbox === false ? () => this.attItem(domN, "domN") : null}>
                                        <Input disabled={disableCheckbox} checked={domN} type="checkbox" name="domN" className="checkmark" />
                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                        <LinhaImaginaria permissao={this.props.user.permissao} linha="ADMINISTRADOR">
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
                                <a href="#corpo">
                                    <Table>
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Professor</th>
                                                <th>Matrícula</th>
                                                <th>Tipo</th>
                                                <th>E-mail</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.listaCorrente.map(o => {
                                                let focus = {}
                                                if (o.id === this.state.id) focus = { backgroundColor: '#0047B6', color: "white" }
                                                return (
                                                    <tr style={focus} key={o.id} onClick={() => this.buscaItem(o.id)}>
                                                        <td>{o.id}</td>
                                                        <td>{o.nome}</td>
                                                        <td>{o.matricula}</td>
                                                        <td>{o.tipo}</td>
                                                        <td>{o.email}</td>
                                                    </tr>
                                                );
                                            })}
                                            {
                                                this.state.lista.length > 0 ? <BarraInicial exec={false} message='Não possui itens para carregar.' colspan="5" /> : <BarraInicial exec={true} message='Não possui itens para carregar.' colspan="5" />
                                            }
                                        </tbody>
                                    </Table>
                                </a>
                            </div>
                        </LinhaImaginaria>
                    </ContainerFade>
                </Row>
            </div>
        </div>
    };
}

export default Disponibilidade

