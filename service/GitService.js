const axios = require("axios");
const endPoint = "https://api.github.com/search/users";
class GitService {
  async getGitUser(city, pageNumber) {
    console.log("calling get service");
    let data = [];
    await axios
      .get(`${endPoint}?q=location%3A${city}&page=${pageNumber}`)
      .then(response => {
        data = response.data;
      })
      .catch(error => {
        console.log(error);
      });
    return data;
  }
}

module.exports = GitService;
