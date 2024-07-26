import { ColumnName, IDataRow} from '../models/file.model.js';

export async function convertCsv(data: IDataRow[], columnNames: ColumnName): Promise<string>{
    const csvRows=[];
    //Add headers 
    csvRows.push(columnNames.join(","));
    //Add data
    data.forEach(row=>{
        const values = columnNames.map(column=>row[column] || "");
        csvRows.push(values.join(""));
    })
    return csvRows.join("\n");
}

export async function downloadCSV(csvContent: string, fileName: string){
    //Blob object with unalterable data and binary
    const blob = new Blob([csvContent], {type: 'text/csv; charset=UTF-8'});
    //Downloading the blob as a file
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        document.body.appendChild(link);
        //Trigger
        link.click();
        //Deletes the link
        document.body.removeChild(link);
}