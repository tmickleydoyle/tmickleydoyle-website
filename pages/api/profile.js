import path from 'path';
import { promises as fs } from 'fs';

export const runtime = 'edge'; // 'nodejs' is the default
export const preferredRegion = 'iad1'; // only execute this function on iad1

export default async function handler(req, res) {
  const jsonDirectory = path.join(process.cwd());
  const profileData = await fs.readFile(jsonDirectory + '/data/config.json', 'utf8');
  res.status(200).json(JSON.parse(profileData));
}