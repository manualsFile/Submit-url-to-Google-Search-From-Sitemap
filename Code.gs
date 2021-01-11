function getService_Indexing() {
  //OAuth2 For service account with privateKey.
  return OAuth2.createService('GAS_INDEXED_API_GOOGLE')
    .setTokenUrl('https://accounts.google.com/o/oauth2/token')
    .setPrivateKey('input PRIVATE KEY for service account here')
    .setIssuer('input email service account here')
    .setPropertyStore(PropertiesService.getUserProperties())
    .setScope('https://www.googleapis.com/auth/indexing')
    .setParam('access_type', 'offline')
}

function indexing_SubmitUrl(url) {
  if (typeof url !='string') return false;

  var service = getService_Indexing();
  if (!service.hasAccess()) return;

  var payload = {
    'url': url,
    'type': 'URL_UPDATED'
  };
  try { 
    var endpoint = 'https://indexing.googleapis.com/v3/urlNotifications:publish';
    var option = {
      'method': "POST",
      'contentType' : 'application/json',
      'headers': {
        'Authorization': 'Bearer ' + service.getAccessToken()
      },
      'payload' : JSON.stringify(payload),
      'muteHttpExceptions' : true
    };
    var response = UrlFetchApp.fetch(endpoint, option);
    if (response.getResponseCode() != 200) return false;
    var result = JSON.parse(response.getContentText());
    return result;
  } catch(e) {
    Logger.log(e);
    return;
  }
}
