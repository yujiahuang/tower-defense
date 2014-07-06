
/*
 * GET home page.
 */

var fs = require('fs');

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.data = function(req, res){
  var data = fs.readFileSync('./data/data.json');
  console.log(data);
  res.json(JSON.parse(data));
}