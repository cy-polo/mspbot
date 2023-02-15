const { settingsModel } = require("../shemas.js");
const { HashContent, HeaderTicket } = require("./checksum.js");
const { AMFClient, ENCODING } = require("@jadbalout/nodeamf");
const fetch = require("node-fetch");

exports.buildTicketHeader = (ticket, header = true) => {
  let ticketObject = {
    anyAttribute: null,
    Ticket: ticket
  };
  if (header) {
    ticketObject.Ticket = HeaderTicket(ticket);
  }
  return ticketObject;
};

exports.sendAmf = async(server, method, args, sessionId) => {
  
  if (!sessionId) {
    sessionId = await settingsModel.find({ });
    sessionId = sessionId[0].SessionId;
  };
  
  if (server === "uk") server = "gb";
  
  let endpoint = (await getEndpoint(server)) + "/Gateway.aspx";

  let client = new AMFClient(endpoint, ENCODING.AMF3);
  client.addGETParam("method", method);

  client.addHTTPHeader("Referer", "app:/cache/t1.bin/[[DYNAMIC]]/2");
  client.addHTTPHeader("Accept","text/xml, application/xml, application/xhtml+xml, text/html;q=0.9, text/plain;q=0.8, text/css, image/png, image/jpeg, image/gif;q=0.8, application/x-shockwave-flash, video/mp4;q=0.9, flv-application/octet-stream;q=0.8, video/x-flv;q=0.7, audio/mp4, application/futuresplash, */*;q=0.5, application/x-mpegURL");
  client.addHTTPHeader("x-flash-version", "32,0,0,100");
  client.addHTTPHeader("Accept-Encoding", "gzip,deflate");
  client.addHTTPHeader("User-Agent",  "Mozilla/5.0 (Windows; U; en) AppleWebKit/533.19.4 (KHTML, like Gecko) AdobeAIR/32.0" );

  client.addHeader("sessionID", false, sessionId);
  client.addHeader("id", false, HashContent(args));
    
  return await client.sendRequest(method, args);
  
};

async function getEndpoint(server) {
  const response = await fetch(
    "https://disco.mspapis.com/disco/v1/services/msp/" +
      server +
      "?services=mspwebservice"
  );

  const json = await response.json();
  return json["Services"][0]["Endpoint"].replace(
    new RegExp("https:", ""),
    "http:"
  );
}
