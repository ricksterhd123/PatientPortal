
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