/*********************************************************************************
 *                                                                              *
 * Author       :  Prasanna Brabourame                                          *
 * Version      :  1.0.0                                                        *
 * Date         :  01 Apr 2022                                                 *
 ********************************************************************************/

/**
 * @param {string} sessionToken A valid session token, u3sed for making a request on behalf of a specific user.
 * @param {boolean} useMasterKey In Cloud Code and Node only, causes the Master Key to be used for this request.
 * @param {boolean} cascadeSave If false, nested objects will not be saved (default is true).
 * @param {object} context A dictionary that is accessible in Cloud Code beforeSave and afterSave triggers.
 * @returns {object} with utility functions
 */
 module.exports.p = (sessionToken = undefined, useMasterKey = false, cascadeSave = true, context = {}) => {
    const options = this.options = { useMasterKey, cascadeSave, context }
    if (sessionToken) options.sessionToken = sessionToken
  
    const dotToNest = o => {
      const nest = (k, v, o) => {
        const keys = k.split('.')
        const l = Math.max(1, keys.length - 1)
        let currentObj = o
        let i
        let key
        for (i = 0; i < l; ++i) {
          key = keys[i]
          currentObj[key] = currentObj[key] || {}
          currentObj = currentObj[key]
        }
        currentObj[keys[i]] = v
        delete o[k]
      }
  
      for (const k in o) {
        if (k.indexOf('.') !== -1) { nest(k, o[k], o) }
      }
      return o
    }
  
    const nestToDot = (o, roots = [], sep = '.') => Object.keys(o)
      .reduce((memo, prop) => Object.assign({}, memo,
        Object.prototype.toString.call(o[prop]) === '[object Object]' && !o[prop].attributes
          ? nestToDot(o[prop], roots.concat([prop]))
          : { [roots.concat([prop]).join(sep)]: o[prop] }
      ), {})
  
    /**
       * Creates an instance of ParseQuery
       * @param {string} className - The class name of the Parse object.
       * @param {object} conditions - optional key value pairs to match
       * @param {string} includes optional array of names of pointed objects to include
       * @returns {ParseQuery}
       */
    const query = (className, conditions = {}, ...includes) => {
      const q = new Parse.Query(className, includes, options)
      for (const key in conditions) q.equalTo(key, conditions[key])
      includes.map(i => q.include(i))
      return q
    }
  
    /**
       * Finds the result of a parse query using the given options
       * such as sessionToken, useMasterKey etc
       * @param {ParseQuery} query
       * @returns {Promise<ParseObject[]>}
       */
    const find = async query => {
      return query.find(options)
    }
  
    /**
       * Creates an instance of ParseObject
       * @param {string} className - The class name of the Parse object.
       * @returns {ParseObject}
       */
    const instance = (className, data = {}) => {
      return new Parse.Object(className, data)
    }
  
    /**
       * Update or Insert, when expected value found for a key it updates
       * @param {string} className - The class name of the Parse object.
       * @param {object} conditions - key value pairs to match
       * @param {object} data - optional data to create new instance or update existing
       * @returns {Promise<ParseObject>} inserted or updated instance
       */
    const upsert = async (className, conditions, data = {}) => {
      const i = await last(className, conditions)
      if (i) {
        delete data.id
        return Object.keys(data).length ? await i.save(data, options) : i
      }
      delete conditions.id
      delete conditions.objectId
      return await insert(className, { ...dotToNest(conditions), ...data })
    }
  
    /**
       * Search for given conditions and get the first result
       * @param {string} className - The class name of the Parse object.
       * @param {object} conditions - key value pairs to match
       * @param {string} includes optional array of names of pointed objects to include
       * @returns {Promise<ParseObject>}
       */
    const first = async (className, conditions, ...includes) => {
      const q = await query(className, conditions, ...includes)
      q.descending('createdAt')
      return q.first(options)
    }
  
    /**
       * Search for given conditions and get the latest result
       * @param {string} className - The class name of the Parse object.
       * @param {object} conditions - key value pairs to match
       * @param {string} includes optional array of names of pointed objects to include
       * @returns {Promise<ParseObject>}
       */
    const last = async (className, conditions, ...includes) => {
      const q = await query(className, conditions, ...includes)
      return q.first(options)
    }
  
    /**
       * Search for and get all the result
       * @param {string} className - The class name of the Parse object.
       * @param {object} conditions - key value pairs to match
       * @param {string} includes optional array of names of pointed objects to include
       * @returns {Promise<ParseObject[]>}
       */
    const search = async (className, conditions, ...includes) => {
      return await query(className, conditions, ...includes).find(options)
    }
  
    /**
       * Retrieves all objects for a parse class by going through pagination
       * @param {string} className - The class name of the Parse object.
       * @param {object} conditions - key value pairs to match
       * @param {string} includes optional array of names of pointed objects to include
       * @returns {Promise<ParseObject[]>}
       */
    const all = async (className, conditions, ...includes) => {
      const items = []
      const q = await query(className, conditions, ...includes)
      q.limit(100)
      while (true) {
        const batch = await q.find(options)
        if (!batch.length) break
        items.push(...batch)
        q.skip(items.length)
      }
      return items
    }
  
    /**
       * Retrieves latest 100 objects or less for a given class name
       * @param {string} className - The class name of the Parse object.
       * @param {string} includes optional array of names of pointed objects to include
       * @returns {Promise<ParseObject[]>}
       */
    const list = async (className, ...includes) => {
      return await query(className, {}, ...includes)
        .descending('createdAt').find(options)
    }
  
    /**
       * Retrieve an object by id
       * @param {string} className - The class name of the Parse object.
       * @param {string} id - The id of the Parse object.
       * @param {string} includes optional array of names of pointed objects to include
       * @returns {Promise<ParseObject>}
       */
    const get = async (className, id, ...includes) => {
      return await query(className, {}, ...includes).get(id, options)
    }
  
    /**
       * Update an object by id
       * @param {string} className - The class name of the Parse object.
       * @param {string} id - The id of the Parse object.
       * @param {object} data - data to update existing
       * @returns {Promise<ParseObject>}
       */
    const update = async (className, id, data) => {
      return pointer(className, id).save(data, options)
    }
  
    /**
       * Create a new object
       * @param {string} className - The class name of the Parse object.
       * @param {object} data - data to create new object
       * @returns {Promise<ParseObject>}
       */
    const insert = async (className, data) => {
      if (data.id) Parse.allowCustomObjectId = true
      const i = instance(className)
      const s = await i.save(data, options)
      if (data.id) Parse.allowCustomObjectId = false
      return s
    }
  
    /**
       * Create a collection new object
       * @param {object} instances - data to create collection new object
       * @returns {Promise<ParseObject>}
       */
    const insertAll = async (instances) => {
      return Parse.Object.saveAll(instances, options)
    }
  
    /**
       * Fetch set of related objects to current object
       * @param {ParseObject} object - object to query the relationship
       * @param key - name of the relationship
       * @returns {Promise<ParseObject[]>} related objects
       */
    const related = async (object, key) => {
      return await (object.relation(key).query()).find(options)
    }
    /**
       * Create a pointer to a Parse object given its id and the class name.
       * @param {string} className - The class name of the Parse object.
       * @param {string} id - The id of the Parse object.
       * @returns {ParseObject} Pointer to the Parse object.
       */
    const pointer = (className, id) => {
      const o = instance(className)
      o.id = id
      return o
    }
    /**
       * Saves given data to as a pointed property of given instance
       * @param {ParseObject} object object to add the pointer
       * @param {string} property - name of the pointed property
       * @param {string} className - The class name of the Parse object to be linked.
       * @param {object} conditions - key value pairs to match
       * @param {object} data - data to create the pointed object
       * @returns {Promise<ParseObject>} parent instance with the added pointer value
       */
    const upsertPointer = async (object, property, className, conditions, data = {}) => {
      object.set(property, await upsert(className, conditions, data))
      return (await object.save(null, options))
    }
  
    /**
       * Saves given data to as a pointed property of given instance
       * @param {ParseObject} object object to add the pointer
       * @param {string} property - name of the pointed property
       * @param {string} className - The class name of the Parse object to be linked.
       * @param {object} data - data to create the pointed object
       * @returns {Promise<ParseObject>} parent instance with the added pointer value
       */
    const insertPointer = async (object, property, className, data) => {
      object.set(property, instance(className, data))
      return (await object.save(null, options))
    }
  
    /**
       * Saves given data to as a related property of given instance
       * @param {ParseObject} object object to add the pointer
       * @param {string} className - The class name of the Parse object to be added.
       * @param {string} property - name of the related property
       * @param {object} data - data to create the related object
       * @returns {Promise<ParseObject>} parent instance with the added relationship
       */
    const insertRelated = async (object, className, property, data) => {
      const relation = object.relation(property)
      const relatedInstance = instance(className)
      const result = await relatedInstance.save(data, options)
      relation.add(result)
      return result
    }
    /**
       * Deletes an object by id
       * @param {string} className - The class name of the Parse object.
       * @param {string} id - The id of the Parse object.
       * @returns {Promise}
       */
    const del = async (className, id) => {
      return (await (await get(className, id)).destroy(options))
    }
    /**
       * Deletes all objects of a parse class that match the given condition by going through pagination
       * @param {string} className - The class name of the Parse object.
       * @param {object} conditions - key value pairs to match
       * @returns {Promise}
       */
    const deleteAll = async (className, conditions) => {
      return (await Parse.Object.destroyAll(await all(className, conditions), options))
    }
  
    return {
      // helper
      instance,
      query,
      find,
      pointer,
      nestToDot,
      dotToNest,
      // search
      first,
      last,
      search,
      all,
      // retrieve
      get,
      list,
      // update
      insert,
      update,
      upsert,
      insertAll,
      // relations
      related,
      insertPointer,
      upsertPointer,
      insertRelated,
      // delete
      delete: del,
      deleteAll
    }
  }
  