import React from "react";
import { FaSearch } from "react-icons/fa";
import { Row, Input, InputGroup, InputGroupAddon, Button } from "reactstrap";
import { POST, Loading } from "../componentes/Request";
import { ContainerFade, Navegacao, Cabecalho, ModalDetalhe } from "../componentes/corpo"

class ConsultaDisponibilidade extends React.Component {
    state = {
        lista: [],
        professor: {},
        loading: false,
        count: 0,
        manha: "",
        tarde: "",
        noite: "",
        pesquisa: "",
        manhap:false,
        tardep:false,
        noitep:false,
        segunda: false,
        terca: false,
        quarta: false,
        quinta: false,
        sexta: false,
        sabado: false,
        domingo: false,
        modalidade: [],
        areaConhecimento: [],
        unidadeCurricular: [],
        toggle: false
    }
    token = this.props.user.token

    componentDidMount() {
        this.getListaProfessores()
    }
    setPesquisa(pesquisa) { this.setState({ pesquisa: pesquisa.target.value.toString().limitSize(255) }) }

    async getListaProfessores() {
        this.setState({ loading: true })
        let st = this.state
        let o = {}
        o.pesquisa = st.pesquisa
        o.segunda = st.segunda
        o.terca = st.terca
        o.quarta = st.quarta
        o.quinta = st.quinta
        o.sexta = st.sexta
        o.sabado = st.sabado
        o.domingo = st.domingo
        o.manha = st.manhap
        o.tarde = st.tardep
        o.noite = st.noitep
        let response = await POST("disponibilidade/listadisponibilidade/" + this.token, o)
        console.log(response)
        if (response !== null && response !== undefined) {
            this.setState({
                lista: response,
            })
        }

        this.setState({ loading: false })
    }

    async professorInfo(id) {
        await this.setState({
            professor: this.pegaProfessor(id)
        })
        this.setState({ loading: true })
        await this.getDisponibilidade()
        await this.getModalidade()
        await this.getAreaconhecimento()
        await this.getUnidadecurricular()
        this.setState({ loading: false })
    }

    getModalidade() {
        let modalidade = this.state.professor.modalidade
        let lista = []
        for (let i = 0; i < modalidade.length; i++) {
            lista.push(modalidade[i].nome)
        }
        this.setState({
            modalidade: lista
        })
    }
    getAreaconhecimento() {
        let areaConhecimento = this.state.professor.areaconhecimento
        let lista = []
        for (let i = 0; i < areaConhecimento.length; i++) {
            lista.push(areaConhecimento[i].nome)
        }
        this.setState({
            areaConhecimento: lista
        })
    }
    getUnidadecurricular() {
        let unidadeCurricular = this.state.professor.unidadecurricular
        let lista = []
        for (let i = 0; i < unidadeCurricular.length; i++) {
            let o = {}
            o.id = unidadeCurricular[i].id
            o.nome = unidadeCurricular[i].nome
            o.descricao = unidadeCurricular[i].descricao
            lista.push(o)
        }
        this.setState({
            unidadeCurricular: lista
        })
    }

