import React from "react";
import Pagination from "./paginacao-plugin";
import { ArrayCompare } from "./utilidadePublica";

class Paginacao extends React.Component {
    state = {
        lista: [],
        listaCorrente: [],
        currentPage: 1,
        totalPages: null,
        pageLimit: 10,
        buttons: {
            10: true,
            25: false,
            50: false,
            100: false,
        }
    }
    setPageLimit = (pageLimit) => {
        this.setState({
            pageLimit
        })
    }
    onPageChanged = data => {
        const { lista } = this.state;
        const { currentPage, totalPages, pageLimit } = data;
        if (lista.length > 0) {
            const offset = (currentPage - 1) * pageLimit;
            const listaCorrente = lista.slice(offset, offset + pageLimit);
            this.setState({ listaCorrente });
        }
        this.setState({ currentPage, totalPages });
    };
    componentDidUpdate() {
        if (!ArrayCompare(this.props.lista, this.state.lista)) {
            this.setState({ lista: this.props.lista })
        }
        this.atualizaLista()
        this.props.retornaLista(this.props.lista.length > 0 ? this.state.listaCorrente : [])
    }

    atualizaLista() {
        const { lista } = this.state;
        const { currentPage, pageLimit } = this.state;
        const calculo = (currentPage - 1) * pageLimit
        const offset = calculo <= 0 ? 0 : calculo
        if (this.props.lista.length > 0) {
            const listaCorrente = lista.slice(offset, offset + pageLimit);
            if (!ArrayCompare(listaCorrente, this.state.listaCorrente)) {
                this.setState({ listaCorrente });
                return true
            }
        }
        return false
    }

    async setBotoes(botao) {
        await this.zerarBotoes()
        let { buttons } = this.state
        buttons[botao] = true
        this.setState({ buttons })
    }

    zerarBotoes() {
        this.setState({
            buttons: {
                10: false,
                25: false,
                50: false,
                100: false,
            }
        })
    }

    render() {

        const { buttons } = this.state

        const b10 = buttons[10]
        const b25 = buttons[25]
        const b50 = buttons[50]
        const b100 = buttons[100]

        return <div className="paginacao" id="paginacao">
            {
                (this.props.total === 0) ? null :
                    <Pagination
                        totalRecords={this.props.total}
                        pageLimit={this.state.pageLimit}
                        pageNeighbours={4}
                        onPageChanged={this.onPageChanged}
                    />
            }
            <div className="limitePaginacao" style={{ marginLeft: "15px" }}>
                <span style={{ fontSize: "11px", color: "rgba(0,0,0,.5)" }}>Nº Itens &nbsp;</span>
                <ul className="pagination">
                    <li className={"page-item "+(b10 ? "act" : "")} onClick={() => this.setBotoes(10)}><a className="page-link" onClick={() => this.setPageLimit(10)}>10</a></li>
                    <li className={"page-item "+(b25 ? "act" : "")} onClick={() => this.setBotoes(25)}><a className="page-link" onClick={() => this.setPageLimit(25)}>25</a></li>
                    <li className={"page-item "+(b50 ? "act" : "")} onClick={() => this.setBotoes(50)}><a className="page-link" onClick={() => this.setPageLimit(50)}>50</a></li>
                    <li className={"page-item "+(b100 ? "act" : "")} onClick={() => this.setBotoes(100)}><a className="page-link" onClick={() => this.setPageLimit(100)}>100</a></li>
                </ul>
            </div>
        </div>

    }
}

export default Paginacao