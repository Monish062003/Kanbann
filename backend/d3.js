const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const fs = require('fs');
const svg2img = require('svg2img');
const { JSDOM } = require('jsdom');
const d3 = require('d3');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    const data = [30, 50, 90, 120, 150];

    // Create a new JSDOM instance to provide a fake DOM environment
    const jsdom = new JSDOM();
    const { document } = jsdom.window;
    global.document = document;

    // Create a new SVG element using D3.js
    const svg = d3.select(document.createElementNS('http://www.w3.org/2000/svg', 'svg'))
        .attr("width", 400)
        .attr("height", 200);

    svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", (d, i) => i * 80)
        .attr("y", d => 200 - d)
        .attr("width", 50)
        .attr("height", d => d)
        .attr("fill", "steelblue");

    // Get the SVG string
    const svgString = svg.node().outerHTML;

    // Convert SVG to PNG
    svg2img(svgString, function(error, buffer) {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error converting SVG to PNG' });
        }

        // Convert the binary image data to a Base64-encoded string
        const base64Image = buffer.toString('base64');

        // Send the Base64-encoded image data as part of a JSON response
        res.json({ image: base64Image });
    });
});

app.get('/check',(req,res)=>{
    res.send("Hello");
})

const PORT = 80;
app.listen(PORT, () => {
    console.log("Listen to: http://localhost:80");
});
