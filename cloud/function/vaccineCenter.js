/*********************************************************************************
 *                                                                              *
 * Author       :  Prasanna Brabourame                                          *
 * Version      :  1.0.0                                                        *
 * Date         :  01 Apr 2022                                                  *
 ********************************************************************************/

//Imports
const { combinedItems, dateSort } = require('../../helpers/util');

/**
 * Cloud Code used to fetch the vaccine Centers List
 * @async
 * @function fetchVaccineCenterList
 * @returns {Object} Status
 */
Parse.Cloud.define('fetchVaccineCenterList', async () => {
    try {
        const pAll = require('../../helpers/p').p(undefined, true)
        const response = (await pAll.all('VaccinationCenter', { active: true })).map(item => item.toJSON())
        const dates = new Set()
        const dateResponse = (await pAll.all('VaccineSlots', {}, 'center')).map((item) => {
            let parsedDetail = item.toJSON()
            dates.add(parsedDetail.date)
            parsedDetail.vCenterName = parsedDetail.center.name
            parsedDetail.vCenterCode = parsedDetail.center.code
            parsedDetail.date = parsedDetail.date
            return parsedDetail
        })
        let mergedResponse = combinedItems(dateResponse)
        let sortedDates = dateSort([...dates])
        return {
            status: true, data: {
                response: { vaccineCenters: mergedResponse, dateSlots: [...sortedDates] }
            }
        }
    } catch (err) {
        return {
            status: false, data: {
                code: '1003'
            }
        }
    }
}, {
    fields: {

    },
    requireUser: false
})


/**
 * Cloud Code used to fetch the existing Slot Lits
 * @async
 * @function fetchExistingSlots
 * @param {String} vaccineCenter Vaccination Center
 * @param {String} vaccineDate Vaccination Date
 * @returns {Object} Status
 */
Parse.Cloud.define('fetchExistingSlots', async ({ params }) => {
    try {
        const { vaccineDate, vaccineCenter } = params
        const pAll = require('../../helpers/p').p(undefined, true)
        let timeSlots = new Set()
        let minSlots = new Set()
        let response = (await pAll.all('VaccineReservation', { date: `${vaccineDate}`, vaccineCenter: pAll.pointer('VaccinationCenter', `${vaccineCenter}`) }, 'vaccineCenter', 'minSlots', 'timeSlots')).map(item => {
            let cItem = item.toJSON()
            timeSlots.add(cItem.timeSlots.code)
            minSlots.add(cItem.minSlots.code)
            return cItem
        })
        return {
            status: true, data: {
                existingSlots: {
                    timeSlots: [...timeSlots], minSlots: [...minSlots]
                }
            }
        }
    } catch (err) {
        return {
            status: false, data: {
                code: '1012'
            }
        }
    }
}, {
    fields: {

    },
    requireUser: false
})
