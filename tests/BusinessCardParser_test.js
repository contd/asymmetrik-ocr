const os = require('os');
const expect = require('chai').expect;
const { BusinessCardParser } = require('../BusinessCardParser');

// Test input 1 split by newline since this is done when read from console
const inputMultiline1 = `ASYMMETRIK LTD
Mike Smith
Senior Software Engineer
(410)555-1234
msmith@asymmetrik.com
`.split(os.EOL);

// Test output 1 expected (parsed to JSON object for deep equal compare)
const outputMultiline1 = JSON.parse('{"fullName":"Mike Smith","phone":"4105551234","email":"msmith@asymmetrik.com"}');

// Test input 2
const inputMultiline2 = `Foobar Technologies
Analytic Developer
Lisa Haung
1234 Sentry Road
Columbia, MD 12345
Phone: 410-555-1234
Fax: 410-555-4321
lisa.haung@foobartech.com`.split(os.EOL);

// Test output 2
const outputMultiline2 = JSON.parse('{"fullName":"Lisa Haung","phone":"4105551234","email":"lisa.haung@foobartech.com"}')

// Test input 3
const inputMultiline3 = `Arthur Wilson
Software Engineer
Decision & Security Technologies
ABC Technologies
123 North 11th Street
Suite 229
Arlington, VA 22209
Tel: +1 (703) 555-1259
Fax: +1 (703) 555-1200
awilson@abctech.com`.split(os.EOL);

// Test output 3
const outputMultiline3 = JSON.parse('{"fullName":"Arthur Wilson","phone":"17035551259","email":"awilson@abctech.com"}');

// Begin individual unit tests per function

describe("Testing BusinessCardParser.checkIfName", function() {
  // Test for positive correct
  it("Should find 'Mike Smith' and return true", function() {
    expect(BusinessCardParser.checkIfName("Mike Smith")).to.equal(true);
  });
  // Test for negative correct because not first name
  it("Should not find 'Foobar Technologies' and return false", function() {
    expect(BusinessCardParser.checkIfName("Foobar Technologies")).to.equal(false);
  });
  // Test for negative correct because doesn't match pattern
  it("Should not determine Smith is a name since it is the company name and does not match name pattern", function() {
    expect(BusinessCardParser.checkIfName("Smith")).to.equal(false);
  })
});

describe("Testing BusinessCardParser.checkIfPhone", function() {
  // Test for positive correct
  it("Should find '(410)555-1234' and return true", function() {
    expect(BusinessCardParser.checkIfPhone("(410)555-1234")).to.equal(true);
  });
  // Test for positive correct
  it("Should find 'Tel: +1 (703) 555-1259' and return true", function() {
    expect(BusinessCardParser.checkIfPhone("Tel: +1 (703) 555-1259")).to.equal(true);
  });
  // Test for negative correct because not phone but fax
  it("Should not find 'Fax: 410-555-4321' and return false", function() {
    expect(BusinessCardParser.checkIfPhone("Fax: 410-555-4321")).to.equal(false);
  });
});

describe("Testing BusinessCardParser.checkIfEmail", function() {
  // Test for positive correct
  it("Should find 'jason@kumpf.io' and return true", function() {
    expect(BusinessCardParser.checkIfEmail("jason@kumpf.io")).to.equal(true);
  });
  // Test for negative correct because not valid email
  it("Should not find 'someguy@someplace' and return false", function() {
    expect(BusinessCardParser.checkIfEmail("someguy@someplace")).to.equal(false);
  });
});

describe("Testing BusinessCardParser.formatPhone", function() {
  // Test for correct format for domestic phone format
  it("Should format 'Phone: 410-555-1234'", function() {
    expect(BusinessCardParser.formatPhone("Phone: 410-555-1234")).to.equal("4105551234");
  });
  // Test for correct format for international phone format
  it("Should format 'Tel: +1 (703) 555-1259'", function() {
    expect(BusinessCardParser.formatPhone("Tel: +1 (703) 555-1259")).to.equal("17035551259");
  });
});

describe("Testing BusinessCardParser.formatFullName", function() {
  // Test for correct format for full name pattern 1
  it("Should format 'Jason Kumpf'", function() {
    expect(BusinessCardParser.formatFullName("Jason Kumpf".split(' '))).to.equal("Jason Kumpf");
  });
  // Test for correct format for full name pattern 2
  it("Should format 'Mike M. Smith'", function() {
    expect(BusinessCardParser.formatFullName("Mike M. Smith".split(' '))).to.equal("Mike M. Smith");
  });
  // Test for correct format for full name pattern 3
  it("Should format 'Jason Patrick Jones'", function() {
    expect(BusinessCardParser.formatFullName("Jason Patrick Jones".split(' '))).to.equal("Jason Patrick Jones");
  });
});

// Unit test the getContactInfo which also tests integration of other functions
describe("Testing BusinessCardParser.getContactInfo", function() {
  it("Should find all three given the test input 1", function() {
    expect(BusinessCardParser.getContactInfo(inputMultiline1)).to.include(outputMultiline1);
  });
  it("Should find all three given the test input 2", function() {
    expect(BusinessCardParser.getContactInfo(inputMultiline2)).to.include(outputMultiline2);
  });
  it("Should find all three given the test input 3", function() {
    expect(BusinessCardParser.getContactInfo(inputMultiline3)).to.include(outputMultiline3);
  });
});
