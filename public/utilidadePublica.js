
String.prototype.isEmpty = function () { return this.trim().length == 0 }

String.prototype.isEmail = function () {
    let usuario = this.substring(0, this.indexOf("@"));
    let dominio = this.substring(this.indexOf("@") + 1, this.length);
    return ((usuario.length >= 1) &&
        (dominio.length >= 3) &&
        (usuario.indexOf("@") === -1) &&
        (dominio.indexOf("@") === -1) &&
        (usuario.indexOf(" ") === -1) &&
        (dominio.indexOf(" ") === -1) &&
        (dominio.indexOf(".") !== -1) &&
        (dominio.indexOf(".") >= 1) &&
        (dominio.lastIndexOf(".") < dominio.length - 1))
}

String.prototype.equals = function (i) { return this.toString() == i.toString() }
String.prototype.replaceAll = function (needle, replacement) { return this.split(needle).join(replacement); };

// deprecated
String.prototype.maskCpf = function () {

    let cpf = this.replace(/\D/g, '')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1')
    return cpf.length <= 14 ? cpf
        : cpf.limitSize(cpf.length - 1).maskCpf()
}

String.prototype.maskTelefone = function () {
    let telefone = this.replace(/\D/g, '')
        .replace(/^(\d{2})(\d)/g, "($1) $2")
        .replace(/(\d)(\d{4})$/, "$1-$2")
    return telefone.length <= 15 ? telefone
        : telefone.limitSize(telefone.length - 1).maskTelefone();
}

String.prototype.limitSize = function (i) {
    return this.length <= i ? this : this.substring(0, this.length - 1).limitSize(i)
}

String.prototype.formatDate = function () {
    return this.substring(0, this.indexOf(" ")).split("-").reverse().join("/");
}

