import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import axios from 'axios'

const app = express()
const port = process.env.APP_EXPRESS_PORT || 3000

app.get('/', async (req, res) => {
    res.send('/freight - get all shipments<br>/freight/id - get freight details by id<br>/invoices - get all invoices')
})

app.get('/freight', async (req, res) => {
    try {
        const response = await axios.post(`${process.env.CORE1_ENDPOINT}/api/v1/freight/`, {
            page: 1,
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.CORE1_API_KEY}`,
            },
        })
        
        return res.json(response.data)
    } catch (error) {
        console.error('Error fetching data:', error)
    }
    res.status(500).send('Error fetching data')
})

app.get('/freight/id', async (req, res) => {
    try {
        const response = await axios.get(`${process.env.CORE1_ENDPOINT}/api/v1/freight/AU-1741183347164`, {
            headers: {
                'Authorization': `Bearer ${process.env.CORE1_API_KEY}`,
            },
        })
        
        return res.json(response.data)
    } catch (error) {
        console.error('Error fetching data:', error)
    }
    res.status(500).send('Error fetching data')
})

app.get('/invoices', async (req, res) => {
    try {
        const response = await axios.post(`${process.env.CORE1_ENDPOINT}/api/v1/invoices`, {
            page: 1,
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.CORE1_API_KEY}`,
            },
        })
        
        return res.json(response.data)
    } catch (error) {
        console.error('Error fetching data:', error)
    }
    res.status(500).send('Error fetching data')
})

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));

axios.get('https://api.ipify.org?format=json')
    .then(response => {
        console.log(`Your public IP address is: ${response.data.ip}`);
    })
    .catch(error => {
        console.error('Error fetching IP address:', error);
    });