    pegaProfessor(id) {
        for (let item of this.state.lista) {
            if (item.id === id) {
                return item;
            }
        }
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

    async setcheck(param) {
        switch (param) {
            case "segunda": await this.setState(dia => ({ segunda: !dia.segunda })); break;
            case "terca": await this.setState(dia => ({ terca: !dia.terca })); break;
            case "quarta": await this.setState(dia => ({ quarta: !dia.quarta })); break;
            case "quinta": await this.setState(dia => ({ quinta: !dia.quinta })); break;
            case "sexta": await this.setState(dia => ({ sexta: !dia.sexta })); break;
            case "sabado": await this.setState(dia => ({ sabado: !dia.sabado })); break;
            case "domingo": await this.setState(dia => ({ domingo: !dia.domingo })); break;
            case "manhap": await this.setState(dia => ({ manhap: !dia.manhap })); break;
            case "tardep": await this.setState(dia => ({ tardep: !dia.tardep })); break;
            case "noitep": await this.setState(dia => ({ noitep: !dia.noitep })); break;
            default: console.log("erro opcao"); break;
        }
        this.getListaProfessores()
    }


    render() {
        const { loading, professor, pesquisa, manhap,tardep, noitep, manha, tarde, noite, segunda, terca, quarta, quinta, sabado, sexta, domingo, modalidade, areaConhecimento, unidadeCurricular } = this.state
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
                                <h1>Consulta de disponibilidade</h1>
                            </div>
                        </Row>
                        <div className="flexbox">
                            <div className="filtroInputDisponibilidade">
                                <InputGroup className="w-50">
                                    <Input value={pesquisa} onChange={this.setPesquisa.bind(this)} name="pesquisa" placeholder="Barra de pesquisa" />
                                    <InputGroupAddon addonType="append">
                                        <Button color="secondary" onClick={() => this.getListaProfessores()}>
                                            <FaSearch />
                                        </Button>
                                    </InputGroupAddon>
                                </InputGroup>
                            </div>
                        </div>
                        <div className="flexbox filtroSemanaButtons">
                            <div className="btn btn-outline-secondary w-142857143 boxtitle flexbox m-5 ">
                                <div onClick={() => this.setcheck("manhap")} className="filtroDivSemana w-full" outline>Manhã
                                    <Input checked={manhap} type="checkbox" id="check" name="check" className="checkSemana" />
                                </div>
                            </div>
                            <div className="btn btn-outline-secondary w-142857143 boxtitle flexbox m-5 ">
                                <div onClick={() => this.setcheck("tardep")} className="filtroDivSemana w-full" outline>Tarde
                                    <Input checked={tardep} type="checkbox" id="check" name="check" className="checkSemana" />
                                </div>
                            </div>
                            <div className="btn btn-outline-secondary w-142857143 boxtitle flexbox m-5 ">
                                <div onClick={() => this.setcheck("noitep")} className="filtroDivSemana w-full" outline>Noite
                                    <Input checked={noitep} type="checkbox" id="check" name="check" className="checkSemana" />
                                </div>
                            </div>
                        </div>
                        <div className="flexbox filtroSemanaButtons">
                            <div className="btn btn-outline-secondary w-142857143 boxtitle flexbox m-5 ">
                                <div onClick={() => this.setcheck("segunda")} className="filtroDivSemana w-full" outline>Segunda
                                    <Input checked={segunda} type="checkbox" id="check" name="check" className="checkSemana" />
                                </div>
                            </div>
                            <div className="btn btn-outline-secondary w-142857143 boxtitle flexbox m-5 ">
                                <div onClick={() => this.setcheck("terca")} className="filtroDivSemana w-full " outline>Terça
                                    <Input checked={terca} type="checkbox" id="check" name="check" className="checkSemana" />
                                </div>
                            </div>
                            <div className="btn btn-outline-secondary w-142857143 boxtitle flexbox m-5 ">
                                <div onClick={() => this.setcheck("quarta")} className="filtroDivSemana w-full " outline>Quarta
                                    <Input checked={quarta} type="checkbox" id="check" name="check" className="checkSemana" />
                                </div>
                            </div>
                            <div className="btn btn-outline-secondary w-142857143 boxtitle flexbox m-5 ">
                                <div onClick={() => this.setcheck("quinta")} className="filtroDivSemana w-full " outline>Quinta
                                    <Input checked={quinta} type="checkbox" id="check" name="check" className="checkSemana" />
                                </div>
                            </div>
                            <div className="btn btn-outline-secondary w-142857143 boxtitle flexbox m-5 ">
                                <div onClick={() => this.setcheck("sexta")} className="filtroDivSemana w-full " outline>Sexta
                                    <Input checked={sexta} type="checkbox" id="check" name="check" className="checkSemana" />
                                </div>
                            </div>
                            <div className="btn btn-outline-secondary w-142857143 boxtitle flexbox m-5 ">
                                <div onClick={() => this.setcheck("sabado")} className="filtroDivSemana w-full " outline>Sabado
                                    <Input checked={sabado} type="checkbox" id="check" name="check" className="checkSemana" />
                                </div>
                            </div>
                            <div className="btn btn-outline-secondary w-142857143 boxtitle flexbox m-5 ">
                                <div onClick={() => this.setcheck("domingo")} className="filtroDivSemana w-full " outline>Domingo
                                    <Input checked={domingo} type="checkbox" id="check" name="check" className="checkSemana" />
                                </div>
                            </div>

                        </div>
                        <div className="flexbox">
                            <div className="w-3">
                                <div className="boxContainer" style={{ backgroundColor: "rgba(144,238,144)" }}>
                                    <div className="boxtitle">Manhã</div>
                                    <div className="boxItens">
                                        {
                                            this.state.lista
                                                .filter(res => {
                                                    let boo = false;
                                                    if (segunda) boo = true;
                                                    if (terca) boo = true;
                                                    if (quarta) boo = true;
                                                    if (quinta) boo = true;
                                                    if (sexta) boo = true;
                                                    if (sabado) boo = true;
                                                    if (domingo) boo = true;

                                                    if (boo) {
                                                        return (res.disponibilidade.segM && segunda) ||
                                                            (res.disponibilidade.terM && terca) ||
                                                            (res.disponibilidade.quaM && quarta) ||
                                                            (res.disponibilidade.quiM && quinta) ||
                                                            (res.disponibilidade.sexM && sexta) ||
                                                            (res.disponibilidade.sabM && sabado) ||
                                                            (res.disponibilidade.domM && domingo)
                                                    }

                                                    return res.disponibilidade.segM || res.disponibilidade.terM || res.disponibilidade.quaM
                                                        || res.disponibilidade.quiM || res.disponibilidade.sexM
                                                        || res.disponibilidade.sabM || res.disponibilidade.domM
                                                }).map(res => {
                                                    return (
                                                        <div className="boxfields">
                                                            <div className="fieldsLabel">{res.nome}</div>
                                                            <div className="iconLabel">
                                                                <ModalDetalhe
                                                                    professor={professor}
                                                                    manha={manha}
                                                                    tarde={tarde}
                                                                    noite={noite}
                                                                    modalidade={modalidade}
                                                                    areaConhecimento={areaConhecimento}
                                                                    unidadeCurricular={unidadeCurricular}
                                                                    id={res.id}
                                                                    redirect={this.professorInfo.bind(this)}
                                                                />
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="w-3">
                                <div className="boxContainer" style={{ backgroundColor: "rgba(240,230,140)" }}>
                                    <div className="boxtitle">Tarde</div>
                                    <div className="boxItens">
                                        {
                                            this.state.lista
                                                .filter(res => {
                                                    let boo = false;
                                                    if (segunda) boo = true;
                                                    if (terca) boo = true;
                                                    if (quarta) boo = true;
                                                    if (quinta) boo = true;
                                                    if (sexta) boo = true;
                                                    if (sabado) boo = true;
                                                    if (domingo) boo = true;

                                                    if (boo) {
                                                        return (res.disponibilidade.segT && segunda) ||
                                                            (res.disponibilidade.terT && terca) ||
                                                            (res.disponibilidade.quaT && quarta) ||
                                                            (res.disponibilidade.quiT && quinta) ||
                                                            (res.disponibilidade.sexT && sexta) ||
                                                            (res.disponibilidade.sabT && sabado) ||
                                                            (res.disponibilidade.domT && domingo)
                                                    }
                                                    return res.disponibilidade.segT || res.disponibilidade.terT || res.disponibilidade.quaT
                                                        || res.disponibilidade.quiT || res.disponibilidade.sexT
                                                        || res.disponibilidade.sabT || res.disponibilidade.domT
                                                }).map(res => {
                                                    return (
                                                        <div className="boxfields">
                                                            <div className="fieldsLabel">{res.nome}</div>
                                                            <div className="iconLabel">
                                                                <ModalDetalhe
                                                                    professor={professor}
                                                                    manha={manha}
                                                                    tarde={tarde}
                                                                    noite={noite}
                                                                    modalidade={modalidade}
                                                                    areaConhecimento={areaConhecimento}
                                                                    unidadeCurricular={unidadeCurricular}
                                                                    id={res.id}
                                                                    redirect={this.professorInfo.bind(this)}
                                                                />
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="w-3">
                                <div className="boxContainer" style={{ backgroundColor: "rgba(176,196,222)" }}>
                                    <div className="boxtitle">Noite</div>
                                    <div className="boxItens">
                                        {
                                            this.state.lista
                                                .filter(res => {
                                                    let boo = false;
                                                    if (segunda) boo = true;
                                                    if (terca) boo = true;
                                                    if (quarta) boo = true;
                                                    if (quinta) boo = true;
                                                    if (sexta) boo = true;
                                                    if (sabado) boo = true;
                                                    if (domingo) boo = true;

                                                    if (boo) {
                                                        return (res.disponibilidade.segN && segunda) ||
                                                            (res.disponibilidade.terN && terca) ||
                                                            (res.disponibilidade.quaN && quarta) ||
                                                            (res.disponibilidade.quiN && quinta) ||
                                                            (res.disponibilidade.sexN && sexta) ||
                                                            (res.disponibilidade.sabN && sabado) ||
                                                            (res.disponibilidade.domN && domingo)
                                                    }
                                                    return res.disponibilidade.segN || res.disponibilidade.terN || res.disponibilidade.quaN
                                                        || res.disponibilidade.quiN || res.disponibilidade.sexN
                                                        || res.disponibilidade.sabN || res.disponibilidade.domN
                                                }).map(res => {
                                                    return (
                                                        <div className="boxfields">
                                                            <div className="fieldsLabel">{res.nome}</div>
                                                            <div className="iconLabel">
                                                                <ModalDetalhe
                                                                    professor={professor}
                                                                    manha={manha}
                                                                    tarde={tarde}
                                                                    noite={noite}
                                                                    modalidade={modalidade}
                                                                    areaConhecimento={areaConhecimento}
                                                                    unidadeCurricular={unidadeCurricular}
                                                                    id={res.id}
                                                                    redirect={this.professorInfo.bind(this)}
                                                                />
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ContainerFade>
                </Row>
            </div>
        </div >
    };
}

export default ConsultaDisponibilidade

