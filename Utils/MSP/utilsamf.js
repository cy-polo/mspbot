const { WebhookClient } = require("discord.js");
const { histogramsModel, settingsModel } = require("../shemas.js");
const { warningHistogram } = require("./../config.json"); // 
const { sendAmf } = require("./amf.js");

exports.GetActorIdByName = async(server, username) => {
  let ActorId = await sendAmf(
    server,
    "MovieStarPlanet.WebService.AMFActorService.GetActorIdByName",
    [ username ]
  );
  
  try {
    ActorId = ActorId.bodies[0].data;
  } catch {
    return false;
  }
  
  if (ActorId === 0) return false;
  else return ActorId;
}

exports.GetSessionId = async needToBeSaved => {
  try {
    let createPacket;
    let histogram;
    let sessionId = "";
    async function getHistogram() {
      do {
        sessionId = sessionId + (Math.random() * 2147483647).toString(16).replace(".", "");
      } while (sessionId.length < 48);
      sessionId = sessionId.substr(0, 46);
      sessionId = Buffer.from(sessionId).toString("base64");

      createPacket = await sendAmf(
        "uk",
        "MovieStarPlanet.WebService.Os.AMFOs.CreateOsRef",
        [],
        sessionId
      );

      createPacket = createPacket.bodies[0].data;

      histogram = await histogramsModel.findOne({ TjData: createPacket.TjData });
      };
      
    await getHistogram();
        
    while (!histogram) {
      const webhookClient = new WebhookClient({ id: warningHistogram.id, token: warningHistogram.token });
      await webhookClient.send({ content: `@everyone, mspbot can't get the sessionId, because the TjData is not on MongoDB.\nPlease build this TjData:\n\n\`${createPacket.TjData}\`` });
      await getHistogram();
    };
      
    const runPacket = await sendAmf(
      "uk",
      "MovieStarPlanet.WebService.Os.AMFOs.RunOsCheck",
      [ createPacket.RefId, histogram.Histogram ],
      sessionId
    );
    
    sessionId = runPacket.bodies[0].data;
    
    if (needToBeSaved) await settingsModel.updateMany({ }, { SessionId: sessionId });

    return sessionId;
  } catch { };
}