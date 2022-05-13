const express = require('express')
const cors = require('cors')
const app = express()

const baseDir = `${__dirname}/build/`

app.use(cors())

app.use(express.static(`${baseDir}`))

app.get('*', (req,res) => res.sendFile('index.html' , { root : baseDir }))

const port = 3000

app.listen(port, () => console.log(`Servidor subiu com sucesso na porta ${port}`))
