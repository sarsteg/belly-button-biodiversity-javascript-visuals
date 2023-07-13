//Use the D3 library to read in samples.json from URL
d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then(data => {
    // Extract necessary data from the JSON object
    const samples = data.samples;
    const metadata = data.metadata;

// Create a dropdown menu
const dropdown = d3.select("#selDataset");
const options = dropdown.selectAll("option").data(samples).enter().append("option");
options.text(d => d.id);

// Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual.
// Use sample_values as the values for the bar chart.
// Use otu_ids as the labels for the bar chart.
// Use otu_labels as the hovertext for the chart.
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

// Create a bubble chart that displays each sample
// Use otu_ids for the x values.
// Use sample_values for the y values.
// Use sample_values for the marker size.
// Use otu_ids for the marker colors.
// Use otu_labels for the text values.
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

// Display the sample metadata, i.e., an individual's demographic information.
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

// Display each key-value pair from the metadata JSON object somewhere on the page.

// Update all of the plots any time that a new sample is selected.
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
