// ASSUMPTION: this is not run on a platform with limited resources (i.e. mobile, embedded)
const maleNames = require('datasets-male-first-names-en');
const femaleNames = require('datasets-female-first-names-en');

const BusinessCardParser = {
  // Checks if line given is a person's name
  checkIfName(line) {
    // First check if matches common name patters (i.e. Fname Lname, Fname M. Lname, Fname Mname Lname)
    const re1 = /^\w+\s\w+$/;
    const re2 = /^\w+\s\w\.\s\w+$/;
    const re3 = /^\w+\s\w+\s\w+$/;
    // If matches none of 3 patterns, very unlikely a name
    if (!re1.test(line.trim()) && !re2.test(line.trim()) && !re3.test(line.trim())) {
      return false;
    }
    // Split by space to check first word is in firt name dataset.
    const words = line.trim().split(' ');
    // Just to be safe that line wasn't just a string of whitespace.
    if (words && words.length > 0) {
      // If first letter is no upper case, probably not a name
      if (words[0].charAt(0) !== words[0].charAt(0).toUpperCase()) {
        return false;
      }
      // Check if first word exists in either male or female dataset.
      return (maleNames.includes(words[0]) || femaleNames.includes(words[0]));
    } else {
      // No words/characters (line of whitespace) can't be a name
      return false;
    }
  },
  // Checks if line given is a valid email address
  checkIfEmail(line) {
    // Based on a more practical implementation of RFC 2822 with 99.99% (https://www.regular-expressions.info/email.html)
    const re = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    // Return resulting test
    return re.test(line.toLowerCase());
  },
  //
  checkIfPhone(line) {
    // Remove lines that start with Phone: or Tel: so regex will work (and not work on others like fax)
    const newLine = line.trim().replace(/^Phone\:\s/, '').replace(/^Tel\:\s/, '');
    // Regex that should match most cases (international and with varied formats i.e (###) and ###-###)
    const re = /^[+]?(1\-|1\s|1|\d{3}\-|\d{3}\s|)?((\(\d{3}\))|\d{3})(\-|\s)?(\d{3})(\-|\s)?(\d{4})$/g;
    // Return resulting test
    return re.test(newLine);
  },
  // Formats name for consistency
  formatFullName(words) {
    // Use array so can rejoin with spaces
    let fullName = [];
    // Format each word to title case
    for (let word of words) {
      // Append reformated version to fullName array
      fullName.push(word.charAt(0).toUpperCase() + word.substr(1).toLowerCase());
    }
    // Return fullName as string joined by spaces
    return fullName.join(' ');
  },
  // Removes all non numeric characters from phone number
  formatPhone(phone) {
    // Remove any non-numeric characters from phone
    return phone.replace(/\D/g,'');
  },
  //
  getContactInfo(lines) {
    // Setup card object to make updating and printout easier.
    const card = ContactInfo;
    // Check each line for match and update card object if a match
    for (let i in lines) {
      if (this.checkIfName(lines[i])) {
        // Trim off whitespace from both ends
        card.fullName = this.formatFullName(lines[i].trim().split(' '));
      }
      if (this.checkIfEmail(lines[i])) {
        // Trim off whitespace and lowercase for consistency
        card.email = lines[i].trim().toLowerCase();
      }
      if (this.checkIfPhone(lines[i])) {
        // Clean up phone format
        card.phone = this.formatPhone(lines[i].trim());
      }
    }
    // Return card object with cleansed findings
    return card;
  }
}

const ContactInfo = {
  constructor() {
    this.fullName = "";
    this.phone = "";
    this.email = "";
  },
  getName() {
    return this.fullName;
  },
  getPhoneNumber() {
    return this.phone;
  },
  getEmailAddress() {
    return this.email;
  }
}

module.exports = {
  BusinessCardParser,
  ContactInfo
}