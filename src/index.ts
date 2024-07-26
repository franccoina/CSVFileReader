import { FileController } from "./controllers/file.controller.js";
import { renderTable } from "./controllers/table.controller.js";
import { filterData } from "./controllers/filter.controller.js";
import { ColumnName, IDataRow } from "./models/file.model.js";
import { convertCsv, downloadCSV } from "./controllers/downloader.controller.js";

//---------------------------------------- Getting elements from HTML -----------------------

const csvForm = document.querySelector("#csvForm") as HTMLFormElement;
const csvFile = document.querySelector("#csvFile") as HTMLInputElement;
const contentArea = document.querySelector("#contentArea") as HTMLDivElement;
const searchInput = document.querySelector("#searchInput") as HTMLInputElement;
const downloadButton = document.querySelector("#downloadCSV") as HTMLButtonElement;
const paginationControlsNav = document.querySelector('#paginationControls') as HTMLElement;

//---------------------------------------- Variables ---------------------------------------- 

const recordsPerPage = 15
let currentPage = 1
let finalValues: IDataRow[] = []
let columnNames: ColumnName = []

//---------------------------------------- Functions for rendering pagination controls ----------------------------------

function pagination(totalRecords: number, currentPage: number, recordsPerPage: number): string {
    const totalOfPages = Math.ceil(totalRecords / recordsPerPage);
    const maxButtons: number = 10;

    let paginationHTML: string = `<ul class="pagination rounded">`;

    // Start
    if (currentPage > 1) {
        paginationHTML += `
            <li class="page-item">
                <a class="page-link border border-dark-subtle" data-page="1" href="#">Start</a>
            </li>`;
    }

    // Previous
    if (currentPage > 1) {
        paginationHTML += `
            <li class="page-item">
                <a class="page-link border border-dark-subtle" data-page="${currentPage - 1}" href="#">Previous</a>
            </li>`;
    }

    // Buttons
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let finalPage = Math.min(totalOfPages, currentPage + Math.floor(maxButtons / 2));

    // Adjust range
    if (finalPage - startPage < maxButtons - 1) {
        if (startPage === 1) {
            finalPage = Math.min(totalOfPages, startPage + maxButtons - 1);
        } else if (finalPage === totalOfPages) {
            startPage = Math.max(1, finalPage - maxButtons + 1);
        }
    }

    // Page Numbers
    for (let i = startPage; i <= finalPage; i++) {
        paginationHTML += `
                <li class="page-item ${i === currentPage ? "active" : ''}">
                    <a class="page-link border border-dark-subtle" href='#' data-page="${i}">${i}</a>
                </li>
                `;
    }

    // Next
    if (currentPage < totalOfPages) {
        paginationHTML += `
            <li class="page-item">
                <a class="page-link border border-dark-subtle" data-page="${currentPage + 1}" href="#">Next</a>
            </li>`;
    }

    // End
    if (currentPage < totalOfPages) {
        paginationHTML += `
            <li class="page-item">
                <a class="page-link border border-dark-subtle" data-page="${totalOfPages}" href="#">End</a>
            </li>`;
    }

    paginationHTML += `</ul>`;
    return paginationHTML;
}

//---------------------------------------- addEvfor rendering the table and downloading ----------------------------------------

document.addEventListener("DOMContentLoaded", () => {
    //----------------------------- Uploading the file ----------------------------->

    csvForm.addEventListener("submit", async (ev: Event) => {
        ev.preventDefault()

        const csvReader = new FileReader()

        // '!' : Not null
        // '?' : Not undefined

        //We need the file extension, so we get the file name, then we split it
        //by the '.' character, and with pop() method we select the file extension
        //and save it in another variable

        const input = csvFile.files![0]
        const fileName = input.name
        const fileExtension = fileName.split(".").pop()?.toLowerCase()

        if (fileExtension !== 'csv' && fileExtension !== 'txt') {
            alert("Invalid file format. Please select a .csv or .txt file.")
            return
        }

        csvReader.onload = async function (event) {
            const text = event.target?.result as string
            const fileController = new FileController(text)
            finalValues = fileController.getData()
            columnNames = fileController.getColumnNames()

            await renderTableControls()
        }

        csvReader.readAsText(input)
    })

    //----------------------------- Downloading the file ----------------------------->

    downloadButton.addEventListener('click', async (ev: Event) => {
        ev.preventDefault()
        //Filtered data
        const searchTerm: string = searchInput.value
        const dataFilteredValues = filterData(finalValues, searchTerm)
        const csvContent = await convertCsv(dataFilteredValues, columnNames)
        await downloadCSV(csvContent, 'filtered_data.csv')
    })
    //------------------------------ Searching ---------------------------------------->

    searchInput.addEventListener('input', async (ev: Event) => {
        ev.preventDefault()
        await renderTableControls()
    })
})

//---------------------------------------- Rendering table with its controls ----------------
async function renderTableControls() {
    const searchTerm: string = searchInput.value 
    const filteredValues = filterData(finalValues, searchTerm)

    //Render filtered values
    const tableHTML = await renderTable(filteredValues, currentPage, recordsPerPage)
    contentArea.innerHTML = tableHTML

    //Pagination nav
    const paginationControls = pagination(filteredValues.length, currentPage, recordsPerPage)
    paginationControlsNav!.innerHTML = paginationControls

    // Re-select pagination links after rendering
    const paginationLinks = document.querySelectorAll('.page-link') as NodeListOf<HTMLElement>;

    //Current Page and Number of Pagination Links
    paginationLinks.forEach(link => {
        link.addEventListener('click', (ev) => {
            ev.preventDefault()

            const targetPage = Number((ev.target as HTMLElement).dataset.page)
            if (targetPage) {
                currentPage = targetPage
                renderTableControls()
            }
        })
    })
}
