//----------------------------------- Interfaces -----------------------------------

//Interface for each Record or Row from our table

export interface IDataRow {
    [key: string]: string
}

//----------------------------------- Types ----------------------------------------

//Type for our table, that is filled with Record or Rows

export type DataTable = IDataRow[]

//Type for the name of our Columns

export type ColumnName = string[]

//----------------------------------- Data Schema -----------------------------------

//For better understanding, here you have a schema of how we are structuring the file data 

//[{ 'Departamento': 'Antioquia', 'Municipio': 'Medellín' }, { 'Departamento': 'Cundinamarca', 'Municipio': 'Bogotá' }]

//WHERE: [] Table, is an Array with the table rows
//       {} Table Rows, is an Object with each value, related to a Column Name with identifies the value