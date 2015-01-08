var spawn = require('child_process').spawn;
var Promise = require('bluebird');

module.exports = function(command, args, options){
  return new Promise(function(resolve, reject){
    var task = spawn(command, args, options);
    var out = '';
    var err = '';

    task.stdout.on('data', function(data){
      out += data.toString();
      process.stdout.write(data);
    });

    task.stderr.on('data', function(data){
      err += data.toString();
      process.stderr.write(data);
    });

    task.on('close', function(code){
      if (code){
        var e = new Error(err);
        e.code = code;

        reject(e);
      } else {
        resolve(out);
      }
    });
  });
};