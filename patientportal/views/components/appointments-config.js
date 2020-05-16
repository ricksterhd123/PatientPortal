/**
* Appointment schedule config
*/

// When the first week starts
var weekStart = new Date();
//weekStart.setDate(new Date().getDate() - new Date().getDay() + 1);
weekStart.setHours(7);
weekStart.setMinutes(0);
weekStart.setSeconds(0);
weekStart.setMilliseconds(0);
var startTime = { hours: 7, minutes: 0, seconds: 0, milliseconds: 0 };
var endTime = { hours: 18, minutes: 0, seconds: 0, milliseconds: 0 };
// Could be dynamic
var appointmentDurationMins = 15;
var appointmentDurationHours = appointmentDurationMins / 60;
var dayDurationHours = endTime.hours - startTime.hours;
var slotsEachDay = dayDurationHours / appointmentDurationHours;
var days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
var daysEachWeek = days.length; 
// Number of weeks to paginate
var noWeeks = 2;

/**
* Create empty booking slot container
*/
function emptyBookingSlots() {
    let cols = [];
    let dateTime = new Date();
    console.log(dateTime);
    for (let week = 0; week < noWeeks; week++) {
        let weekSlots = [];
        for (let i = 0; i < days.length; i++) {
            dateTime.setDate(dateTime.getDate() + 1);
            if (dateTime.getDay() == 0) {
                dateTime.setDate(dateTime.getDate() + 1);
            }
            // do {
                
            // } while (dateTime.getDay() == 0)

            let rows = [];
            let hour = 7;
            let minutes = 0;
            let startHour = 7;
            let startMinutes = 0;
            
            for (let j = 0; j < slotsEachDay; j++) {
                minutes = startMinutes + (j * 15) % 60;
                if (j * 15 >= 60) {
                    hour = startHour + Math.floor((j * 15) / 60);
                }

                dateTime.setHours(hour);
                dateTime.setMinutes(minutes);
                dateTime.setSeconds(0);
                dateTime.setMilliseconds(0);
                
                rows.push({ time: new Date(dateTime), appointments: [], full: false });
            }

            weekSlots.push({
                day: dateTime.toDateString(),
                slots: rows
            });
        }
        cols.push(weekSlots)
    }

    return cols;
}

/**
 * Create empty schedule container
 */
function emptySchedule() {
    let schedule = [];
    let dateTime = new Date();
    for (let week = 0; week < noWeeks; week++) {
        let scheduleWeek = [];
        for (let i = 0; i < days.length; i++) {

            dateTime.setDate(dateTime.getDate() + 1);
            if (dateTime.getDay() == 0) {
                dateTime.setDate(dateTime.getDate() + 1);
            }

            let slots = [];
            let hour = 7;
            let minutes = 0;
            let startHour = 7;
            let startMinutes = 0;

            for (let j = 0; j < slotsEachDay; j++) {
                minutes = startMinutes + (j * 15) % 60;
                if (j * 15 >= 60) {
                    hour = startHour + Math.floor((j * 15) / 60);
                }
                dateTime.setHours(hour);
                dateTime.setMinutes(minutes);
                dateTime.setSeconds(0);
                dateTime.setMilliseconds(0);
                slots.push({ time: new Date(dateTime), appointment: false });
            }
            scheduleWeek.push({day: dateTime.toDateString(), slots: slots});
        }
        schedule.push(scheduleWeek);
    }
    return schedule;
}