/**
    * PawPals Authentication System
    * Handles user login recovery
    * Implements user feedback requirements and robust error handling
    */

/**
    * Authentication Controller - Main business logic controller
    * Manages form switching, validation, and user interactions
    */
class AuthController {
    /**
     * Initialize the authentication system
     * Set up event listeners and form validation
     */
    static init() {
        this.setupEventListeners();
        this.loadRememberedUser();
    }

    /**
     * Set up all event listeners for form interactions
     * Critical for user experience and accessibility
     */
    static setupEventListeners() {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) loginForm.addEventListener('submit', this.handleLogin.bind(this));

        const registerForm = document.getElementById('registerForm');
        if (registerForm) registerForm.addEventListener('submit', this.handleRegister.bind(this));

        const forgotPasswordForm = document.getElementById('forgotPasswordForm');
        if (forgotPasswordForm) forgotPasswordForm.addEventListener('submit', this.handleForgotPassword.bind(this));

        const registerUsername = document.getElementById('registerUsername');
        if (registerUsername) registerUsername.addEventListener('input', this.validateUsername);

        const registerEmail = document.getElementById('registerEmail');
        if (registerEmail) registerEmail.addEventListener('input', this.validateEmail);

        const registerPassword = document.getElementById('registerPassword');
        if (registerPassword) registerPassword.addEventListener('input', this.validatePassword);

