function FilterBar({
  view,
  setView,
  selectedDay,
  setSelectedDay,
  days,
  selectedCategory,
  setSelectedCategory,
  categories,
}) {
  return (
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

      <div className="category-group">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className={selectedCategory === category ? "active category-pill" : "category-pill"}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <select value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)}>
        {days.map((day) => (
          <option key={day} value={day}>
            {day}
          </option>
        ))}
      </select>
    </section>
  );
}

export default FilterBar;
