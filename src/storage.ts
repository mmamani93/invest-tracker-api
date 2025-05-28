import * as fs from 'fs';
import * as path from 'path';

const dataDir = path.join(__dirname, '../data');

interface StoredData {
  [key: string]: any;
}

export function readJSON(filename: string): any | null {
  const filePath = path.join(dataDir, filename);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw);
}

export function writeJSON(filename: string, data: any): void {
  const filePath = path.join(dataDir, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}