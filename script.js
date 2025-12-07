// script.js

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('qualificationForm');
    const submitBtn = document.getElementById('submitBtn');
    const submitText = document.getElementById('submitText');
    const spinner = document.getElementById('spinner');
    const message = document.getElementById('message');
    const formContainer = document.getElementById('form-container');
    const successState = document.getElementById('success-state');

    // The target API endpoint for POST submission
    const API_ENDPOINT = 'https://zerogpt.app.n8n.cloud/webhook-test/form-api-v1form-api-v1';
    
    // Helper function to show loading state
    const setLoading = (isLoading) => {
        submitBtn.disabled = isLoading;
        if (isLoading) {
            submitText.textContent = 'Submitting...';
            spinner.classList.remove('hidden');
            message.textContent = '';
        } else {
            submitText.textContent = 'Submit & See Next Step';
            spinner.classList.add('hidden');
        }
    };

    // Form submission handler
    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent default form submission
        setLoading(true);

        try {
            // 1. Collect form data
            const formData = new FormData(form);
            const data = {};
            
            // Convert FormData to a simple JSON object
            formData.forEach((value, key) => {
                // For radio buttons, the last one wins, which is correct
                data[key] = value.trim();
            });

            // 2. POST data using Fetch API
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Note: No 'Authorization' or 'x-api-key' is included as per prompt.
                },
                body: JSON.stringify(data),
            });

            // Check for a successful response (status 200-299)
            if (response.ok) {
                // Success State Transition
                form.classList.add('hidden');
                successState.classList.remove('hidden');
                formContainer.scrollIntoView({ behavior: 'smooth' }); // Scroll to the success message
                message.textContent = 'Success! Your information has been received.';
                message.className = 'mt-4 text-center text-sm font-semibold text-primary';

            } else {
                // Handle API errors (e.g., 400, 500)
                const errorData = await response.text();
                console.error('API Submission Error:', response.status, errorData);
                message.textContent = `Submission failed (Error: ${response.status}). Please try again or contact support.`;
                message.className = 'mt-4 text-center text-sm font-semibold text-red-400';
            }

        } catch (error) {
            // Handle network or other unexpected errors
            console.error('Network or Parse Error:', error);
            message.textContent = 'An unexpected error occurred. Check your network connection.';
            message.className = 'mt-4 text-center text-sm font-semibold text-red-400';

        } finally {
            setLoading(false); // Reset loading state
        }
    });
});
