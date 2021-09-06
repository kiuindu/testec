const express = require('express')
const app = express()
app.use(express.static("public"))

function eliminarbarra(varlor){
console.log("valorfinal")
var string = String(varlor)
var valorfinal = ""
for (var i = 0; i < string.length ; i++) {
    console.log("valorfinal")
    if (string[i] != "/") {
        valorfinal += string[i]
    }
}
console.log(valorfinal)
return valorfinal;
}
var formidable = require('formidable');
const http = require('http').Server(app)

const serverSocket = require('socket.io')(http)

const porta = process.env.PORT || 8000

const host = process.env.HEROKU_APP_NAME ? `https://${process.env.HEROKU_APP_NAME}.herokuapp.com` : "http://localhost"

http.listen(porta, function(){
    const portaStr = porta === 80 ? '' :  ':' + porta

    if (process.env.HEROKU_APP_NAME) 
        console.log('Servidor iniciado. Abra o navegador em ' + host)
    else console.log('Servidor iniciado. Abra o navegador em ' + host + portaStr)
})

app.get('/', function (requisicao, resposta) {
    //ms.pipe(requisicao, resposta,[__dirname + '/index.html',__dirname +  "/som.mp3"]);
resposta.sendFile(__dirname + '/index.html')
})
var fs = require('fs');

app.use('/fileupload/', function (req, res) {
    if (req.url == '/fileupload') {
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
          var oldpath = files.filetoupload.path;
          var newpath = __dirname + "/public/" + files.filetoupload.name;
          fs.rename(oldpath, newpath, function (err) {
            if (err) throw err;
            res.write('File uploaded and moved!');
            res.end();
          });
     });
      } else {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
        res.write('<input type="file" name="filetoupload"><br>');
        res.write('<input type="submit">');
        res.write('</form>');
        return res.end();
      }})



app.use('/secret/',function (req,res) {
    console.log("chamando")
        res.send(eliminarbarra(req.url))
    })
var conectados = []



serverSocket.on('connect', function(socket){

    socket.on('login', function (nickname) { 
        socket.nickname = nickname
        const msg = nickname + ' conectou'
        console.log(msg)
        conectados.push(nickname)
        serverSocket.emit('chat msg', msg)
    })

    socket.on('patualizar', function (seila) { 
        serverSocket.emit('atualizar', conectados)
    })

    socket.on('disconnect', function(){
        conectados = conectados.filter(e => e + " " !== socket.nickname + " ")
        console.log('Cliente desconectado: ' + socket.nickname)
        serverSocket.emit('atualizar', conectados)
    })
        
    socket.on('chat msg', function(msg){
        serverSocket.emit('chat msg', `${socket.nickname} diz: ${msg}`)
    })

    socket.on('status', function(msg){
        console.log(msg)
        socket.broadcast.emit('status', msg)
    })
})

