const express = require('express')
const app = express()
const port = 3000
const cors = require('cors')
const axios = require('axios')


app.use(cors())

app.get('/getWalletBalance', (req, result) => {
  var chainID = req.query.chainID;
  axios.get('https://api.covalenthq.com/v1/'+chainID+'/address/0x6AE65a7033a84bb36778fEA6607A25a0d6c8EE50/balances_v2/?key=ckey_af34717a92384b14b858f3d0d42', { 
    headers: { "Accept-Encoding": "gzip,deflate,compress" } 
})
  // Show response data
  .then(res => {
    
    var items = res.data.data.items;
    var resultItems = [];
    var sum = 0;

    for(var i in items) {
        sum = sum + (items[i].balance / (Math.pow(10, items[i].contract_decimals))).toFixed(2)* items[i].quote_rate;
        resultItems.push({name: items[i].contract_name, logo_url: items[i].logo_url, symbol: items[i].contract_ticker_symbol, balance: ( (items[i].balance / (Math.pow(10, items[i].contract_decimals))).toFixed(2)* items[i].quote_rate).toFixed(2), tokens: (items[i].balance / (Math.pow(10, items[i].contract_decimals))).toFixed(2)})
    }
    sum = sum.toFixed(2);
    var finalResult = {totalBalance: sum, items: resultItems};
    result.send(finalResult)
  })
  .catch(err => result.send(err))
  
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})