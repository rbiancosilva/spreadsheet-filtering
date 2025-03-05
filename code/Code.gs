// Sets default values for each column type
const columnsMap = {
    "productType": 4, // E in the original spreadsheet
    "price": 8, // I in the original spreadsheet
    "color": 13, // N in the original spreadsheet
    "size": 14 // O in the original spreadsheet
}


// Loads HTML page
function doGet() {
    return HtmlService.createHtmlOutputFromFile('index');
}


// Function triggered by filter button
function filterValues(formValues) {

    // Gets current sheet and its values
    const activeSheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const currentData = activeSheet.getDataRange().getValues();

    // Gets the filtered data
    const filteredData = getFilteredData(currentData, formValues);

    // Creates a new spreadsheet with filtered data
    const filteredSpreadsheet = createFilteredSpreadsheet(filteredData);

    let message = "Spreadsheet created"

    const mailReceiver = formValues.receiverEmail;

    // Checks if the e-mail option was filled and if it is a valid e-mail
    if (mailReceiver) {
        sendSpreadsheetMail(filteredSpreadsheet, mailReceiver, formValues)
        message = message.concat(` and Email sent to ${mailReceiver}.`)
    }

    // Returns an object with the message and link to be displayed
    return {
        filteredSpreadsheetUrl: filteredSpreadsheet.getUrl(),
        message: message
    } 
}


// Sends e-mail with the spreadsheet link [Optional]
function sendSpreadsheetMail(
    filteredSpreadsheet, 
    mailReceiver,
    formValues
) {
    const subject = filteredSpreadsheet.getName();

    // Generates e-mail's body
    const filtersEmailString = getFilterListString(formValues)
    const body = `Hello! \n \nHere is the link to access your filtered spreadsheet: ${filteredSpreadsheet.getUrl()}\n \nChoosen filters: ${filtersEmailString}`;
    MailApp.sendEmail(mailReceiver, subject, body);
}


// Generates a string with the filled filters to add in the e-mail body
function getFilterListString(formValues) {
    let filterListString = "";

    if (formValues.minPrice) {
        filterListString += `\nMin. Price: ${formValues.minPrice}`;
    } 

    if (formValues.maxPrice) {
        filterListString += `\nMax. Price: ${formValues.maxPrice}`;
    }

    if (formValues.size) {
        filterListString += `\nSize: ${formValues.size}`;
    }

    if (formValues.color) {
        filterListString += `\nColor: ${formValues.color}`;
    }

    if (formValues.productType) {
        filterListString += `\nProduct Type: ${formValues.productType}`;
    }

    return filterListString;
}


// Filters current sheet columns using the filters map
function getFilteredData(currentData, formValues) {
    // Extract headers (first row) from the original data
    const headers = currentData[0];

    // Filter the remaining rows (excluding the header row)
    const filteredRows = currentData.slice(1).filter(row => {
        const minPrice = formValues.minPrice;
        const maxPrice = formValues.maxPrice;
        const color = formValues.color;
        const size = formValues.size;
        const productType = formValues.productType;

        // Checks if any column fits the filter
        return (
            (minPrice ? parseFloat(row[columnsMap["price"]]) >= parseFloat(minPrice) : true) &&
            (maxPrice ? parseFloat(row[columnsMap["price"]]) <= parseFloat(maxPrice) : true) &&
            (color ? row[columnsMap["color"]] == color : true) &&
            (size ? row[columnsMap["size"]] == size : true) &&
            (productType ? row[columnsMap["productType"]] == productType : true)
        );
    });

    return [headers, ...filteredRows];
}


// Creates a new spreadsheet using the filtered data and permissions
function createFilteredSpreadsheet(filteredData) {
    // Gets formatted datetime for the spreadsheet's title
    const currentDateTime = new Date();
    const formattedDateTime = currentDateTime.toLocaleString();

    // Creates spreadsheet with name 'Filtered Spreadsheet - DD/MM/YYYY, hh:mm:ss'
    const filteredSpreadsheet = SpreadsheetApp.create(`Filtered Spreadsheet - ${formattedDateTime}`);
    const filteredSheet = filteredSpreadsheet.getActiveSheet();

    // Set the values in the new spreadsheet, including headers
    filteredSheet.getRange(1, 1, filteredData.length, filteredData[0].length).setValues(filteredData);

    // Set permissions on the generated spreadsheet  
    const googleFile = DriveApp.getFileById(filteredSpreadsheet.getId());
    googleFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    return filteredSpreadsheet;
}


// Creates an object with the unique values of each column, used to fill the select options in the html
function getOptions() {
    // Gets current spreadsheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    let uniqueValues = {};

    // Creates an array with the unique values for each column
    Object.keys(columnsMap).forEach(key => {
        if (key != "price") {
            const values = sheet.getRange(2, columnsMap[key] + 1, sheet.getLastRow()).getValues();
            const flattenedValues = values.flat().filter(String);
            uniqueValues[key] = ["", ...new Set(flattenedValues)];
        }
    });
    
    // Returns filled object
    return uniqueValues;
}