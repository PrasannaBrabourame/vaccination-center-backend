/*********************************************************************************
 *                                                                              *
 * Author       :  Prasanna Brabourame                                          *
 * Version      :  1.0.0                                                        *
 * Date         :  31 Mar 2021                                                  *
 ********************************************************************************/

/**
 * Cloud Code used to fetch the product category
 * @async
 * @function fetchSlots
 * @returns {Object} Status
 */

Parse.Cloud.define('fetchSlots', async () => {
    try {
        const pAll = require('../../helpers/p').p(undefined, true)
        const timeSlots = (await pAll.all('TimeSlots', { active: true })).map(item => item.toJSON())
        const minutesSlots = (await pAll.all('MinutesSlots', { active: true })).map(item => item.toJSON())
        return {
            status: true, data: {
                timeSlots, minutesSlots
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