import { GoogleAuthProvider, signInWithRedirect } from "firebase/auth"; // Changed this line
import { auth } from "../firebase";

function Login() {
    const handleGoogleSignIn = () => { // No longer needs async/await
        const provider = new GoogleAuthProvider();
        signInWithRedirect(auth, provider); // Changed this line
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-3xl font-bold mb-6">Welcome to Lifts</h1>
            <button
                onClick={handleGoogleSignIn}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition duration-300"
            >
                Sign in with Google
            </button>
        </div>
    );
}

export default Login;