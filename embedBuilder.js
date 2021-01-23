const Discord = require("discord.js");
const colorsAr = require("./colors.json");
module.exports = {
  topAnimeEmbBuilder,
  animeQueryEmbBuilder,
  listEmbBuilder,
  profileEmbBuilder,
  helpEmbBuilder,
  charEmbBuilder,
};

function randColor() {
  var pos = Math.floor(Math.random() * colorsAr.length);
  return colorsAr[pos];
}

//.help
function helpEmbBuilder() {
  var embed = new Discord.MessageEmbed()
    .setTitle("Commands:")
    .setColor(randColor())
    .addField(".info *username*", "returns information about a MAL account")
    .addField(".list *username*", "returns user's anime list")
    .addField(".anime *anime*", "returns information about anime")
    .addField(
      ".char *character name*",
      "returns information and picture of character"
    )
    .addField(".topanime", "returns the current most popular anime");
  return embed;
}
//.info
function undefToEmptStr(parm) {
  if (parm == undefined || parm == null) {
    return "Unset";
  }
  return parm;
}
const months = {
  1: "Jan.",
  2: "Feb.",
  3: "Mar.",
  4: "Apr.",
  5: "May",
  6: "Jun.",
  7: "Jul.",
  8: "Aug.",
  9: "Sep.",
  10: "Oct.",
  11: "Nov.",
  12: "Dec.",
};
function profileEmbBuilder(query, data) {
  var gender = undefToEmptStr(data["gender"]);
  var mean_score = undefToEmptStr(data.anime_stats.mean_score);
  var watched = undefToEmptStr(data.anime_stats.completed);
  var watchedD = undefToEmptStr(data.anime_stats.days_watched);
  var joined = data["joined"];
  var joinedY = joined.substring(0, 4);
  var joinedM = months[joined.substring(5, 7)];
  var joinedD = parseInt(joined.substring(8, 10)); //removes 0 if 1 digit
  var joinedTotal = `${joinedM} ${joinedD}, ${joinedY}`;
  // makes sure gender does not send as "" (undefToEmptStr: returns "" if undef)
  if (gender == null) {
    gender = "Unset";
  }
  var embed = new Discord.MessageEmbed()
    .setTitle(`${query}'s MAL Account`)
    .setURL(data["url"])
    .setThumbnail(data["image_url"])
    .addField("Gender:", gender)
    .addField("Joined:", joinedTotal)
    .addField("Mean Score:", mean_score)
    .addField("Watched:", watched)
    .addField("No life for:", `${watchedD} days`)
    .setColor(randColor());
  return embed;
}

//.topanime
function topAnimeEmbBuilder(data) {
  var top = data.top;
  var embed = new Discord.MessageEmbed()
    .setTitle("Top 10 Anime: ")
    .setThumbnail(top[0].image_url)
    .setColor(randColor());
  var count = 10;
  for (i = 0; i < count; i++) {
    embed.addField(`${top[i].rank}:`, top[i].title);
  }
  return embed;
}

//.anime
function animeQueryEmbBuilder(data) {
  var r1 = data.results[0];
  var membersStr = r1.members.toString();
  var pos = 3;
  if (membersStr.length > 3) {
    var ar = membersStr.split("");
    var len = membersStr.length;
    while (len - pos > 0) {
      var commapos = len - pos;
      ar.splice(commapos, 0, ",");
      pos += 3;
    }
    membersStr = ar.join("");
  }
  var infoAr = [r1.score, r1.episodes, r1.synopsis, membersStr];
  for (i = 0; i < infoAr.length; i++) {
    if (infoAr[i] == "") {
      infoAr[i] = "None";
    }
  }
  var embed1 = new Discord.MessageEmbed()
    .setTitle(r1.title)
    .setURL(r1.url)
    .setImage(r1.image_url)
    .setColor(randColor())
    .addField("Score:", infoAr[0])
    .addField("Ep:", infoAr[1])
    .addField("Synopsis:", infoAr[2])
    .addField("Popularity:", `${infoAr[3]} members`);
  return embed1;
}

//.list
function listEmbBuilder(query, data) {
  var embeddesc = `${data.anime[0].title}: ${data.anime[0].score}` + "\n";
  var embed = new Discord.MessageEmbed()
    .setTitle(`${query}'s Anime List`)
    .setColor(randColor());
  for (i = 1; i < data.anime.length; i++) {
    var title = data.anime[i].title;
    var score = data.anime[i].score.toString();
    embeddesc = embeddesc.concat(`${title}: ${score}` + "\n");
  }
  embed.setDescription(embeddesc);
  return embed;
}

//.char
function charEmbBuilder(data1) {
  var data = data1.data.Page.characters[0];
  var fulldesc = data.description;
  if (fulldesc.includes("__Birthday__:") || fulldesc.includes("Birthday:")) {
    var length = fulldesc.indexOf("\n\n") + 1;
    var desc = fulldesc.substring(0, length);
  } else {
    desc = "__Birthday:__ None \n__Zodiac:__ None\n__Blood Type:__ None";
  }
  var embed = new Discord.MessageEmbed()
    .setTitle(data.name.full)
    .setURL(data.siteUrl)
    .setImage(data.image.medium)
    .setDescription(desc)
    .setColor(randColor());
  return embed;
}
