const ScheduledReminderBaseController = require('./base/reminder_controller.js')
const { ScheduledReminders, ScheduledReminderCategories } = require('../models/scheduled_reminders.js')
const { repetition, status: statuses } = require('../models/modelEnums.js')
const { maximumDataInASingleQuest, logger } = require('../config/enum.js');

class ScheduledRemindersController extends ScheduledReminderBaseController {
    /**
     * 
     * This class will implement 2 methods including:
     *  - Get   : get scheduled reminder list in paginated formate
     *  - Post  : create a goddamn scheduled reminder
     *  
     */   

    constructor(){
        super()
    }

    get = (req, res) => {

        const GetScheduledReminders = async ( username ) => {
            const { limit, offset } = this.solvePeriodParams( req.query )
            const data = await ScheduledReminders.findAll({
                where: {
                    owner: username,
                },      
                limit,
                offset,
                include: [{ model: ScheduledReminderCategories }]
            })

            const formatedData = this.scheduledReminderListFormater(data)

            this.throwResponse(true, 200,"Successfully retrieve remiders", "SU_AU201")
            this.response.data.reminders = formatedData
        }
        this.AuthorizedRequestDecorator(req, res,  GetScheduledReminders )
    }


    post = (req, res) => {
        /**
         * 
         * Create scheduled reminder
         * Descendant jobs will be create separately due to optimizing purpose
         * 
         */

        const CreateScheduledReminder = async ( username ) => {
            /**
             * 
             * There are several steps to do in order to run this function
             * 
             * 1: Request body validation: If there is a weird field name in request body => immediately response 400
             * 2: Validate if repeat is a valid string which has to be included in enumerate repetitions
             * 3: Validate categories
             *      --> If body.categories is undefined or empty -> Just pass
             *      --> If body.categories is array and has at least one category 
             *          -> Ensure every category is valid then save them.
             *          -> If at least one of these categories is invalid -> Reponse 400
             * 4: If everything is fine at this step => save the scheduled reminder ( and its categories )
             * 
             */

            const data = req.body;
            const isBodyValid = this.validateReqBodyFields(data)
            // 1st step
            if( !isBodyValid ){
                this.throw400BadRequest()
            }else{

                // 2nd step
                const { repeat } = data;

                if( repetition.indexOf(repeat) === -1 ){
                    this.throwResponse( false, 400, "Invalid repetition type", "ER_AU202" )
                }else{

                    // 3rd step
                    const cates = (data.categories && Array.isArray(data.categories)) ? data.categories : [];                    
                    const areCatesAllValid = this.categoriesCheck( cates )
                    if( !areCatesAllValid ){                        
                        this.throwResponse( false, 400, "Invalid category set", "ER_AU203" )
                    }else{                  
                        // 4th step      

                        const newReminder = await ScheduledReminders.create({ ...data, owner: username }) 
                        if( cates.length > 0 ){
                            const newReminderCates = cates.map( cate => {
                                return {
                                    reminder_id: newReminder.dataValues.reminder_id,
                                    category: cate
                                }
                            })
                            await ScheduledReminderCategories.bulkCreate(newReminderCates)
                        }
                        this.throwResponse(true, 200, "Successfully created", "SU_AU202")
                        this.response.data.reminder = this.scheduledReminderFormater(newReminder)
                    }
                }
            }
        }
        this.AuthorizedRequestDecorator( req, res, CreateScheduledReminder )
    }


    solvePeriodParams = (params) => {
    /**
     * 
     * Solving from - to query
     * 
     * Or page query ( just leave it for now )
     * 
     */

        const { from, to } = params;                
        if( from === undefined ){    
            /**
             * From is undefined -> return default limit with offset = 0
             */
            return { limit: maximumDataInASingleQuest, offset: 0 }
        }else{
            const parsedFrom = parseInt( from )
            if( Number.isNaN(parsedFrom) ){
                /**
                 * From is not a number -> return default limit with offset = 0
                 */
                return { limit: maximumDataInASingleQuest, offset: 0 }
            }else{                
                const parsedTo = parseInt(to)
                if( Number.isNaN(parsedTo) ){
                    /**
                     * From is valid but to is not -> return default limit with offset = from
                     */
                    return { limit: maximumDataInASingleQuest, offset: parsedFrom }
                }else{
                    const limit = parsedTo - parsedFrom + 1
                    if( limit <= 0 ){
                        /**
                         * Both from - to are valid but to is less than from -> return default limit with offset = from
                         */
                        return { limit: maximumDataInASingleQuest, offset: parsedFrom }
                    }else{                        
                        if( limit > maximumDataInASingleQuest ){
                            return { limit: maximumDataInASingleQuest, offset: parsedFrom }
                        }else{
                            return { limit, offset: parsedFrom }
                        }
                    }
                }
            }
        }
    }
    
}

