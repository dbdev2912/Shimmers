const Controller = require('./controller.js')
const { ScheduledReminders, ScheduledReminderCategories } = require('../models/scheduled_reminders.js')
const { repetition, categories } = require('../models/modelEnums.js')
const { maximumDataInASingleQuest } = require('../config/enum.js');

class ScheduledRemindersController extends Controller {
    validFields = ["title", "description", "time", "place", "tag", "repeat", "categories"]

    constructor(){
        super()
    }

    get = async (req, res) => {
        /**
         * 
         * Suspend here
         * 
         */
        const GetScheduledReminder = async ( username ) => {
            const { limit, offset } = this.solvePeriodParams( req.query )
            const data = await ScheduledReminders.findAll({
                where: {
                    owner: username,
                },
                limit,
                offset,
                include: [{ model: ScheduledReminderCategories }]
            })
            this.throwResponse(true, 200,"Successfully retrieve remiders", "SU_AU201")
            this.response.data.reminders = data
        }
        this.AuthorizedRequestDecorator(req, res,  GetScheduledReminder )
    }



    post = (req, res) => {
        /**
         * 
         * Create scheduled reminder
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
                    }
                }
            }
        }
        this.AuthorizedRequestDecorator( req, res, CreateScheduledReminder )
    }

    categoriesCheck = (cates = []) => {
        /**
         * 
         * Check if any category in categpry list is not included in default category enum set
         * 
         */

        
        for( let i = 0 ; i < cates.length; i++ ){
            const cate = cates[i]
            if( categories.indexOf(cate) === -1 ){
                return false
            }
        }
        return true
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
            if( !parsedFrom ){
                /**
                 * From is not a number -> return default limit with offset = 0
                 */
                return { limit: maximumDataInASingleQuest, offset: 0 }
            }else{                
                const parsedTo = parseInt(to)
                if( !parsedTo ){
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

module.exports = {
    ScheduledRemindersController: new ScheduledRemindersController(),
}