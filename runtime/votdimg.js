const got = require('got');

exports.handler = function(context, event, callback) {
  var now = new Date();
  var start = new Date(now.getFullYear(), 0, 0);
  var diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
  var oneDay = 1000 * 60 * 60 * 24;
  var day = Math.floor(diff / oneDay);
  var votd_url = "https://developers.youversionapi.com/1.0/verse_of_the_day/" + day + "?version=asv";    
  got
    .get(votd_url, {
      headers: {
        'X-YouVersion-Developer-Token': `${context.YOUVERSION_API_KEY}`,
        'Accept': 'application/json',
        'Referer': 'https://si-rob.com'
      },
      json: true,
    })
    .then(response => {
        console.log(response)
        imgurl = response.body.image.url;
        
        imgurl = imgurl.replace(/{width}x{height}/g, "300x300");
        imgurl = "https:" + imgurl;

        const MessagingResponse = require('twilio').twiml.MessagingResponse;

        const imgresponse = new MessagingResponse();
        const message = imgresponse.message();
        message.media(imgurl);
        console.log(imgresponse);
        callback(null, imgresponse);


        // let responseObject = { "url": imgurl };
        // callback(null, imgurl);
	   // callback(null, responseObject);
    })
    .catch(err => {
      callback(err);
    });
};
