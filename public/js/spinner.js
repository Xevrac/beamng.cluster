document.addEventListener("DOMContentLoaded", function() {
    setTimeout(function() {
        const spinner = document.querySelector('.spinner');

        if (spinner) {
            // Only add the spinner class if the spinner element is present
            spinner.classList.add('spinner-jump');
        }

        setTimeout(function() {
            const splashScreen = document.getElementById('splash-screen');
            if (splashScreen) {
                splashScreen.style.transition = 'opacity 0.5s ease-out';
                splashScreen.style.opacity = '0';

                setTimeout(function() {
                    splashScreen.style.display = 'none';
                    const appContent = document.getElementById('app-content');
                    if (appContent) {
                        appContent.style.display = 'block';
                    }
                }, 200);
            } else {
                // If splash-screen is not present, directly show app content
                const appContent = document.getElementById('app-content');
                if (appContent) {
                    appContent.style.display = 'block';
                }
            }
        }, 250);
    }, 1000);
});
