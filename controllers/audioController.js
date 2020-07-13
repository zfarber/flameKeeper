const List = require('../models/list');
const Upload = require('../models/upload');
const Delete = require('../models/delete');
const Replace = require('../models/replace');
const AppendDoc = require('../models/appendDoc');

const formidable = require('formidable');
const fs = require('fs');

global.counter = 0;
global.uploadLock = 0;
global.dashboardLock = true;
console.log('From AUDIO CONTROLLER ' + global.dashboardLock)


// REPLACE function when submitting from composer page
exports.replace_function = function (req, res) {
  function replacedFile() {
    Replace.replace_file({
      name: 'fk-audio',
      id: req.params.id
    })
    return new Promise(resolve => {
      setTimeout(function () {
        resolve(res.redirect('/'))        
      }, 2000)
    })
  }
  replacedFile(),


    function (err, results) {
      res.send('ERRONEOUS!');
    }
}


// Home page list AUDIO files
exports.list_function = function (req, res) {
  let fileInfo;

  function getList() {
    fileInfo = List.list_files({
      name: 'fk-audio'
    });
    return new Promise(resolve => {
      setTimeout(function () {                                        
        resolve(res.render('index', fileInfo));        
      }, 2000)
    })
  }
  getList(),

    function (err, results) {
      res.send('ERRONEOUS!');
    }    
}

// DISPLAY selected files to the home page upon submit
exports.dashboard_function = function (req, res) {
  let fileInfo;

  function getDash() {
    fileInfo = List.list_files({
      name: 'fk-audio'
    });
    return new Promise(resolve => {
      setTimeout(function () {
        resolve(res.render('dashboard', fileInfo))
      }, 2000)
    })
  }
  getDash(),

    function (err, results) {
      res.send('ERRONEOUS!');
    }
}

// UPLOAD page
exports.upload_function = function (req, res, next) {
  global.counter++;  
  
  new formidable.IncomingForm().parse(req)
    .on('field', (name, field) => {
      // res.status(415).send(field);      
    })
    .on('file', (name, file) => {
      function uploadFile() {
        Upload.upload_files({
          name: 'fk-audio',
          fileName: file.name,
          fileToUpload: file.path
        });
        return new Promise(resolve => {
          setTimeout(function () {
            resolve(res.redirect('dashboard'))
          }, 2000)
        })
      }
      uploadFile(),
      // AppendDoc.append_csv('fk-audio'),
      

        function (err, results) {
          res.send('ERRONEOUS!');
        }
      })
    
    .on('success', (name, field) => {
      console.log('Field')
    })    
}

exports.delete_function = function (req, res, next) {
  global.counter--;
  global.uploadLock = 1;

  function deleteLast() {
    Delete.delete_file({
      name: 'fk-audio',
      id: req.params.id,
    });
    return new Promise(resolve => {
      setTimeout(function () {
        resolve(res.redirect('/upload-form'))
      }, 2000)
    })
  }
  deleteLast(),


    function (err, results) {
      res.send('ERRONEOUS!');
    };
}

exports.test_function = function (req, res) {
  AppendDoc.append_csv();
}
