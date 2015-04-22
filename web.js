var express = require('express');
var app = express();
var swig = require('swig');

app.use(express.static('public'));
// This is where all the magic happens!
app.engine('swig', swig.renderFile);
app.set('view engine', 'swig');
app.set('views', __dirname + '/templates/views');

// Swig will cache templates for you, but you can disable
// that and use Express's caching instead, if you like:
app.set('view cache', false);

app.use('/', require('./routes/index'));

var server = app.listen(3000, function () {
	
	var host = server.address().address;
	var port = server.address().port;
	
	console.log('Example app listening at http://%s:%s', host, port);
	
});
