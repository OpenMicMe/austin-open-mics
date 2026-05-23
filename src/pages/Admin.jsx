import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase/config";
import { approveOpenMic, deleteOpenMic } from "../firebase/openMics";
import { signInWithGoogle, signOutUser, watchAuthState } from "../firebase/auth";
import "../App.css";

const ADMIN_EMAIL = "jfchuck19892011@gmail.com";

export default function Admin() {
  const [user, setUser] = useState(null);
  const [pendingMics, setPendingMics] = useState([]);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [loadingMics, setLoadingMics] = useState(true);

  useEffect(() => {
    const unsubscribe = watchAuthState((currentUser) => {
      setUser(currentUser);
      setLoadingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user || user.email !== ADMIN_EMAIL) {
      setPendingMics([]);
      setLoadingMics(false);
      return;
    }

    const q = query(collection(db, "openMics"), where("approved", "==", false));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPendingMics(docs);
        setLoadingMics(false);
      },
      (error) => {
        console.error("Error loading pending open mics:", error);
        setLoadingMics(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const handleApprove = async (id) => {
    try {
      await approveOpenMic(id);
      alert("Open mic approved.");
    } catch (error) {
      console.error("Approve failed:", error);
      alert("Could not approve open mic.");
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this submission?");
    if (!confirmed) return;

    try {
      await deleteOpenMic(id);
      alert("Submission deleted.");
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Could not delete submission.");
    }
  };

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Login failed:", error);
      alert("Could not sign in.");
    }
  };

  const handleLogout = async () => {
    try {
      await signOutUser();
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Could not sign out.");
    }
  };

  if (loadingAuth) {
    return (
      <div className="app-shell">
        <HeaderBlock />
        <section className="card form-card admin-card">
          <h2>Loading admin access...</h2>
        </section>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="app-shell">
        <HeaderBlock />
        <section className="card form-card admin-card">
          <h2>Admin Login Required</h2>
          <p className="admin-subtitle">
            Sign in with your Google account to access the admin page.
          </p>
          <button className="approve-button" onClick={handleLogin}>
            Sign in with Google
          </button>
        </section>
      </div>
    );
  }

  if (user.email !== ADMIN_EMAIL) {
    return (
      <div className="app-shell">
        <HeaderBlock />
        <section className="card form-card admin-card">
          <h2>Access Denied</h2>
          <p className="admin-subtitle">
            Signed in as <strong>{user.email}</strong>, but this account is not an admin.
          </p>
          <div className="admin-actions">
            <button className="delete-button" onClick={handleLogout}>
              Sign out
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <HeaderBlock />

      <section className="card form-card admin-card">
        <div className="admin-topbar">
          <div>
            <h2>Admin Review</h2>
            <p className="admin-subtitle">
              Review pending public submissions before they appear live.
            </p>
          </div>

          <div className="admin-userbox">
            <p className="admin-email">{user.email}</p>
            <button className="delete-button" onClick={handleLogout}>
              Sign out
            </button>
          </div>
        </div>

        {loadingMics ? (
          <p>Loading pending submissions...</p>
        ) : pendingMics.length === 0 ? (
          <p>No pending submissions right now.</p>
        ) : (
          <div className="admin-list">
            {pendingMics.map((mic) => (
              <div key={mic.id} className="card admin-item">
                <h3>{mic.venue || "Untitled Venue"}</h3>
                <p><strong>Category:</strong> {mic.category || "—"}</p>
                <p><strong>Address:</strong> {mic.address || "—"}</p>
                <p><strong>Day:</strong> {mic.day || "—"}</p>
                <p><strong>Time:</strong> {mic.time || "—"}</p>
                <p><strong>Contact:</strong> {mic.contact || "—"}</p>
                <p><strong>Signup Link:</strong> {mic.signupLink || "—"}</p>
                <p><strong>Notes:</strong> {mic.notes || "—"}</p>
                <p><strong>Submitted By:</strong> {mic.submittedBy || "—"}</p>

                <div className="admin-actions">
                  <button
                    className="approve-button"
                    onClick={() => handleApprove(mic.id)}
                  >
                    Approve
                  </button>

                  <button
                    className="delete-button"
                    onClick={() => handleDelete(mic.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function HeaderBlock() {
  return (
    <header className="hero">
      <p className="eyebrow">AUSTIN, TEXAS</p>
      <h1>Austin Open Mics Admin</h1>
      <p className="hero-copy">
        Review and approve submitted open mic listings.
      </p>
    </header>
  );
}
