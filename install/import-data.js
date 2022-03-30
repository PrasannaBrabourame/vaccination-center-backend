/*********************************************************************************
 *                                                                              *
 * Author       :  Prasanna Brabourame                                          *
 * Version      :  1.0.0                                                        *
 * Date         :  28 Mar 2021                                                  *
 ********************************************************************************/

const local = true
const Parse = global.Parse = require(`../helpers/init${local ? '' : '-remote'}`)

const p = require('../helpers/p').p(undefined, true)

const includedClasses = [

]

const paginator = (arr = [], perPage = 10) => {
    if (perPage < 1 || !arr) return () => []
    let page = 0
    return () => {
        const basePage = page * perPage
        page++
        return basePage >= arr.length ? [] : arr.slice(basePage, basePage + perPage)
    }
}

const excludes = ['objectId']

const index = {}

const fixData = (data) => {
    return Object.keys(data)
        .filter(key => !excludes.includes(key))
        .reduce((obj, key) => {
            let value = data[key]

            if (value.objectId && !isNaN(value.objectId)) {
                value = new Parse.Object(value.className, { objectId: value.objectId })
            } else if (value.objectId && index[value.objectId]) {
                // pointer found
                const id = index[value.objectId]
                    ? '' + index[value.objectId]
                    : value.objectId
                const pointer = new Parse.Object(value.className, { objectId: id })
                if (!pointer.id) {
                    console.log('failed with', value)
                }
                value = pointer
            }
            obj[key] = value
            return obj
        }, {})
}

const instance = (className, data) => {
    if (data.hasOwnProperty('objectId') && isNaN(data.objectId)) {
        index[data.objectId] = data.code
    }
    if (data.hasOwnProperty('date')) {
        data.date = new Date(data.date);
    }
    const instance = p.instance(className, fixData(data))
    if (data.hasOwnProperty('code')) {
        instance.id = '' + data.code
    }

    return instance
}

const run = async () => {
    let items = []
    try {
        Parse.allowCustomObjectId = true
        const data = require('../all-data.json')
        for (const className in data) {
            if (includedClasses.length && !includedClasses.includes(className)) { continue }
            // await remove(className);
            const paginate = paginator(data[className], 50)
            let page = paginate()
            while (page.length) {
                items = page.map(i => instance(className, i))
                await Parse.Object.saveAll(items, { useMasterKey: true })
                console.log(className, page.length)
                page = paginate()
            }
        }
        console.log(`all json data imported to ${local ? 'local' : 'remote'} parse`)
    } catch (err) {
        console.log(index)
        console.error(err)
        console.trace(err)
    }
}

run()