class ScheduledReminderController extends ScheduledReminderBaseController{
    /**
     * 
     * This class will implement 4 methods including:
     *  - Get   : Get a specific scheduled reminder using its ID
     *  - Put   : Update scheduled reminder general information
     *  - Patch : Switch Scheduled reminder state between proper methods
     *  - Delete: We already had Patch method for setting states and we don't
     *  truly delete scheduled reminders, so this method simply set a reminder
     *  to state of "deleted" 
     *  
     */

    constructor(){
        super()
    }
    get = (req, res) => {
        const GetOneScheduledReminder = async (reminder ) => {
            /**
             * 
             * Get one scheduled reminder using reminder_id
             * 
             */            
            this.throwResponse(true, 200, "Successfully retrieve remiders", "SU_AU201")
            this.response.data.reminder = reminder                                
            
        }
        this.IdSearchScheduledReminderDecorator( req, res, GetOneScheduledReminder )
    }

    put = async (req, res) => {
        /**
         * 
         * Update reminder general infors and category list
         * 
         * Descendent jobs will be updated separately for performance optimizing purpose
         * 
         */
        const UpdateScheduledReminder = async ( reminder ) => {     
            
            /**
             * 
             * These validating steps quite similar to ScheduledRemindersController.post() so we
             * won't explain them again.
             * 
             */
            const data = req.body;
            const isBodyValid = this.validateReqBodyFields(data)

            if( !isBodyValid ){
                this.throw400BadRequest()
            }else{
                const { repeat } = data 
                if( repetition.indexOf(repeat) === -1 ){
                    this.throwResponse( false, 400, "Invalid repetition type", "ER_AU202" )
                }else{
                    const cates = ( data.categories && Array.isArray(data.categories)) ? data.categories : [];                    
                    const areCatesAllValid = this.categoriesCheck( cates )
                    if( !areCatesAllValid ){                        
                        this.throwResponse( false, 400, "Invalid category set", "ER_AU203" )
                    }else{   
                        /**
                         *
                         * If everything is fine, update infomations
                         *  
                         */                     
                        await ScheduledReminders.update(
                            { ...data },
                            {  
                                where: {
                                    reminder_id: reminder.reminder_id
                                }
                            }
                        ) 

                        /**
                         * 
                         * For now, we delete all existed categories and re-insert the new ones
                         * The optimizing way will be implement if needed
                         * 
                         */
                        await ScheduledReminderCategories.destroy({
                            where: {
                                reminder_id: reminder.reminder_id
                            }
                        })

                        if( cates.length > 0 ){
                            const newReminderCates = cates.map( cate => {
                                return {
                                    reminder_id: reminder.reminder_id,
                                    category: cate
                                }
                            })
                            await ScheduledReminderCategories.bulkCreate(newReminderCates)
                        }

                        this.throwResponse(true, 200, "Successfully updated", "SU_AU203")                       
                    }
                }
            }
        }
        this.IdSearchScheduledReminderDecorator(req, res, UpdateScheduledReminder )
    }

    patch = async ( req, res ) => {
        /**
         * 
         * Update scheduled reminder status
         * 
         */

        const StatusPatch = async ( reminder ) => {
            const data = req.body            
            const isBodyValid = this.validateObjectFields( data, ["status"] )

            if( !isBodyValid ){
                this.throw400BadRequest()
            }else{
                const { status } = data;
                if( statuses.indexOf(status) === -1 ){
                    this.throwResponse(false, 400, "Invalid status value", "ER_AU207")
                }else{
                    await ScheduledReminders.update(
                        { status }, 
                        { 
                            where: {
                                reminder_id: reminder.reminder_id
                            }
                        }
                    )
                    this.throwResponse(true, 200, "Successfully update scheduled reminder", "SU_AU203")
                }
            }
        }
        this.IdSearchScheduledReminderDecorator(req, res, StatusPatch )
    }

    delete = async (req, res) => {
        /**
         * 
         * Update scheduled reminder status to permanently deleted
         * 
         */
        const ScheduledReminderRemoval = async (reminder) => {
            
            await ScheduledReminders.update(
                { status: "permanently_deleted" }, 
                { 
                    where: {
                        reminder_id: reminder.reminder_id
                    }
                }
            )
            this.throwResponse(true, 200, "Successfully removed scheduled reminder", "SU_AU204")
        }
        this.IdSearchScheduledReminderDecorator(req, res, ScheduledReminderRemoval )
    }
}

module.exports = {
    ScheduledRemindersController: new ScheduledRemindersController(),
    ScheduledReminderController: new ScheduledReminderController(),
}