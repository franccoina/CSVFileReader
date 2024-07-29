import { FileController } from "./controllers/file.controller.js";
import { renderTableTemplate } from "./controllers/tableTemplate.controller.js";
import { filterData } from "./controllers/filter.controller.js";
import { ColumnName, DataTable } from "./models/file.model.js";
import { convertToCsv } from "./controllers/convertToCSV.controller.js";
import { downloadCSV } from "./controllers/downloadCSV.controller.js";

//---------------------------------------- Getting elements from HTML -----------------------

const csvForm = document.querySelector("#csvForm") as HTMLFormElement;
const csvFile = document.querySelector("#csvFile") as HTMLInputElement;
const contentArea = document.querySelector("#contentArea") as HTMLDivElement;
const searchInput = document.querySelector("#searchInput") as HTMLInputElement;
const downloadFileButton = document.querySelector("#downloadCSV") as HTMLButtonElement;
const paginationControlsNav = document.querySelector('#paginationControls') as HTMLElement;

//---------------------------------------- Variables ---------------------------------------- 

const recordsPerPage = 15
let currentPage = 1
let sortColumn: string = '';
let sortOrder: 'asc' | 'desc' = 'asc';
let data: DataTable = []
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

    // Nav links (Buttons)
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

    // Pagination Numbers
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

//---------------------------------------- Rendering table with its controls ----------------
async function renderTableController() {
    const searchTerm: string = searchInput.value 
    let filteredData: DataTable = filterData(data, searchTerm)

    // Sorting data
    if (sortColumn) {
        const fileController = new FileController('');
        fileController.data = filteredData;
        fileController.sortData(sortColumn, sortOrder);
        filteredData = fileController.getData();
    }

    contentArea.innerHTML = ''
    //Render filtered data
    const tableHTML: string = await renderTableTemplate(filteredData, currentPage, recordsPerPage, sortColumn, sortOrder)
    contentArea.innerHTML += tableHTML

    //Pagination nav
    const paginationControls: string = pagination(filteredData.length, currentPage, recordsPerPage)
    paginationControlsNav.innerHTML = paginationControls

    // Re-select pagination links after rendering
    const paginationLinks: NodeListOf<HTMLElement> = document.querySelectorAll('.page-link');

    paginationLinks.forEach(link => {
        link.addEventListener('click', () => {
            currentPage = parseInt(link.getAttribute('data-page')!)
            renderTableController()
        })
    })

    // Re-select pagination links after rendering
    const sortingButtons: NodeListOf<HTMLElement> = document.querySelectorAll('.sort-button');

    sortingButtons.forEach(button => {
        button.addEventListener('click', (event: Event) => {
            const target = event.target as HTMLButtonElement;
            sortColumn = target.getAttribute('data-column')!;
            sortOrder = target.getAttribute('data-order') as 'asc' | 'desc';
            renderTableController();
        });
    });
}

//---------------------------------------- addEv for rendering the table and downloading ----------------------------------------

document.addEventListener("DOMContentLoaded", () => {
    //----------------------------- Uploading the file ----------------------------->
    csvForm.addEventListener("submit", (ev: Event) => {
        ev.preventDefault()

        // '!' : Not null
        // '?' : Not undefined

        //We need the file extension, so we get the file name, then we split it
        //by the '.' character, and with pop() method we select the file extension
        //and save it in another variable

        const inputFile: File = csvFile.files![0]
        const fileReader: FileReader = new FileReader()
        const fileName: string = inputFile.name
        const fileExtension: string | undefined = fileName.split('.').pop()?.toLowerCase()

        if (fileExtension !== 'csv') {
            alert("Invalid file format. Please upload a .csv file.")
            return
        }

        fileReader.onload = async (event: ProgressEvent) => {
            const fileContent: string = (event.target as FileReader).result as string;
            const fileController: FileController = new FileController(fileContent);
            fileController.processFile()
            data = fileController.getData()
            columnNames = fileController.getColumnNames()

            await renderTableController()
        }
        fileReader.readAsText(inputFile)
    })

    //----------------------------- Downloading the file ----------------------------->

    downloadFileButton.addEventListener('click', async (ev: Event) => {
        ev.preventDefault()
        //Filtered data
        let searchTerm: string = searchInput.value
        const filteredData = filterData(data, searchTerm)
        const fileContent: string = await convertToCsv(filteredData, columnNames)
        await downloadCSV(fileContent, 'filtered_data.csv')
    })

    //------------------------------ Searching ---------------------------------------->

    searchInput.addEventListener('input', async (ev: Event) => {
        ev.preventDefault()
        await renderTableController()
    })
})