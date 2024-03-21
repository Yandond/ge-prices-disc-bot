const express = require('express')
const server = express()

server.all('/', (req, res) => {
  res.send('Result: [OK]')
})


module.exports = () =>
 {
    server.listen(3000, () => {
    console.log('server is now ready!')
  })
}

