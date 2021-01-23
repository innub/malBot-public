const config = require("./config.json");
const Discord = require("discord.js");
var client = new Discord.Client();

const fetch = require("node-fetch");
// other js files
const fetchAPI = require("./fetchAPI");
const embedBuilder = require("./embedBuilder");

const pfx = ".";

// used throughout
function getSecVal(str, replace) {
  if (!str.includes(" ")) {
    return;
  } else if (replace) {
    return str.substring(str.indexOf(" ") + 1, str.length).replace(/ /g, "%20");
  } else if (!replace) {
    return str.substring(str.indexOf(" ") + 1, str.length);
  }
  return;
}

//respond to mentions
client.on("message", (message) => {
  if (message.content.includes("<@!775865808324001803>")) {
    message.channel.send(embedBuilder.helpEmbBuilder());
  }
});

//commands
//.help
client.on("message", (message) => {
  var content = message.content.trim();
  if (content.includes(`${pfx}help`)) {
    var embed = embedBuilder.helpEmbBuilder();
    message.channel.send(embed);
  }
});

//.info
client.on("message", (message) => {
  var content = message.content.trim();
  if (content.includes(`${pfx}info`)) {
    var query = getSecVal(content, true);
    if (query == undefined) {
      message.channel.send("Please provide a username");
      return;
    }
    fetchAPI
      .profileQuery(query)
      .then((data) => {
        var embed = embedBuilder.profileEmbBuilder(query, data);
        message.channel.send(embed);
      })
      .catch((error) => {
        message.channel.send("User not found");
      });
  }
});

//.list
client.on("message", (message) => {
  var content = message.content.trim();
  if (content.includes(`${pfx}list`)) {
    var query = getSecVal(content, true);
    if (query == undefined) {
      message.channel.send("Please provide a username");
      return;
    }
    fetchAPI
      .animeList(query)
      .then((data) => {
        var embed = embedBuilder.listEmbBuilder(query, data);
        message.channel.send(embed);
      })
      .catch((error) => {
        message.channel.send("User not found");
      });
  }
});

// .anime
client.on("message", (message) => {
  var content = message.content.trim();
  if (content.includes(`${pfx}anime`)) {
    var query = getSecVal(content, true);
    if (query == undefined) {
      message.channel.send("Please provide an anime title");
      return;
    }
    fetchAPI
      .animeQuery(query)
      .then((data) => {
        var embed = embedBuilder.animeQueryEmbBuilder(data);
        message.channel.send(embed);
      })
      .catch((error) => {
        message.channel.send("Anime not found");
      });
  }
});

// .topanime
client.on("message", async (message) => {
  var content = message.content.trim();
  if (content.includes(`${pfx}topanime`)) {
    fetchAPI
      .topAnime()
      .then((data) => {
        var embed = embedBuilder.topAnimeEmbBuilder(data);
        message.channel.send(embed);
      })
      .catch((error) => {
        console.log(error);
      });
  }
});

//.char
client.on("message", (message) => {
  var content = message.content.trim();
  if (content.includes(`${pfx}char`)) {
    var charname = getSecVal(content, false);
    if (charname == undefined) {
      message.channel.send("Please provide an character name");
      return;
    }
    fetchAPI
      .characterQuery(charname)
      .then((data) => {
        var embed = embedBuilder.charEmbBuilder(data);
        message.channel.send(embed);
      })
      .catch((error) => {
        message.channel.send("Character not found");
      });
  }
});

client.on("ready", () => {
  client.user.setPresence({
    activity: { name: "with body pillows" },
    status: "online",
  });
});
client.login(config.token);
