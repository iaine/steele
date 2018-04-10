var express = require('express');
var N3 = require('n3');
var router = express.Router();


router.post('/comment', function(req, res, next) {
  let uri = JSON.parse(req.body.data);
  console.log(uri);
  res.status == 200;
});

/* GET prov graph for this id .
@todo: change this to a hah function (rfc6920)
 */
router.get('/:id', function(req, res, next) {
    let data = getData(req);
    res.send(data);
});

/*
  POST the initial prov data to build the graph
*/
router.post('/:id', function(req, res, next) {
  let uri = JSON.parse(req.body.data);
  createSonificationProvGraph(uri);
  res.status == 200;
});

var writer = N3.Writer( { 'prefixes' : 
  { 'xsd':  'http://www.w3.org/2001/XMLSchema#',
   'prov': 'http://www.w3.org/ns/prov#',
   'rdf': 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
   '': 'http://example.org/'
  }
});

/*
 Function to store the data
*/
function setListData(req) {

  var key = req.body.key;
  var _data = req.body.data;

  //push the data to the end of the list
  client.rpush(key, _data);
}

// Function to store the Prov graph in the hash key
// it is separate to the notes
function storeProvGraph(graph, hashkey) {

  client.hset(hashkey, 'prov', graph, redis.print);
}

function createAnnotationGraph() {
/*
@prefix dc: <http://purl.org/dc/terms/> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
@prefix ns0: <http://www.w3.org/ns/oa#> .
@prefix dc11: <http://purl.org/dc/elements/1.1/> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .

<http://example.org/anno>
  a <http://www.w3.org/ns/oa#Annotation> ;
  dc:created "2018-04-10T14:34:20.032Z"^^xsd:dateTime ;
  ns0:hasBody [
    a <http://njh.me/volume> ;
    dc11:format "text/plain"^^xsd:string ;
    rdf:value "0.5318603611900158"^^xsd:string
  ] ;
  ns0:hasTarget <http://127.0.0.1/sonify/> .
*/
}


function createSonificationProvGraph(uri) {
   writer.addTriple( 'http://example.org/sonification', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type', 'http://www.w3.org/ns/prov#Entity');
   writer.addTriple( 'http://example.org/sonification', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#about', '"http://127.0.0.1:3000/sonify/'+uri);
   writer.addTriple( 'http://example.org/sonification', 'http://www.w3.org/ns/prov#wasGeneratedBy', 'http://example.org/note');
   //writer.addTriple( 'http://example.org/sonification', 'http://www.w3.org/ns/prov#wasDerivedFrom', 'http://example.org/data');
   //add note
   writer.addTriple( 'http://example.org/note', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type', 'http://www.w3.org/ns/prov#Activity');
   writer.addTriple( 'http://example.org/note', 'http://www.w3.org/ns/prov#used', 'http://example.org/data');
   //add data
   writer.addTriple( 'http://example.org/data', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#Type', 'http://www.w3.org/ns/prov#Entity');
   writer.addTriple( 'http://example.org/data', 'http://www.w3.org/ns/prov#wasGeneratedBy', 'http://example.org/dataCollection');
   //add datacolection
   writer.addTriple( 'http://example.org/dataCollection', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type', 'http://www.w3.org/ns/prov#Activity');
   writer.addTriple( 'http://example.org/dataCollection', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#about', 'http://127.0.0.1:3000/data/'+uri);

   writer.end(function (error, result) { console.log(result); });
} 

module.exports = router;
