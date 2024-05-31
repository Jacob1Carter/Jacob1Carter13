document.addEventListener('DOMContentLoaded', function() {
    // JavaScript code to detect scrollbar and add class
    const contactLinks = document.querySelector('.contact-links');

    function checkScrollbar() {
        if (contactLinks.scrollWidth > contactLinks.clientWidth) {
            contactLinks.classList.add('has-scrollbar');
        } else {
            contactLinks.classList.remove('has-scrollbar');
        }
    }

    // Call the function on initial load and on resize
    window.addEventListener('load', checkScrollbar);
    window.addEventListener('resize', checkScrollbar);

    // Scroll to the right after inactivity
    let inactivityTimeout;
    let interruptTimeout;
    let interrupted = false;

    function resetInactivityTimeout() {
        clearTimeout(inactivityTimeout);
        clearTimeout(interruptTimeout);
        interrupted = false;
        inactivityTimeout = setTimeout(() => {
            if (!interrupted) {
                scrollToEndGradually(contactLinks, 6000, true); // Scroll to end over 2 seconds
            }
        }, 1000); // Adjust the inactivity period as needed (2000 ms = 2 seconds)
    }

    // Reset the inactivity timer on user interaction
    ['scroll', 'mousemove', 'mousedown', 'touchstart', 'keydown'].forEach(event => {
        contactLinks.addEventListener(event, () => {
            clearInterval(interruptTimeout);
            interrupted = true;
            interruptTimeout = setTimeout(() => {
                interrupted = false;
                resetInactivityTimeout();
            }, 12000); // Resume after 7 seconds if interrupted
        });
    });

    // Initially set the inactivity timeout
    resetInactivityTimeout();

    function scrollToEndGradually(element, duration, scrollBack = false) {
        const start = element.scrollLeft;
        const end = scrollBack ? 0 : element.scrollWidth - element.clientWidth;
        const distance = end - start;
        const startTime = performance.now();

        function scroll() {
            const currentTime = performance.now();
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);

            element.scrollLeft = start + (distance * easeInOutQuad(progress));

            if (progress < 1) {
                requestAnimationFrame(scroll);
            } else if (scrollBack) {
                setTimeout(() => {
                    scrollToEndGradually(element, duration, false);
                }, 4000); // Scroll back after another 2 seconds
            }
        }

        function easeInOutQuad(t) {
            return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        }

        requestAnimationFrame(scroll);
    }
});
