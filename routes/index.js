
/*
 * GET home page.
 */

var fs = require('fs');
var stage_chosen = false;
var stage_data = {};

var words = [
  "ntglisyinipdpao", // "disappointingly"
  "eamgsssnienenls", // "meaninglessness"
  "srnoilhoteotubg", // "troubleshooting"
  "mnknoecewaedglt", // "acknowledgement"
  "rsieriastcchtca", // "characteristics"
  "oaaisngronltuct", // "congratulations"
  "iitornifetdanfe", // "differentiation"
  "veedrnsisuctste", // "destructiveness"
  "ltronyalemevinn", // "environmentally"
  "eeraanghytlbirk", // "heartbreakingly"
  "nproeslenisssbe", // "responsibleness"
  "rditofsawtrrhag"  // "straightforward"
];

var hardness_list = [0, 0, 1, 1, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4];

exports.index = function(req, res){
  res.render('stage', { title: 'Express' });
};

exports.data = function(req, res){
  var data = JSON.parse(fs.readFileSync('./data/data.json'));
  data.stage_data = stage_data;

  var hardness = hardness_list[stage_data.stage - 1];
  data.info.hardness = hardness;

  console.log(data);
  stage_chosen = false;
  res.json(data);
}

exports.game = function(req, res){

  if(stage_chosen) res.render("game");
  else res.redirect('/');

}

exports.choose = function(req, res){

  var team = req.body.team;
  var stage = req.body.stage;
  stage_data.team = team;
  stage_data.stage = stage;
  stage_chosen = true;

  res.json(stage_data);

}

exports.sendLetter = function(req, res){

  var team = req.body.team;
  var stage = req.body.stage;
  res.send(words[team - 1][stage - 1]);

}



