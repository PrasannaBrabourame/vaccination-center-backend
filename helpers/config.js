/*********************************************************************************
 *                                                                              *
 * Author       :  Prasanna Brabourame                                          *
 * Version      :  1.0.0                                                        *
 * Date         :  01 Apr 2022                                                  *
 ********************************************************************************/

//Imports
const port = process.env.PARSE_SERVER_PORT || 1550
const baseURL = process.env.PARSE_SERVER_PUBLIC_URL || process.env.PARSE_SERVER_URL
const serverURL = `${process.env.PARSE_SERVER_URL}${process.env.PARSE_SERVER_PATH}`
const publicServerURL = `${baseURL}${process.env.PARSE_SERVER_PATH}`
const appName = process.env.PARSE_SERVER_APP_NAME 

module.exports = {
    port,
    baseURL,
    serverURL,
    publicServerURL,
    appName,
}
