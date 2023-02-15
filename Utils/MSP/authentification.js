const { sendAmf } = require("./amf.js");

exports.MspClient = class MspClient {
  constructor(server) {
    this.Server = server;
    this.Login = null;
  }
  async LoginAsync(username, password) {
    const loginPacket = await sendAmf(
      this.Server,
      "MovieStarPlanet.WebService.User.AMFUserServiceWeb.Login",
      [
        username,
        password,
        [ ],
        null,
        null,
        "MSP1-Standalone:XXXXXX"
      ]
    );

    try {
      this.Login = loginPacket.bodies[0].data.loginStatus; // InvalidCredentials, Success
      
      return this.Login.status;
    } catch {
      return this.Login = "error";
   }
  }
  GetTicket() {
    return this.Login.ticket;
  }
}