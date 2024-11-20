import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import axios from 'axios'

const app = express()
const port = process.env.APP_EXPRESS_PORT || 3000

app.get('/', async (req, res) => {
    try {
        const response = await axios.post(`${process.env.CORE1_ENDPOINT}/api/v1/freight`, {
            headers: {
                'Authorization': `Bearer ${process.env.CORE1_API_KEY}`,
            },
        })
        
        res.json(response.data)
    } catch (error) {
        console.error('Error fetching data:', error)
    }
    res.status(500).send('Error fetching data')
})

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
