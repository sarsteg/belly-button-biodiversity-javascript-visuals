///////////////////////////////////////////////////////////////////////
// Advanced Challenge Assignment (Optional)
// The following task is advanced and therefore optional.

// Adapt the Gauge Chart from https://plot.ly/javascript/gauge-charts/ to plot the weekly washing frequency of the individual.
// Modify the example gauge code to account for values ranging from 0-9
// Update the chart whenever a new sample is selected


// Step 1: Read the JSON data
d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then(data => {
    // Extract necessary data from the JSON object
    const samples = data.samples;
    const metadata = data.metadata;

    // Step 2: Create a dropdown menu to display the top 10 OTUs
    const dropdown = d3.select("#selDataset");
    const options = dropdown.selectAll("option").data(samples).enter().append("option");
    options.text(d => d.id);

    // Step 3: Create a horizontal bar chart
    function createBarChart(sampleId) {
        const sampleData = samples.find(sample => sample.id === sampleId);
        const top10Values = sampleData.sample_values.slice(0, 10).reverse();
        const top10Labels = sampleData.otu_ids.slice(0, 10).reverse();
        const top10HoverText = sampleData.otu_labels.slice(0, 10).reverse();

        const trace = {
            x: top10Values,
            y: top10Labels.map(label => `OTU ${label}`),
            text: top10HoverText,
            type: "bar",
            orientation: "h"
        };

        const layout = {
            title: "Top 10 OTUs",
            xaxis: { title: "Sample Values" },
            yaxis: { title: "OTU IDs" }
        };

        Plotly.newPlot("bar", [trace], layout);
    }

    // Step 4: Create a bubble chart
    function createBubbleChart(sampleId) {
        const sampleData = samples.find(sample => sample.id === sampleId);

        const trace = {
            x: sampleData.otu_ids,
            y: sampleData.sample_values,
            text: sampleData.otu_labels,
            mode: "markers",
            marker: {
                size: sampleData.sample_values,
                color: sampleData.otu_ids
            }
        };

        const layout = {
            title: "OTU IDs vs Sample Values",
            xaxis: { title: "OTU IDs" },
            yaxis: { title: "Sample Values" }
        };

        Plotly.newPlot("bubble", [trace], layout);
    }

    // Step 5: Display sample metadata
    function displayMetadata(sampleId) {
        const metadataDiv = d3.select("#sample-metadata");
        const metadataInfo = metadata.find(m => m.id === parseInt(sampleId));

        // Clear previous metadata
        metadataDiv.html("");

        // Display each key-value pair
        Object.entries(metadataInfo).forEach(([key, value]) => {
            metadataDiv.append("p").text(`${key}: ${value}`);
        });
    }

    // Step 6: Update all plots when a new sample is selected
    function optionChanged(sampleId) {
        createBarChart(sampleId);
        createBubbleChart(sampleId);
        displayMetadata(sampleId);
    }

    // Initial rendering
    const initialSampleId = samples[0].id;
    createBarChart(initialSampleId);
    createBubbleChart(initialSampleId);
    displayMetadata(initialSampleId);
});
