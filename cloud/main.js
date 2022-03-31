/*********************************************************************************
 *                                                                              *
 * Author       :  Prasanna Brabourame                                          *
 * Version      :  1.0.0                                                        *
 * Date         :  31 Mar 2021                                                  *
 ********************************************************************************/
/**
 * @fileoverview Master file import for Parser Default functions like cloud code, Triggers and Jobs.
 * @version 1.0.0
 */

/**
 * @type FUNCTIONS
  */
 require('./function/vaccineCenter')
 require('./function/timeSlots')
 require('./function/vaccineRegistration')

/**
 * @type TRIGGERS
 */


/**
 * @type JOBS
 */
require('./trigger/vaccineRegistration')
