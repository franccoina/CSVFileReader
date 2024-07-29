//---------------------- Function for filtering records or rows from our Table -------------------
export function filterData(tableArray, searchTerm) {
    //If the searcher is empty
    if (!searchTerm) {
        return tableArray; //Error handler: No need to filter, so return the original array
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return tableArray.filter(row => Object.values(row).some(cell => {
        return cell.toString().toLowerCase().includes(lowerCaseSearchTerm);
    }));
}
