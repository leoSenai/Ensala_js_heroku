import React from 'react'
import Spinner from 'react-spinkit'

const base = process.env.REACT_APP_SERVER_URL;
const door = process.env.REACT_APP_SERVER_PORT;
const context = process.env.REACT_APP_SERVER_CONTEXT;
const headers = { "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" };
export const POST = (path, o, f, callback) => {
    return fetch(base + door + context + path, {
        method: 'POST',
        headers: headers,
        body: btoa(JSON.stringify(o))
    }).then(result => {
        if (!result.ok) throw result;
        if (callback) callback(result.ok)
        return result.json();
    }).catch(err => {
        if (f || f === undefined) ERRO(err)
        console.log('Status Code POST: ' + err.status);
    })
}
export const GET = (path, f) => {
    return fetch(base + door + context + path, {
        method: 'GET',
        headers: headers,
    }).then(result => {
        if (!result.ok) throw result;
        return result.json();
    }).catch(err => {
        if (f || f === undefined) ERRO(err)
        console.log('Status Code GET: ' + err.status)
        throw err
    })
}
export const DELETE = (path, f) => {
    return fetch(base + door + context + path, {
        method: 'DELETE',
        headers: headers,
    }).then(result => {
        if (!result.ok) throw result;
        return result.json();
    }).catch(err => {
        if (f || f === undefined) ERRO(err)
        console.log('Status Code remover: ' + err.status);
    })
}
export const PUT = (path, o, f) => {
    return fetch(base + door + context + path, {
        method: 'PUT',
        headers: headers,
        body: btoa(JSON.stringify(o))
    }).then(result => {
        if (!result.ok) throw result;
        return result.json();
    }).catch(err => {
        if (f || f === undefined) ERRO(err)
        console.log('Status Code PUT: ' + err.status);
    })
}

const alertaErros = {
    EMAIL_ERRADO: () => {
        alert("Ops! Não podemos trocar seu e-mail.")
    },
    INSERIR_ERROR: () => {
        alert("Ops! Erro ao inserir.")
    },
    ALTERAR_ERROR: () => {
        alert("Ops! Erro ao alterar.")
    },
    REMOVER_ERROR: () => {
        alert("Ops! Erro ao remover.")
    },
    SELECIONAR_ERROR: () => {
        alert("Ops! Erro ao selecionar.")
    },
    LOGIN_ERRO: () => {
        alert("Usuario ou senha escrito incorretamente.")
    },
    SEM_AUTORIZACAO: () => {
        alert("Opa! Você não foi autorizado a usar esse recurso! Volte para tela de login.")
        window.location.href = "/logout";
    },
    EMAIL_EM_USO_ERROR: () => {
        alert("Este email já esta sendo usado.")
    },
    MATRICULA_USO_ERROR: () => {
        alert("Esta matrícula já foi cadastrada.")
    },
    NOME_JA_CADASTRADO: () => {
        alert("Esse nome já foi cadastrado.")
    },
    ERRO_ENVIAR_EMAIL: () => {
        alert("Erro ao tentar enviar o e-mail.")
    },
    EMAIL_NAO_ENCONTRADO: () => {
        alert("Este e-mail não foi encontrado.")
    },
    USUARIO_JA_CADASTRADO: () => {
        alert("Seu cadastro ja foi efetuado, pode realizar seu login.")
        window.location.href = "/";
    },
    IMPOSSIVEL_REATIVAR: () => {
        alert("É impossível reativar esse usuário, pois existe um usuário ativo com o mesmo e-mail.")
    }
}

export const ERRO = (err) => {
    if (err.status === undefined) alert("Ops! O servidor não está respondendo.\nPor favor, aguarde um momento e tente novamente.")
    if (err.status >= 500)
        err.text().then(errorMessage => {
            console.log(errorMessage)
            if (errorMessage !== undefined) alertaErros[errorMessage]()
        })
    else
        if (err.status >= 400) alert("Ops! Erro: " + err.status + " \nO servidor não conseguiu processar esta requisição.")

}


export const Loading = ({ loading, message }) => {
    return loading ? (
        <div className='overlay-content'>
            <div className='wrapper'>
                <Spinner
                    name='pacman'
                    fadeIn='none'
                    color='yellow'
                />
                <span className='message'>
                    {message}
                </span>
            </div>
        </div>
    ) : null
}