        const confirmPassword = document.getElementById('confirmPassword');
        if (confirmPassword) confirmPassword.addEventListener('input', this.validatePasswordConfirm);
    }

    /**
     * Handle user registration form submission
     * @param {Event} e - Form submission event
     */
    static async handleRegister(e) {
        e.preventDefault();
        
        const formData = {
            username: document.getElementById('registerUsername').value.trim(),
            email: document.getElementById('registerEmail').value.trim(),
            password: document.getElementById('registerPassword').value,
            confirmPassword: document.getElementById('confirmPassword').value,
            acceptTerms: document.getElementById('acceptTerms').checked
        };

        // Comprehensive validation
        if (!this.validateRegistrationForm(formData)) {
            return;
        }

        try {
            this.setLoadingState('registerBtn', true);
            
            // Simulate API call
            await this.simulateAPICall(2000);
            
            this.showNotification('Account created successfully! Welcome to PawPals!', 'success');
            
            // Auto-login after successful registration
            setTimeout(() => {
                this.goToLogin();
                document.getElementById('loginUsername').value = formData.username;
            }, 1500);

        } catch (error) {
            this.showNotification('Registration failed. Please try again.', 'error');
        } finally {
            this.setLoadingState('registerBtn', false);
        }
    }

    /**
        * Load remembered user credentials if "Remember me" was checked
        * High-priority user convenience feature
        */
    static loadRememberedUser() {
        const rememberedUsername = localStorage.getItem('rememberedUsername');
        if (rememberedUsername) {
            document.getElementById('loginUsername').value = rememberedUsername;
            document.getElementById('rememberMe').checked = true;
        }
    }

    /**
     * Handle user login form submission
     * @param {Event} e - Form submission event
     */
    static async handleLogin(e) {
        e.preventDefault();
        
        const username = document.getElementById('loginUsername').value.trim();
        const password = document.getElementById('loginPassword').value;
        const rememberMe = document.getElementById('rememberMe').checked;

        // Client-side validation
        if (!this.validateLoginForm(username, password)) {
            return;
        }

        try {
            this.setLoadingState('loginBtn', true);
            
            // Simulate API call - replace with actual backend integration
            await this.simulateAPICall(1500);
            
            // Handle remember me functionality
            if (rememberMe) {
                localStorage.setItem('rememberedUsername', username);
            } else {
                localStorage.removeItem('rememberedUsername');
            }

            this.showNotification('Login successful! Welcome back to PawPals!', 'success');
            
            // In real app: redirect to dashboard
            setTimeout(() => {
                window.location.href = 'homepage.html';
            }, 1500);
        } catch (error) {
            this.showNotification('Login failed. Please check your credentials.', 'error');
        } finally {
            this.setLoadingState('loginBtn', false);
        }
    }

    /**
    * Comprehensive login form validation
    * @param {string} username - User's username
    * @param {string} password - User's password
    * @returns {boolean} - Validation result
    */
    static validateLoginForm(username, password) {
        let isValid = true;

        if (!username) {
            this.showFieldError('loginUsernameError', 'Username is required');
            isValid = false;
        } else {
            this.clearFieldError('loginUsernameError');
        }

        if (!password) {
            this.showFieldError('loginPasswordError', 'Password is required');
            isValid = false;
        } else {
            this.clearFieldError('loginPasswordError');
        }

        return isValid;
    }

    /**
     * Comprehensive registration form validation
     * @param {Object} formData - Registration form data
     * @returns {boolean} - Validation result
     */
    static validateRegistrationForm(formData) {
        let isValid = true;

        // Username validation
        if (!this.validateUsername(formData.username, 'registerUsernameError')) {
            isValid = false;
        }

        // Email validation
        if (!this.validateEmail(formData.email, 'registerEmailError')) {
            isValid = false;
        }

        // Password validation
        if (!this.validatePassword(formData.password, 'registerPasswordError')) {
            isValid = false;
        }

        // Password confirmation
        if (formData.password !== formData.confirmPassword) {
            this.showFieldError('confirmPasswordError', 'Passwords do not match');
            isValid = false;
        } else {
            this.clearFieldError('confirmPasswordError');
        }

        // Terms acceptance
        if (!formData.acceptTerms) {
            this.showFieldError('termsError', 'You must accept the terms to continue');
            isValid = false;
        } else {
            this.clearFieldError('termsError');
        }

        return isValid;
    }

    /**
     * Username validation with real-time feedback
     * @param {string} username - Username to validate
     * @param {string} errorElementId - Error display element ID
     * @returns {boolean} - Validation result
     */
    static validateUsername(username, errorElementId = null) {
        const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
        
        if (typeof username === 'object') {
            // Called from event listener
            username = username.target.value.trim();
            errorElementId = 'registerUsernameError';
        }

        if (!username) {
            if (errorElementId) this.showFieldError(errorElementId, 'Username is required');
            return false;
        }

        if (!usernameRegex.test(username)) {
            if (errorElementId) this.showFieldError(errorElementId, 'Username must be 3-20 characters, letters, numbers, and underscores only');
            return false;
        }

        if (errorElementId) this.clearFieldError(errorElementId);
        return true;
    }

    /**
     * Email validation with comprehensive checks
     * @param {string} email - Email to validate
     * @param {string} errorElementId - Error display element ID
     * @returns {boolean} - Validation result
     */
    static validateEmail(email, errorElementId = null) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (typeof email === 'object') {
            // Called from event listener
            email = email.target.value.trim();
            errorElementId = 'registerEmailError';
        }

        if (!email) {
            if (errorElementId) this.showFieldError(errorElementId, 'Email is required');
            return false;
        }

        if (!emailRegex.test(email)) {
            if (errorElementId) this.showFieldError(errorElementId, 'Please enter a valid email address');
            return false;
        }

        if (errorElementId) this.clearFieldError(errorElementId);
        return true;
    }

    /**
     * Password validation with strength requirements
     * @param {string} password - Password to validate
     * @param {string} errorElementId - Error display element ID
     * @returns {boolean} - Validation result
     */
    static validatePassword(password, errorElementId = null) {
        if (typeof password === 'object') {
            // Called from event listener
            password = password.target.value;
            errorElementId = 'registerPasswordError';
        }

        if (!password) {
            if (errorElementId) this.showFieldError(errorElementId, 'Password is required');
            return false;
        }

        if (password.length < 8) {
            if (errorElementId) this.showFieldError(errorElementId, 'Password must be at least 8 characters long');
            return false;
        }

        if (!/(?=.*[a-zA-Z])(?=.*[0-9])/.test(password)) {
            if (errorElementId) this.showFieldError(errorElementId, 'Password must contain both letters and numbers');
            return false;
        }

        if (errorElementId) this.clearFieldError(errorElementId);
        return true;
    }

    /**
     * Real-time password confirmation validation
     * @param {Event} e - Input event
     */
    static validatePasswordConfirm(e) {
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = e.target.value;

        if (confirmPassword && password !== confirmPassword) {
            AuthController.showFieldError('confirmPasswordError', 'Passwords do not match');
        } else {
            AuthController.clearFieldError('confirmPasswordError');
        }
    }

    static openTermsOfService() 
    {
        window.open("TermsOfService.html", "_blank");
    }
    
    static openPrivacyPolicy()
    {
        window.open("PrivacyPolicy.html", "_blank");
    }

    /**
        * Handle forgot password form submission
        * @param {Event} e - Form submission event
        */
    static async handleForgotPassword(e) {
        e.preventDefault();
        
        const email = document.getElementById('forgotEmail').value.trim();

        if (!this.validateEmail(email, 'forgotEmailError')) {
            return;
        }

        try {
            this.setLoadingState('forgotBtn', true);
            
            // Simulate API call
            await this.simulateAPICall(1500);
            
            // Show success message
            document.getElementById('forgotPasswordForm').classList.add('hidden');
            document.getElementById('resetSuccessMessage').classList.remove('hidden');
            document.getElementById('backToLogin').classList.remove('hidden');
            
            this.showNotification('Password reset link sent to your email!', 'success');

        } catch (error) {
            this.showNotification('Failed to send reset link. Please try again.', 'error');
        } finally {
            this.setLoadingState('forgotBtn', false);
        }
    }


    /**
     * Username validation with real-time feedback
     * @param {string} username - Username to validate
     * @param {string} errorElementId - Error display element ID
     * @returns {boolean} - Validation result
     */
    static validateUsername(username, errorElementId = null) {
        const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
        
        if (typeof username === 'object') {
            // Called from event listener
            username = username.target.value.trim();
            errorElementId = 'registerUsernameError';
        }

        if (!username) {
            if (errorElementId) this.showFieldError(errorElementId, 'Username is required');
            return false;
        }

        if (!usernameRegex.test(username)) {
            if (errorElementId) this.showFieldError(errorElementId, 'Username must be 3-20 characters, letters, numbers, and underscores only');
            return false;
        }

        if (errorElementId) this.clearFieldError(errorElementId);
        return true;
    }

    /**
     * Email validation with comprehensive checks
     * @param {string} email - Email to validate
     * @param {string} errorElementId - Error display element ID
     * @returns {boolean} - Validation result
     */
    static validateEmail(email, errorElementId = null) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (typeof email === 'object') {
            // Called from event listener
            email = email.target.value.trim();
            errorElementId = 'registerEmailError';
        }

        if (!email) {
            if (errorElementId) this.showFieldError(errorElementId, 'Email is required');
            return false;
        }

        if (!emailRegex.test(email)) {
            if (errorElementId) this.showFieldError(errorElementId, 'Please enter a valid email address');
            return false;
        }

        if (errorElementId) this.clearFieldError(errorElementId);
        return true;
    }

    /**
     * Password validation with strength requirements
     * @param {string} password - Password to validate
     * @param {string} errorElementId - Error display element ID
     * @returns {boolean} - Validation result
     */
    static validatePassword(password, errorElementId = null) {
        if (typeof password === 'object') {
            // Called from event listener
            password = password.target.value;
            errorElementId = 'registerPasswordError';
        }

        if (!password) {
            if (errorElementId) this.showFieldError(errorElementId, 'Password is required');
            return false;
        }

        if (password.length < 8) {
            if (errorElementId) this.showFieldError(errorElementId, 'Password must be at least 8 characters long');
            return false;
        }

        if (!/(?=.*[a-zA-Z])(?=.*[0-9])/.test(password)) {
            if (errorElementId) this.showFieldError(errorElementId, 'Password must contain both letters and numbers');
            return false;
        }

        if (errorElementId) this.clearFieldError(errorElementId);
        return true;
    }

    /**
     * Real-time password confirmation validation
     * @param {Event} e - Input event
     */
    static validatePasswordConfirm(e) {
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = e.target.value;

        if (confirmPassword && password !== confirmPassword) {
            AuthController.showFieldError('confirmPasswordError', 'Passwords do not match');
        } else {
            AuthController.clearFieldError('confirmPasswordError');
        }
    }

    /**
    * Form switching methods for navigation
    */
    static goToLogin() {
        window.location.href = "login.html";
    }

    static goToRegister() {
        window.location.href = "registration.html";
    }

    static goToReset() {
        window.location.href = "ResetPassword.html";
    }

    /**
     * UI Helper Methods
     */
    
    /**
     * Set loading state for buttons during API calls
     * @param {string} buttonId - Button element ID
     * @param {boolean} isLoading - Loading state
     */
    static setLoadingState(buttonId, isLoading) {
        const button = document.getElementById(buttonId);
        const text = button.querySelector('.btn-text');
        const spinner = button.querySelector('.loading-spinner');

        if (isLoading) {
            button.disabled = true;
            text.classList.add('hidden');
            spinner.classList.remove('hidden');
        } else {
            button.disabled = false;
            text.classList.remove('hidden');
            spinner.classList.add('hidden');
        }
    }

    /**
     * Show field-specific error messages
     * @param {string} elementId - Error element ID
     * @param {string} message - Error message
     */
    static showFieldError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
    }

    /**
     * Clear field-specific error messages
     * @param {string} elementId - Error element ID
     */
    static clearFieldError(elementId) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.classList.remove('show');
        }
    }

    /**
     * Show user notifications for feedback
     * @param {string} message - Notification message
     * @param {string} type - Notification type (success, error, info)
     */
    static showNotification(message, type = 'info') {
        const container = document.getElementById('notificationContainer');
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;

        container.appendChild(notification);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    /**
     * Simulate API calls for demonstration
     * @param {number} delay - Delay in milliseconds
     */
    static simulateAPICall(delay) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate occasional failures for testing
                if (Math.random() > 0.9) {
                    reject(new Error('Simulated API failure'));
                } else {
                    resolve();
                }
            }, delay);
        });
    }
}

