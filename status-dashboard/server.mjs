import express from 'express';
import fetch from 'node-fetch';

const app = express();
const port = 3000;
const HOST = '0.0.0.0'; // Listen on all network interfaces

// ✅ Default route
app.get('/', (req, res) => {
    res.send('Server is running! Use /status/:service to check a service.');
});

// ✅ Handle missing service name
app.get('/status/', (req, res) => {
    res.status(400).send('Error: Please specify a service. Example: /status/aws');
});

// ✅ Handle valid service checks
app.get('/status/:service', async (req, res) => {
    const service = req.params.service;
    let url;

    switch(service) {
        case 'cloudflare':
            url = 'https://www.cloudflarestatus.com/';
            break;
        case 'aws':
            url = 'https://health.aws.amazon.com/health/status';
            break;
        case 'laravel':
            url = 'https://status.laravel.com/';
            break;
        case 'bitbucket':
            url = 'https://bitbucket.status.atlassian.com/';
            break;
        case 'digitalocean':
            url = 'https://status.digitalocean.com/';
            break;
        case 'grafana':
            url = 'https://status.grafana.com/#';
            break;
        default:
            return res.status(404).send('Service not found. Try: aws, cloudflare, laravel, bitbucket, digitalocean, grafana');
    }

    try {
        const response = await fetch(url);
        const text = await response.text();

        res.send({ status: 'Operational', details: 'Detailed issue or downtime info' });
    } catch (error) {
        res.status(500).send({ status: 'Down', details: 'Error while fetching status' });
    }
});

app.listen(port, HOST, () => {
    console.log(`Server running at http://${HOST}:${port}`);
});
