const express = require('express');
var Handlebars = require('handlebars');
const { engine} = require('express-handlebars'); // Import Handlebars along with engine
const bodyParser = require('body-parser');

const app = express();

// Setup Handlebars engine with custom helpers
app.engine('hbs', engine({
    defaultLayout: 'main',
    extname: '.hbs',
    helpers: {
        generateColorGrid: function(size) {
            let html = '<table>';
            for (let row = 0; row < size; row++) {
                html += '<tr>';
                for (let col = 0; col < size; col++) {
                    let color = ((1 << 24) * Math.random() | 0).toString(16);
                    color = color.padStart(6, '0'); // Ensure 6-digit hex code
                    html += `<td style="background-color: #${color}; width: 50px; height: 50px; text-align: center;">`;
                    html += `<span style="color: black;">#${color}</span>`;
                    html += `<br>`;
                    html += `<span style="color: white;">#${color}</span>`;
                    html += `</td>`;
                }
                html += '</tr>';
            }
            html += '</table>';
            return new Handlebars.SafeString(html);
        }        
    }
}));

app.set('view engine', 'hbs');
app.set('views', 'views');

// Middleware to parse request body
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Route for the index page
app.get('/', (req, res) => {
    res.render('index', {
        numbers: [3, 4, 5, 10, 20] // Options for the dropdown
    });
});

// Route to handle form submission
app.post('/submit', (req, res) => {
    const selectedNumber = parseInt(req.body.number, 10); // Get the selected number from the form
    res.render('index', {
        numbers: [3, 4, 5, 10, 20],
        selectedNumber: selectedNumber // Pass the selected number to the template for the grid generation
    });
});

module.exports = app; // Export the app instance for use by the www file
