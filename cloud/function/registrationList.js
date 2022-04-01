/*********************************************************************************
 *                                                                              *
 * Author       :  Prasanna Brabourame                                          *
 * Version      :  1.0.0                                                        *
 * Date         :  01 Apr 2022                                                  *
 ********************************************************************************/

 /**
  * Cloud Code used to fetch the Vaccination Registered User List
  * @async
  * @function registrationList
  * @returns {Object} Status
  */
 Parse.Cloud.define('registrationList', async () => {
     try {
         const pAll = require('../../helpers/p').p(undefined, true)
         const registrationList = (await pAll.all('VaccineReservation',{},'vaccineCenter','timeSlots','minSlots')).map(item => item.toJSON())
         return {
             status: true, data: {
                 response: registrationList
             }
         }
     } catch (err) {
         return {
             status: false, data: {
                 code: '1001'
             }
         }
     }
 }, {
     fields: {
 
     },
     requireUser: false
 })