import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
    const filePath = path.join(process.cwd(), 'scripts', 'github_repos.json'); // Move JSON file inside /public
    const jsonData = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(jsonData);

    res.status(200).json(data);
}
