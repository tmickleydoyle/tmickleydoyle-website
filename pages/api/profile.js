import path from 'path';
import { promises as fs } from 'fs';

export const config = {
  runtime: 'edge',
  regions: ['iad1'],
};

export default async function handler(req, res) {
  const jsonDirectory = path.join(process.cwd());
  const profileData = await fs.readFile(jsonDirectory + '/data/config.json', 'utf8');
  res.status(200).json(JSON.parse(profileData));
}