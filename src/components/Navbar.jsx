import { Link } from 'react-router-dom';
import { signOut } from 'firebase/auth'; // Import the signOut function
import { auth } from '../firebase';     // Import the auth instance

function Navbar() {
    const handleSignOut = async () => {
        try {
            await signOut(auth);
            console.log("User signed out successfully.");
        } catch (error) {
            console.error("Error signing out: ", error);
        }
    };

    return (
        <nav className="bg-gray-800 p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/dashboard" className="text-xl font-bold text-white">
                    Lifts
                </Link>
                <div className="flex items-center space-x-6">
                    <Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors">
                        Dashboard
                    </Link>
                    <Link to="/sessions" className="text-gray-300 hover:text-white transition-colors">
                        Sessions
                    </Link>
                    <Link to="/exercises" className="text-gray-300 hover:text-white transition-colors">
                        Exercises
                    </Link>
                    <button
                        onClick={handleSignOut}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-lg text-sm transition-colors"
                    >
                        Sign Out
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;