# Business Card OCR Parser

Command line tool that parses the results of the optical character recognition (OCR) component in order to extract the name, phone number, and email address from the processed business card image.

## Interface Specification

```javascript
ContactInfo
    String getName() : returns the full name of the individual (eg. John Smith, Susan Malick)
    String getPhoneNumber() : returns the phone number formatted as a sequence of digits
    String getEmailAddress() : returns the email address

BusinessCardParser
    ContactInfo getContactInfo(String document)
```

## Usage

Can be run two different ways. The first way without any arguments will then prompt you to pick one of the three text files that are in the `examples` directory.

```bash
node index.js
```

The second way is the include one of the text file names as an arument like so:

```bash
node index.js example1.txt
```

## Testing

All tests can be run using `yarn` or `npm` like so:

```bash
yarn test
```
or

```bash
npm test
```