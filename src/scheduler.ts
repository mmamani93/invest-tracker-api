import schedule from 'node-schedule'
import { fetchSheetData } from './fetchGoogleSheet'
import { readJSON, writeJSON } from './storage'

const GOOGLE_SHEET_URL = 'https://example.com/sheet'; // Placeholder

async function fetchAndStoreDailyData(): Promise<void> {
  const data = await fetchSheetData(GOOGLE_SHEET_URL);
  if (data) {
    const existingData = readJSON('DailyHistory.json') || [];
    const timestamp = new Date().toISOString();
    existingData.push({ timestamp, data });
    writeJSON('DailyHistory.json', existingData);
    console.log('Daily data updated:', timestamp);
  }
}

async function updateLatestDailyData(): Promise<void> {
  const data = await fetchSheetData(GOOGLE_SHEET_URL);
  if (data) {
    let existingData = readJSON('DailyHistory.json') || [];
    const timestamp = new Date().toISOString();

    if (existingData.length > 0) {
      existingData[existingData.length - 1] = { timestamp, data };
    } else {
      existingData.push({ timestamp, data });
    }

    writeJSON('DailyHistory.json', existingData);
    console.log('Daily close data updated:', timestamp);
  }
}

export function setupSchedules(): void {
  // Adjust times to your timezone and market hours
  // Times are in UTC; for example, 14:40 UTC is 10:40 Eastern Time during DST
  schedule.scheduleJob('0 40 14 * * *', fetchAndStoreDailyData); // 10 min after market open
  schedule.scheduleJob('0 10 20 * * *', updateLatestDailyData); // 10 min after market close
}