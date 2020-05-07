
var startTime = { hours: 7, minutes: 0, seconds: 0, milliseconds: 0 };
var endTime = { hours: 18, minutes: 0, seconds: 0, milliseconds: 0 };
var appointmentDurationMins = 15;  // Minutes
var appointmentDurationHours = appointmentDurationMins / 60;
var dayDurationHours = endTime.hours - startTime.hours;
var slotsEachDay = dayDurationHours / appointmentDurationHours;
var daysEachWeek = 6; // m | t | w | t | f | s
var days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

class Schedule extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let cols = [];
        let schedule = this.props.slots;
        if (schedule) {
            for (let i = 0; i < slotsEachDay; i++) {
                let time = false;
                let item = []
                for (let j = 0; j < daysEachWeek; j++) {
                    let slot = schedule[j].slots[i];
                    //cols[index].rows = [];
                    time = slot.time;
                    item.push({time: time, text: slot.appointment ? "Booked" : "", class: slot.appointment ? "table-danger" : "", appointment: slot.appointment});
                }
                cols.push({time: time, items: item})
            }
        }

        return <div>
            <h2>Schedule</h2>
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