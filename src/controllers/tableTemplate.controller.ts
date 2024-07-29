import { DataTable, ColumnName } from "../models/file.model.js";

//---------------------------------- Function for rendering our Table ----------------------------------
export async function renderTableTemplate(tableArray: DataTable, currentPage: number, recordsPerPage: number, sortColumn: string, sortOrder: 'asc' | 'desc'): Promise<string> {

    // Index start and end
    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex = startIndex + recordsPerPage;
    const rows = tableArray.slice(startIndex, endIndex);

    // Column names from the first record or row. If atleast one of these exist, let's go on
    const columnNames: ColumnName = tableArray.length > 0 ? Object.keys(tableArray[0]) : [];

    // Building our table HTML content
    const tableContent: string = `
                                <table class="table table-responsive table-bordered border-dark-subtle">
                                    <thead>
                                        ${columnNames.map((columnName) => `
                                            <th scope="col">${columnName}
                                                <br>
                                                <button class="btn btn-light sort-button" data-column="${columnName}" data-order="${sortOrder === 'asc' ? 'desc' : 'asc'}">
                                                ${sortColumn === columnName ? (sortOrder === 'asc' ? '↑' : '↓') : '⇅'}</button>
                                            </th>
                                            `).join("")}
                                    </thead>
                                    <tbody>
                                        ${rows.map((row) =>
                                            `
                                            <tr>
                                                ${columnNames.map((columnName) => `
                                                    <td scope="col">
                                                        ${row[columnName || ""]}
                                                    </td>
                                                    `).join("")}
                                            </tr>
                                            `).join("")}
                                    </body>
                                </table>
                                `;
    return tableContent;
}
