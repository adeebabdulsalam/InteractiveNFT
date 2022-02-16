// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
const axios = require('axios')

const handler = async (event) => {

    var {address} = event.queryStringParameters;
    const API_SECRET = process.env.ETHERSCAN_API_KEY;
    const url = `https://api-rinkeby.etherscan.io/api?module=contract&action=getabi&address=${address}&apikey=${API_SECRET}`;
  try {
    const { data } = await axios.get(url);

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    }
  } catch (error) {
    const {status, statusText, headers, data } = error.response;
    return { statusCode: status, 
             body: JSON.stringify({status, statusText, headers, data})

    }
  }
}

module.exports = { handler }