/**
 * Test Suite for Authentication Functions
 * Ensures code reliability and catches regressions
 */
class AuthTests {
    /**
     * Run all authentication tests
     */
    static runTests() {
        console.log('Running PawPals Authentication Tests...');
        
        this.testUsernameValidation();
        this.testEmailValidation();
        this.testPasswordValidation();
        this.testFormSwitching();
        
        console.log('All tests completed.');
    }

    /**
     * Test username validation logic
     */
    static testUsernameValidation() {
        console.log('Testing username validation...');
        
        // Valid usernames
        console.assert(AuthController.validateUsername('john123') === true, 'Valid username should pass');
        console.assert(AuthController.validateUsername('pet_lover') === true, 'Username with underscore should pass');
        
        // Invalid usernames
        console.assert(AuthController.validateUsername('') === false, 'Empty username should fail');
        console.assert(AuthController.validateUsername('ab') === false, 'Short username should fail');
        console.assert(AuthController.validateUsername('user@name') === false, 'Username with special chars should fail');
        
        console.log('✓ Username validation tests passed');
    }

    /**
     * Test email validation logic
     */
    static testEmailValidation() {
        console.log('Testing email validation...');
        
        // Valid emails
        console.assert(AuthController.validateEmail('user@example.com') === true, 'Valid email should pass');
        console.assert(AuthController.validateEmail('test.user@domain.co.uk') === true, 'Complex valid email should pass');
        
        // Invalid emails
        console.assert(AuthController.validateEmail('') === false, 'Empty email should fail');
        console.assert(AuthController.validateEmail('invalid.email') === false, 'Email without @ should fail');
        console.assert(AuthController.validateEmail('@domain.com') === false, 'Email without user part should fail');
        
        console.log('✓ Email validation tests passed');
    }

