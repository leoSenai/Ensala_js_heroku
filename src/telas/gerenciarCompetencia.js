import React from "react";
import { ArrayCompare } from "../componentes/utilidadePublica";
import Paginacao from "../componentes/paginacao";
import { Container, Input, Row, Table } from "reactstrap";
import { Cabecalho, ContainerFade, Navegacao, BarraInicial, LinhaImaginaria, BarraDePesquisa } from "../componentes/corpo";
import { GET, Loading, POST } from "../componentes/Request";
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';


class Competencia extends React.Component {
    state = {
        loading: false,
        listaProfessores: [],
        modalidade: [],
        unidadeCurricular: [],
        unidadeCurricularListaPesquisa: [],
        unidadeCurricularListaTouch: [],
        areaConhecimento: [],
        cacheModalidade: [],
        cacheUnidadeCurricular: [],
        cacheAreaConhecimento: [],
        count: 0,
        id: 0,
        matricula: "",
        tipo: "",
        nome: "",
        email: "",
        disableCheckbox: true,
        listaCorrente: [],
        listaCache: [],
        barraPesquisa: ""
    }
    token = this.props.user.token
    touchUnidadeCurricular = this.touchUnidadeCurricular.bind(this)

    preencheBarraDePesquisa(barraPesquisa) { this.setState({ barraPesquisa }) }
    async touchUnidadeCurricular(i, valor) {
        await this.setState({
            unidadeCurricularListaTouch: valor,
            unidadeCurricular:
                this.state.cacheUnidadeCurricular.filter(value => {
                    if (valor === null | valor === undefined)
                        return true
                    return value.nome.includes(valor.nome) ? true : false
                })
        })
    }
    async checkToggleUnidadeCurricular(id) {

        await this.setState({
            unidadeCurricular: this.setCheck(this.state.unidadeCurricular, id),
            cacheUnidadeCurricular: this.setCheck(this.state.cacheUnidadeCurricular, id),
        })
        this.setUnidadeCurricular()
    }
    permissaoStatus = {
        PROFESSOR: () => {
            this.buscaItem(this.props.user.id)
        },
        ADMINISTRADOR: () => {
            this.buscarProfessores()
        }
    }
    componentDidMount() {
        this.getModalidade()
        this.getAreaConhecimento()
        this.getUnidadeCurricular()
        this.permissaoStatus[this.props.user.permissao]()
    }
    limpaDescricao() {
        this.setState({
            id: 0,
            matricula: "",
            tipo: "",
            nome: "",
            email: "",
            modalidade: this.state.cacheModalidade,
            unidadeCurricular: this.state.cacheUnidadeCurricular,
            areaConhecimento: this.state.cacheAreaConhecimento,

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
        GET("competencia/buscarItem/" + id + "/" + this.token)
            .then(response => {
                let modalidade = this.limparCheck(this.state.cacheModalidade)
                response.modalidade.forEach(item => {
                    modalidade = this.setCheck(modalidade, item.id)
                })

                let areaconhecimento = this.limparCheck(this.state.cacheAreaConhecimento)
                response.areaconhecimento.forEach(item => {
                    areaconhecimento = this.setCheck(areaconhecimento, item.id)
                })

                let unidadeCurricular = []
                areaconhecimento.forEach(elem => {
                    const newLista = elem.unidadeCurricular.filter(elem => {
                        return unidadeCurricular.filter(elemUnidade => {
                            return elemUnidade.id === elem.id
                        }).length === 0
                    })
                    if (elem.check) unidadeCurricular = unidadeCurricular.concat(newLista)
                })

                unidadeCurricular = this.limparCheck(unidadeCurricular)
                response.unidadecurricular.forEach(elem => {
                    unidadeCurricular = this.setCheck(unidadeCurricular, elem.id)
                })

                this.setState({
                    id: response.id,
                    nome: response.nome,
                    matricula: response.matricula,
                    tipo: response.tipo,
                    email: response.email,
                    unidadeCurricular: unidadeCurricular,
                    cacheUnidadeCurricular: unidadeCurricular,
                    unidadeCurricularListaPesquisa: unidadeCurricular
                })
                if (modalidade.length > 0)
                    this.setState({
                        modalidade: modalidade,
                    })

                if (areaconhecimento.length > 0)
                    this.setState({
                        areaConhecimento: areaconhecimento,
                    })
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

    buscarProfessores = () => {
        // segundo atualiza <----------------------------
        this.setState({ loading: true })
        GET("gerenciarEmails/listarProfessores/" + this.token)
            .then(response => {
                if (response === undefined | response.length === 0) throw new Error('Erro lista vazia.')
                this.setState({
                    listaProfessores: response,
                    listaCache: response,
                    inicial: false
                })
            })
            .catch(err => {
                console.log(err)
                this.setState({
                    listaProfessores: [],
                    listaCache: [],
                    inicial: true
                })
            }).finally(() => {
                this.setState({ loading: false })
            })
    }

    async getModalidade() {
        this.carregamentoInicial()
        let response = await GET("competencia/pegamodalidades/" + this.token)
        if (response != null && response != undefined) {
            this.setState({
                modalidade: response,
                cacheModalidade: response,
            })
        }
        this.finalizarCarregamentoInicial()
    }
    async getAreaConhecimento() {
        this.carregamentoInicial()
        let response = await GET("competencia/pegaareaconhecimentos/" + this.token)
        if (response != null && response != undefined) {
            this.setState({
                areaConhecimento: response,
                cacheAreaConhecimento: response,
            })
        }
        this.finalizarCarregamentoInicial()
    }
    async getUnidadeCurricular() {
        this.carregamentoInicial()
        let response = await GET("competencia/pegaunidadecurriculares/" + this.token)
        if (response != null && response != undefined) {
            this.setState({
                unidadeCurricular: response,
                cacheUnidadeCurricular: response,
                unidadeCurricularListaPesquisa: response

            })
        }
        this.finalizarCarregamentoInicial()
    }

    carregamentoInicial() {
        this.setState({
            count: this.state.count++
        })
    }
    finalizarCarregamentoInicial() {
        this.setState({
            count: this.state.count--
        })
        if (this.state.count == 0) {
            this.setState({
                loading: false
            })
        }
    }

    async checkToggleModalidade(id) {
        await this.setState({ modalidade: this.setCheck(this.state.modalidade, id) })
        this.setModalidade()
    }
    async checkToggleAreaConhecimento(id) {
        await this.setState({ areaConhecimento: this.setCheck(this.state.areaConhecimento, id) })
        this.setAreaConhecimento()
    }


    async setModalidade() {
        let o = {}
        o.id = this.state.id;
        o.modalidade = this.ForEachItemArray(this.state.modalidade)
        await POST("competencia/inseremodalidade/" + this.token, o)
    }
    async setAreaConhecimento() {
        let o = {}
        o.id = this.state.id;
        o.areaconhecimento = this.ForEachItemArray(this.state.areaConhecimento)
        await POST("competencia/insereareaconhecimento/" + this.token, o)
        await this.setUnidadeCurricular()
        this.buscaItem(this.state.id)
    }
    async setUnidadeCurricular() {
        let o = {}
        o.id = this.state.id;
        o.unidadecurricular = this.ForEachItemArray(this.state.cacheUnidadeCurricular)
        await POST("competencia/insereunidadecurricular/" + this.token, o)
    }

    ForEachItemArray(list) {
        let aux = []
        this.filterCheck(list).forEach(item => {
            if (item.check == true)
                aux.push({ 'id': item.id })
        });
        return aux;
    }

    filterCheck(lista) {
        return lista.filter(item => {
            return item.check == true;
        })
    }

    setCheck(lista, id) {
        let novaLista = []
        lista.forEach(item => {
            if (item.id == id) {
                novaLista.push({ ...item, check: !item.check })
            } else {
                novaLista.push({ ...item })
            }
        });

        return novaLista
    }

    limparCheck(lista) {
        let novaLista = []
        lista.forEach(item => {
            novaLista.push({ ...item, check: false })
        });

        return novaLista
    }

    getRetornaListaCorrente(listaCorrente) {
        if (!ArrayCompare(listaCorrente, this.state.listaCorrente)) {
            this.setState({ listaCorrente });
        }
    }

    async barraPesquisa(listaFiltrada) {
        if (!ArrayCompare(this.state.listaProfessores, listaFiltrada)) {
            await this.setState({
                listaProfessores: listaFiltrada
            })
        }
    }

    organizaListaPorNome(lista) {
        return lista.sort((a, b) => {
            return a.nome.localeCompare(b.nome);
        })
    }

    render() {
        const { disableCheckbox, loading, unidadeCurricular, unidadeCurricularListaPesquisa, unidadeCurricularListaTouch, id, matricula, tipo, nome, email } = this.state

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
                                <h1>Competência</h1>
                            </div>
                        </Row>
                        <div id="corpo" className="cadastro">
                            <Container >
                                <div className="descriptionbox">
                                    <div className="flexbox" style={{ borderTop: "1px solid #dee2e6" }}>
                                        <div className="w-3">id: {id === 0 ? "#" : id}</div>
                                        <div className="w-3">Matrícula: {matricula === "" ? "#" : matricula}</div>
                                        <div className="w-3">Nome: {nome === "" ? "#" : nome}</div>
                                    </div>
                                    <div className="flexbox" style={{ borderTop: "1px solid #dee2e6" }}>
                                        <div className="w-3">E-mail: {email === "" ? "#" : email}</div>
                                        <div className="w-3" style={{ width: "15%" }}>Tipo: {tipo === "" ? "#" : tipo}</div>
                                    </div>
                                </div>
                                <div className="flexbox">
                                    <div className="w-3">
                                        <div className="boxContainer">
                                            <div className="boxtitle">Modalidade</div>
                                            <div className="boxItens">
                                                {
                                                    this.organizaListaPorNome(this.state.modalidade).map(res => {
                                                        if (res.check === undefined) res.check = false;
                                                        return (
                                                            <div onClick={disableCheckbox == false ? () => this.checkToggleModalidade(res.id) : null} className="boxfields">
                                                                <div className="fieldsLabel">{res.nome}</div>
                                                                <div className="fieldsCheck">
                                                                    <Input disabled={disableCheckbox} checked={res.check} type="checkbox" id="check" className="checkCompetencia" name="check" />
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                }
                                                {
                                                    this.state.areaConhecimento.length > 0 ? <BarraInicial exec={false} message='' colspan="1" /> : <BarraInicial exec={true} message={(<span style={{ fontSize: "14px" }}>Não possui itens para carregar.</span>)} colspan="1" />
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-3">
                                        <div className="boxContainer">
                                            <div className="boxtitle">Área de conhecimento</div>
                                            <div className="boxItens rolagem">
                                                {
                                                    this.organizaListaPorNome(this.state.areaConhecimento).map(res => {
                                                        if (res.check === undefined) res.check = false;
                                                        return (
                                                            <div onClick={disableCheckbox == false ? () => this.checkToggleAreaConhecimento(res.id) : null} className="boxfields">
                                                                <div className="fieldsLabel">{res.nome}</div>
                                                                <div className="fieldsCheck">
                                                                    <Input disabled={disableCheckbox} checked={res.check} type="checkbox" id="check" className="checkCompetencia" name="check" />
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                }
                                                {
                                                    this.state.areaConhecimento.length > 0 ? <BarraInicial exec={false} message='' colspan="1" /> : <BarraInicial exec={true} message={(<span style={{ fontSize: "14px" }}>Não possui itens para carregar.</span>)} colspan="1" />
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-3">
                                        <div className="boxContainer">
                                            <div className="boxtitle">Unidade Curricular</div>
                                            <Autocomplete
                                                options={unidadeCurricularListaPesquisa}
                                                value={unidadeCurricularListaTouch}
                                                onChange={this.touchUnidadeCurricular}
                                                getOptionLabel={(option) => option.nome}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        variant="standard"
                                                        label="Pesquisar"
                                                        placeholder="Escolha..."
                                                    />
                                                )}
                                            />
                                            <div className="boxItens rolagem">
                                                {

                                                    this.organizaListaPorNome(unidadeCurricular).map(res => {
                                                        if (res.check === undefined) res.check = false;
                                                        return (
                                                            <div onClick={disableCheckbox == false ? () => this.checkToggleUnidadeCurricular(res.id) : null} className="boxfields">
                                                                <div className="fieldsLabel">{res.nome}</div>
                                                                <div className="fieldsCheck">
                                                                    <Input disabled={disableCheckbox} checked={res.check} type="checkbox" id="check" className="checkCompetencia" name="check" />
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                }
                                                {
                                                    unidadeCurricular.length > 0 ? <BarraInicial exec={false} message='' colspan="1" /> : <BarraInicial exec={true} message={(<span style={{ fontSize: "14px" }}>Selecione uma Area de conhecimento.</span>)} colspan="1" />
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Container>
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
                                                lista={this.state.listaProfessores}
                                                total={this.state.listaProfessores.length}
                                                retornaLista={this.getRetornaListaCorrente.bind(this)}
                                            />
                                        </div>
                                    </div>
                                    <a href="#corpo">
                                        <Table>
                                            <thead>
                                                <tr>
                                                    <th>ID</th>
                                                    <th>Matrícula</th>
                                                    <th>Professor</th>
                                                    <th>tipo</th>
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
                                                            <td>{o.matricula}</td>
                                                            <td>{o.nome}</td>
                                                            <td>{o.tipo}</td>
                                                            <td>{o.email}</td>
                                                        </tr>
                                                    );
                                                })}
                                                {
                                                    this.state.listaProfessores.length > 0 ? <BarraInicial exec={false} message='Não possui itens para carregar.' colspan="5" /> : <BarraInicial exec={true} message='Não possui itens para carregar.' colspan="5" />
                                                }
                                            </tbody>
                                        </Table>
                                    </a>
                                </div>
                            </LinhaImaginaria>
                        </div>
                    </ContainerFade>
                </Row>
            </div>
        </div>
    };
}

export default Competencia

