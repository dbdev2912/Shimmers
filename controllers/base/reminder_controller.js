const Controller = require('./controller');
const { ScheduledReminders, ScheduledReminderCategories } = require('../../models/scheduled_reminders')
const { categories } = require('../../models/modelEnums.js')

class ScheduledReminderBaseController extends Controller{
    validFields = ["title", "description", "time", "place", "tag", "repeat", "categories"]

    constructor(){
        super()
    }

    scheduledReminderListFormater = ( remindersQueryObject ) => {
        /**
         * 
         * Extract raw query objects to concise form
         * 
         * @params
         * remindersQueryObject: <SequelizeQuery>
         * 
         */
        if( remindersQueryObject ){

            const data = remindersQueryObject.map( rawReminder => {
                /**
                 * 
                 * Format raw reminders, currently reminders are sequelize's query object, 
                 * the results we're looking for actually in reminder.dataValues, get them and format
                 * 
                 */
                const reminder = rawReminder.dataValues;
                const cates    = reminder.scheduled_reminder_categories;
                
                /**
                 * Get all categories by mapping through and place in a list with name "categories"
                 * Remove default associated field
                 */
                reminder.categories = cates.map( cate => cate.category )
                delete reminder.scheduled_reminder_categories
                
                /**
                 * Remove createAt & updatedAt if exist
                 */
                delete reminder.createdAt;
                delete reminder.updatedAt;

                return reminder        
            })
            return data
        }
        return null
    }


    scheduledReminderFormater = ( reminderQueryObject ) => {
        /**
         * 
         *  Extract raw query object to concise form
         *  @params
         *      - reminderQueryObject: <SequelizeQuery>
         * 
         */

        if( reminderQueryObject ){

            const reminder =  reminderQueryObject.dataValues;
    
            /** 
             * Mapping associated field which is from scheduled_reminder_categories table to a list of string 
             * Then remove it
             * 
             * Ps: Newly created reminder does not have scheduled_reminder_categories so it may be undefined
             * Be wary
             */
    
            reminder.categories = reminder.scheduled_reminder_categories?.map( cate => cate.dataValues.category );
            delete reminder.scheduled_reminder_categories;
            

            /**
             * Remove createAt & updatedAt if exist
             */
            delete reminder.createdAt;
            delete reminder.updatedAt;

            return reminder
        }
        return null
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

    IdSearchScheduledReminderDecorator = async ( req, res, nextFunc ) => {
        /**
         * 
         * Decorator for all method that apply these step
         * 
         * 1. Check reminder_id in url query
         * 2. Check if reminder with that reminder_id exists or not
         * 2. Execute next function(s)
         * 
         */
        const thisFunc = async ( username ) => {
            
            const { reminder_id } = req.params 
            const parsedReminderId = parseInt( reminder_id )

            if( Number.isNaN(parsedReminderId) ){
                this.throw404NotFound()                
            }else{
                /**
                 * Here comes the database check, this may cause low performance
                 */
                const scheduledReminderQuery = await ScheduledReminders.findOne({
                    where: {
                        reminder_id,
                        owner: username
                    },
                    include: [{ model: ScheduledReminderCategories }],                    
                }, )
                if( !scheduledReminderQuery ){
                    this.throw404NotFound()
                }else{
                    const reminder = this.scheduledReminderFormater( scheduledReminderQuery )
                    await nextFunc( reminder )
                }
            }
        }        
        await this.AuthorizedRequestDecorator( req, res, thisFunc )
    }
    
}

module.exports = ScheduledReminderBaseController