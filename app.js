// app.js
document.addEventListener('DOMContentLoaded', function () {
    const cmdbHealthTrigger = document.getElementById('cmdbHealthTrigger');
    const cmdbScorecardTrigger = document.getElementById('cmdbScorecardTrigger');
    const chartContainer = document.querySelector('.chart-container');
    const scorecardContent = document.querySelector('.cmdb-scorecard-content');
    const pieChartCanvas = document.getElementById('pieChart');
    const tableContainer = document.getElementById('scorecardTableContainer');

    // Sample data for the graphs
    const graph1Data = {
        labels: ['January', 'February', 'March'],
        datasets: [{
            label: 'Graph 1',
            data: [20, 40, 60],
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            fill: false,
        }],
    };

    const graph2Data = {
        labels: ['A', 'B', 'C'],
        datasets: [{
            label: 'Graph 2',
            data: [10, 30, 50],
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
            fill: false,
        }],
    };

    // Chart configuration
    const chartConfig = {
        type: 'line',
        options: {
            scales: {
                x: [{
                    type: 'linear', // Set the type to linear for a numeric x-axis
                    position: 'bottom',
                    ticks: {
                        callback: function (value, index, values) {
                            return value + '%'; // Format the tick labels as percentages
                        }
                    }
                }],
                y: [{
                    ticks: {
                        beginAtZero: true,
                    }
                }],
            },
        },
    };

    // Sample data for the pie chart and table
    const pieChartData = {
        labels: ['Category A', 'Category B'],
        datasets: [{
            data: [30, 70],
            backgroundColor: ['rgba(255, 99, 132, 1)', 'rgba(75, 192, 192, 1)', 'rgba(255, 205, 86, 1)'],
        }],
    };

    const tableData = [
        { category: 'Category A', value: 30 },
        { category: 'Category B', value: 40 },
    ];

    cmdbHealthTrigger.addEventListener('click', function () {
        // Handle CMDB Health trigger click event
        console.log('CMDB Health Trigger Clicked');

        // Hide the scorecard content
        scorecardContent.style.display = 'none';

        // Remove any existing charts and create Graph 1 and Graph 2
        chartContainer.innerHTML = '';
        createGraph(graph1Data, chartContainer);
        createGraph(graph2Data, chartContainer);
    });

    cmdbScorecardTrigger.addEventListener('click', function () {
        // Handle CMDB Scorecard trigger click event
        console.log('CMDB Scorecard Trigger Clicked');

        fetchDataFromServiceNow();

        // Hide the chart container
        chartContainer.style.display = 'none';

        // Show the scorecard content and update the pie chart and table
        scorecardContent.style.display = 'flex';
        updatePieChart(pieChartData);
        updateTable(tableData);
    });

    function createGraph(graphData, container) {
        const graphCanvas = document.createElement('canvas');
        const graphCtx = graphCanvas.getContext('2d');
        const graph = new Chart(graphCtx, {
            ...chartConfig,
            data: graphData,
        });

        // Append the chart to the container
        container.appendChild(graphCanvas);
    }

    function updatePieChart(data) {
        const pieChartCtx = pieChartCanvas.getContext('2d');
        new Chart(pieChartCtx, {
            type: 'pie',
            data: data,
        });
    }

    function updateTable(data) {
        // Clear previous content
        tableContainer.innerHTML = '';

        // Create a table element
        const table = document.createElement('table');
        table.border = '1';

        // Create header row
        const headerRow = document.createElement('tr');
        const columnHeaders = ['Column 1', 'Column 2', 'Column 3', 'Column 4'];
        columnHeaders.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);

        // Create data rows
        data.forEach(item => {
            const row = document.createElement('tr');
            const columnNames = ['column1', 'column2', 'column3', 'column4'];
            columnNames.forEach(column => {
                const td = document.createElement('td');
                td.textContent = item[column];
                row.appendChild(td);
            });
            table.appendChild(row);
        });

        // Append the table to the container
        tableContainer.appendChild(table);
    }

    function fetchDataFromServiceNow() {
        // Replace 'your_username', 'your_password', and 'your-servicenow-instance' with your actual ServiceNow credentials and instance URL
        const apiUrl = 'http://localhost:5500/api?sysparm_display_value=true&sysparm_exclude_reference_link=true&sysparm_fields=u_ci_name%2Cu_ci_name.install_status%2Cu_ci_name.sys_class_name%2Cu_compliance_filter%2Cu_aging%2Cu_active&u_active=true';
        const username = 'itdashboard';
        const password = 'Stratacent@1';

        fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + btoa(username + ':' + password),
            },
        })
        .then(response => response.json())
        .then(data => {
            // Process the ServiceNow data and update the pie chart and table
            // For demonstration, using the existing pieChartData and tableData
            updatePieChart(pieChartData);
            updateTable(tableData);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    function updateTable(data) {
        // Clear previous content
        tableContainer.innerHTML = '';

        // Create a table element
        const table = document.createElement('table');
        table.border = '1';

        // Create header row
        const headerRow = document.createElement('tr');
        Object.keys(data[0]).forEach(key => {
            const th = document.createElement('th');
            th.textContent = key.charAt(0).toUpperCase() + key.slice(1);
            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);

        // Create data rows
        data.forEach(item => {
            const row = document.createElement('tr');
            Object.values(item).forEach(value => {
                const td = document.createElement('td');
                // Check if the value is an object (nested property) and format accordingly
                td.textContent = typeof value === 'object' ? formatNestedValue(value) : value;
                row.appendChild(td);
            });
            table.appendChild(row);
        });

        // Append the table to the container
        tableContainer.appendChild(table);
    }

    function formatNestedValue(obj) {
        // Format nested values as a string (you can customize this based on your needs)
        return Object.values(obj).join(' ');
    }
});
