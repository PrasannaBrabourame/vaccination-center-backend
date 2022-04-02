# vaccination-center-backend
Vaccination Center Backend

## Coding guidelines

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](http://standardjs.com)

## Requirements

  - Node >= 14.17.2
  - MongoDB - URL in env

## Installation

Make sure that Node is installed Properly
1. Installing the dependency
```sh
$ npm install
```
2. Create an .env file on the root folder similar to .env-example file as example
3. Add the mongoDB url on the "PARSE_SERVER_DATABASE_URI" as example given below
```
PARSE_SERVER_DATABASE_URI=mongodb://0.0.0.0:27017/hometest
```
2. Installling Necessary Updates 
```sh
$ node install/import-data.js 
```
3. To Run the Project
```sh
$ node app.js
```

## Dashboard Details
* [Dashboard URL](http://localhost:1550/dashboard/apps/HOMEAGE/)

Which will Act as a admin panel to manage
1. Vaccination Centers (Add/Edit/Update/Delete)
2. Daily Availability of Vaccination Slots (Add/Edit/Update/Delete)

## Conditions
1. Considering Each Registration Time for Vaccination is 10 minutes based on the for an hour we have splited the time into 6 each 10 mins.

## Package Dependencies

* axios                 - Version ^0.26.1 
* dotenv                - Version ^16.0.0 
* express               - Version ^4.17.3 
* moment                - Version ^2.29.1 
* moment-timezone       - Version ^0.5.34 
* parse-dashboard       - Version ^4.0.1 
* parse-server          - Version ^5.2.0 