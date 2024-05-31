$(document).ready(function() {

    var currBanner = 0;
    var bannerCount = 0;
    var timer;

    countBanners = function() {
        // count how many li are in ul with id="banner-imgs"
        var banners = document.querySelectorAll('#banner-imgs li');
        return banners.length;
    }

    moveBanner = function() {
        var banners = document.querySelectorAll('#banner-imgs li');
        var indicators = document.querySelectorAll('.banner-indicators li');

        // Remove active class from current indicator
        indicators[currBanner].classList.remove('indicator-active');

        // Calculate next banner index
        var nextBanner = (currBanner + 1) % bannerCount;

        // Add active class to next indicator
        indicators[nextBanner].classList.add('indicator-active');

        // Move all banners to the left by 1000 pixels
        for (var i = 0; i < bannerCount; i++) {
            var currentTranslateX = parseInt(banners[i].style.transform.replace('translateX(', '').replace('px)', '')) || 0;
            if (currentTranslateX <= -1000) {
                // Temporarily disable transition
                var reset = currentTranslateX/1000;
                banners[i].style.transition = 'none';
                banners[i].style.transform = `translateX(${(bannerCount + reset) * 1000}px)`;
                // Force reflow
                banners[i].offsetHeight;
                // Re-enable transition
                banners[i].style.transition = 'transform 0.5s ease';
            }
            var newTranslateX = parseInt(banners[i].style.transform.replace('translateX(', '').replace('px)', '')) || 0;
            banners[i].style.transform = `translateX(${newTranslateX - 1000}px)`;
        }

        // Update current banner index
        currBanner = nextBanner;
    }

    goto = function(index) {
        var banners = document.querySelectorAll('#banner-imgs li');
        var indicators = document.querySelectorAll('.banner-indicators li');

        // Remove active class from current indicator
        indicators[currBanner].classList.remove('indicator-active');

        // Add active class to target indicator
        indicators[index].classList.add('indicator-active');

        // Move all banners to the correct position
        for (var i = 0; i < bannerCount; i++) {
            var offset = (i - index) * 1000;
            if (offset < -1000 * (bannerCount - 1)) {
                // Temporarily disable transition
                banners[i].style.transition = 'none';
                banners[i].style.transform = `translateX(${(bannerCount - 1) * 1000}px)`;
                // Force reflow
                banners[i].offsetHeight;
                // Re-enable transition
                banners[i].style.transition = 'transform 0.5s ease';
            } else {
                banners[i].style.transition = 'transform 0.5s ease';
                banners[i].style.transform = `translateX(${offset}px)`;
            }
        }

        // Update current banner index
        currBanner = index;

        // Restart the automatic scrolling
        clearInterval(timer);
        timer = setInterval(moveBanner, 5000);
    }

    startScroll = function() {
        timer = setInterval(moveBanner, 5000); // Change banner every 5 seconds
    }

    initScroll = function() {
        bannerCount = countBanners();
        if (bannerCount > 1) {
            startScroll();
        }

        // Add click event listeners to indicators
        var indicators = document.querySelectorAll('.banner-indicators li');
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', function() {
                goto(index);
            });
        });
    }

    initScroll();
});
