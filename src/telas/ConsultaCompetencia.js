import React from "react";
import { Row, Table } from "reactstrap";
import { POST, GET, Loading } from "../componentes/Request";
import { BarraInicial, ContainerFade, Navegacao, Cabecalho, BarraDePesquisa, ModalDetalhe } from "../componentes/corpo"
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import { ArrayCompare } from "../componentes/utilidadePublica";
import Paginacao from "../componentes/paginacao";

class ConsultaCompetencia extends React.Component {
    state = {
        lista: [],
        professor: {},
        loading: false,
        modal: false,
        count: 0,
        manha: "",
        tarde: "",
        noite: "",
        pesquisa: "",
        modalidade: [],
        areaConhecimento: [],
        unidadeCurricular: [],
        valueModalidade: {},
        valueAreaConhecimento: {},
        valueUnidadeCurricular: {},
        professorModalidade: [],
        professorAreaconhecimento: [],
        professorUnidadecurricular: [],
        listaCorrente: [],
        listaCache: [],
        barraPesquisa: "",
        toggle:false
    }
    token = this.props.user.token
    touchModalidade = this.touchModalidade.bind(this);
    touchAreaConhecimento = this.touchAreaConhecimento.bind(this);
    touchUnidadeCurricular = this.touchUnidadeCurricular.bind(this);

    preencheBarraDePesquisa(barraPesquisa) { this.setState({ barraPesquisa }) }

    touchModalidade(e, valueModalidade) {
        this.state.valueModalidade = this.amountList(valueModalidade)
        this.getListaProfessores()
    }
    touchAreaConhecimento(e, valueAreaConhecimento) {
        this.state.valueAreaConhecimento = this.amountList(valueAreaConhecimento)

        this.getListaProfessores()
    }
    touchUnidadeCurricular(e, valueUnidadeCurricular) {
        this.state.valueUnidadeCurricular = this.amountList(valueUnidadeCurricular)
        this.getListaProfessores()
    }

    amountList(listaAntiga) {

        let listNova = [];
        for (let i in listaAntiga) {
            let o = {}
            o.id = listaAntiga[i].id
            o.status = 1
            listNova.push(o)
        }

        return listNova
    }

    async professorInfo(id) {
        await this.setState({
            professor: this.pegaProfessor(id)
        })
        this.setState({ loading: true })
        await this.getDisponibilidade()
        await this.getProfessorModalidade()
        await this.getProfessorAreaconhecimento()
        await this.getProfessorUnidadecurricular()
        this.setState({ loading: false })
    }


    getProfessorModalidade() {
        let professorModalidade = this.state.professor.modalidade
        let lista = []
        for (let i = 0; i < professorModalidade.length; i++) {
            lista.push(professorModalidade[i].nome)
        }
        this.setState({
            professorModalidade: lista
        })
    }
    getProfessorAreaconhecimento() {
        let professorAreaconhecimento = this.state.professor.areaconhecimento
        let lista = []
        for (let i = 0; i < professorAreaconhecimento.length; i++) {
            lista.push(professorAreaconhecimento[i].nome)
        }
        this.setState({
            professorAreaconhecimento: lista
        })
    }
    getProfessorUnidadecurricular() {
        let professorUnidadecurricular = this.state.professor.unidadecurricular
        let lista = []
        for (let i = 0; i < professorUnidadecurricular.length; i++) {
            let o = {}
            o.id = professorUnidadecurricular[i].id
            o.nome = professorUnidadecurricular[i].nome
            o.descricao = professorUnidadecurricular[i].descricao
            lista.push(o)
        }
        this.setState({
            professorUnidadecurricular: lista
        })
    }

    getDisponibilidade() {
        let disp = this.state.professor.disponibilidade
        let manha = ""
        let tarde = ""
        let noite = ""

        if (disp.segM) manha += "Segunda, "
        if (disp.terM) manha += "Terça, "
        if (disp.quaM) manha += "Quarta, "
        if (disp.quiM) manha += "Quinta, "
        if (disp.sexM) manha += "Sexta, "
        if (disp.sabM) manha += "Sabado, "
        if (disp.domM) manha += "Domingo, "

        if (disp.segT) tarde += "Segunda, "
        if (disp.terT) tarde += "Terça, "
        if (disp.quaT) tarde += "Quarta, "
        if (disp.quiT) tarde += "Quinta, "
        if (disp.sexT) tarde += "Sexta, "
        if (disp.sabT) tarde += "Sabado, "
        if (disp.domT) tarde += "Domingo, "

        if (disp.segN) noite += "Segunda, "
        if (disp.terN) noite += "Terça, "
        if (disp.quaN) noite += "Quarta, "
        if (disp.quiN) noite += "Quinta, "
        if (disp.sexN) noite += "Sexta, "
        if (disp.sabN) noite += "Sabado, "
        if (disp.domN) noite += "Domingo, "

        this.setState({
            manha: manha.substr(0, manha.length - 2),
            tarde: tarde.substr(0, tarde.length - 2),
            noite: noite.substr(0, noite.length - 2),
        })
    }


    pegaProfessor(id) {
        for (let item of this.state.lista) {
            if (item.id == id) {
                return item;
            }
        }
    }

    async getListaProfessores() {
        this.setState({ loading: true })
        let st = this.state
        let o = {}
        o.modalidade = this.newArray(st.valueModalidade)
        o.areaconhecimento = this.newArray(st.valueAreaConhecimento)
        o.unidadecurricular = this.newArray(st.valueUnidadeCurricular)
        let response = await POST("competencia/listarItens/" + this.token, o)
        if (response != null && response != undefined) {
            this.setState({
                lista: response,
                listaCache: response,
            })
        }

        this.setState({ loading: false })
    }

