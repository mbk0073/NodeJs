var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
var sockets=[];//array used to hold all the connections at the same place to broadcast signals to all the sockets/users at the same time
var net=require('net');
var server=net.createServer();
//Socket Programmming
//Connecting...
server.on('connection',function(socket){
  console.log('Found Connection..');

  sockets.push(socket);//collecting all the clients
  socket.on('data',function(data){//reading data

    console.log("Got data:",data.toString());
    sockets.forEach(function(otherSocket){//broadcasting data
      if(otherSocket!==socket)otherSocket.write(data);
    });
  });
  socket.on('close',function(){
    console.log("disconnected");
    var index=sockets.indexOf(socket);
    sockets.splice(index,1);
  })
})
server.on('error',function(err){
  console.log("Error Message:",err.message);
});

server.on('close',function(){//Removing all closed connections

  console.log('Server Closed');

});

server.listen(3001);

//Reading data from the connection





//
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
