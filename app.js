/*********************************************************************************
 *                                                                              *
 * Author       :  Prasanna Brabourame                                          *
 * Version      :  1.0.0                                                        *
 * Date         :  01 Apr 2022                                                 *
 ********************************************************************************/

require('dotenv').config()
const express = require('express')
const path = require('path')
const { default: ParseServer } = require('parse-server')
const ParseDashboard = require('parse-dashboard')
const { port, serverURL, publicServerURL, appName } = require('./helpers/config')

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static('public', { maxAge: 31557600000 }))

const config = {
    appId: process.env.PARSE_SERVER_APP_ID,
    appName,
    databaseURI: process.env.PARSE_SERVER_DATABASE_URI,
    cloud: process.env.CLOUD_CODE_MAIN || path.join(__dirname, '/cloud/main.js'),
    masterKey: process.env.SDK_MASTER_KEY,
    restAPIKey: process.env.SDK_REST_API_KEY,
    javascriptKey: process.env.SDK_JAVASCRIPT_KEY,
    serverURL,
    publicServerURL,
    allowCustomObjectId: true,
    expireInactiveSessions: true,
    revokeSessionOnPasswordReset: true,
    sessionLength: 2629746,
    verbose: process.env.PARSE_SERVER_VERBOSE ? process.env.PARSE_SERVER_VERBOSE : false,
    enableAnonymousUsers: false,
    allowClientClassCreation: false,
    dashboardOptions: {
        cloudFileView: process.env.DASHBOARD_CLOUD_FILE_VIEW || false
    },
}

const parse = new ParseServer(config)
app.use(process.env.PARSE_SERVER_PATH, parse.app)
const dashboard = new ParseDashboard(
    {
        customBrandIcon: 'icon-bw.jpg',
        customBrandTitle: 'SG VAC ADMIN',
        customBrandColorPrimary: '#853e3b',
        apps: [
            {
                appId: process.env.PARSE_SERVER_APP_ID,
                appName,
                production: 'Test',
                masterKey: process.env.SDK_MASTER_KEY,
                serverURL
            }
        ]
    },
    { allowInsecureHTTP: true }
)
app.use('/dashboard', dashboard)

const httpServer = require('http').createServer(app)
httpServer.listen(port, function () {
    console.log('Homeage Server running on port ' + port + '.')
})

module.exports = { app, config }