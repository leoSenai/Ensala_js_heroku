import React from "react"
import {
    Button
} from "reactstrap";

class BotaoEnviar extends React.Component {
    handleClick(event) {
        event.preventDefault()
        this.props.enviar()
    }
    render() {
        return (
            <Button outline type="button" onClick={this.handleClick.bind(this)} color="success" size="sm" className="Enviar" >Enviar</Button>
        )
    }
}

class BotaoResetar extends React.Component {
    handleClick(event) {
        event.preventDefault()
        this.props.resetar()
    }
    render() {
        return (
            <Button outline type="reset" onClick={this.handleClick.bind(this)} color="secondary" size="sm" className="Limpar" >Limpar</Button>
        )
    }
}

export { BotaoEnviar, BotaoResetar }