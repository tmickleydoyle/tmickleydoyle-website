import fetch from 'node-fetch';

export const runtime = 'edge'; // 'nodejs' is the default
export const preferredRegion = 'iad1'; // only execute this function on iad1

const query = `
    query($username: String!) {
        user(login: $username) {
            repositories(first: 100) {
                nodes {
                    name
                    isPrivate
                    isArchived
                    owner {
                        login
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

    var resData = data.data.user.repositories.nodes.filter(repo => !repo.isPrivate && !repo.isArchived && repo.owner.login === 'tmickleydoyle');

    res.status(200).json(resData);
}