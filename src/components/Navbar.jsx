import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <nav className="bg-gray-800 p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/dashboard" className="text-xl font-bold text-white">
                    Lifts
                </Link>
                <div className="space-x-6">
                    <Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors">
                        Dashboard
                    </Link>
                    <Link to="/sessions" className="text-gray-300 hover:text-white transition-colors">
                        Sessions
                    </Link>
                    <Link to="/exercises" className="text-gray-300 hover:text-white transition-colors">
                        Exercises
                    </Link>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;