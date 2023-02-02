
var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var core_use = require('cors');
var pg = require('pg');

app.use(core_use());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
 
var config = {
  user: 'postgres', //env var: PGUSER 
  database: 'ABW', //env var: PGDATABASE 
  password: '123', //env var: PGPASSWORD 
  port: 5432, //env var: PGPORT 
  max: 10, // max number of clients in the pool 
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed 
};

var pool = new pg.Pool(config);

// rota com protocolo GET para seleção no banco de dados
app.get('/consulta', function (req, res) {
	
	// to run a query we can acquire a client from the pool, 
	// run a query on the client, and then return the client to the pool 
	pool.connect(function(err, client, done) {
	  if(err) {
		return console.error('error fetching client from pool', err);
	  }
	  client.query('SELECT * from jornada order by horainicio', 
      function(err, result) {
		//call `done()` to release the client back to the pool 
		done();
	 
		if(err) {
		  return console.error('error running query', err);
		}
		res.setHeader('Access-Control-Allow-Origin','*');
		console.log(result.rows);
    res.json(result.rows); // servidor retorna a consulta em formato json
			
		});
	});
});

// rota com protocolo POST para inserção no banco de dados
app.post('/insere', function (req, res) {

// to run a query we can acquire a client from the pool, 
// run a query on the client, and then return the client to the pool 
//var registro = {codigo:'4', nome:'medalha', qtde:'100', valor: '5.0'};
pool.connect(function(err, client, done) {
  if(err) {
    return console.error('error fetching client from pool', err);
  }
  client.query('insert into jornada (tipo, dtinicio, mesinicio, dtfim, mesfim, horainicio, mininicio, horafim, minfim, obs, latitude, longitude) values (\'' + req.body.tipo + 
  	'\', \'' + req.body.dtinicio + '\', \'' + req.body.mesinicio + '\', \'' + req.body.dtfim + '\', \'' + req.body.mesfim + '\', \'' + req.body.horainicio + '\', \'' + req.body.mininicio + '\', \'' + req.body.horafim + '\', \'' + req.body.minfim + '\', \'' + req.body.obs + '\', \'' + req.body.lat + '\', \'' + req.body.long + '\' )', function(err, result) {
    //call `done()` to release the client back to the pool 
    done();
 
    if(err) {
      return console.error('error running query', err);
    }

    res.setHeader('Access-Control-Allow-Origin','*');
    res.json(result.rows); // servidor retorna a consulta em formato json
  });
});
});



app.listen(3000)


