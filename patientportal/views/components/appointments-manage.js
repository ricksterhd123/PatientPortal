
/**
 * Enable the user to choose clinician and book selected appointment slot.
 * Once the user has selected an available appointment slot they must choose a clinician that is available, 
 * (i.e no overlapping appointments during user's selected slot)
 */
class ManageAppointment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {clinician: false};
    }

    async update() {
        try {
        let response = await HttpRequest("GET", "/api/appointments/clinicians");
        response = JSON.parse(response);

        if (response.result.length > 0) {
            let clinician = response.result.find(c => {
                // Check if clinician ID already exists in the list of appointments in the slot.
                return this.props.appointment.clinicianID == c._id;
            });

            this.setState({clinician: clinician});
        }
        } catch (e) {
            console.error(e);
        }
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
            {this.state.clinician ? <h2>Clinician: {this.state.clinician.username}</h2> : ""}
            <p>Time: {new Date(this.props.appointment.dateTime).toTimeString()}</p>
            <p>Date: {new Date(this.props.appointment.dateTime).toDateString()}</p>
            <p>Duration: 15 minutes</p>
            <button type="button" className="btn btn-primary btn-lg" onClick={() => {this.props.rescheduleClick(this.props.appointment)}}>Reschedule appointment</button>
            <button type="button" className="btn btn-primary btn-lg" onClick={() => {this.props.cancelClick(this.props.appointment)}}>Cancel appointment</button>
            <button type="button" className="btn btn-warning btn-lg" onClick={this.props.backHandle}>Go back</button>
        </div>
    }
}