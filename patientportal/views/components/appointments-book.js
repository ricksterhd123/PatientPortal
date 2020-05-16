
/**
 * Enable the user to choose clinician and book selected appointment slot.
 * Once the user has selected an available appointment slot they must choose a clinician that is available, 
 * (i.e no overlapping appointments during user's selected slot)
 */
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
            // Check if clinician ID already exists in the list of appointments in the slot.
            return this.props.appointments.findIndex(appointment => {return appointment.clinicianID == c._id}) == -1;
        });
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
                <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    {this.state.selected ? this.state.selected.username : "Select an available clinician"}
                </button>
                <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    {this.state.clinicians.map(clinic => <a key={clinic._id} className="dropdown-item" onClick={() => {this.clinicSelect(clinic)}}>{clinic.username}</a>)}
                </div>
            </div>

            <h2>Clinician: {this.state.selected? this.state.selected.username : ""}</h2>
            <p>Time: {new Date(this.props.time).toTimeString()}</p>
            <p>Date: {new Date(this.props.time).toDateString()}</p>
            <p>Duration: 15 minutes</p>
            <button type="button" className="btn btn-primary btn-lg" onClick={() => {this.props.handleClick(this.state.selected)}}>Book appointment</button>
            <button type="button" className="btn btn-warning btn-lg" onClick={this.props.backHandle}>Go back</button>
        </div>
    }
}