const { createHash } = require("crypto");

exports.HashContent = hashArgs => createChecksum(hashArgs);
exports.HeaderTicket = ticket => {
  const markingId = Math.floor(Math.random() * 1000 + 1).toString();
  const md5 = createHash("md5").update(markingId).digest("hex");
  const hex = Buffer.from(markingId).toString("hex");
  return ticket + md5 + hex;
};

/*
function strTohex(input) {
  for (let e = input, a = "", t = 0; t < e.length; t++)
    a += "" + e.charCodeAt(t).toString(16);
  return a;
}
*/

function createChecksum(args) {
  const sha = createHash("sha1");
  const split = joinArray(args);
  const salt = getSalt();
  const ticketvalue = getEndData(args);
  sha.update(`${split}${ticketvalue}${salt}`);
  const hash = sha.digest("hex");
  return hash;
}

function joinArray(array) {
  let endResult = "";
  for (let arg of array) {
    if (Array.isArray(arg)) {
      endResult += joinArray(arg);
      continue;
    }
    if (arg == undefined || arg == null || arg.hasOwnProperty("Ticket")) {
      continue;
    }
    endResult += arg;
  }
  return endResult;
}

function getSalt() {
  return "$CuaS44qoi0Mp2qp";
}

function getEndData(args) {
  for (let arg of args) {
    if (!(arg == undefined || arg == null) && arg.hasOwnProperty("Ticket")) {
      const ticket = arg.Ticket;
      if (ticket.includes(",")) {
        const splitted = ticket.split(",");
        if (splitted.length == 6) {
          return splitted[5].substring(0, 5);
        }
      }
    }
  }
  return "v1n3g4r";
}
