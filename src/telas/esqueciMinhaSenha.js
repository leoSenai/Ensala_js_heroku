import React from "react";
import {
    Container, Row, Col
} from "reactstrap";
import InputDefault from "../componentes/inputsPadroes";
import { BotaoEnviar } from "../componentes/botoes";
import { POST, Loading } from "../componentes/Request";
import { withRouter } from "react-router-dom";

class EsqueciMinhaSenha extends React.Component {
    state = {
        email: "",
        loading: false,
    }

    //fields inserir
    preencheEmail(email) { this.setState({ email: email.toLowerCase().replaceAll(" ", "") }) }

    enviaFormulario(event) {
        let st = this.state
        if (
            !st.email.isEmpty()
        ) {
            if (st.email.isEmail()) {
                let o = {};
                o.email = st.email;
                this.enviar(o);
            } else alert("Digite um e-mail válido.")
        } else alert("Insira os dados para enviar")
    }

    enviar = async o => {
        this.setState({ loading: true });
        await POST("gerenciarEmails/esqueciMinhaSenha", o, undefined, (ok) => {
            if (ok) {
                alert("Enviamos um e-mail para o endereço: "+o.email)
                window.location.href = "/";
            }
        }).finally(() => {
            this.setState({ loading: false });
        })
    }

    render() {
        const { email, loading } = this.state;
        return <>
            <Loading loading={loading} message='Carregando ...' />
            <div className="corpoTelaInicial">
                <div className="cadastro">
                    <Container>
                        <Col>
                            <form>
                                <Row>
                                    <Col xs={{ size: 8, offset: 2 }}>
                                        <Col className="caixa_alerta">
                                            <p className="p_alerta">Digite o endereço de e-mail que foi usado no seu cadastro,</p>
                                            <p className="p_alerta">Você poderá refazer sua senha pelo link que enviaremos para esse endereço.</p>
                                        </Col>
                                        <Col style={{ marginTop: "15px" }}>
                                            <InputDefault obrigatorio evento={this.preencheEmail.bind(this)} valor={email} size="70" tipo="text" nome="email" titulo="E-mail" descricao="Digite seu e-mail" />
                                        </Col>
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
        </>
    }
}

export default withRouter(EsqueciMinhaSenha)