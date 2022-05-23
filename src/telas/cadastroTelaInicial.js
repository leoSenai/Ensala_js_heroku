import React from "react";
import {
    Container, Row, Col
} from "reactstrap";
import InputDefault from "../componentes/inputsPadroes";
import { BotaoEnviar, BotaoResetar } from "../componentes/botoes";
import { POST, GET, Loading } from "../componentes/Request";
import { EmailDeConfirmacao } from "../componentes/corpo"

class CadastroTelaInicial extends React.Component {
    state = {
        nome: "",
        email: "",
        telefone: "",
        permissao: "",
        senha: "",
        confirmar: "",
        matricula: "",
        tipo: "",
        toggleModalConfirmacao: false,
        tokenCadastroCache: "",
        loading: false,
    }

    //fields inserir
    preencheNome(nome) { this.setState({ nome }) }
    preencheEmail(email) { this.setState({ email: email.toLowerCase().replaceAll(" ", "") }) }
    preencheTelefone(telefone) { this.setState({ telefone: telefone.maskTelefone() }) }
    preenchePermissao(permissao) { this.setState({ permissao }) }
    preencheSenha(senha) { this.setState({ senha }) }
    preencheConfirmar(confirmar) { this.setState({ confirmar }) }
    preencheMatricula(matricula) { this.setState({ matricula }) }
    preencheTipo(tipo) { this.setState({ tipo }) }
    limparFormlulario() {
        this.setState({
            nome: "",
            email: "",
            telefone: "",
            permissao: "",
            senha: "",
            confirmar: "",
            matricula: "",
            tipo: ""
        })
    }

    enviaFormulario(event) {
        let st = this.state
        if (
            !st.nome.isEmpty() &&
            !st.email.isEmpty() &&
            (
                (!st.telefone.isEmpty() && st.telefone.length >= 14 && st.telefone.length <= 15) ||
                st.telefone.isEmpty()
            ) &&
            (!st.tipo.isEmpty() && !st.tipo.equals("SELECIONE")) &&
            !st.senha.isEmpty() &&
            !st.confirmar.isEmpty()
        ) {
            if (st.email.isEmail()) {
                if (st.senha.length > 4) {
                    if (st.senha.equals(st.confirmar)) {
                        let o = {};
                        o.nome = st.nome;
                        o.email = st.email;
                        o.tipo = st.tipo;
                        o.matricula = st.matricula;
                        o.telefone = st.telefone;
                        o.senha = st.senha;
                        this.inserir(o);
                    } else alert("\"Confirmar senha\" precisa ser exatamente igual a senha.")
                } else alert("A senha precisa ter pelo menos 5 letras, e no máximo 10 letras.")
            } else alert("Digite um e-mail válido.")
        } else alert("Insira os dados para enviar")

    }

    inserir = async o => {
        this.setState({ loading: true });
        await POST("professor/inserirProfessor/telaInicial/professor", o, undefined, (ok) => {
            this.toggleModalConfirmacaoFunc(true)
        })
            .then(response => {
                this.setState({
                    tokenCadastroCache: response
                })
            })
            .finally(() => {
                this.setState({ loading: false });
            })

    }

    toggleModalConfirmacaoFunc(callback) {
        if (callback !== undefined)
            this.setState({
                toggleModalConfirmacao: callback,
            });
        if (callback === false) window.location.href = "/";
    }

    async reenviarEmail() {
        await GET("professor/enviarEmailCadastro/" + this.state.tokenCadastroCache).then(() => {
            alert("Verifique sua caixa de entrada e pasta de span, isso pode levar alguns minutos.")
        })
    }

    render() {
        const { nome, email, telefone, senha, confirmar, matricula, tipo, loading, toggleModalConfirmacao } = this.state;
        return <>
            <Loading loading={loading} message='Carregando ...' />
            <div className="corpoTelaInicial">
                <div className="cadastro">
                    <Container>
                        <Col>
                            <form>
                                <Row>
                                    <Col xs={{ size: 8, offset: 2 }}>
                                        <Col>
                                            <InputDefault obrigatorio evento={this.preencheNome.bind(this)} valor={nome} size="70" tipo="text" nome="nome" titulo="Nome" descricao="Digite um nome" />
                                        </Col>
                                        <Row>
                                            <Col md={{ size: 6 }}>
                                                <InputDefault obrigatorio evento={this.preencheMatricula.bind(this)} valor={matricula} size="10" tipo="text" nome="matricula" titulo="Matrícula" descricao="Digite a sua matrícula" />
                                            </Col>
                                            <Col md={{ size: 6 }}>
                                                <InputDefault obrigatorio evento={this.preencheTipo.bind(this)} valor={tipo} tipo="select" name="tipo" titulo="Modalidade">
                                                    <option value="SELECIONE">Selecione...</option>
                                                    <option>HORISTA</option>
                                                    <option>MENSALISTA</option>
                                                </InputDefault>
                                            </Col>
                                        </Row>
                                        <Col>
                                            <InputDefault obrigatorio evento={this.preencheEmail.bind(this)} valor={email} size="255" tipo="text" nome="email" titulo="Email" descricao="Digite um email" />
                                        </Col>
                                        <Row>
                                            <Col md={{ size: 6 }}>
                                                <InputDefault evento={this.preencheTelefone.bind(this)} valor={telefone} tipo="text" nome="telefone" titulo="Telefone" descricao="Digite um telefone" />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={{ size: 6 }}>
                                                <InputDefault obrigatorio evento={this.preencheSenha.bind(this)} size="10" valor={senha} tipo="password" nome="senha" titulo="Senha" descricao="Digite uma senha" />
                                            </Col>
                                            <Col md={{ size: 6 }}>
                                                <InputDefault obrigatorio evento={this.preencheConfirmar.bind(this)} size="10" valor={confirmar} tipo="password" nome="confirmar" titulo="Confirmar" descricao="Confirme a senha" />
                                            </Col>
                                        </Row>
                                        <Col>
                                            <div className="botao" align="right">
                                                <BotaoResetar resetar={this.limparFormlulario.bind(this)} />
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
            <EmailDeConfirmacao toggle={toggleModalConfirmacao} callback={this.toggleModalConfirmacaoFunc.bind(this)} email={email} reenviar={this.reenviarEmail.bind(this)}> 
                É necessário a confirmação de e-mail para prosseguir!
            </EmailDeConfirmacao>
        </>
    }
}

export default CadastroTelaInicial