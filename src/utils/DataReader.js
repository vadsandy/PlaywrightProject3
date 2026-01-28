const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');
const mssql = require('mssql');
require('dotenv').config();

// Unified Config: Reads from .env locally or GitHub Secrets in CI
const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    server: process.env.DB_SERVER || 'localhost',
    database: process.env.DB_NAME || 'PlaywrightTestData',
    port: 1433,
    options: {
        encrypt: true,
        trustServerCertificate: true,
        instanceName: 'SQLEXPRESS'
    }
};

class DataReader {
    static async getData(sourceType, identifier, key) {
        switch (sourceType.toLowerCase()) {
            case 'json':
                return this.getJsonData(identifier, key);
            case 'excel':
                return await this.getExcelData(identifier, key);
            case 'sql':
                return await this.getSqlData(identifier);
            default:
                throw new Error(`Source type ${sourceType} is not supported.`);
        }
    }

    static async getSqlData(query) {
        let pool;
        try {
            pool = await mssql.connect(dbConfig);
            let result = await pool.request().query(query);
            if (!result.recordset || result.recordset.length === 0) {
                throw new Error("No rows returned from SQL query.");
            }
            return result.recordset[0];
        } catch (err) {
            console.error("SQL Execution Error: ", err.message);
            throw err;
        } finally {
            if (pool) await pool.close();
        }
    }

    static getJsonData(relativeFilePath, key) {
        const filePath = path.join(__dirname, `../../${relativeFilePath}`);
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        return data[key];
    }

    static async getExcelData(relativeFilePath, key) {
        const filePath = path.join(__dirname, `../../${relativeFilePath}`);
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(filePath);
        const worksheet = workbook.getWorksheet(1);
        let dataObject = {};
        const headerRow = worksheet.getRow(1);

        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber > 1) {
                const lastColIndex = row.actualCellCount;
                if (row.getCell(lastColIndex).value === key) {
                    headerRow.eachCell((headerCell, colNumber) => {
                        dataObject[headerCell.value] = row.getCell(colNumber).value;
                    });
                }
            }
        });
        return dataObject;
    }
}

module.exports = { DataReader };