    newArray(arrayVelho) {

        let arrayNovo = []

        for (var p in arrayVelho) {
            arrayNovo.push(arrayVelho[p])
        }

        return arrayNovo
    }

    async getModalidade() {
        await GET("modalidade/listar/" + this.token)
            .then(response => {
                if (response === undefined | response.length === 0) throw new Error('Erro lista vazia.')
                this.setState({
                    modalidade: response,
                })
            })
            .catch(err => {
                console.log(err)
                this.setState({
                    modalidade: [],
                })
            }).finally(() => {
                if (this.state.modalidade.length == 0) return false

                let lista = [];
                for (let i in this.state.modalidade) {
                    let listaM = []
                    listaM['nome'] = this.state.modalidade[i].nome
                    listaM['id'] = this.state.modalidade[i].id

                    lista.push(listaM)
                }
                this.setState({
                    modalidade: lista
                })
            })

    }

    async getAreaconhecimento() {
        await GET("areaConhecimento/listar/" + this.token)
            .then(response => {
                if (response === undefined | response.length === 0) throw new Error('Erro lista vazia.')
                this.setState({
                    areaConhecimento: response,
                })
            })
            .catch(err => {
                console.log(err)
                this.setState({
                    areaConhecimento: [],
                })
            }).finally(() => {
                if (this.state.areaConhecimento.length == 0) return false

                let lista = [];
                for (let i in this.state.areaConhecimento) {
                    let listaM = []
                    listaM['nome'] = this.state.areaConhecimento[i].nome
                    listaM['id'] = this.state.areaConhecimento[i].id

                    lista.push(listaM)
                }
                this.setState({
                    areaConhecimento: lista
                })
            })

    }

    async getUnidadecurricular() {
        await GET("unidadeCurricular/listar/" + this.token)
            .then(response => {
                if (response === undefined | response.length === 0) throw new Error('Erro lista vazia.')
                this.setState({
                    unidadeCurricular: response,
                })
            })
            .catch(err => {
                console.log(err)
                this.setState({
                    unidadeCurricular: [],
                })
            }).finally(() => {
                if (this.state.unidadeCurricular.length == 0) return false

                let lista = [];
                for (let i in this.state.unidadeCurricular) {
                    let listaM = []
                    listaM['nome'] = this.state.unidadeCurricular[i].nome
                    listaM['id'] = this.state.unidadeCurricular[i].id

                    lista.push(listaM)
                }
                this.setState({
                    unidadeCurricular: lista
                })
            })

    }

    async componentDidMount() {
        this.setState({ loading: true })
        await this.getModalidade()
        await this.getAreaconhecimento()
        await this.getUnidadecurricular()
        await this.getListaProfessores()
        this.setState({ loading: false })
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
        const { loading, professor, manha, tarde, noite,
            valueModalidade, valueAreaConhecimento, valueUnidadeCurricular,
            modalidade, areaConhecimento, unidadeCurricular,
            professorModalidade, professorAreaconhecimento, professorUnidadecurricular } = this.state

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
                                <h1>Consulta de competências</h1>
                            </div>
                        </Row>
                        <div className="flexbox">
                            <div className="filtroInputDisponibilidade">
                                <Autocomplete
                                    multiple
                                    options={modalidade}
                                    value={valueModalidade['modalidade']}
                                    onChange={this.touchModalidade}
                                    getOptionLabel={(option) => option.nome}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            variant="standard"
                                            label="Modalidades"
                                            placeholder="Escolha..."
                                        />
                                    )}
                                />
                            </div>
                            <div className="filtroInputDisponibilidade">
                                <Autocomplete
                                    multiple
                                    options={areaConhecimento}
                                    value={valueAreaConhecimento['areaconhecimento']}
                                    onChange={this.touchAreaConhecimento}
                                    getOptionLabel={(option) => option.nome}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            variant="standard"
                                            label="Área de conhecimento"
                                            placeholder="Escolha..."
                                        />
                                    )}
                                />
                            </div>
                            <div className="filtroInputDisponibilidade">
                                <Autocomplete
                                    multiple
                                    options={unidadeCurricular}
                                    value={valueUnidadeCurricular['unidadecurricular']}
                                    onChange={this.touchUnidadeCurricular}
                                    getOptionLabel={(option) => option.nome}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            variant="standard"
                                            label="Unidade de conhecimento"
                                            placeholder="Escolha..."
                                        />
                                    )}
                                />
                            </div>
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
                                        <th>ID</th>
                                        <th>Professor</th>
                                        <th>Matrícula</th>
                                        <th>Tipo</th>
                                        <th>E-mail</th>
                                        <th>sobre</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.listaCorrente.map(o => {
                                        return (
                                            <tr key={o.id}>
                                                <td>{o.id}</td>
                                                <td>{o.nome}</td>
                                                <td>{o.matricula}</td>
                                                <td>{o.tipo}</td>
                                                <td>{o.email}</td>
                                                <ModalDetalhe
                                                    professor={professor}
                                                    manha={manha}
                                                    tarde={tarde}
                                                    noite={noite}
                                                    modalidade={professorModalidade}
                                                    areaConhecimento={professorAreaconhecimento}
                                                    unidadeCurricular={professorUnidadecurricular}
                                                    destaque={valueUnidadeCurricular}
                                                    id={o.id}
                                                    redirect={this.professorInfo.bind(this)}
                                                    onClick={this.state.toggle = !this.state.toggle}
                                                />
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
            </div>

        </div >
    };

}

export default ConsultaCompetencia

