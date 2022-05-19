import React from "react";
import { 
    Container, Row, Button
} from "reactstrap";
import { GET, Loading, POST } from "../../componentes/Request";
import { ContainerFade, Navegacao, Cabecalho, BarraInicial } from "../../componentes/corpo"
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import {
    withRouter
} from "react-router-dom";

class RelacionamentoSegmentoTecnologico extends React.Component {
    state = {
        modalidade: {},
        areaConhecimento: [],
        unidadeCurricularListaPesquisa: [],
        unidadeCurricularListaTouch: [],
        cacheUnidadeCurricular: [],
        lista: [],
        loading: true
    }
    id = this.props.match.params.id
    token = this.props.match.params.token
    voltarAreaConhecimento = this.voltarAreaConhecimento.bind(this)

    touchUnidadeCurricular = this.touchUnidadeCurricular.bind(this)

    async touchUnidadeCurricular(i, valor) {
        console.log(valor)
        await this.setState({
            unidadeCurricularListaTouch: valor,
            areaConhecimento:
                this.state.areaConhecimento.filter(value => {
                    if (valor === null | valor === undefined)
                        return true
                    return value.nome.includes(valor.nome) ? true : false
                })
        })
        if (valor === null | valor === undefined) await this.atualizarUnidadeCurricular()
    }

    async componentDidMount() {
        let modalidade = await GET("modalidade/buscar/" + this.id + "/" + this.token)
        console.log(modalidade)
        let areaConhecimento = await GET("areaConhecimento/listar/" + this.token)
        this.setState({
            modalidade: modalidade,
            areaConhecimento: areaConhecimento,
            cacheUnidadeCurricular: areaConhecimento,
            lista: modalidade.areaConhecimento.length > 0 ? modalidade.areaConhecimento : [],
            loading: false
        })
        await this.atualizarLista()
        await this.atualizarUnidadeCurricular()
    }

    async atualizarLista() {
        let modalidade = await GET("modalidade/buscar/" + this.id + "/" + this.token)
        if (modalidade.areaConhecimento)
            await this.setState({
                lista: modalidade.areaConhecimento.length > 0 ? modalidade.areaConhecimento : []
            })
        else
            await this.setState({
                lista: []
            })
    }

    async atualizarUnidadeCurricular() {
        let areaConhecimento = await GET("areaConhecimento/listar/" + this.token)
        this.setState({
            areaConhecimento: areaConhecimento.filter((elem, id) => {
                return this.state.lista.filter((elemLista, idLista) => {
                    return elemLista.id == elem.id
                }).length == 0
            })
        })
    }

    async click(id, decisao) {
        let o = await this.state.lista.filter((elem, index) => {
            return elem.id !== id
        })
        if (decisao) {
            await this.state.areaConhecimento.filter((elem, index) => {
                return elem.id === id
            }).forEach((elem, index) => {
                if (elem.id == id) o.push(elem)
            })
        }
        let req = this.state.modalidade
        req.areaConhecimento = o
        await POST("modalidade/relacionar/" + this.token, req)
        await this.atualizarLista()
        await this.atualizarUnidadeCurricular()
    }

    voltarAreaConhecimento() {
        this.props.history.push("/cadastro/modalidade")
    }
    organizaListaPorNome(lista) {
        return lista.sort((a, b) => {
            return a.nome.localeCompare(b.nome);
        })
    }
    render() {
        const { modalidade, areaConhecimento, lista, loading, unidadeCurricularListaTouch } = this.state
        return (<>
            <Loading loading={loading} message='Carregando ...' />
            <div className="corpo">
                <div>
                    <Cabecalho user={this.props.user} />
                </div>
                <Row>
                    <Navegacao user={this.props.user} backPaste="../../" />
                    <ContainerFade>
                        <div className="cadastro">
                            <div style={{ marginTop: "15px", marginBottom: "15px", marginLeft: "5px" }}>
                                <Button outline type="button" onClick={() => this.voltarAreaConhecimento()} color="secondary" size="sm" className="Limpar">Voltar</Button>
                            </div>
                            <Container>
                                <div className="flexbox">
                                    <div className="w-25">
                                        <div className="caixa_detalhe disponivelDescriptionBox">
                                            <div style={{ textAlign: "center" }}>
                                                Modalidade
                                            </div>
                                            <div className="flexbox">
                                                <div className="w-25">
                                                    <b>id:</b>
                                                </div>
                                                <div className="w-75">
                                                    {modalidade.id}
                                                </div>
                                            </div>
                                            <div className="flexbox">
                                                <div className="w-25">
                                                    <b>Nome:</b>
                                                </div>
                                                <div className="w-75">
                                                    {modalidade.nome}
                                                </div>
                                            </div>
                                            <div>
                                                <div>
                                                    <b>Observação</b>
                                                </div>
                                                {modalidade.descricao}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flexbox w-full">
                                        <div className="boxContainer w-50">
                                            <div className="boxtitle">Unidade curricular</div>
                                            <div className="boxItens rolagem">
                                                <Autocomplete
                                                    options={areaConhecimento}
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
                                                {
                                                    this.organizaListaPorNome(areaConhecimento).map(res => {
                                                        return (
                                                            <div onClick={() => this.click(res.id, true)} className="boxfields">
                                                                <div className="fieldsLabelCenter">{res.nome}</div>
                                                                <div className="fieldsCheck">
                                                                    <span style={{color:"green"}}><FaArrowRight /></span>
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        </div>
                                        <div className="boxContainer w-50">
                                            <div className="boxtitle">Relacionado</div>
                                            <div className="boxItens rolagem">
                                                {
                                                    this.organizaListaPorNome(lista).length > 0 ?
                                                        lista.map(res => {
                                                            return (
                                                                <div onClick={() => this.click(res.id, false)} className="boxfields">
                                                                    <div className="fieldsCheck">
                                                                    <span style={{color:"red"}}><FaArrowLeft /></span>
                                                                    </div>
                                                                    <div className="fieldsLabelCenter">{res.nome}</div>
                                                                </div>
                                                            )
                                                        }) : null
                                                }
                                                {
                                                    lista.length > 0 ? <BarraInicial exec={false} message='' colspan="1" /> : <BarraInicial exec={true} message={(<span style={{ fontSize: "14px" }}>Não possui itens para carregar.</span>)} colspan="1" />
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Container>
                        </div>
                    </ContainerFade>
                </Row>
            </div>
        </>)
    }
}

export default withRouter(RelacionamentoSegmentoTecnologico)