import { useMemo, useState } from "react";
import "./App.css";

const openMics = [
  {
    id: 1,
    venue: "Friends Bar",
    address: "208 E 6th St, Austin, TX",
    day: "Monday",
    time: "8:00 PM",
    contact: "@friendsbaratx",
    notes: "Live music open mic, arrive early for signup.",
  },
  {
    id: 2,
    venue: "Kick Butt Coffee",
    address: "5775 Airport Blvd, Austin, TX",
    day: "Tuesday",
    time: "7:00 PM",
    contact: "Venue Organizer",
    notes: "Musician-friendly room with regular open mic nights.",
  },
  {
    id: 3,
    venue: "Mozart's Coffee Roasters",
    address: "3825 Lake Austin Blvd, Austin, TX",
    day: "Wednesday",
    time: "6:30 PM",
    contact: "House Host",
    notes: "Acoustic-friendly vibe.",
  },
  {
    id: 4,
    venue: "The Buzz Mill",
    address: "1505 Town Creek Dr, Austin, TX",
    day: "Thursday",
    time: "8:00 PM",
    contact: "Open Mic Host",
    notes: "Eclectic crowd, good for singer-songwriters.",
  },
];

const days = ["All", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function App() {
  const [view, setView] = useState("list");
  const [selectedDay, setSelectedDay] = useState("All");
  const [formData, setFormData] = useState({
    venue: "",
    address: "",
    day: "Monday",
    time: "",
    contact: "",
    notes: "",
  });

  const filteredOpenMics = useMemo(() => {
    if (selectedDay === "All") return openMics;
    return openMics.filter((mic) => mic.day === selectedDay);
  }, [selectedDay]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Submission captured locally for now. Firebase comes later.");
    setFormData({
      venue: "",
      address: "",
      day: "Monday",
      time: "",
      contact: "",
      notes: "",
    });
  };

  return (
    <div className="app-shell">
      <header className="hero">
        <p className="eyebrow">Austin, Texas</p>
        <h1>Austin Open Mics</h1>
        <p className="subtext">
          Find musician open mics fast. Built for performers heading out tonight.
        </p>
      </header>

      <section className="controls">
        <div className="toggle-group">
          <button
            className={view === "list" ? "active" : ""}
            onClick={() => setView("list")}
          >
            List View
          </button>
          <button
            className={view === "map" ? "active" : ""}
            onClick={() => setView("map")}
          >
            Map View
          </button>
        </div>

        <select value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)}>
          {days.map((day) => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </select>
      </section>

      {view === "map" ? (
        <section className="card map-card">
          <h2>Map Placeholder</h2>
          <p>Centered on Austin, Texas.</p>
          <div className="map-placeholder">
            <span>Interactive map goes here later</span>
          </div>
        </section>
      ) : (
        <section className="list-grid">
          {filteredOpenMics.map((mic) => (
            <article key={mic.id} className="card mic-card">
              <h3>{mic.venue}</h3>
              <p><strong>Address:</strong> {mic.address}</p>
              <p><strong>Day:</strong> {mic.day}</p>
              <p><strong>Time:</strong> {mic.time}</p>
              <p><strong>Contact:</strong> {mic.contact}</p>
              <p><strong>Notes:</strong> {mic.notes}</p>
            </article>
          ))}
        </section>
      )}

      <section className="card form-card">
        <h2>Submit an Open Mic</h2>
        <form onSubmit={handleSubmit}>
          <input
            name="venue"
            placeholder="Venue name"
            value={formData.venue}
            onChange={handleChange}
            required
          />
          <input
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            required
          />
          <select name="day" value={formData.day} onChange={handleChange}>
            {days
              .filter((d) => d !== "All")
              .map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
          </select>
          <input
            name="time"
            placeholder="Start time"
            value={formData.time}
            onChange={handleChange}
            required
          />
          <input
            name="contact"
            placeholder="Organizer contact"
            value={formData.contact}
            onChange={handleChange}
          />
          <textarea
            name="notes"
            placeholder="Notes"
            value={formData.notes}
            onChange={handleChange}
            rows="4"
          />
          <button type="submit">Submit</button>
        </form>
      </section>
    </div>
  );
}

export default App;
