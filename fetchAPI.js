const fetch = require("node-fetch");
module.exports = {
  topAnime,
  animeQuery,
  animeList,
  profileQuery,
  characterQuery,
};

async function topAnime() {
  var data = await fetch(
    `https://api.jikan.moe/v3/top/anime/1`
  ).then((response) => response.json());
  return data;
}

async function animeQuery(query) {
  var data = await fetch(
    `https://api.jikan.moe/v3/search/anime?q=${query}&page=1&limit=5`
  ).then((response) => {
    return response.json();
  });
  return data;
}

async function animeList(query) {
  var data = await fetch(
    `https://api.jikan.moe/v3/user/${query}/animelist?order_by=score&order_by2=title&sort=descending`
  ).then((response) => response.json());
  return data;
}

async function profileQuery(query) {
  var data = await fetch(
    `https://api.jikan.moe/v3/user/${query}`
  ).then((response) => response.json());
  return data;
}

async function characterQuery(charname) {
  var query1 = `
    query ($id: Int, $page: Int, $perPage: Int, $search: String){
      Page (page: $page, perPage: $perPage){
        characters (id: $id, search: $search){
          name{
            full
          }
          image{
            medium
          }
          siteUrl
          description
        }
      }
    }`;
  var variables = {
    search: charname,
    page: 1,
    perPage: 3,
  };

  var url = "https://graphql.anilist.co",
    options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: query1,
        variables: variables,
      }),
    };

  var data = await fetch(url, options).then((response) => {
    if (!response.ok) {
      return;
    } else {
      return response.json();
    }
  });
  return data;
}
