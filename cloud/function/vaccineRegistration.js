/*********************************************************************************
 *                                                                              *
 * Author       :  Prasanna Brabourame                                          *
 * Version      :  1.0.0                                                        *
 * Date         :  01 Apr 2022                                                  *
 ********************************************************************************/

//Imports
const { combinedItems,dateSort } = require('../../helpers/util');

/**
 * Cloud Code used to register the user for vaccination
 * @async
 * @function registerVaccination
 * @param {String} vaccineCenter Vaccination Center
 * @param {String} vaccineDate Vaccination Date
 * @param {String} vaccineMin Vaccination Minutues
 * @param {String} vaccineTime Vaccination Hours
 * @param {String} name Registered User Name
 * @param {String} nric Registered User NRIC Number
 * @returns {Object} Status
 */
Parse.Cloud.define('registerVaccination', async ({ params }) => {
    try {
        const { vaccineCenter, vaccineDate, vaccineMin, vaccineTime, name, nric } = params
        const pAll = require('../../helpers/p').p(undefined, true)
        const isAvailable = await pAll.first('VaccineReservation', { nric }, 'VaccinationCenter', 'MinutesSlots')
        if (isAvailable) {
            return {
                status: false, data: {
                    code: '1004'
                }
            }
        }
        const sameTime = await pAll.first('VaccineReservation', { timeSlots: pAll.pointer('TimeSlots', `${vaccineTime}`), minSlots: pAll.pointer('MinutesSlots', `${vaccineMin}`), date: `${vaccineDate}`, vaccineCenter: pAll.pointer('VaccinationCenter', `${vaccineCenter}`) }, 'VaccinationCenter', 'MinutesSlots')
        if (sameTime) {
            return {
                status: false, data: {
                    code: '1005'
                }
            }
        }
        const register = await pAll.insert('VaccineReservation', { vaccineCenter: pAll.pointer('VaccinationCenter', `${vaccineCenter}`), timeSlots: pAll.pointer('TimeSlots', `${vaccineTime}`), minSlots: pAll.pointer('MinutesSlots', `${vaccineMin}`), date: `${vaccineDate}`, name, nric })
        const currentSlot = (await pAll.first('VaccineSlots', { date: `${vaccineDate}`, center: pAll.pointer('VaccinationCenter', `${vaccineCenter}`) })).toJSON()
        const remainingSlots = await pAll.upsert('VaccineSlots', { date: `${vaccineDate}`, center: pAll.pointer('VaccinationCenter', `${vaccineCenter}`) }, { remainingSlots: Number(currentSlot.remainingSlots - 1) })
        return {
            status: true, data: {
                response: register
            }
        }
    } catch (err) {
        return {
            status: false, data: {
                code: '1006'
            }
        }
    }
}, {
    fields: {

    },
    requireUser: false
})

/**
 * Cloud Code used to register the update the registered user for vaccination
 * @async
 * @function updateVaccinationDetails
 * @param {String} vaccineCenter Vaccination Center
 * @param {String} vaccineDate Vaccination Date
 * @param {String} vaccineMin Vaccination Minutues
 * @param {String} vaccineTime Vaccination Hours
 * @param {String} name Registered User Name
 * @param {String} nric Registered User NRIC Number
 * @returns {Object} Status
 */
Parse.Cloud.define('updateVaccinationDetails', async ({ params }) => {
    try {
        const { vaccineCenter, vaccineDate, vaccineMin, vaccineTime, name, nric } = params
        const pAll = require('../../helpers/p').p(undefined, true)
        const isAvailable = await pAll.first('VaccineReservation', { nric }, 'VaccinationCenter', 'MinutesSlots')
        if (isAvailable) {
            return {
                status: false, data: {
                    code: '1007'
                }
            }
        }
        const sameTime = await pAll.first('VaccineReservation', { timeSlots: pAll.pointer('TimeSlots', `${vaccineTime}`), minSlots: pAll.pointer('MinutesSlots', `${vaccineMin}`), date: `${vaccineDate}`, vaccineCenter: pAll.pointer('VaccinationCenter', `${vaccineCenter}`) }, 'VaccinationCenter', 'MinutesSlots')
        if (sameTime) {
            return {
                status: false, data: {
                    code: '1008'
                }
            }
        }
        const register = await pAll.upsert('VaccineReservation', { objectId: nric }, { vaccineCenter: pAll.pointer('VaccinationCenter', `${vaccineCenter}`), timeSlots: pAll.pointer('TimeSlots', `${vaccineTime}`), minSlots: pAll.pointer('MinutesSlots', `${vaccineMin}`), date: `${vaccineDate}`, name, nric })
        const currentSlot = (await pAll.first('VaccineSlots', { date: `${vaccineDate}`, center: pAll.pointer('VaccinationCenter', `${vaccineCenter}`) })).toJSON()
        const remainingSlots = await pAll.upsert('VaccineSlots', { date: `${vaccineDate}`, center: pAll.pointer('VaccinationCenter', `${vaccineCenter}`) }, { remainingSlots: Number(currentSlot.remainingSlots - 1) })
        return {
            status: true, data: {
                response: register
            }
        }
    } catch (err) {
        return {
            status: false, data: {
                code: '1009'
            }
        }
    }
}, {
    fields: {

    },
    requireUser: false
})

/**
 * Cloud Code used to delete the registration
 * @async
 * @function deleteRegistration
 * @param {String} id Registered User Id
 * @returns {Object} Status
 */
Parse.Cloud.define('deleteRegistration', async ({ params }) => {
    try {
        const { id } = params
        const pAll = require('../../helpers/p').p(undefined, true)
        const deleted = await pAll.delete('VaccineReservation', id)
        const registrationList = (await pAll.all('VaccineReservation', {}, 'vaccineCenter', 'timeSlots', 'minSlots')).map(item => item.toJSON())
        return {
            status: true, data: {
                message: "Successfully Deleted",
                response: registrationList
            }
        }
    } catch (err) {
        return {
            status: false, data: {
                code: '1010'
            }
        }
    }
}, {
    fields: {

    },
    requireUser: false
})


/**
 * Cloud Code used to fetch the registration details
 * @async
 * @function fetchRegistrationDetails
 * @param {String} id Registered User Id
 * @returns {Object} Status
 */
Parse.Cloud.define('fetchRegistrationDetails', async ({ params }) => {
    try {
        const { id } = params
        const pAll = require('../../helpers/p').p(undefined, true)
        const registrationDetails = (await pAll.first('VaccineReservation', { objectId: id }, 'vaccineCenter', 'timeSlots', 'minSlots')).toJSON()
        const dates = new Set()
        const dateResponse = (await pAll.all('VaccineSlots', {}, 'center')).map((item) => {
            let parsedDetail = item.toJSON()
            dates.add(parsedDetail.date)
            parsedDetail.vCenterName = parsedDetail.center.name
            parsedDetail.vCenterCode = parsedDetail.center.code
            parsedDetail.date = parsedDetail.date
            return parsedDetail
        })
        let vaccineCenterList = combinedItems(dateResponse)
        const timeSlots = (await pAll.all('TimeSlots', { active: true })).map(item => item.toJSON())
        const minutesSlots = (await pAll.all('MinutesSlots', { active: true })).map(item => item.toJSON())
        let sortedDates = dateSort([...dates])
        return {
            status: true, data: {
                response: { registrationDetails, vaccineCenterList, timeSlots, minutesSlots, dateSlots: [...sortedDates] }
            }
        }
    } catch (err) {
        return {
            status: false, data: {
                code: '1011'
            }
        }
    }
}, {
    fields: {

    },
    requireUser: false
})
