const axios = require('axios');
const jwt = require('jsonwebtoken');

exports.createCollectRequest = async ({ school_id, amount, callback_url }) => {
  const payload = { school_id, amount, callback_url };

  const sign = jwt.sign(payload, process.env.PG_KEY); // Sign using PG_KEY
//   console.log(sign)

  const res = await axios.post('https://dev-vanilla.edviron.com/erp/create-collect-request', {
    school_id,
    amount,
    callback_url,
    sign
  }, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.API_KEY}`
    }
  });

  return res.data;
};
