anychart.onDocumentReady(function() {

    // set the data
    var data = [
        {x: "Booster", value: 31.2},
        {x: "2nd Dose", value: 32.9},
        {x: "1st Dose", value: 11.5},
        {x: "No Vaccination", value: 24.4},
    ];

    // create the chart
    var chart = anychart.pie();

    // set the chart title
    chart.title("Vaccination Status");

    // add the data
    chart.data(data);

    // display the chart in the container
    chart.container('container');
    chart.draw();

    });