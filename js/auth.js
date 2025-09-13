// js/auth.js - DEFINITIVE FINAL VERSION (With IWA Head Check)

document.addEventListener('DOMContentLoaded', () => {
    // This script should only run on the login page.
    if (!document.getElementById('signInBtn')) {
        return; // If there's no Sign In button, stop immediately.
    }

    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const signInBtn = document.getElementById('signInBtn');
    const signUpBtn = document.getElementById('signUpBtn');

    // --- MAIN LOGIC ---

    async function handleSignIn() {
        const email = emailInput.value;
        const password = passwordInput.value;
        if (!email || !password) {
            alert("Please enter both email and password.");
            return;
        }

        // Sign in the user
        const { data: { user }, error } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            alert('Error signing in: ' + error.message);
        } else if (user) {
            // After a successful login, check the user's ID
            
            // =======================================================================
            // CRITICAL: Replace this placeholder with your REAL IWA Head User ID
            // You can find this in your Supabase project under Authentication > Users
            // =======================================================================
            const IWA_HEAD_USER_ID = '9ec202e3-0748-44e8-9945-2298d6f01af5'; 
            
            if (user.id === IWA_HEAD_USER_ID) {
                // If the user is the IWA Head, send them to the dashboard
                window.location.href = 'dashboard.html';
            } else {
                // Otherwise, send them to the normal user panel
                window.location.href = 'index.html';
            }
        }
    }

    async function handleSignUp() {
        const email = emailInput.value;
        const password = passwordInput.value;
        if (!email || !password) {
            alert("Please enter both email and password.");
            return;
        }
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
    passwordInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            handleSignIn();
        }
    });

    // --- INITIALIZATION ---
    // This function is for redirecting users who are already logged in
    async function checkSessionAndRedirect() {
        const { data: { session } } = await supabaseClient.auth.getSession();
        if (session) {
            // User is already logged in, so they should not be on the login page.
            
            // =======================================================================
            // CRITICAL: Replace this placeholder with your REAL IWA Head User ID
            // =======================================================================
            const IWA_HEAD_USER_ID = 'YOUR_IWA_HEAD_USER_ID';
            
            if (session.user.id === IWA_HEAD_USER_ID) {
                // Redirect the IWA Head to their dashboard
                window.location.href = 'dashboard.html';
            } else {
                // Redirect normal users to their panel
                window.location.href = 'index.html';
            }
        }
    }

    // Run the check as soon as the page loads.
    checkSessionAndRedirect();
});