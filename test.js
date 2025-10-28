import fetch from "node-fetch";

const url =
  "https://instagram-data1.p.rapidapi.com/comments?post=https%3A%2F%2Fwww.instagram.com%2Fp%2FCAVeEm1gDh2%2F";
const options = {
  method: "GET",
  headers: {
    "x-rapidapi-key": "510ee0d11dmshaf5d2bb343077ecp173c6ejsn53338aa3fd7e",
    "x-rapidapi-host": "instagram-data1.p.rapidapi.com",
  },
};

try {
  const response = await fetch(url, options);
  const result = await response.text();
  console.log(JSON.parse(result));
} catch (error) {
  console.error(error);
}
