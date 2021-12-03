import React from "react";
import {
    Container, Row, Col
} from "reactstrap";
import InputDefault from "../componentes/inputsPadroes";
import { BotaoEnviar } from "../componentes/botoes";
import { POST, Loading } from "../componentes/Request";
import {
    withRouter
} from "react-router-dom";
class AlterarSenha extends React.Component {
    state = {
        token: "",
        senha: "",
        confirmar: "",
        sucesso: false
    }

    preencheSenha(senha) { this.setState({ senha }) }
    preencheConfirmar(confirmar) { this.setState({ confirmar }) }

    componentDidMount() {
        console.log(this.props.match.params)
        this.setState({
            token: this.props.match.params.token
        })
    }

    //fields inserir
    preencheEmail(email) { this.setState({ email: email.toLowerCase().replaceAll(" ", "") }) }

    enviaFormulario(event) {
        let st = this.state
        if (st.senha.length > 4) {
            if (st.senha.equals(st.confirmar)) {
              let o = {};
              o.token = st.token
              o.senha = st.senha;
              this.enviar(o);
            } else alert("\"Confirmar\" precisa ser exatamente igual a senha.")
          } else alert("A senha precisa ter pelo menos 5 letras, e no máximo 10 letras.")
    }

    enviar = async o => {
        this.setState({ loading: true });
        await POST("professor/alterarSenha", o, undefined, (ok) => {
            if (ok) {
                this.setState({
                    sucesso: true
                })
            }
        }).finally(() => {
            this.setState({ loading: false });
        })
    }
    voltarTelaInicial() {
        window.location.href = "/";
    }
    render() {
        const { senha, confirmar, loading, token, sucesso } = this.state;
        return (token === "" || token === undefined || token === null) ?
            baba(this.voltarTelaInicial.bind(this)) :
            sucesso ?
                novaSenhaSucesso(this.voltarTelaInicial.bind(this)) :
                (<>
                    <Loading loading={loading} message='Carregando ...' />
                    <div className="corpoTelaInicial">
                        <div className="cadastro">
                            <Container>
                                <Col>
                                    <form>
                                        <Row style={{ marginTop: "15px" }}>
                                            <Col xs={{ size: 8, offset: 2 }}>
                                                <Col className="caixa_alerta">
                                                    <p className="p_alerta">Digite uma nova senha</p>
                                                </Col>
                                                <Row style={{ marginTop: "15px" }}>
                                                    <Col md={{ size: 6 }}>
                                                        <InputDefault obrigatorio evento={this.preencheSenha.bind(this)} valor={senha} size="10" tipo="password" nome="senha" titulo="Nova senha" descricao="Digite uma senha nova" />
                                                    </Col>
                                                    <Col md={{ size: 6 }}>
                                                        <InputDefault obrigatorio evento={this.preencheConfirmar.bind(this)} valor={confirmar} size="10" tipo="password" nome="confirmar" titulo="Confirmar" descricao="Confirme sua senha nova" />
                                                    </Col>
                                                </Row>
                                                <Col>
                                                    <div className="botao" align="right">
                                                        <BotaoEnviar enviar={this.enviaFormulario.bind(this)} />
                                                    </div>
                                                </Col>
                                            </Col>
                                        </Row>
                                    </form>
                                </Col>
                            </Container>
                        </div>
                    </div>
                </>)
    }
}

class AlterarSenhaFail extends React.Component {
    voltarTelaInicial() {
        window.location.href = "/";
    }
    render() {
        return baba(this.voltarTelaInicial.bind(this))
    }
}

function baba(voltarTelaInicial) {
    return (<>
        <div className="corpoTelaInicial">
            <div className="cadastro">
                <Container>
                    <Row>
                        <Col xs={{ size: 8, offset: 2 }}>
                            <Col className="caixa_alerta">
                                <p className="p_alerta">Oi amigo, você está perdido?</p>
                                <p className="p_alerta">Você pode voltar para a tela de login por este caminho.</p>
                                <button className="btn_telaInicial" type="button" onClick={() => voltarTelaInicial()}>Click aqui</button>
                            </Col>
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    </>)
}

function novaSenhaSucesso(voltarTelaInicial) {
    return (<>
        <div className="corpoTelaInicial">
            <div className="cadastro">
                <Container>
                    <Row>
                        <Col xs={{ size: 8, offset: 2 }}>
                            <Col className="caixa_alerta" style={{ borderColor: "#00dc00" }}>
                                <p className="p_alerta">Sua senha foi alterado com sucesso!</p>
                                <p className="p_alerta">Você pode voltar para a tela de login por este caminho.</p>
                                <button className="btn_telaInicial" type="button" onClick={() => voltarTelaInicial()}>Click aqui</button>
                            </Col>
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    </>)
}

AlterarSenha = withRouter(AlterarSenha)
AlterarSenhaFail = withRouter(AlterarSenhaFail)

export { AlterarSenha, AlterarSenhaFail }