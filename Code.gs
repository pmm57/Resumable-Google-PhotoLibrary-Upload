// Create and present Screen
function doGet(request) {
  return HtmlService.createTemplateFromFile('AlbumH5')
      .evaluate().setTitle('Upload Photos to Album');
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}
//
//  Given a URL do a simple fetch and return the error or the results
//      url:   The fullw url ready for the fetch
//      flagJson:  The result is json so return it as json
//      params: default
function doUrlFetch_ (url, flagJson, params = {muteHttpExceptions: true}) {
//  Logger.log( UrlFetchApp.getRequest(url, params) );  // Log query to be sent
  var response = UrlFetchApp.fetch(url, params);
  var respCode = response.getResponseCode();
  if (respCode == 200) {
    // Successful - return results
    if (flagJson) {
      var result = JSON.parse(response.getContentText());
    } else {
      var result = response.getContentText();
    }
  }
  else {
    var result = "Error " +respCode + " " + response.getContentText();
  }
  return result;
}
//  Provide Access Token
function getAt() {
  console.log ('GetAt');
  return ScriptApp.getOAuthToken();
}
//
function createAlbumByScript(albumName) {
  var requestBody={"album":{"title":albumName}};
  var requestHeader={Authorization: "Bearer " + ScriptApp.getOAuthToken()};
  var options = {
    "muteHttpExceptions": true,
    "method" : "post",
    "headers": requestHeader,
    "contentType": "application/json",
    "payload" : JSON.stringify(requestBody)
  };
  //Get data and load it into a JSON object
  var api = "https://photoslibrary.googleapis.com/v1/albums";
  var albumInfo = doUrlFetch_ (api, true, options);
  albumInfo.msg = 'Created Album <a href="' + albumInfo.productUrl + '" target="_blank">' + albumInfo.title + '</a>';
  albumInfo.status = 'isCreated';
  albumInfo.arrayPhotos = [];
  Logger.log(albumInfo);
  return albumInfo;
}
//
