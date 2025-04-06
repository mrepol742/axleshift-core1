import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import axios from 'axios'

const app = express()
const port = process.env.APP_EXPRESS_PORT || 3000

const apiClient = axios.create({
    baseURL: process.env.CORE1_ENDPOINT,
    headers: {
        'Authorization': `Bearer ${process.env.CORE1_API_KEY}`,
    },
})

app.get('/', async (req, res) => {
    res.send(`
        <h1>API Routes</h1>
        <ul>
            <li><a href="/freight">/freight</a> - Get all shipments</li>
            <pre><code>
const response = await apiClient.post('/api/v1/freight/', {
    page: 1,
});
console.log(JSON.stringify(response.data));
            </code></pre>
            <li>/freight/id - Get freight details by ID</li>
            <pre><code>
const response = await apiClient.get('/api/v1/freight/AX-1743777636871/')
console.log(JSON.stringify(response.data));
            </code></pre>
            <li><a href="/invoices">/invoices</a> - Get all invoices</li>
            <pre><code>
const response = await apiClient.post('/api/v1/invoices/', {
    page: 1,
});
console.log(JSON.stringify(response.data));
            </code></pre>
              <li>/invoices/id - Get invoice details by ID</li>
            <pre><code>
const response = await apiClient.get('/api/v1/invoices/AX-1743777636871/')
console.log(JSON.stringify(response.data));
            </code></pre>
            <li><a href="/documents/">/documents</a> - Get all documents</li>
            <pre><code>
const response = await apiClient.post('/api/v1/documents/', {
    page: 1,
});
console.log(JSON.stringify(response.data));
            </code></pre>
             <li>/documents/id - Get documents details by ID</li>
            <pre><code>
const response = await apiClient.get('/api/v1/documents/AX-1743777636871/')
console.log(JSON.stringify(response.data));
            </code></pre>
            <li><a href="/insights/shipment-overtime">/insights/shipment-overtime</a> - Shipment insights over time</li>
            <pre><code>
const response = await apiClient.get('/api/v1/insights/shipment-overtime/')
console.log(JSON.stringify(response.data));
            </code></pre>
            <li><a href="/insights/cost-overtime">/insights/cost-overtime</a> - Cost insights over time</li>
            <pre><code>
const response = await apiClient.get('/api/v1/insights/cost-overtime/')
console.log(JSON.stringify(response.data));
            </code></pre>
            <li><a href="/insights/items-overtime">/insights/items-overtime</a> - Items insights over time</li>
            <pre><code>
const response = await apiClient.get('/api/v1/insights/items-overtime/')
console.log(JSON.stringify(response.data));
            </code></pre>
            <li><a href="/insights/weight-overtime">/insights/weight-overtime</a> - Weight insights over time</li>
            <pre><code>
const response = await apiClient.get('/api/v1/insights/weight-overtime/')
console.log(JSON.stringify(response.data));
            </code></pre>
        </ul>
    `);
});

app.get('/freight', async (req, res) => {
    try {
        const response = await apiClient.post('/api/v1/freight/', {
            page: 1,
        })
        return res.json(response.data)
    } catch (error) {
        console.error('Error fetching data:', error)
    }
    res.status(500).send('Error fetching data')
})

app.get('/invoices', async (req, res) => {
    try {
        const response = await apiClient.post('/api/v1/invoices/', {
            page: 1,
        })
        return res.json(response.data)
    } catch (error) {
        console.error('Error fetching data:', error)
    }
    res.status(500).send('Error fetching data')
})

app.get('/insights/shipment-overtime', async (req, res) => {
    try {
        const response = await apiClient.get('/api/v1/insights/shipment-overtime/')
        return res.json(response.data)
    } catch (error) {
        console.error('Error fetching data:', error)
    }
    res.status(500).send('Error fetching data')
})

app.get('/insights/cost-overtime', async (req, res) => {
    try {
        const response = await apiClient.get('/api/v1/insights/cost-overtime/')
        return res.json(response.data)
    } catch (error) {
        console.error('Error fetching data:', error)
    }
    res.status(500).send('Error fetching data')
})

app.get('/insights/items-overtime', async (req, res) => {
    try {
        const response = await apiClient.get('/api/v1/insights/items-overtime/')
        return res.json(response.data)
    } catch (error) {
        console.error('Error fetching data:', error)
    }
    res.status(500).send('Error fetching data')
})

app.get('/insights/weight-overtime', async (req, res) => {
    try {
        const response = await apiClient.get('/api/v1/insights/weight-overtime/')
        return res.json(response.data)
    } catch (error) {
        console.error('Error fetching data:', error)
    }
    res.status(500).send('Error fetching data')
})

app.get('/documents', async (req, res) => {
    try {
        const response = await apiClient.post('/api/v1/documents/', {
            page: 1,
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