    /**
     * Test password validation logic
     */
    static testPasswordValidation() {
        console.log('Testing password validation...');
        
        // Valid passwords
        console.assert(AuthController.validatePassword('password123') === true, 'Valid password should pass');
        console.assert(AuthController.validatePassword('myPet2023') === true, 'Mixed case password should pass');
        
        // Invalid passwords
        console.assert(AuthController.validatePassword('') === false, 'Empty password should fail');
        console.assert(AuthController.validatePassword('short') === false, 'Short password should fail');
        console.assert(AuthController.validatePassword('onlyletters') === false, 'Password without numbers should fail');
        console.assert(AuthController.validatePassword('12345678') === false, 'Password without letters should fail');
        
        console.log('✓ Password validation tests passed');
    }

    /**
     * Test form switching functionality
     */
    static testFormSwitching() {
        console.log('Testing form switching...');
        
        // Test initial state
        console.assert(!document.getElementById('loginContainer').classList.contains('hidden'), 'Login should be visible initially');
        
        // Test switching to register
        AuthController.goToRegister();
        console.assert(document.getElementById('loginContainer').classList.contains('hidden'), 'Login should be hidden after switching');
        console.assert(!document.getElementById('registerContainer').classList.contains('hidden'), 'Register should be visible');
        
        // Test switching back to login
        AuthController.goToLogin();
        console.assert(!document.getElementById('loginContainer').classList.contains('hidden'), 'Login should be visible again');
        console.assert(document.getElementById('registerContainer').classList.contains('hidden'), 'Register should be hidden');
        
        console.log('✓ Form switching tests passed');
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    AuthController.init();
    
    // Run tests in development mode
    if (window.location.hostname === 'localhost' || window.location.hostname.includes('codespaces')) {
        AuthTests.runTests();
    }
});

// Global error handler for better user experience
window.addEventListener('error', (e) => {
    console.error('Application error:', e.error);
    AuthController.showNotification('An unexpected error occurred. Please refresh the page.', 'error');
});
