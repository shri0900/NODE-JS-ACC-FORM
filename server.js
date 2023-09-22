const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = 8080;

// Salesforce Authentication Details
const SFDC_ENDPOINT = 'https://login.salesforce.com/services/oauth2/token';
const GRANT_TYPE = 'password';
const CLIENT_ID = '3MVG9pRzvMkjMb6lzgyuNb9zSf2d51RQ0E_6plz7icogD9sPX6j2U.YMXEKctKEWdKFEBK437Hg==';
const CLIENT_SECRET = '925EFE3348DF143ABFD3A50FE5E3A187F61E6E0E9C52C18CA1B732C773FE1EF0';
const USERNAME = 'shri@example.com';
const PASSWORD = 'shreeraj2400UeqmxPuIOGmzIJKw4ptKyDFN';

app.use(bodyParser.json());

app.post('/createAccount', async (req, res) => {
    try {
        const { accountName } = req.body;
        
        // Authenticate with Salesforce
        const authResponse = await axios.post(SFDC_ENDPOINT, `grant_type=${GRANT_TYPE}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&username=${USERNAME}&password=${PASSWORD}`, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        
        const accessToken = authResponse.data.access_token;
        console.log("Access token "+accessToken)
        const instanceUrl = authResponse.data.instance_url;
        console.log("Instamce Url"+instanceUrl)

        // Create Account in Salesforce
        const accountResponse = await axios.post(`${instanceUrl}/services/data/v50.0/sobjects/Account`, {
            Name: accountName
        }, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        res.send({ success: true });
    } catch (error) {
        res.status(500).send({ error: 'Failed to create account in Salesforce' });
    }
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
