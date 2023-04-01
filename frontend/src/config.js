// 0=localhost
// 1=cloud
const type = 1;

type===0 ?
module.exports = {
    'type': type,
    'api': 'http://localhost:4000/api'
  }
  :
  module.exports = {
    'type': type,
    'api': 'https://instabackend-sv8r.onrender.com/api'
  }
