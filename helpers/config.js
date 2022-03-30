/*********************************************************************************
 *                                                                              *
 * Author       :  Prasanna Brabourame                                          *
 * Version      :  1.0.0                                                        *
 * Date         :  28 Mar 2021                                                  *
 ********************************************************************************/

const fs = require('fs')
const port = process.env.PARSE_SERVER_PORT || 1550
const dashboardPort = process.env.DASHBOARD_PORT || 5050
const mode = process.env.PARSE_SERVER_MODE ? process.env.PARSE_SERVER_MODE.toLowerCase() : 'dev'
const baseURL = process.env.PARSE_SERVER_PUBLIC_URL || process.env.PARSE_SERVER_URL
const serverURL = `${process.env.PARSE_SERVER_URL}${process.env.PARSE_SERVER_PATH}`
const publicServerURL = `${baseURL}${process.env.PARSE_SERVER_PATH}`
const appName = process.env.PARSE_SERVER_APP_NAME + '-' + mode.toUpperCase()
const dashboardUrl = process.env.DASHBOARD_URL || 'http://localhost:5050'



module.exports = {
    port,
    mode,
    baseURL,
    serverURL,
    publicServerURL,
    appName,
    dashboardUrl,
    dashboardPort
}
