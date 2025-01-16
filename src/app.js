import { createTableRow, filterPassengers, debounce, updateSearchSelectOptions } from './utils.js';
import { CONSTANTS } from "./constants.js";

export function initApp() {
    const searchInput = document.getElementById('searchInput');
    const searchSelect = document.getElementById('searchSelect');
    const searchColumn = document.getElementById('searchColumn');
    const passengerTableBody = document.querySelector('#passengerTable tbody');
    const sentinel = document.getElementById('sentinel');
    const batchSize = 20;
    let passengers = [];
    let displayedPassengers = 0;

    const loadPassengers = async () => {
        try {
            const response = await fetch(CONSTANTS.BASE_URL);
            if (!response.ok) {
                throw new Error(`${CONSTANTS.HTTP_ERROR_MESSAGE} ${response.status}`);
            }
            passengers = await response.json();
            displayNextBatch();
        } catch (error) {
            console.error('Ошибка при загрузке данных:', error);
            alert(CONSTANTS.ERROR_LOADING_DATA);
        }
    };

    const displayNextBatch = () => {
        const query = searchColumn.value === CONSTANTS.GENDER || searchColumn.value === CONSTANTS.STATUS
            ? searchSelect.value
            : searchInput.value;

        const filteredPassengers = filterPassengers(passengers, query, searchColumn.value);
        const nextBatch = filteredPassengers.slice(displayedPassengers, displayedPassengers + batchSize);

        if (nextBatch.length > 0) {
            const rows = nextBatch.map(createTableRow);
            const fragment = document.createDocumentFragment();
            rows.forEach(row => fragment.appendChild(row));
            passengerTableBody.appendChild(fragment);
            displayedPassengers += nextBatch.length;
        }

        if (displayedPassengers >= filteredPassengers.length) {
            sentinel.style.display = CONSTANTS.SENTINEL_NONE_DISPLAY;
        }
    };

    const observer = new IntersectionObserver((entries) => {
        if (entries[0].intersectionRatio > 0.5) {
            displayNextBatch();
        }
    }, {
        threshold: 0.5,
    });

    observer.observe(sentinel);

    const handleSearch = debounce(() => {
        passengerTableBody.innerHTML = '';
        displayedPassengers = 0;
        sentinel.style.display = CONSTANTS.SENTINEL_FLEX_DISPLAY;
        displayNextBatch();
    }, 300);

    const handleColumnChange = () => {
        const column = searchColumn.value;

        if (column === CONSTANTS.GENDER || column === CONSTANTS.STATUS) {
            updateSearchSelectOptions(searchSelect, column, passengers);
            document.getElementById('searchInputContainer').style.display = CONSTANTS.SENTINEL_NONE_DISPLAY;
            document.getElementById('searchSelectContainer').style.display = CONSTANTS.SENTINEL_FLEX_DISPLAY;
        } else {
            document.getElementById('searchInputContainer').style.display = CONSTANTS.SENTINEL_FLEX_DISPLAY;
            document.getElementById('searchSelectContainer').style.display = CONSTANTS.SENTINEL_NONE_DISPLAY;
        }

        handleSearch();
    };

    searchInput.addEventListener('input', handleSearch);
    searchSelect.addEventListener('change', handleSearch);
    searchColumn.addEventListener('change', handleColumnChange);

    loadPassengers().catch((error) => {
        console.error('Ошибка при инициализации приложения:', error);
    });
}
