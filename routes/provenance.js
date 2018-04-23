var express = require('express');
var N3 = require('n3');
const fs = require('fs');
var router = express.Router();


router.post('/comment', function(req, res, next) {
  let uri = req.body.data;
  let tmp = JSON.parse(uri);
  let id = tmp['id'].split('/');
  let sess = tmp['creator'].split('/');
  // write the annotation to disk
  createAnnotationGraph("./data/" +sess[sess.length-1], id[id.length-1] + '.json', uri);
  res.status == 200;
});

router.post('/model', function(req, res, next) {
   setData(req);
   res.status == 200;
});

router.get('/:uid/:id', function(req,res,next) {
    let file_ext = (req.params.id == 'prov') ? '.ttl' : '.json';
    let d = fs.readFileSync("./data/" + req.params.uid + '/' + req.params.id + file_ext);
    res.send(d);
});

/* GET prov graph for this id .
@todo: change this to a hah function (rfc6920)
 */
router.get('/:id', function(req, res, next) {
    let data = buildData(req.params.id);    
    res.send(data);
});

/*
  POST the initial prov data to build the graph
*/
router.post('/:id', function(req, res, next) {
  let uri = JSON.parse(req.body.data);
  //write the graph to disk
  createSonificationProvGraph(req.body.key, uri['data'], uri['id']);
  res.status == 200;
});

/*
 Function to store the data
*/
function setData(req) {
  //var milliseconds = (new Date).getTime();
  var key = req.body.key;
  var _d = JSON.parse(req.body.data);
  
  createAnnotationGraph("./data/" + key,  'model' + _d.id + '.json', JSON.stringify(_d.data));
}

var writer = N3.Writer( { 'prefixes' : 
  { 'xsd':  'http://www.w3.org/2001/XMLSchema#',
   'prov': 'http://www.w3.org/ns/prov#',
   'rdf': 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
   'dc11': 'http://purl.org/dc/elements/1.1/',
   'dc': 'http://purl.org/dc/terms/',
   'oa': 'http://www.w3.org/ns/oa#',
   '': 'http://example.org/', 
   'ro': 'http://purl.org/wf4ever/ro#', 
   'ore' : 'http://www.openarchives.org/ore/terms/'
  }
});

function buildData(sessionid) {

let commentFiles = [];

fs.readdirSync('./data/'+sessionid).forEach(file => {
     commentFiles.push(file.split('.')[0]);
});


writer.addTriple(':' + sessionid, 'a', 'ro:ResearchObject');
writer.addTriple(':' + sessionid, 'a', 'ore:Aggregation');
let _n = commentFiles.join(', :')
writer.addTriple(':' + sessionid, 'ore:aggregates', ':prov, :' + _n);

writer.addTriple(':prov', 'a', 'ro:Resource');
writer.addTriple(':prov', 'ao:body', './'+sessionid + '/prov');

commentFiles.forEach(file => {
  writer.addTriple(':' + file, 'a', 'ro:SemanticAnnotation'); 
  writer.addTriple(':' + file, 'ao:body', './'+sessionid+'/'+ file);
});
let rdf_string = '';
writer.end(function (error, result) { rdf_string = result; });
return rdf_string;
}

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

function createAnnotationGraph(dir, fname, annotationGraph) {
/*
 Write the annotation to disk
*/

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}
console.log(fname);
fs.writeFile(dir +'/' +fname, annotationGraph, 'utf8', function (err) {
    if (err) {
        return console.log(err);
    }
} );
}


function createSonificationProvGraph(session, uri, id) {
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

   writer.end(function (error, result) { createAnnotationGraph("./data/" + session, 'prov.ttl', result ); });
} 

module.exports = router;
