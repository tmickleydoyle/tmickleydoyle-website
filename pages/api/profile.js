import path from 'path';
import { promises as fs } from 'fs';

export default async function handler(req, res) {
  const jsonDirectory = path.join(process.cwd());
  const profileData = await fs.readFile(jsonDirectory + '/data/config.json', 'utf8');
  res.status(200).json(JSON.parse(profileData));
}