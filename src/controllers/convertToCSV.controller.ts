import { ColumnName, IDataRow } from '../models/file.model.js';

export async function convertToCsv(data: IDataRow[], columnNames: ColumnName): Promise<string> {
    const csvRows = [];
    //Adding headers 
    csvRows.push(columnNames.join(","));
    //Adding data
    data.forEach(row => {
        const values = columnNames.map(column => row[column] || "");
        csvRows.push(values.join(","));
    })
    return csvRows.join("\n");
}