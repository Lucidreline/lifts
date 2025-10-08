import { useState } from 'react'; // 1. Import useState
import { Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

function Navbar() {
    // 2. Add state to track if the mobile menu is open
    const [isOpen, setIsOpen] = useState(false);

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
                {/* Your Logo/Brand Name can go here */}
                <div className="text-white text-lg font-bold">
                    <Link to="/dashboard">Lifts</Link>
                </div>

                {/* 3. Hamburger Button - only shows on mobile */}
                <div className="md:hidden">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label={isOpen ? "Close menu" : "Open menu"}
                    >
                        {isOpen ? (
                            // "X" Icon
                            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            // Hamburger Icon
                            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                            </svg>
                        )}
                    </button>
                </div>

                {/* 4. Navigation Links - updated with responsive classes */}
                <div data-testid="nav-links-container" className={`
                    ${isOpen ? 'flex' : 'hidden'} 
                    md:flex flex-col md:flex-row absolute md:static top-16 left-0 w-full md:w-auto 
                    bg-gray-800 md:bg-transparent shadow-md md:shadow-none 
                    items-center space-y-4 md:space-y-0 md:space-x-6 p-4 md:p-0
                `}>
                    <Link to="/dashboard" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white transition-colors">
                        Dashboard
                    </Link>
                    <Link to="/sessions" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white transition-colors">
                        Sessions
                    </Link>
                    <Link to="/exercises" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white transition-colors">
                        Exercises
                    </Link>
                    <Link to="/routines" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white transition-colors">
                        Routines
                    </Link>
                    <button
                        onClick={handleSignOut}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-lg text-sm transition-colors w-full md:w-auto"
                    >
                        Sign Out
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;