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

class AppointmentSlots extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let cols = [];
        let schedule = this.props.slots;
        if (schedule) {
            for (let i = 0; i < slotsEachDay; i++) {
                let item = [];
                let time = false;
                for (let j = 0; j < daysEachWeek; j++) {
                    let slot = schedule[j].slots[i];
                    let className = "table-success";
                    let text = "Free";
                    let appointments = slot.appointments;
                    time = slot.time; 

                    if (slot.full) {
                        text = "Fully booked";
                        className = "table-danger";
                        appointments = false;
                    } else if (time - new Date() < 0) {
                        text = "";
                        className = "table-dark";
                        appointments = false;
                    }
                    // Time here is used to get time of the appointment selected
                    item.push({time: time, text: text, class: className, appointments: appointments});
                }
                // Time here is used for the row labels
                cols.push({time: time, items: item })
            }
        }

        return <div>
            <h2>Click a slot to book it</h2>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        {days.map(d => <th scope="col">{d}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {cols.map((value) =>
                        <Rows key={value.time} time={value.time} items={value.items} rowFn={this.props.handleClick} />
                    )}
                </tbody>
            </table>
            <button type="button" className="btn btn-danger btn-lg btn-block" onClick={this.props.backHandle}>Go back</button>
        </div>
    }
}