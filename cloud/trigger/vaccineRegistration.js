/*********************************************************************************
 *                                                                              *
 * Author       :  Prasanna Brabourame                                          *
 * Version      :  1.0.0                                                        *
 * Date         :  31 Mar 2021                                                  *
 ********************************************************************************/


Parse.Cloud.beforeSave('VaccineReservation', async ({ object, original }) => {
        if (!original) {
            object.id = '' + object.attributes.nric
        }
})