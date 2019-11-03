function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  output = d3.select("#sample-metadata")
  output.html("")
  url = "/metadata/" + sample

  d3.json(url).then(function(d) {
    Object.entries(d).forEach(([key, value]) => {
      var li = output.append("div").text(`${key}: ${value}`);
    })
  });
  
  
  // Use `d3.json` to fetch the metadata for a sample

    // Use d3 to select the panel with id of `#sample-metadata`

    // Use `.html("") to clear any existing metadata

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
    // // buildGauge(data.WFREQ);

    gaugeoutput = d3.select("gauge")
    gaugeoutput.html("")
    vargaugeval = 0
    d3.json(url).then(function(d) {
      Object.entries(d).forEach(([key, value]) => {
        if (key == "WFREQ") {
          var gaugeval = value
          // console.log(gaugeval)
          var data = [{
          value: gaugeval,
          type: "indicator",
          mode: "gauge+number"
          }];
          var layout = {width: 400, height:400}
          Plotly.newPlot("gauge", data, layout)
        };
      });
    });


  }



function buildCharts(sample) {
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  url = "/samples/" + sample
  d3.json(url).then(function(d) {
    data = [{
      labels: d["otu_ids"].slice(0, 10),
      values: d["sample_values"].slice(0, 10),
      type: "pie"
    }];
    layout = {
      height: 400,
      width: 500
    };
    Plotly.newPlot("pie", data, layout)
    // @TODO: Build a Bubble Chart using the sample data
    
    sizeadj = []
    d["sample_values"].forEach(function(x) {
      sizeadj.push(parseInt(x)/2)
    })
    data = [{
      x: d["otu_ids"],
      y: d["sample_values"],
      mode: 'markers',
      marker: {
        size: sizeadj,
        color: d["otu_ids"]
      },
      type: 'scatter',
      text: d["otu_labels"]
    }];
    layout = {
      height: 400,
      width: 1000
      
    };
    Plotly.newPlot("bubble", data, layout)



    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
  });



}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();

