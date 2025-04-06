# API Routes

```javascript
import axios from 'axios

const apiClient = axios.create({
    baseURL: 'https://backend-core1.axleshift.com',
    headers: {
        'Authorization': `Bearer ${process.env.CORE1_API_KEY}`,
    },
})
```

- **/freight** - Get all shipments  

    ```javascript
    const response = await apiClient.post('/api/v1/freight/', {
            page: 1,
    });
    console.log(JSON.stringify(response.data));
    ```

- **/freight/id** - Get freight details by ID  

    ```javascript
    const response = await apiClient.get('/api/v1/freight/AX-1743777636871/');
    console.log(JSON.stringify(response.data));
    ```

- **/invoices** - Get all invoices  

    ```javascript
    const response = await apiClient.post('/api/v1/invoices/', {
            page: 1,
    });
    console.log(JSON.stringify(response.data));
    ```

- **/invoices/id** - Get invoice details by ID  

    ```javascript
    const response = await apiClient.get('/api/v1/invoices/AX-1743777636871/');
    console.log(JSON.stringify(response.data));
    ```

- **/documents** - Get all documents  

    ```javascript
    const response = await apiClient.post('/api/v1/documents/', {
            page: 1,
    });
    console.log(JSON.stringify(response.data));
    ```

- **/documents/id** - Get document details by ID  

    ```javascript
    const response = await apiClient.get('/api/v1/documents/AX-1743777636871/');
    console.log(JSON.stringify(response.data));
    ```

- **/insights/shipment-overtime** - Shipment insights over time  

    ```javascript
    const response = await apiClient.get('/api/v1/insights/shipment-overtime/');
    console.log(JSON.stringify(response.data));
    ```

- **/insights/cost-overtime** - Cost insights over time  

    ```javascript
    const response = await apiClient.get('/api/v1/insights/cost-overtime/');
    console.log(JSON.stringify(response.data));
    ```

- **/insights/items-overtime** - Items insights over time  

    ```javascript
    const response = await apiClient.get('/api/v1/insights/items-overtime/');
    console.log(JSON.stringify(response.data));
    ```

- **/insights/weight-overtime** - Weight insights over time  

    ```javascript
    const response = await apiClient.get('/api/v1/insights/weight-overtime/');
    console.log(JSON.stringify(response.data));
    ```
