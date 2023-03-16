import fetch from 'node-fetch';

const query = `
    query ($username: String!) {
        user(login: $username) {
            contributionsCollection {
            contributionCalendar {
                weeks {
                contributionDays {
                    date
                    contributionCount
                }
                }
            }
            }
        }
    }
`

export default async function handler(req, res) {

    const variables = `
        {
        "username": "tmickleydoyle"
        }
    `
    const body = {
        query,
        variables
    }

    const response = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        },
        body: JSON.stringify(body)
    });
    const data = await response.json();

    res.status(200).json(data);
}