/**
 * 
 * If this const is changed someday, please check 
 * - [ScheduledReminderController].delete() -> ScheduledReminderRemoval
 * because "permanently_deleted" is used there as a raw string
 *  
 * 
 */

const status = [
    "active",
    "disabled",
    "deleted",
    "permanently_deleted"
]



const repetition = [
    "daily",
    "weekly",
    "monthly",
    "annually"
]

const categories = [
    "working",
    "reading",
    "watching",
    "other"
]

module.exports = {
    status,
    repetition,
    categories
}