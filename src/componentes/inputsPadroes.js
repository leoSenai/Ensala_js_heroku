import React from "react"
import {
    Input, Label, FormGroup
} from "reactstrap";
import { CampoObrigatorio } from "../componentes/corpo"
export default class InputDefault extends React.Component {
    handleChange(e) {
        if(this.props.size > 0 && this.props.size !== undefined && this.props.size !== null)
            this.props.evento(e.target.value.toString().limitSize(this.props.size))
        else
            this.props.evento(e.target.value.toString())
    }

    render() {
        const { nome, titulo, tipo, valor, descricao, obrigatorio, disabled } = this.props
        return (
            <FormGroup className="inputCheio">
                <Label for={nome}>{titulo} {obrigatorio ? <CampoObrigatorio /> : ""}</Label>
                <Input onChange={this.handleChange.bind(this)} type={tipo}
                    value={valor} id={nome} disabled={disabled} name={nome} placeholder={descricao}>{this.props.children}</Input>
            </FormGroup>
        )
    }
}