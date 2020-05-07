// Copy of the weekStart
var weekStart = new Date();
weekStart.setDate(new Date().getDate() - new Date().getDay() + 1);
weekStart.setHours(7);
weekStart.setMinutes(0);
weekStart.setSeconds(0);
weekStart.setMilliseconds(0);

var startTime = { hours: 7, minutes: 0, seconds: 0, milliseconds: 0 };
var endTime = { hours: 18, minutes: 0, seconds: 0, milliseconds: 0 };
var appointmentDurationMins = 15;  // Minutes
var appointmentDurationHours = appointmentDurationMins / 60;
var dayDurationHours = endTime.hours - startTime.hours;
var slotsEachDay = dayDurationHours / appointmentDurationHours;
var daysEachWeek = 6; // m | t | w | t | f | s
var days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/**
* Get an empty schedule with 44 slots per day
*/
function emptySlots() {
    let cols = [];
    for (let i = 0; i < days.length; i++) {
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
            let dateTime = new Date(weekStart);
            dateTime.setDate(dateTime.getDate() + i);
            dateTime.setHours(hour);
            dateTime.setMinutes(minutes);
            dateTime.setMilliseconds(0);
            rows.push({ time: dateTime, appointments: [], full: false });
        }

        cols.push({
            day: days[i],
            slots: rows
        });
    }

    return cols;
}

function emptySchedule() {
    let schedule = [];
    for (let i = 0; i < days.length; i++) {
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
            let dateTime = new Date(weekStart);
            dateTime.setDate(dateTime.getDate() + i);
            dateTime.setHours(hour);
            dateTime.setMinutes(minutes);
            dateTime.setMilliseconds(0);
            slots.push({ time: dateTime, appointment: false });
        }

        schedule.push({day: days[i], slots: slots});
    }
    return schedule;
}

class Appointments extends React.Component {
    constructor(props) {
        super(props);
        this.state = { booked: false, slot: false, booking: false, slots: emptySlots(), schedule: false};
        this.getComponents = this.getComponents.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.bookClick = this.bookClick.bind(this);
    }

    async getSchedule() {
        let schedule = emptySchedule();
        try {
            let response = await HttpRequest("GET", "/api/appointments/schedule");
            response = JSON.parse(response);
            let results = response.result;
            if (results && results.length > 0) {
                for (let i = 0; i < schedule.length; i++) {
                    let day = schedule[i].day;
                    let slots = schedule[i].slots;
                    for (let j = 0; j < slots.length; j++) {
                        let time = slots[j].time;

                        let index = response.result.findIndex((appointment) => {
                            return new Date(appointment.dateTime) - time == 0;
                        });

                        if (index != -1){
                            slots[j].appointment = results[index];
                        }
                    }
                }
                console.log(schedule);
                this.setState({schedule: schedule});
            }
        } catch (e) {
            console.error(e);
        }
    }

    async getAvailableSlots() {
        this.state.slots = emptySlots();
        try {
            let response = await HttpRequest("GET", "/api/appointments/slots");
            response = JSON.parse(response);

            let noClinicians = response.clinicians;
            let appointments = response.result;

            for (let i = 0; i < this.state.slots.length; i++) {
                let day = this.state.slots[i].day;
                let slots = this.state.slots[i].slots;
                for (let j = 0; j < slots.length; j++) {
                    let time = slots[j].time;

                    // Find first index
                    let index = appointments.findIndex((appointment) => {
                        return (new Date(appointment.dateTime) - new Date(time)) == 0;
                    });

                    // Find others
                    while (index != -1) {
                        slots[j].appointments.push(appointments[index]);
                        appointments.splice(index, 1);
                        slots[j].full = slots[j].appointments.length == noClinicians;
                        index = appointments.findIndex((appointment) => {
                            return (new Date(appointment.dateTime) - new Date(time)) == 0;
                        });
                    }
                }
            }

            this.setState({ slots: this.state.slots });
            console.log(this.state.schedule);
        } catch (e) {
            console.error(e);
        }
    }

    update(){
        this.getSchedule();
        this.getAvailableSlots();
    }
    
    /**
     * Run this code when the component has been mounted to DOM.
     */
    componentDidMount() {
        this.update();
        this.interval = setInterval((self) => { self.update() }, 1000, this);
    }

    /**
     * Run this code when the component is unmounted from DOM.
     */
    componentWillUnmount() {
        clearInterval(this.interval);
    }
    
    handleClick(item) {
        this.setState({ slot: item });
    }

    async bookClick(clinician) {
        try {
            let response = await HttpRequest("POST", "/api/appointments/create", [], JSON.stringify({id: clinician._id, dateTime: new Date(this.state.slot.time)}));
            response = JSON.parse(response);
            this.setState({ booked: true, slot: false });
        } catch (e) {
            console.error(e);
        }
    }

    getComponents() {
        if (!this.state.booked && !this.state.slot && !this.state.schedule) {
            return <Slots slots={this.state.slots} handleClick={this.handleClick} />;
        } else if (this.state.slot) {
            return <BookAppointment time={this.state.slot.time} appointments={this.state.slot.appointments} handleClick={this.bookClick}/>
        } else {
            return <Schedule slots={this.state.schedule} handleClick={console.log}/>
        }
    }

    render() {
        let controls = <button type="button" class="btn btn-primary btn-lg btn-block" onClick={() => { window.location.href = "/" }}>Go back</button>;
        return <div>
            {this.getComponents()}
            {controls}
        </div>
    }
}

ReactDOM.render(<Appointments />, document.getElementById("menu"));