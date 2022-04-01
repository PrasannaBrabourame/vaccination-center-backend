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
        let fetchVaccineCenterList = await Parse.Cloud.run("fetchVaccineCenterList")
        console.log(fetchVaccineCenterList)
    } catch (error) {
        console.log(error)
    }
}
test()

