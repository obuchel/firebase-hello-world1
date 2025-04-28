

// src/App.jsx
import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set } from 'firebase/database';

function App() {
  const [message, setMessage] = useState('Loading...');
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    // Firebase configuration
    // Replace with your own Firebase config
    const firebaseConfig = {
      apiKey: "YOUR_API_KEY",
      authDomain: "your-project-id.firebaseapp.com",
      databaseURL: "https://your-project-id-default-rtdb.firebaseio.com",
      projectId: "your-project-id",
      storageBucket: "your-project-id.appspot.com",
      messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
      appId: "YOUR_APP_ID"
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const database = getDatabase(app);
    const messageRef = ref(database, 'message');

    // Listen for changes to the message in Firebase
    const unsubscribe = onValue(messageRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setMessage(data);
      } else {
        // If no message exists yet, set the default message
        set(messageRef, 'Hello World!');
      }
    });

    // Clean up the listener
    return () => unsubscribe();
  }, []);

  const updateMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const database = getDatabase();
      set(ref(database, 'message'), newMessage);
      setNewMessage('');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>{message}</h1>
        <form onSubmit={updateMessage}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a new message"
          />
          <button type="submit">Update Message</button>
        </form>
      </header>
    </div>
  );
}

export default App;
