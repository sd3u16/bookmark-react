import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [modalVisible, setModalVisible] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');

  useEffect(() => {
    // Fetch bookmarks from localStorage
    const storedBookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    
    // If no bookmarks in localStorage, initialize with default
    if (!storedBookmarks) {
      const defaultBookmarks = [
        {
          name: 'Jacinto Design',
          url: 'http://jacinto.design',
        },
      ];
      localStorage.setItem('bookmarks', JSON.stringify(defaultBookmarks));
      setBookmarks(defaultBookmarks);
    } else {
      setBookmarks(storedBookmarks);
    }
  }, []);

  const toggleModal = () => setModalVisible(!modalVisible);

  // Validate Form
  const validate = (nameValue, urlValue) => {
    const expression = /(https)?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/g;
    const regex = new RegExp(expression);
    if (!nameValue || !urlValue) {
      alert('Please submit values for both fields.');
      return false;
    }
    if (!urlValue.match(regex)) {
      alert('Please provide a valid web address.');
      return false;
    }
    return true;
  };

  // Store a new bookmark
  const storeBookmark = (e) => {
    e.preventDefault();

    // Validate name and url inputs
    if (!validate(name, url)) return;

    // Add 'https://' if not included
    let urlValue = url;
    if (!urlValue.includes('https://') && !urlValue.includes('http://')) {
      urlValue = `https://${urlValue}`;
    }

    // Create new bookmark object
    const newBookmark = {
      name: name,
      url: urlValue,
    };

    // Update the bookmarks array with the new bookmark
    const updatedBookmarks = [...bookmarks, newBookmark];
    
    // Update the state
    setBookmarks(updatedBookmarks);
    
    // Store updated bookmarks in localStorage
    localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));

    // Clear the form fields
    setName('');
    setUrl('');

    // Close the modal
    toggleModal();
  };

  // Delete a bookmark
  const deleteBookmark = (url) => {
    // Filter out the bookmark that matches the provided URL
    const updatedBookmarks = bookmarks.filter((bookmark) => bookmark.url !== url);

    // Update the bookmarks state
    setBookmarks(updatedBookmarks);

    // Update localStorage
    localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
  };

  return (
    <div className="App">
      <header>
        <h1 onClick={toggleModal}>Add Bookmark</h1>
      </header>

      {modalVisible && (
        <div className="modal-container show-modal" onClick={toggleModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="close-icon" onClick={toggleModal}>
                &times;
              </span>
              <h3>Add Bookmark</h3>
            </div>
            <div className="modal-content">
              <form onSubmit={storeBookmark}>
                <div className="form-group">
                  <label htmlFor="website-name" className="form-label">
                    Website Name
                  </label>
                  <input
                    id="website-name"
                    className="form-input"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="website-url" className="form-label">
                    Website URL
                  </label>
                  <input
                    id="website-url"
                    className="form-input"
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                  />
                </div>
                <button type="submit">Submit</button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Display Bookmarks */}
      <div className="container">
        {bookmarks.map((bookmark, index) => (
          <div key={index} className="item">
            <i
              className="fa fa-times"
              onClick={() => deleteBookmark(bookmark.url)}
              aria-hidden="true"
            ></i>
            <div className="name">
              <img
                src={`https://s2.googleusercontent.com/s2/favicons?domain=${bookmark.url}`}
                alt="Favicon"
              />
              <a href={bookmark.url} target="_blank" rel="noopener noreferrer">
                {bookmark.name}
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;




