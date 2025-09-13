// js/auth.js - ROBUST AND CORRECTED VERSION

document.addEventListener('DOMContentLoaded', () => {
    // This script should only run on the login page.
    if (!document.getElementById('signInBtn')) {
        return; // If there's no Sign In button, stop.
    }

    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const signInBtn = document.getElementById('signInBtn');
    const signUpBtn = document.getElementById('signUpBtn');

    // --- MAIN LOGIC ---

    // Function to handle signing in a user.
    async function handleSignIn() {
        const email = emailInput.value;
        const password = passwordInput.value;

        const { error } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            alert('Error signing in: ' + error.message);
        } else {
            // On success, redirect to the main application page.
            window.location.href = 'index.html';
        }
    }

    // Function to handle signing up a new user.
    async function handleSignUp() {
        const email = emailInput.value;
        const password = passwordInput.value;

        const { error } = await supabaseClient.auth.signUp({
            email: email,
            password: password,
        });

        if (error) {
            alert('Error signing up: ' + error.message);
        } else {
            alert('Sign up successful! Please check your email for a confirmation link.');
        }
    }

    // --- EVENT LISTENERS ---
    signInBtn.addEventListener('click', handleSignIn);
    signUpBtn.addEventListener('click', handleSignUp);
    
    // Add event listener for Enter key on password field for quick login
    passwordInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            handleSignIn();
        }
    });


    // --- INITIALIZATION ---
    // This is the most important part for fixing the "stuck" bug.
    // It checks if the user is ALREADY logged in when they visit the login page.
    async function checkSession() {
        const { data: { session } } = await supabaseClient.auth.getSession();
        if (session) {
            // If they are already logged in, don't wait, just send them to the app.
            console.log('User already logged in. Redirecting...');
            window.location.href = 'index.html';
        } else {
            // If not logged in, show the page.
            console.log('No active session. Showing login page.');
        }
    }

    // Run the check as soon as the page loads.
    checkSession();
});