import { useEffect, useMemo, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "./firebase/config";
import { submitOpenMic } from "./firebase/openMics";
import { openMics as fallbackOpenMics } from "./data/openMics";
import Admin from "./pages/Admin";
import "./App.css";

const days = ["All", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const categories = ["All", "Music", "Comedy", "Poetry", "Acting/Improv"];

const emptyForm = {
  venue: "",
  category: "Music",
  address: "",
  day: "Monday",
  time: "",
  contact: "",
  signupLink: "",
  notes: "",
};

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicApp />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
}

function PublicApp() {
  const [view, setView] = useState("list");
  const [selectedDay, setSelectedDay] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [formData, setFormData] = useState(emptyForm);
  const [liveOpenMics, setLiveOpenMics] = useState([]);
  const [loadingLive, setLoadingLive] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "openMics"), where("approved", "==", true));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLiveOpenMics(docs);
        setLoadingLive(false);
      },
      (error) => {
        console.error("Error loading approved open mics:", error);
        setLoadingLive(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const dataSource = liveOpenMics.length > 0 ? liveOpenMics : fallbackOpenMics;

  const filteredOpenMics = useMemo(() => {
    return dataSource.filter((mic) => {
      const matchesDay = selectedDay === "All" || mic.day === selectedDay;
      const matchesCategory =
        selectedCategory === "All" || mic.category === selectedCategory;

      return matchesDay && matchesCategory;
    });
  }, [dataSource, selectedDay, selectedCategory]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const cleanedData = {
      ...formData,
      venue: formData.venue.trim(),
      category: formData.category.trim(),
      address: formData.address.trim(),
      day: formData.day.trim(),
      time: formData.time.trim(),
      contact: formData.contact.trim() || "",
      signupLink: formData.signupLink.trim() || "",
      notes: formData.notes.trim() || "",
    };

    await submitOpenMic(cleanedData, "public-user");
    alert("Thanks — your open mic was submitted for admin review.");
    setFormData(emptyForm);
  } catch (error) {
    console.error("Submission failed:", error);
    alert("Could not submit open mic. Please try again.");
  }
};
  return (
    <div className="app-shell">
      <Header />

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

        <div className="category-pills">
          {categories.map((category) => (
            <button
              key={category}
              className={`category-pill ${selectedCategory === category ? "active" : ""}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <select
          value={selectedDay}
          onChange={(e) => setSelectedDay(e.target.value)}
        >
          {days.map((day) => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </select>
      </section>

      {liveOpenMics.length === 0 && !loadingLive && (
        <section className="card status-card">
          Showing local sample data until Firebase approved listings are available.
        </section>
      )}

      {view === "map" ? (
        <section className="card form-card">
          <h2>Map View</h2>
          <p>Map feature coming next.</p>
        </section>
      ) : (
        <section className="mic-grid">
          {filteredOpenMics.map((mic) => (
            <OpenMicCard key={mic.id || mic.venue} mic={mic} />
          ))}
        </section>
      )}

      <section className="card form-card">
        <h2>Submit an Open Mic</h2>
        <p>Public submissions are reviewed before appearing live.</p>

        <form onSubmit={handleSubmit}>
          <input
            name="venue"
            placeholder="Venue name"
            value={formData.venue}
            onChange={handleChange}
            required
          />

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            {categories
              .filter((category) => category !== "All")
              .map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
          </select>

          <input
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            required
          />

          <select
            name="day"
            value={formData.day}
            onChange={handleChange}
            required
          >
            {days
              .filter((day) => day !== "All")
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

          <input
            name="signupLink"
            placeholder="Signup link"
            value={formData.signupLink}
            onChange={handleChange}
          />

          <textarea
            name="notes"
            placeholder="Notes"
            value={formData.notes}
            onChange={handleChange}
            rows="4"
          />

          <button type="submit">Submit for Review</button>
        </form>
      </section>
    </div>
  );
}

function Header() {
  return (
    <header className="hero">
      <p className="eyebrow">AUSTIN, TEXAS</p>
      <h1>Austin Open Mics</h1>
      <p className="hero-copy">
        Find musician open mics fast. Built for performers heading out tonight.
      </p>

      <p style={{ marginTop: "12px" }}>
        <Link to="/admin" className="admin-link">
          Go to Admin
        </Link>
      </p>
    </header>
  );
}

function OpenMicCard({ mic }) {
  const signupLink = mic.signupLink?.trim() || "";
  const showSignupButton =
    signupLink !== "" && signupLink.toLowerCase() !== "none";

  return (
    <article className="card openmic-card">
      <h3>{mic.venue}</h3>
      <p><strong>Category:</strong> {mic.category}</p>
      <p><strong>Address:</strong> {mic.address}</p>
      <p><strong>Day:</strong> {mic.day}</p>
      <p><strong>Time:</strong> {mic.time}</p>
      <p><strong>Contact:</strong> {mic.contact || "—"}</p>
      <p><strong>Notes:</strong> {mic.notes || "—"}</p>

      {showSignupButton && (
        <a
          href={signupLink}
          target="_blank"
          rel="noreferrer"
          className="signup-button"
        >
          Sign Up
        </a>
      )}
    </article>
  );
}
