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
* Get an empty schedule
*/
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
            let dateTime = new Date(weekStart)
            dateTime.setDate(dateTime.getDate() + i);
            dateTime.setHours(hour);
            dateTime.setMinutes(minutes);
            dateTime.setMilliseconds(0);
            slots.push({ time: dateTime, appointments: [], full: false });
        }

        schedule.push({
            day: days[i],
            slots: slots
        });
    }

    return schedule;
}

function Row(props) {
    return <td class={props.className} onClick={() => { props.fn(props.obj) }}>{props.obj.text}</td>
}

function Rows(props) {
    if (props.time && props.items) {
        let hours = new Date(props.time).getHours();
        let minutes = new Date(props.time).getMinutes();
        minutes = minutes > 9 ? minutes.toString() : '0' + minutes;

        let rowTime = <th scope="row">{`${hours}:${minutes}`}</th>
        let items = props.items.map(item => <Row className={item.class} obj={item} fn={props.rowFn} />);
        return <tr>
            {rowTime}
            {items}
        </tr>
    }
}

class Slots extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let cols = [];
        let schedule = this.props.schedule;
        if (schedule) {
            for (let i = 0; i < slotsEachDay; i++) {
                let time = false;
                let item = []
                for (let j = 0; j < daysEachWeek; j++) {
                    let slot = schedule[j].slots[i];
                    //cols[index].rows = [];
                    time = slot.time;
                    item.push({time: time, text: slot.full ? "Fully booked" : "Free", class: slot.full ? "table-danger" : "table-success", appointments: slot.appointments});
                }
                cols.push({time: time, items: item })
            }
        }

        return <div>
            <h1>Select an available slot</h1>
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        {days.map(d => <th scope="col">{d}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {cols.map((value) =>
                        <Rows time={value.time} items={value.items} rowFn={this.props.handleClick} />
                    )}
                </tbody>
            </table>

        </div>
    }
}

class BookAppointment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {clinicians: [], selected: false};
        this.clinicSelect = this.clinicSelect.bind(this);
        
    }

    async update() {
        let response = await HttpRequest("GET", "/api/appointments/clinicians");
        response = JSON.parse(response);
        let clinicians = response.result;
        clinicians = clinicians.filter(c => {
            let index = this.props.appointments.findIndex(a => {return a.clinicianID == c._id});
            return index == -1;
        })
        this.setState({clinicians: clinicians});
    }

    clinicSelect(clinician) {
        console.log(clinician);
        this.setState({selected: clinician});
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


    render() {
        return <div>
            <div class="dropdown">
                <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    {this.state.selected ? this.state.selected.username : "Select an available clinician"}
                </button>
                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    {this.state.clinicians.map(clinic => <a class="dropdown-item" onClick={() => {this.clinicSelect(clinic)}}>{clinic.username}</a>)}
                </div>
            </div>

            <h2>Clinician: {this.state.selected? this.state.selected.username : ""}</h2>
            <p>Time: {new Date(this.props.time).toTimeString()}</p>
            <p>Date: {new Date(this.props.time).toDateString()}</p>
            <p>Duration: 15 minutes</p>
            <button type="button" class="btn btn-primary btn-lg" onClick={() => {this.props.handleClick(this.state.selected)}}>Book appointment</button>
        </div>
    }
}

class Appointments extends React.Component {
    constructor(props) {
        super(props);
        this.state = { booked: false, slot: false, booking: false, schedule: emptySchedule()};
        this.getComponents = this.getComponents.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.bookClick = this.bookClick.bind(this);
    }

    async getAvailableSlots() {
        this.state.schedule = emptySchedule();
        let response = await HttpRequest("GET", "/api/appointments/slots");
        response = JSON.parse(response);

        let noClinicians = response.clinicians;
        let appointments = response.result;

        for (let i = 0; i < this.state.schedule.length; i++) {
            let day = this.state.schedule[i].day;
            let slots = this.state.schedule[i].slots;

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
        this.setState({ schedule: this.state.schedule });
    }

    update(){
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
        console.log(item);
        this.setState({ slot: item });
    }

    async bookClick(clinician) {
        console.log(clinician);
        try {
            console.log(JSON.stringify({id: clinician._id, dateTime: new Date(this.state.slot.time)}))
            let response = await HttpRequest("POST", "/api/appointments/create", [], JSON.stringify({id: clinician._id, dateTime: new Date(this.state.slot.time)}));
            response = JSON.parse(response);
            console.log(response);
            this.setState({ booked: true, slot: false });
        } catch (e) {
            console.error(e);
        }
    }

    getComponents() {
        if (!this.state.booked && !this.state.slot) {
            return <Slots schedule={this.state.schedule} handleClick={this.handleClick} />;
        } else if (this.state.slot) {
            return <BookAppointment time={this.state.slot.time} appointments={this.state.slot.appointments} handleClick={this.bookClick}/>
        } else {
            return <div>
                <h1>Schedule</h1>
            </div>
        }
    }

    render() {
        let controls = <button type="button" class="btn btn-primary btn-lg btn-block" onClick={() => { window.location.href = "/appointments" }}>Go back</button>;
        return <div>
            {this.getComponents()}
            {controls}
        </div>
    }
}

ReactDOM.render(<Appointments />, document.getElementById("menu"));