import React from "react";
import {
    Container, Row, Col
} from "reactstrap";
import { GET, Loading } from "../componentes/Request";
import {
    withRouter
} from "react-router-dom";

class FinalizarCadastro extends React.Component {
    state = {
        loading: true,
        resultado: null
    }
    voltarTelaInicial = this.voltarTelaInicial.bind(this)
    async componentDidMount() {
        await GET("professor/finalizarCadastro/" + this.props.match.params.token, false).then(() => {
            this.setState({
                loading: false,
                resultado: (<>
                    <Col className="caixa_alerta" style={{ borderColor: "#00dc00" }}>
                        <p className="p_alerta" style={{ color: "#00dc00" }}>Seu cadastro foi finalizado com sucesso!</p>
                        <p className="p_alerta">Deverá conseguir se logar no sistema a partir de agora.</p>
                        <p className="p_alerta">Você pode voltar para a tela de login por este caminho.</p>
                        <button className="btn_telaInicial" type="button" onClick={() => this.voltarTelaInicial()}>Click aqui</button>
                    </Col>
                </>)
            })
        }).catch(err => {
            this.setState({
                loading: false,
                resultado: (<>
                    <Col className="caixa_alerta">
                        <p className="p_alerta" style={{ color: "rgb(255, 93, 93)" }}>Seu cadastro não foi finalizado.</p>
                        <p className="p_alerta">Pode ser que o servidor não conseguiu processar sua finalização ou esteja fora do ar.</p>
                        <p className="p_alerta">Recomendo que tente novamente mais tarde ou entre em contato com um administrador.</p>
                        <p className="p_alerta">Você pode voltar para a tela de login por este caminho.</p>
                        <button className="btn_telaInicial" type="button" onClick={() => this.voltarTelaInicial()}>Click aqui</button>
                    </Col>
                </>)
            })
            if (err.status === undefined) alert("Ops! O servidor não está respondendo.\nPor favor, aguarde um momento e tente novamente.")
            if (err.status >= 500)
                err.text().then(errorMessage => {
                    console.log(errorMessage)
                    if (errorMessage != undefined && errorMessage == "USUARIO_JA_CADASTRADO") {
                        alert("Seu cadastro ja foi efetuado, pode realizar seu login.")
                        window.location.href = "/";
                    }
                })
            else
                if (err.status >= 400) alert("Ops! Erro: " + err.status + " \nO servidor não conseguiu processar esta requisição.")

        })
    }
    voltarTelaInicial() {
        window.location.href = "/";
    }
    render() {
        return (<>
            <Loading loading={this.state.loading} message='Carregando ...' />
            <div className="corpoTelaInicial">
                <div className="cadastro">
                    <Container>
                        <Row>
                            <Col xs={{ size: 8, offset: 2 }}>
                                {this.state.resultado}
                            </Col>
                        </Row>
                    </Container>
                </div>
            </div>
        </>)

    }
}

export default withRouter(FinalizarCadastro)