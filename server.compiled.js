"use strict";

var express = require('express');

var path = require('path');

var fetch = require('node-fetch');

require('dotenv').config();

var PORT = process.env.HTTP_PORT || 4001;

var fs = require('fs');

var app = express(); //serve static files//

app.use(express["static"]('public')); //start fetch data//

app.get('/', function (req, res) {
  res.sendFile('index.html');
}); //server map-app//

app.use(express["static"](path.join(__dirname, 'map-widget', 'build'))); // Serve map widget

app.use('/map-widget/', express["static"](path.join(__dirname, 'map-widget', 'build')));
app.get('/map-widget/*', function (req, res) {
  res.sendFile(path.join(__dirname, './map-widget/build', 'index.html'));
}); // Server graph widget

app.use('/graph-widget/', express["static"](path.join(__dirname, 'graph-widget', 'build')));
app.get('/graph-widget/*', function (req, res) {
  res.sendFile(path.join(__dirname, './graph-widget/build', 'index.html'));
}); // Server top seat widget

app.use('/top-widget/', express["static"](path.join(__dirname, 'top-widget', 'build')));
app.get('/top-widget/*', function (req, res) {
  res.sendFile(path.join(__dirname, './top-widget/build', 'index.html'));
}); // Server top barchart widget

app.use('/barchart-widget/', express["static"](path.join(__dirname, 'barchart-widget', 'build')));
app.get('/barchart-widget/*', function (req, res) {
  res.sendFile(path.join(__dirname, './barchart-widget/build', 'index.html'));
}); // Server get data files: 

app.get('*/overallresults', function (req, res) {
  var results = fs.readFileSync(process.env.OVERALLELECTIONRESULTS || 'public/data/nb_overall.json');
  res.send(JSON.parse(results));
});
app.get('*/fullresults', function (req, res) {
  var results = fs.readFileSync(process.env.FULLELECTIONRESULTS || 'public/data/nb_results_full.json');
  res.send(JSON.parse(results));
});
app.get('*/declaration', function (req, res) {
  var results = fs.readFileSync(process.env.DECLARATION || 'public/data/nb_declaration.json');
  res.send(JSON.parse(results));
});
app.get('*/geojson', function (req, res) {
  var geo = fs.readFileSync(process.env.GEOJSON || 'public/data/nb_electoral_proj.json');
  console.log(process.env.GEOJSON);
  res.send(JSON.parse(geo));
});
app.get('*/title', function (req, res) {
  res.send(process.env.TITLE || 'New Brunswick Election 2020');
});
app.get('/testEnv', function (req, res) {
  res.send(process.env.TEST_TEXT || "Test text not found");
});
app.get('/testData', function (req, res) {
  var file = fs.readFileSync('public/data/test.json');
  res.send(JSON.parse(file));
});
app.get('*/image/:filename', function (req, res) {
  var filename = req.params.filename.slice(0, -4);
  var image = "/headshots_test/".concat(filename, ".jpg");

  if (filename === "D'AMOURS_JC_LIB_48") {
    console.log('true');
    image = "/headshots_test/DAMOURS_Jc_LIB_48.jpg";
  }

  res.redirect(image); // fs.access(`${image}`, (err)=>{
  //     if (err) {
  //         console.log(err)
  //         res.redirect('/img/no_headshot.png')
  //     } else  {
  //         res.redirect(image)
  //     }   
  // })
});

function startTimer(req, res, next) {
  console.log("Server test listening at port ".concat(PORT, "."));
  getPartyData();
  setInterval(function () {
    console.log("getting party data");
    getPartyData();
  }, process.env.TIMER || 600000);
} //get party data


function getPartyData() {
  var resultsurl = "https://election-touchscreen.globalnews.ca/data/nb_full_2020.json";
  var overallurl = "https://election-touchscreen.globalnews.ca/data/nb_overall.json";
  var declarationurl = "https://election-touchscreen.globalnews.ca/data/nb_declaration.json";
  fetch(overallurl).then(function (res) {
    if (res.ok) {
      return res.json();
    }
  }).then(function (json) {
    var data = JSON.stringify(json);
    fs.writeFile('public/data/nb_overall.json', data, finished);

    function finished(err) {
      console.log('all done');
    }
  });
  fetch(resultsurl).then(function (res) {
    if (res.ok) {
      return res.json();
    }
  }).then(function (json) {
    var data = JSON.stringify(json);
    fs.writeFile('public/data/nb_results_full.json', data, finished);

    function finished(err) {
      console.log('all done');
    }
  });
  fetch(declarationurl).then(function (res) {
    if (res.ok) {
      return res.json();
    }
  }).then(function (json) {
    var data = JSON.stringify(json);
    fs.writeFile('public/data/nb_declaration.json', data, finished);

    function finished(err) {
      console.log('all done');
    }
  });
}

app.listen(PORT, startTimer); // app.listen(PORT, ()=> {
//     console.log(`Server test listening at port ${PORT}.`);
// })
// const nextFunction = (req,res,next) => {
//     var date = new Date();
//     var test = {
//         "test": 'this is also a test',
//         "date": date
//     }
//     var data = JSON.stringify(test);
//     fs.writeFile('public/data/test.json', data, finished)
//     function finished(err) {
//         console.log('all done')
//     }
//     console.log(date)
// }
