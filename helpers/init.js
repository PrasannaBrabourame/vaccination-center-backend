/*********************************************************************************
 *                                                                              *
 * Author       :  Prasanna Brabourame                                          *
 * Version      :  1.0.0                                                        *
 * Date         :  01 Apr 2022                                                  *
 ********************************************************************************/

// Master Configs
require('dotenv').config()
const Parse = require('parse/node')
Parse.serverURL = `${process.env.PARSE_SERVER_URL}${process.env.PARSE_SERVER_PATH}`
Parse.initialize(process.env.PARSE_SERVER_APP_ID, process.env.SDK_JAVASCRIPT_KEY, process.env.SDK_MASTER_KEY)
module.exports = Parse