const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

//cria array vazio para usuarios
var usuarios = [];
var socketIds = [];

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});



io.on('connection',(socket)=>{
    //console.log('usuario conectado');

    //io.emit envia para todos os usuarios q vc esta conectado
    //io.emit('conectado','Estou conectado!');

    //socket.broadcast.emit notifica apenas os outros usuarios que vc se conectou
   /*  socket.broadcast.emit('novo usuario','Um novo usuário se conectou!');


    //aviso que desconectou
    socket.on('disconnect',()=>{
        console.log('desconectado');
    }) */

    //verifica se ja existe usuario com mesmo nome
    socket.on('new user',function(data){

        //se retornar -1 é sinal que nao existe nenhum nome armazenado em (data)
        if(usuarios.indexOf(data) != -1){

            //ja existe usuario com esse nome
            socket.emit('new user',{success: false});
        }else{
            usuarios.push(data);
            socketIds.push(socket.id);

            //emit aos outros usuarios que ha um novo usuario conectado
            socket.emit('new user',{success: true});
            //socket.broadcast.emit("hello", "word");
        }
    })

    //recupera oque foi enviado ao servidor e retorna ao index.html
    socket.on('chat message',(obj)=>{
       // console.log(obj);

       //verifica se o usuario que esta enviando a mensagem existe
       if(usuarios.indexOf(obj.nome) != -1 && usuarios.indexOf(obj.nome) == socketIds.indexOf(socket.id)){
           //recebe oque vai ser enviado e retorna
            io.emit('chat message',obj);
       }else{
           console.log('Erro: nao tem permissao para enviar');
       }

    })


    //quando é desconectado remove ele da lista
    socket.on('disconnect',()=>{
        let id = socketIds.indexOf(socket.id);
        socketIds.splice(id,1);
        usuarios.splice(id,1);

        console.log(socketIds);
        console.log(usuarios);
        console.log('user disconnected');
    });

})



http.listen(5000, () => {

  console.log('listening on *:5000');

});
