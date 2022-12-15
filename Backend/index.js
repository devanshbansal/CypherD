const express = require('express')
const app = express()
const port = 3000
const cors = require('cors')
const axios = require('axios')


app.use(cors())

app.get('/test', (req, res) => {
  res.send('Hello World!')
})

app.get('/getWalletBalance', (req, result) => {
  var chainID = req.query.chainID;
  axios.get('https://api.covalenthq.com/v1/'+chainID+'/address/0x6AE65a7033a84bb36778fEA6607A25a0d6c8EE50/balances_v2/?key=ckey_af34717a92384b14b858f3d0d42', { 
    headers: { "Accept-Encoding": "gzip,deflate,compress" } 
})
  
  // Show response data
  .then(res => result.send(res.data))
  .catch(err => result.send(err))
  
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})