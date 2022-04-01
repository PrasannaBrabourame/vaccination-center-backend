/*********************************************************************************
 *                                                                              *
 * Author       :  Prasanna Brabourame                                          *
 * Version      :  1.0.0                                                        *
 * Date         :  01 Apr 2022                                                 *
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
 require('./function/registrationList')

/**
 * @type JOBS
 */
require('./trigger/vaccineRegistration')
