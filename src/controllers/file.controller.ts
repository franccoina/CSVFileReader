import { IDataRow, DataTable, ColumnName } from "../models/file.model.js";

export class FileController {
    public fileContent: string;
    public data: DataTable = [];
    public columnNames: ColumnName = [];

    constructor(fileContent: string){
        this.fileContent = fileContent;
    };

    //---------------------------------------- Function for processing the csv file and catching data ----------------------------------------
    public processFile(): void {
        //We split the row each time there is a Line break and creates a new element inside of an array ('rows').
        //Filtering, so we only get the row with content
        const rows = this.fileContent.split(/[\r\n]+/).filter(row =>
            row.trim() !== ''  // This is for ignoring empty rows and deleting start-end-spaces
        );

        if (rows.length > 0){
            //We take our Data from the element [1], because the element [0] are the Column Names.
            //This elements are Rows, so we have to split it again, to get the actual elements, or values
            //We are going to use
            this.columnNames = rows[0].split(',');
            
            this.data = rows.slice(1).map(row => {
                //This allow us to have each and all values from the row record, turned into
                //an array element
                const values: string[] = row.split(',');
                const dataRow: IDataRow = {};

                //We ... the row with our column names, and we assign each column, a
                //value. The structure defined in the interface is key: value, 
                this.columnNames.forEach((columnName,index)=>{
                    dataRow[columnName] = values[index] || '';
                });
                return dataRow;
            });
        };
    };

    //---------------------------------------- Function for getting or catching data ----------------------------------------
    public getData(): DataTable{
        return this.data;
    }
    
    //---------------------------------------- Function for getting column names ----------------------------------------
    public getColumnNames(): ColumnName{
        return this.columnNames;
    }

    //---------------------------------------- Function for sorting data ----------------------------------------
    public sortData(column: string, order: 'asc' | 'desc'): void {
        this.data.sort((a, b) => {
            const valueA = a[column].toLowerCase();
            const valueB = b[column].toLowerCase();

            if (valueA < valueB) {
                return order === 'asc' ? -1 : 1;
            }
            if (valueA > valueB) {
                return order === 'asc' ? 1 : -1;
            }
            return 0;
        });
    }
};