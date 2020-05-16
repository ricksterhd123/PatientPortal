

/**
 * This class is composed of three components:
 * <BookAppointment/>, 
 * <AppointmentSlots/>, 
 * <AppointmentSchedule/>
 */
class Appointments extends React.Component {
    constructor(props) {
        super(props);

        // initial state
        this.state = { 
            bookingSlots: false, // Slots
            schedule: false,     // Appointment schedule
            slot: false,        // Has user selected a free slot to book?
            appointment: false, // Has user selected appointment from their schedule?
            cancelling: false   // User is cancelling
        };

        // Binds
        this.selectSlot = this.selectSlot.bind(this);
        this.selectAppointment = this.selectAppointment.bind(this);
        this.book = this.book.bind(this);
        this.reschedule = this.reschedule.bind(this);
        this.cancel = this.cancel.bind(this);
    }

    /**
     * On behalf of the user this method requests a list of all appointments they have booked from the API and
     * stuffs the data into a custom data structure generated by the function emptySchedule. This data is then used to render
     * <AppointmentSchedule/> for when the user has already booked an appointment.
     * TODO: Make compatible with doctors but not admins.
     */
    async getSchedule() {
        let schedule = emptySchedule();
        console.log(schedule.length);
        try {
            let response = await HttpRequest("GET", "/api/appointments/schedule");
            response = JSON.parse(response);
            let results = response.result;
            if (results && results.length > 0) {
                for (let week = 0; week < schedule.length; week++) {
                    for (let day = 0; day < schedule[week].length; day++) {
                        let slots = schedule[week][day].slots;
                        for (let slot = 0; slot < slots.length; slot++) {
                            let time = slots[slot].time;

                            let index = results.findIndex((appointment) => {
                                return new Date(appointment.dateTime) - time == 0;
                            });

                            if (index != -1){
                                slots[slot].appointment = results[index];
                            }
                        }
                    }
                }
                this.setState({schedule: schedule});
            } else if (this.state.schedule) {
                this.setState({schedule: false});
            }
        } catch (e) {
            console.error(e);
        }
    }

    /**
     * TODO: fix
     * This method requests a list of all booked appointments from the API and stuffs the data into 
     * a custom data structure generated by the function emptySlots. This data is then used to render
     * <AppointmentSlots/> for when the user needs to book an appointment slot.
     */
    async getAvailableSlots() {
        try {
            let bookingSlots = emptyBookingSlots();
            let response = await HttpRequest("GET", "/api/appointments/slots");
            response = JSON.parse(response);
            let noClinicians = response.clinicians;
            let appointments = response.result;

            for (let week = 0; week < bookingSlots.length; week++) {
                for (let i = 0; i < bookingSlots[week].length; i++) {
                    let slots = bookingSlots[week][i].slots;
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
            }

            console.log(bookingSlots);
            this.setState({ bookingSlots: bookingSlots });
            console.log(this.state.bookingSlots);
        } catch (e) {
            console.error(e);
        }
    }

    /**
     * Update the views with data fetched from the API
     */
    update(){
        this.getSchedule();
        this.getAvailableSlots();
    }
    
    /**
     * Run this code when the component has been mounted to DOM.
     */
    componentDidMount() {
        this.update();
        this.setState({waiting: true});
        setTimeout((self) => {self.setState({waiting: false})}, 500, this);
        this.interval = setInterval((self) => { self.update() }, 1000, this);
    }

    /**
     * Run this code when the component is unmounted from DOM.
     */
    componentWillUnmount() {
        clearInterval(this.interval);
    }
    
    /**
     * Select an appointment slot
     * @param {object} item
     */
    selectSlot(item) {
        if (item.appointments) {
            this.setState({ slot: item });
        }
    }

    selectAppointment(item) {
        if (item.appointment) {
            this.setState({appointment: item.appointment});
        }
    }

    /**
     * Books an appointment with a clinician at a selected dateTime.
     * @param {object} clinician - This object is recieved from <BookAppointment/> component class.
     */
    async book(clinician) {
        try {
            await HttpRequest("POST", "/api/appointments/create", [], JSON.stringify({id: clinician._id, dateTime: new Date(this.state.slot.time)}));
            this.setState({ slot: false });
        } catch (e) {
            console.error(e);
        }
    }

    async reschedule(appointment) {
        console.log(appointment);
    }

    async cancel(appointment) {
        try {
            await HttpRequest("POST", "/api/appointments/cancel", [], JSON.stringify({appointmentID: appointment._id}));
            this.setState({cancelling: false, appointment: false});
        } catch (e) {
            console.error(e);
        }
    }

    render() {
        if (this.state.waiting) {
            return <div><h2>Loading</h2><div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
            </div></div>;
        } else if (this.state.cancelling) {
            return <CancelAppointment appointment={this.state.appointment} confirm={this.cancel} backHandle={() => {this.setState({cancelling: false})}}/>
        } else if (this.state.appointment) {
            return <ManageAppointment appointment={this.state.appointment} rescheduleClick={this.reschedule} cancelClick={() => {this.setState({cancelling: true})}} backHandle={() => {this.setState({appointment: false})}} />;
        } else if (this.state.schedule){
            return <AppointmentSchedule schedule={this.state.schedule} handleClick={this.selectAppointment} backHandle={() => {window.location.href="/"}}/>;
        } else if (this.state.slot) {   
            return <BookAppointment time={this.state.slot.time} appointments={this.state.slot.appointments} handleClick={this.book} backHandle={()=>{this.setState({slot: false})}}/>;
        } else {
            return <AppointmentSlots slots={this.state.bookingSlots} handleClick={this.selectSlot} backHandle={() => {window.location.href="/"}}/>;
        }
    }  
}

ReactDOM.render(<Appointments />, document.getElementById("menu"));