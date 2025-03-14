# Product Spreadsheet Filtering and Reporting

This Google Apps Script project is designed to filter data in a Products Spreadsheet based on user-defined criteria. It generates a new spreadsheet with the filtered results and, optionally, sends an email to a specified address containing the link to the filtered spreadsheet and the chosen filters. The project's functionalities include:
 - Dynamic data filtering
 - New spreadsheet generation
 - Email reporting 
 - Integration with Google Sheets

You can try out the deployed version using [this link](https://script.google.com/macros/s/AKfycbz1udj5gtmMFt8ToKRgGWON5VI5sAxWnOBYdF0YkAkDzO1FGIgD77Me-cflziDB1dXiyQ/exec). 

To make changes and deploy a new version of the project, you can follow the step-by-step instructions in the project setup section. 

[Project overview](#project-overview)<br>
[Project setup](#project-setup)<br>
[Demonstration video](#demonstration-video)<br>

## Project overview

### Load layout diagram

```mermaid
sequenceDiagram
    actor us as User
    participant fe as Front-End
    participant gs as Google Script
    
    gs->>fe: Loads HTML
    fe->>gs: Gets options for color, size and type
    gs-->>fe: Returns options list 
    fe->>fe: Fills options
    fe->>us: Displays filled layout
```

### Generate spreadsheet and send e-mail diagram

```mermaid 
sequenceDiagram 
    actor us as User
    participant fe as Front-End
    participant gs as Google Script

    us->>fe: Clicks 'Filter' button
    fe->>fe: Validates fields
    fe->>gs: Calls filterValues function<br>sending fields
    gs->>gs: Generates a new spreadsheet<br>with received values
    gs-->>us: Sends e-mail with filtered spreadsheet
    gs-->>fe: Returns filtered spreadsheet URL
    fe-->>us: Displays filtered spreadsheet URL
```

## Project setup

### Environment variables
The object columnsMap is used to set the column for each category to be filtered. The value for each key is, respectively, the index of that column in the spreadsheet.

```
>>/code/Code.gs

const columnsMap = {
    "productType": 4, // 'E' in spreadsheet
    "price": 8, // 'I' in spreadsheet
    "color": 13, // 'N' in spreadsheet
    "size": 14 // 'O' in spreadsheet
}
```
Example: The first column from left to right (labeled 'A') has the value 0.

### Style

Both bootstrap and internal CSS were used to style the project. To use bootstrap, the style and script links were added:
```
>>/code/index.html

<head>
    ...
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    ...
</head>
<body>
    ...
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    ...
</body>
```

### Deployment 

This project was designed to be applied to a copy of the original products spreadsheet.

To deploy it using Google Apps Scripts, you can follow the bellow step-by-step:
1. Open the [project's Google Spreadsheet](https://docs.google.com/spreadsheets/d/1y7kVZzz3KfwrkL0M9ZfEwbH5fRKFgl5zZcphqIzsiBE/edit?usp=sharing).
2. Go to 'File' > 'Make a Copy'.
3. Enter a name for the new copy.
4. On the new copy and go to 'Extensions' > 'Apps Script'.
5. Go to 'Deploy' > 'New Deployment'.
6. Enter a name for the deployment.
7. Click 'Deploy'
8. Access it using the generated URL.

Run the script once to authorize it to access your Google Sheets, Gmail, and other required services.

## Demonstration video
[![Watch the demonstration video](https://i9.ytimg.com/vi/ahmQrfwAvYc/mqdefault.jpg?v=67c8ca52&sqp=COCSo74G&rs=AOn4CLAHYuNUTiWOnV8xxragDxMIm6IHmg)](https://youtu.be/ahmQrfwAvYc)
