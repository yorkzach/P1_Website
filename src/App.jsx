import React, { useState } from 'react';
import coursesData from './courseData';

function App() {
  const [modalCourse, setModalCourse] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [courseLevel, setCourseLevel] = useState('All Levels');
  const [creditHours, setCreditHours] = useState('All Credits');
  const [semester, setSemester] = useState('All Semesters');
  const coursesPerPage = 10;

  const [favorites, setFavorites] = useState([]);

  const [showFavorites, setShowFavorites] = useState(false);

  const filteredCourses = coursesData.filter(course => {
    const levelMatch = courseLevel === 'All Levels' || 
      Math.floor(parseInt(course.header.match(/\d+/)[0])/100)*100 === parseInt(courseLevel);
    const creditMatch = creditHours === 'All Credits' || course.credits === parseInt(creditHours);
    const semesterMatch = semester === 'All Semesters' || course.semesters.includes(semester);
    const searchMatch = course.header.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.title.toLowerCase().includes(searchTerm.toLowerCase());
    const favoritesMatch = !showFavorites || favorites.includes(course.id);
  
    return levelMatch && creditMatch && semesterMatch && searchMatch && favoritesMatch;
  });

  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
  const displayedCourses = filteredCourses.slice(
    (currentPage - 1) * coursesPerPage,
    currentPage * coursesPerPage
  );

  const toggleFavorite = (courseId) => {
    setFavorites(currentFavorites => {
      if (currentFavorites.includes(courseId)) {
        return currentFavorites.filter(id => id !== courseId);
      } else {
        return [...currentFavorites, courseId];
      }
    });
  };



  const openModal = (course) => setModalCourse(course);
  const closeModal = () => setModalCourse(null);

  return (
    <div className="app-container">
      <header className="header">
        <h1>BYU CS Courses</h1>
        <p className="subtitle">Explore undergraduate Computer Science courses</p>
        <p className="results-count">
          Showing {displayedCourses.length} of {filteredCourses.length} courses
        </p>
      </header>

      <div className="main-content">
        <aside className="filters">
          <div className="filter-group">
            <label>Search</label>
            <div className="search-container">
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button className="clear-button" onClick={() => setSearchTerm('')}>×</button>
              )}
            </div>
          </div>

          <div className="filter-group">
            <label>Course Level</label>
            <select value={courseLevel} onChange={(e) => setCourseLevel(e.target.value)}>
              <option>All Levels</option>
              <option value="100">100 Level</option>
              <option value="200">200 Level</option>
              <option value="300">300 Level</option>
              <option value="400">400 Level</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Credit Hours</label>
            <select value={creditHours} onChange={(e) => setCreditHours(e.target.value)}>
              <option>All Credits</option>
              {[...new Set(coursesData.map(c => c.credits))].sort().map(credit => (
                <option key={credit} value={credit}>{credit} credit{credit !== 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Semester</label>
            <select value={semester} onChange={(e) => setSemester(e.target.value)}>
              <option>All Semesters</option>
              <option value="F">Fall</option>
              <option value="W">Winter</option>
              <option value="SP">Spring</option>
              <option value="SU">Summer</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Show Favorites</label>
            <input
              type="checkbox"
              checked={showFavorites}
              onChange={() => setShowFavorites(f => !f)}
            />
          </div>
        </aside>

        <main className="courses-container">
          <div className="courses-scroll">
            <div className="courses-grid">
              {displayedCourses.map((course) => (
                <div className="course-card" key={course.id}>
                <div className="card-header">
                  <h3>{course.header}</h3>
                  <span className="credits">{course.credits} credits</span>
                  <button 
                    className={`favorite-button ${favorites.includes(course.id) ? 'favorited' : ''}`}
                    onClick={() => toggleFavorite(course.id)}
                  >
                    {favorites.includes(course.id) ? '★ Unfavorite' : '☆ Favorite'}
                  </button>
                </div>
                <h4>{course.title}</h4>
                <p className="description">{course.description.substring(0, 120)}...</p>
                <div className="semester-badges">
                  {course.semesters.map((sem, idx) => (
                    <span key={idx} className={`semester ${sem}`}>{sem}</span>
                  ))}
                </div>
                <button className="more-button" onClick={() => openModal(course)}>Details</button>
              </div>
              ))}
            </div>
          </div>

          <div className="pagination">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </main>
      </div>

      {modalCourse && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>
            <h2>{modalCourse.header}: {modalCourse.title}</h2>
            <button
                className={`favorite-button ${favorites.includes(modalCourse.id) ? 'favorited' : ''}`}
                onClick={() => toggleFavorite(modalCourse.id)}
              >
                {favorites.includes(modalCourse.id) ? '★ Unfavorite' : '☆ Favorite'}
            </button>
            <p className="modal-description">{modalCourse.description}</p>
            <div className="modal-details">
              <p><strong>Credits:</strong> {modalCourse.credits}</p>
              <p><strong>Semesters Offered:</strong></p>
              <div className="modal-semesters">
                {modalCourse.semesters.map((sem, idx) => (
                  <span key={idx} className={`semester ${sem}`}>
                    {sem === 'F' ? 'Fall' : sem === 'W' ? 'Winter' : sem === 'SP' ? 'Spring' : 'Summer'}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;


