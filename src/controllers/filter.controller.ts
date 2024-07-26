import { DataTable } from "../models/file.model.js";

//---------------------- Function for filtering records or rows from our Table -------------------
export function filterData(tableArray: DataTable, searchTerm: string | undefined): DataTable{
    //If the searcher is empty
    if(searchTerm === undefined) {
        return tableArray //Error handler: No need to filter, so return the original array
    }

    const lowerCaseSearchTerm: string = searchTerm.toLowerCase()

    const resultFilterData: DataTable = tableArray.filter(row => 
        Object.values(row).some(cell=>{
            if(cell === null || cell === undefined){
                return false //Error handler. We can't use and empty or undefined cell
            } else{
                return cell.toString().toLowerCase().includes(lowerCaseSearchTerm)
            }
        })
    )
    return resultFilterData
}