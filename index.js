const express = require('express')
const rp = require('request-promise-native')
require('express-csv')
const app = express()

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function (req, res, next) {
  rp('http://updates.jenkins-ci.org/update-center.actual.json')
    .then(body => {
      const plugins = JSON.parse(body).plugins
      const ret = [['pluginId', 'title']]
      for (const pluginId of Object.keys(plugins)) {
        ret.push([pluginId, plugins[pluginId].title])
      }
      return ret
    })
    .then(csv => {
      res.attachment('pluginId2Name.csv')
      res.csv(csv)
    })
    .then(() => next())
    .catch(err => next(err))
})

if (process.env.PORT) {
  // listen for requests :)
  const listener = app.listen(process.env.PORT, function () {
    console.log('Your app is listening on port ' + listener.address().port)
  })
}
module.exports = app
