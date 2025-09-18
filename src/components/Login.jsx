import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";
import { createUserDocument } from "../utils/userUtils"; // Import our new function

function Login() {
    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        try {
            console.log("Attempting sign-in with pop-up...");
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            console.log("✅ Pop-up sign-in successful! User:", user);

            await createUserDocument(user);

        } catch (error) {
            console.error("🚨 Pop-up Sign-In Error:", error);
            alert(`Pop-up sign-in failed: ${error.message}`);
        }
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