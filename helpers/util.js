/*********************************************************************************
 *                                                                              *
 * Author       :  Prasanna Brabourame                                          *
 * Version      :  1.0.0                                                        *
 * Date         :  31 Mar 2021                                                  *
 ********************************************************************************/

const combinedItems = (arr = []) => {
    const res = arr.reduce((acc, obj) => {
        let found = false;
        for (let i = 0; i < acc.length; i++) {
            if (acc[i].vCenterCode === obj.vCenterCode) {
                found = true;
                acc[i][`${obj.date}`] = obj.remainingSlots
            };
        }
        if (!found) {
            obj[`${obj.date}`] = obj.remainingSlots
            acc.push(obj);
        }
        return acc;
    }, []);
    return res;
}

module.exports = { combinedItems }