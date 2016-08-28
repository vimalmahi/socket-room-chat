var express = require('express');
var http = require('http');
var expressApp = express();
var appConfig = require('./config/app')
var appFunctions = require('./lib/');

3333
//This will log all messages to terminal prefixing the timestamp
require('console-stamp')(console, { pattern : "dd/m/yyyy HH:MM:ss.l" } ); 

server = http.createServer(expressApp);
var io = require('socket.io').listen(server);

server.listen(appConfig.server.port);

exports.io = io;

//Route for HTML client for chat
expressApp.use('/client', express.static('public'));

// usernames which are currently connected to the chat
var usernames = {};

appFunctions.init();


