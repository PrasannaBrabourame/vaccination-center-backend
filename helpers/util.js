/*********************************************************************************
 *                                                                              *
 * Author       :  Prasanna Brabourame                                          *
 * Version      :  1.0.0                                                        *
 * Date         :  01 Apr 2022                                                 *
 ********************************************************************************/

/**
 * function used to merge the Array based on keys
 * @sync
 * @function combinedItems
 * @returns {Array} Merged Array
 */
const combinedItems = (arr = []) => {
    try {
        const res = arr.reduce((acc, obj) => {
            obj.dates = {}
            let found = false;
            for (let i = 0; i < acc.length; i++) {
                if (acc[i].vCenterCode === obj.vCenterCode) {
                    found = true;
                    acc[i].dates[`${obj.date}`] = { dates: obj.remainingSlots, nurse: obj.nurse }
                };
            }
            if (!found) {
                obj.dates[`${obj.date}`] = { dates: obj.remainingSlots, nurse: obj.nurse }
                acc.push(obj);
            }
            return acc;
        }, []);
        return res;
    } catch (e) {
        console.log(e)
    }
}

/**
 * function used to sort the Date Array
 * @sync
 * @function dateSort
 * @returns {Array} Sorted Array
 */
const dateSort = (arr) => {
    return arr.sort(function (a, b) {
        let aComps = a.split("-");
        let bComps = b.split("-");
        let aDate = new Date(aComps[2], aComps[1], aComps[0]);
        let bDate = new Date(bComps[2], bComps[1], bComps[0]);
        return aDate.getTime() - bDate.getTime();
    });
}

module.exports = { combinedItems, dateSort }