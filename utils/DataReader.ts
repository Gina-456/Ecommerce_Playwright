import fs from 'fs';
import { parse } from 'csv-parse/sync';
import XLSX from 'xlsx';

export class DataProvider {
    static readJson(filePath: string) {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    }

    static readCsv(filePath: string) {
        const data = fs.readFileSync(filePath);
        return parse(data, { columns: true, skip_empty_lines: true });
    }

    static readExcel(filePath: string) {
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        return XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    }
}