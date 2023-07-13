// URL in constant variable
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

//Use the D3 library to read in samples.json from URL
d3.json(url).then(data => {
    // Extract data from the JSON object
    const samples = data.samples;
    const metadata = data.metadata;


// Create a dropdown menu
const dropdown = d3.select("#selDataset");
// console.log(dropdown);
// const options = dropdown.selectAll("option").data(samples).enter().append("option");
// for (key in samples){
//     dropdown.append("h6").text(${key.toUpperCase()}':' ${samples[key]});
//   };
// options.text(d => d.id);

// console.log(samples);
// console.log(data);

let sampleNames = data.names;
    for (let i = 0; i < sampleNames.length; i++){
      dropdown
        .append("option")
        .text(sampleNames[i])
        .property("value", sampleNames[i]);
    };



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
        orientation: "h", 
        marker: {
            color: "rgb(203, 148, 73)"
        }
    };

    const layout = {
        title: {
            text: "<b>Top 10 OTUs</b>",
            font: {color: "black", size: 20}
        },
        xaxis: { title: "Sample Values" },
        yaxis: { title: "OTU IDs" },
        plot_bgcolor: "rgba(0, 0, 0, 0)",
        paper_bgcolor: "rgba(0, 0, 0, 0)"
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
        title: {
            text: "<b>OTU IDs vs Sample Values</b>",
            font: {color: "black", size: 20}
        },
        xaxis: { title: "OTU IDs" },
        yaxis: { title: "Sample Values" },
        plot_bgcolor: "transparent",
        paper_bgcolor: "transparent"
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
        metadataDiv.append("h6").text(`${key}: ${value}`);
    });
    // console.log(metadataDiv);
}

    // Function that builds the gauge chart
    function createGaugeChart(sampleId) {
        const sampleMetadata = metadata.find(item => item.id === parseInt(sampleId));
        const washFrequency = sampleMetadata.wfreq;

        const trace = {
            value: washFrequency,
            domain: { x: [0, 1], y: [0, 1] },
            title: {
                text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week",
                font: { color: "black", size: 20 }
            },
            type: "indicator",
            mode: "gauge+number",
            gauge: {
                axis: { range: [0, 10], tickmode: "linear", tick0: 2, dtick: 2 },
                bar: { color: "black" },
                steps: [
                    { range: [0, 1], color: "#CB9449" },
                    { range: [1, 2], color: "#C18D45" },
                    { range: [2, 3], color: "#B88542" },
                    { range: [3, 4], color: "#AE7E3E" },
                    { range: [4, 5], color: "A4773B" },
                    { range: [5, 6], color: "9B6F37" },
                    { range: [6, 7], color: "916834" },
                    { range: [7, 8], color: "886030" },
                    { range: [8, 9], color: "7E592D" },
                    { range: [9, 10], color: "745229" }
                ]
            }
        };

        const layout = {
            width: 400,
            height: 400,
            margin: { t: 0, b: 0 },
            plot_bgcolor: "transparent",
            paper_bgcolor: "transparent"
        };

        Plotly.newPlot("gauge", [trace], layout);
    }



// Display each key-value pair from the metadata JSON object somewhere on the page.

// Update all of the plots any time that a new sample is selected.
function optionChanged(sampleId) {
    createBarChart(sampleId);
    createBubbleChart(sampleId);
    createGaugeChart(sampleId);
    displayMetadata(sampleId);
}

// Add the event listener to the dropdown menu


dropdown.on("change", function() {
    let dropdownValue = d3.select("#selDataset").node().value;
    // console.log(dropdownValue);
    // const selectedSampleId = d3.event.target.value;
    optionChanged(dropdownValue);
});

// Initial rendering
const initialSampleId = samples[0].id;
createBarChart(initialSampleId);
createBubbleChart(initialSampleId);
displayMetadata(initialSampleId);
});
