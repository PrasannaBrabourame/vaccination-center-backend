/*********************************************************************************
 *                                                                              *
 * Author       :  Prasanna Brabourame                                          *
 * Version      :  1.0.0                                                        *
 * Date         :  28 Mar 2021                                                  *
 ********************************************************************************/
const moment = require('moment');
const { combinedItems } = require('../../helpers/util');
/**
 * Cloud Code used to fetch the product category
 * @async
 * @function fetchVaccineCenterList
 * @returns {Object} Status
 */

Parse.Cloud.define('fetchVaccineCenterList', async () => {
    try {
        const pAll = require('../../helpers/p').p(undefined, true)
        const response = (await pAll.all('VaccinationCenter', { active: true })).map(item => item.toJSON())
        const dateResponse = (await pAll.all('VaccineSlots', {}, 'center')).map((item, index) => {
            let parsedDetail = item.toJSON()
            parsedDetail.vCenterName = parsedDetail.center.name
            parsedDetail.vCenterCode = parsedDetail.center.code
            parsedDetail.date = moment(parsedDetail.date.iso).format('DD-MM-YYYY')
            return parsedDetail
        })
        let mergedResponse = combinedItems(dateResponse)
        return {
            status: true, data: {
                response: mergedResponse
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