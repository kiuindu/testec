const { table } = require('console')
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
var tabela

app.use('/fileupload/', function (req, res) {

    res.send(`
    <input type='file'/>
    <script src="/socket.io/socket.io.js"></script>
    <img id="myImg" src="#">
<script>
const socket = io()

function toDataURL(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
      var reader = new FileReader();
      reader.onloadend = function() {
        callback(reader.result);
      }
      reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
  };

window.addEventListener('load', function() {
    document.querySelector('input[type="file"]').addEventListener('change', function() {
        if (this.files && this.files[0]) {

            
            function uploadFile(inputElement) {
                var reader = new FileReader();
                reader.onloadend = function() {
                  socket.emit("imagem", reader.result);
                }
                reader.readAsDataURL(inputElement);
              }

            var img = document.querySelector('img');
                img.src = URL.createObjectURL(this.files[0]); 
                var testae = this.files[0]
                uploadFile(testae)
        
        }
    });
  });
</script>
    `)

})


/*    app.get('/tabela', function (requisicao, resposta) {
    resposta.sendFile(tabela.kiuind)
    })*/

app.use('/secret/',function (req,res) {
    res.send(`<img id="myImg" src="#">
    <script>
    var img = document.querySelector('img');
      img.src = "${tabela}";
    </script>`)})
var conectados = []



serverSocket.on('connect', function(socket){

    socket.on('login', function (nickname) { 
        socket.nickname = nickname
        const msg = nickname + ' conectou'
        console.log(msg)
        conectados.push(nickname)
        serverSocket.emit('chat msg', msg)
    })
    socket.on('imagem', function (seilaa) { 
        console.log("tabelaaaaaaaaaaaaaaaaaaaa")
        tabela = seilaa
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

