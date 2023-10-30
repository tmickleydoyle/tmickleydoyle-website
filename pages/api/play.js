import fetch from 'node-fetch';

export const runtime = 'edge'; // 'nodejs' is the default
export const preferredRegion = 'iad1'; // only execute this function on iad1

export default async function handler(req, res) {
    const response = await fetch('https://raw.githubusercontent.com/mesosphere/tweeter/master/shakespeare-data.json');
    const textData = await response.text();
    res.status(200).send(textData);
}