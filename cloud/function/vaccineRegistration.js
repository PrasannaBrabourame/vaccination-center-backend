/*********************************************************************************
 *                                                                              *
 * Author       :  Prasanna Brabourame                                          *
 * Version      :  1.0.0                                                        *
 * Date         :  31 Mar 2021                                                  *
 ********************************************************************************/

const { p } = require('../../helpers/p')

Parse.Cloud.define('registerVaccination', async ({ params }) => {
    try {
        const { vaccineCenter, vaccineDate, vaccineMin, vaccineTime, name, nric } = params
        const pAll = require('../../helpers/p').p(undefined, true)
        const isAvailable = await pAll.first('VaccineReservation', { objectId: nric }, 'VaccinationCenter', 'MinutesSlots')
        if (isAvailable) {
            return {
                status: true, data: {
                    isExist: "User Already Registered Vaccination",
                }
            }
        }
        const sameTime = await pAll.first('VaccineReservation', { timeSlots: pAll.pointer('TimeSlots', `${vaccineTime}`), minSlots: pAll.pointer('MinutesSlots', `${vaccineMin}`), date: `${vaccineDate}`, vaccineCenter: pAll.pointer('VaccinationCenter', `${vaccineCenter}`) }, 'VaccinationCenter', 'MinutesSlots')
        if (sameTime) {
            return {
                status: true, data: {
                    sameTime: "Someone already registered for this time slot"
                }
            }
        }
        const register = await pAll.insert('VaccineReservation', { vaccineCenter: pAll.pointer('VaccinationCenter', `${vaccineCenter}`), timeSlots: pAll.pointer('TimeSlots', `${vaccineTime}`), minSlots: pAll.pointer('MinutesSlots', `${vaccineMin}`), date: `${vaccineDate}`, name, nric })
        return {
            status: true, data: {
                response: register
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