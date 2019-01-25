const os = require('os');
const fs = require('fs');
const path = require('path');
const inq = require('inquirer');
const { BusinessCardParser } = require('./BusinessCardParser');

// Print results to console per spec.
const printOutput = (card) => {
  // Utilizes the ContactInfo methods per interface specification
  console.log(`Name: ${card.getName()}`);
  console.log(`Phone: ${card.getPhoneNumber()}`);
  console.log(`Email: ${card.getEmailAddress()}`);
};

// Checks given filename exists and then proceeds to parse contents
const parseFileText = (filename) => {
  // Make sure file exists
  console.log(filename);
  if (fs.existsSync(path.join(__dirname, 'examples', filename))) {
    // ASSUPTION: OCR system would dump results to text file, hard coded path for convenience
    const inputText = fs.readFileSync(path.join(__dirname, 'examples', filename), 'utf8');
    // Parse input text
    const card = BusinessCardParser.getContactInfo(inputText.split(os.EOL));
    // Print resulting card to console
    printOutput(card);
  } else {
    console.error(`ERROR: File does not exist!`);
  }
}

// If third argument given, assumed its a file name.
if (process.argv.length > 2) {
  const filename = process.argv[2];
  // Ready to parse
  parseFileText(filename);
} else {
  // If no arguments are passed then use inquirer to type in a file name interactively.
  inq
    .prompt([
      {
        type: 'list',
        name: 'filename',
        message: "Enter the file name containing the scanned text of the business card and hit enter.",
        choices: [
          'example1.txt',
          'example2.txt',
          'example3.txt'
        ]
      }
    ])
    .then(ans => {
      // Ready to parse
      parseFileText(ans.filename);
    });
}
