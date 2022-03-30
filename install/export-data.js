/*********************************************************************************
 *                                                                              *
 * Author       :  Prasanna Brabourame                                          *
 * Version      :  1.0.0                                                        *
 * Date         :  28 Mar 2021                                                  *
 ********************************************************************************/

const local = true
const Parse = global.Parse = require(`../helpers/init${local ? '' : '-remote'}`)

const p = require('../helpers/p').p(undefined, true)
const fs = require('fs')

const items = [
  'VaccineReservation',
  'VaccinationCenter',
  'VaccineSlots',
  'TimeSlots',
  'MinutesSlots'
]

const classNameChanges = {

}

const extraPropertiesForClasses = {}

const propertyNameChanges = {
  // code: 'id',
}
const fixBoolean = value => value == 1
const propertyTypeChanges = { // fixes boolean types
  mandatory: fixBoolean,
  active: fixBoolean,
  allowMultiple: fixBoolean,
  supportPortal: fixBoolean
}
const excludes = ['createdAt', 'updatedAt']

const extractData = (instance) => {
  const attributes = { objectId: instance.id, ...instance.attributes }
  return Object.keys(attributes)
    .filter(key => !excludes.includes(key))
    .reduce((obj, key) => {
      const newKey = propertyNameChanges[key] || key
      let value = attributes[key]
      value = propertyTypeChanges[key]
        ? propertyTypeChanges[key](value)
        : (isNaN(value) ? value : Number(value))
      if (Array.isArray(value)) {
        // do nothing
      } else if (typeof value === 'object') {
        value = {
          objectId: value.id,
          className: value.className
        }
      }
      obj[newKey] = value
      return obj
    }, {})
}
const data = {}

const extract = async (name) => {
  const positions = await p.all(name)
  let items = positions.map(extractData)
  const className = classNameChanges[name] || name
  if (typeof extraPropertiesForClasses[name] === 'object') {
    items = items.map(item => {
      return { ...item, ...extraPropertiesForClasses[name] }
    })
  }
  data[className] = items
  console.log(className, items.length)
}

const run = async () => {
  try {
    await Promise.all(items.map(extract))
    const index = {}
    items.forEach(i => {
      const k = classNameChanges[i] || i
      index[k] = data[k].sort((a, b) => a.code - b.code)
    })

    fs.writeFileSync('all-data.json', JSON.stringify(index, null, 2))
    console.log(`all data from ${local ? 'local' : 'remote'} parse server exported to json file`)
  } catch (err) {
    console.error(err)
    console.trace(err)
  }
}

run()
