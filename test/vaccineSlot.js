/*********************************************************************************
 *                                                                              *
 * Author       :  Prasanna Brabourame                                          *
 * Version      :  1.0.0                                                        *
 * Date         :  01 Apr 2022                                                 *
 ********************************************************************************/

 const local = true
 const Parse = global.Parse = require(`../helpers/init${local ? '' : '-remote'}`)


 const test = async (user) => {
    try {
        const pAll = require('../helpers/p').p(undefined, true)
        const first = (await pAll.first('VaccineSlots', { date: `01-04-2022`, center: pAll.pointer('VaccinationCenter', `100`) })).toJSON();
        console.log(Number(first.remainingSlots - 1))
        const remainingSlots = await pAll.upsert('VaccineSlots', { date: `01-04-2022`, center: pAll.pointer('VaccinationCenter', `100`) }, { remainingSlots: Number(first.remainingSlots - 1) })
        console.log(remainingSlots)
    } catch (error) {
        console.log(error)
    }
}
test()
 