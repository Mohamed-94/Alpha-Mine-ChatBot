'use strict';

const express = require('express');
const bodyParser = require('body-parser');
var http = require('http');

const apiRoute = express();


//var url = 'http://services.att.com/search/v1/global-search?app-id=testing&start=0&row=1&fl=title&fq=_lw_data_source_s:globalsearch-catalog&facet=false&hl=false&q=';

function getResponse(url, callback){
    http.get(url, function(res) {
    	var data = '';
        res.on('data', function (chunk) {
        	data += chunk;
             });
        res.on('end', function(){
        	callback(JSON.parse(data));
        	});
        res.on('error', function (e) {
            console.error(e);
        	});
        });
	}


//--------------------------------------------------------------------------------------------------------------------------------------------------------------------

apiRoute.use(bodyParser.urlencoded({
    extended: true
}));

apiRoute.use(bodyParser.json());

apiRoute.post('/find', function(req, res) {
    var speech = req.body.result && req.body.result.parameters && req.body.result.parameters.apiAiText ? req.body.result.parameters.apiAiText : "Could not quite understand what you just said."
	//var speech = 'galaxy';
	var url = 'http://services.att.com/search/v1/global-search?app-id=testing&start=0&row=1&fl=title&fq=_lw_data_source_s:globalsearch-catalog&facet=false&hl=false&sort=defaultMarketingSequence%20asc&q='+speech;

    // For local testing due to proxy issues
    //var url = 'http://zlt0.vci.att.com:3000/search/v1/global-search?app-id=testing&start=0&row=1&fl=title&fq=_lw_data_source_s:globalsearch-catalog&facet=false&hl=false&sort=defaultMarketingSequence%20asc&q='+speech;

    console.log('you entered - ',url);
    
    //var results = '';
    var random;
   	getResponse(url, function(results){
   		if(results && results.response && results.response.docs[0]){
   			random = results.response.docs[0].title[0];
   		}
   		else 
   			random = 'No results found.';
   		console.log('random: ',random);
    });
    
   	
   	//console.log('results: ',results.response.docs[0].title[0]);
   	setTimeout(function () {
   		console.log('function: ',random);   	  	
   	   	var resultDisplay = random ? random : "Well! Something went wrong, but I am only learning.";
   	   	var resultSpeech = 'Here is the top result for your query; '+speech+'.\n '+resultDisplay;
    	
    return res.json({
        speech: resultSpeech,
        displayText: resultDisplay,
        source: 'search-webhook-sample'
    });}, 700);
});



apiRoute.listen((process.env.PORT || 8180), function() {
	console.log("Server is up and listening...");
});
