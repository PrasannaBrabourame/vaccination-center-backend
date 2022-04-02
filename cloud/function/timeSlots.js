/*********************************************************************************
 *                                                                              *
 * Author       :  Prasanna Brabourame                                          *
 * Version      :  1.0.0                                                        *
 * Date         :  01 Apr 2022                                                  *
 ********************************************************************************/

/**
 * Cloud Code used to fetch the Hours and Mins Available Slots
 * @async
 * @function fetchSlots
 * @returns {Object} Status
 */
Parse.Cloud.define('fetchSlots', async () => {
    try {
        const pAll = require('../../helpers/p').p(undefined, true)
        const timeSlots = (await pAll.all('TimeSlots', { active: true })).map(item => item.toJSON()).sort(function(a, b) {
            return parseFloat(a.code) - parseFloat(b.code);
        })
        const minutesSlots = (await pAll.all('MinutesSlots', { active: true })).map(item => item.toJSON()).sort(function(a, b) {
            return parseFloat(a.code) - parseFloat(b.code);
        })
        return {
            status: true, data: {
                timeSlots, minutesSlots
            }
        }
    } catch (err) {
        return {
            status: false, data: {
                code: '1002'
            }
        }
    }
}, {
    fields: {

    },
    requireUser: false
})