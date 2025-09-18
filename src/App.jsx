import { useEffect } from 'react';
import { getRedirectResult } from 'firebase/auth';
import { auth } from './firebase';
import Login from './components/Login';

function App() {
  useEffect(() => {
    const checkRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          // User has just signed in.
          const user = result.user;
          console.log("Signed in from redirect:", user);
          alert(`Welcome back, ${user.displayName}!`);
        }
      } catch (error) {
        console.error("Error getting redirect result:", error);
      }
    };

    checkRedirectResult();
  }, []); // Empty array ensures this runs only once when the app loads

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Login />
    </div>
  );
}

export default App;