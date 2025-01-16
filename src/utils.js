import { CONSTANTS } from "./constants.js";

export function createTableRow(passenger) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>
            ${passenger.name || CONSTANTS.N_A}<br>
            ${CONSTANTS.TICKET_LABEL}${passenger.ticket || CONSTANTS.N_A}
        </td>
        <td>${passenger.gender ? passenger.gender.charAt(0).toUpperCase() : CONSTANTS.N_A}</td>
        <td>${passenger.age || CONSTANTS.N_A}</td>
        <td>${passenger.survived ? CONSTANTS.SURVIVED_TEXT : CONSTANTS.NOT_SURVIVED_TEXT}</td>
    `;
    return row;
}

export function filterPassengers(passengers, query, column) {
    const lowerCaseQuery = query.toLowerCase();
    return passengers.filter((passenger) => {
        const displayValues = {
            [CONSTANTS.NAME_TEXT]: `${passenger.name || CONSTANTS.N_A}`.toLowerCase(),
            [CONSTANTS.GENDER_TEXT]: (passenger.gender ? passenger.gender.charAt(0).toUpperCase() : CONSTANTS.N_A).toLowerCase(),
            [CONSTANTS.AGE_LABEL]: `${passenger.age || CONSTANTS.N_A}`.toLowerCase(),
            [CONSTANTS.STATUS_TEXT]: passenger.survived ? CONSTANTS.SURVIVED_TEXT : CONSTANTS.NOT_SURVIVED_TEXT,
        };

        if (column === CONSTANTS.STATUS) {
            return displayValues[CONSTANTS.STATUS_TEXT].toLowerCase() === lowerCaseQuery;
        }

        if (column === CONSTANTS.ALL) {
            return Object.values(displayValues).some((value) => value.includes(lowerCaseQuery));
        } else {
            return displayValues[column].includes(lowerCaseQuery);
        }
    });
}

export function updateSearchSelectOptions(selectElement, column, passengers) {
    const options = column === CONSTANTS.GENDER
        ? [...new Set(passengers.map((p) => p.gender?.charAt(0).toUpperCase() || CONSTANTS.N_A))]
        : [CONSTANTS.SURVIVED_TEXT, CONSTANTS.NOT_SURVIVED_TEXT];

    selectElement.innerHTML = options
        .map((option) => `<option value="${option}">${option}</option>`)
        .join('');
}

export function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}
