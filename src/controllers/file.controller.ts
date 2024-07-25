import { DataRow, DataTable, ColumnName } from "../models/file.model";

export class FileController {
    private data: DataTable = [];
    private columnNames: ColumnName = [];

    constructor(private fileContent:string){
        this.processFile();
    };

    //---------------------------------------- Function for processing our file and catching data ----------------------------------------
    private processFile(): void {
        //We split the row each time there is a Line break and creates a new element inside of an array ('rows').
        //Filtering, so we only get the row with content
        const rows = this.fileContent.split(/[\r\n]+/).filter(row=>{
            return row.trim() !== '';  // This is for ignoring empty rows and deleting start-end-spaces
        });

        if (rows.length > 0){
            //We take our Data from the element [1], because the element [0] are the Column Names.
            //This elements are Rows, so we have to split it again, to get the actual elements, or values
            //We are going to use
            this.columnNames = rows[0].split(',');
            
            this.data = rows.slice(1).map(row => {
                //This allow us to have each and all values from the row record, turned into
                //an array element
                const values = row.split(',');
                const dataRow: DataRow = {};

                //We ... the row with our column names, and we assign each column, a
                //value. The structure defined in the interface is key: value, 
                this.columnNames.forEach((columnName,index)=>{
                    dataRow[columnName] = values[index] || '';
                });
                return dataRow;
            });
        };
    };
};