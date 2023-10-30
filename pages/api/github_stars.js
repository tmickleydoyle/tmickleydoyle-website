import fetch from 'node-fetch';

export const runtime = 'edge'; // 'nodejs' is the default
export const preferredRegion = 'iad1'; // only execute this function on iad1

const query = `
    query($username: String!, $name: String!) {
        repository(owner: $username, name: $name) {
            stargazers {
                totalCount
            }
        }
    }
`

export default async function handler(req, res) {
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const host = req.headers.host;
    const domain = `${protocol}://${host}`;

    const repos = await fetch(`${domain}/api/github_repositories`);
    const reposData = await repos.json();

    var repoStars = [];

    for (var i = 0; i < reposData.length; i++) {
        const variables = `
            {
            "username": "tmickleydoyle",
            "name": "${reposData[i].name}"
            }
        `
        const body = {
            query,
            variables
        }

        const responsee = await fetch('https://api.github.com/graphql', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
            },
            body: JSON.stringify(body)
        });
        const data = await responsee.json();
        if (data.data.repository.stargazers.totalCount > 0) {
            repoStars.push({
                name: reposData[i].name,
                stars: data.data.repository.stargazers.totalCount
            });
        }
    }

    res.status(200).json(repoStars);
}