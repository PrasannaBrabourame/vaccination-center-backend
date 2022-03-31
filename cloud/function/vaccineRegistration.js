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
                    response: isAvailable.toJSON()
                }
            }
        }
        const register = await pAll.insert('VaccineReservation', { vaccineCenter: pAll.pointer('VaccinationCenter', `${vaccineCenter}`), timeSlots: pAll.pointer('TimeSlots', `${vaccineTime}`), minSlots: pAll.pointer('MinutesSlots', `${vaccineMin}`), date: `${vaccineDate}`, name, nric })
        return {
            status: true, data: {
                response: []
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