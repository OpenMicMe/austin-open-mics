function OpenMicCard({ mic }) {
  return (
    <article className="card mic-card">
      <h3>
        {mic.signupLink ? (
          <a
            href={mic.signupLink}
            target="_blank"
            rel="noreferrer"
            className="venue-link"
          >
            {mic.venue}
          </a>
        ) : (
          mic.venue
        )}
      </h3>

      <p><strong>Category:</strong> {mic.category}</p>
      <p><strong>Address:</strong> {mic.address}</p>
      <p><strong>Day:</strong> {mic.day}</p>
      <p><strong>Time:</strong> {mic.time}</p>
      <p><strong>Contact:</strong> {mic.contact}</p>
      <p><strong>Notes:</strong> {mic.notes}</p>

      {mic.signupLink && (
        <a
          href={mic.signupLink}
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

export default OpenMicCard;
