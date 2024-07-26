import { DataTable, IDataRow, ColumnName } from "../models/file.model";

//---------------------------------- Function for rendering our Table ----------------------------------
export async function renderTable(tableArray: DataTable, currentPage: number, recordsPerPage: number): Promise<string> {

    // Index start and end
    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex = startIndex + recordsPerPage;
    const paginatedData = tableArray.slice(startIndex, endIndex);

    // Column names from the first record or row. If atleast one of these exist, let's go on
    const columnName: ColumnName = tableArray.length > 0 ? Object.keys(tableArray[0]) : [];

    // Building our table HTML content
    const tableContent = `
                        <table class="table table-responsive table-bordered border-dark-subtle">
                            <thead>
                                ${columnName.map((value) => `
                                    <th scope="col">${value}</th>
                                    `).join("")}
                            </thead>
                            <tbody>
                                ${paginatedData.map((row) => `
                                    <tr>
                                        ${columnName.map((columnName) => `
                                            <td scope="col">
                                                ${row[columnName || ""]}
                                            </td>
                                            `).join("")}
                                    </tr>
                                    `).join("")}
                            </body>
                        </table>
                        `
    return tableContent;
}
