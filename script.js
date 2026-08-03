document.addEventListener('DOMContentLoaded', () => {
    console.log('Page loaded'); 
    const video = document.getElementById('memeVideo');
    const lemonBtn = document.getElementById('lemonBtn');

    if (!video || !lemonBtn) {
        console.error('Element not found:', { video, lemonBtn });
        return;
    }

    // NEW: Listen for the video to finish, then redirect
    video.addEventListener('ended', () => {
        console.log('Video finished! Redirecting to Samsung demo...');
        window.location.href = "https://trygalaxy.com/?utm_source=retail&utm_medium=qr&utm_campaign=GTMOps_Kit_Pens";
    });

    // Wait for click on the lemon
    lemonBtn.addEventListener('click', () => {
        console.log('Lemon clicked, starting video');
        lemonBtn.style.display = 'none';
        video.style.display = 'block';
        video.volume = 0;
        video.muted = false;

        // Start video
        video.play().then(() => {
            console.log('Video started');
            increaseVolume();
        }).catch(error => {
            console.error('Playback error:', error);
            video.muted = true;
            video.play().then(() => {
                video.muted = false;
                increaseVolume();
            });
        });

        // Background playback support
        video.addEventListener('pause', () => {
            if (document.hidden && video.currentTime < video.duration) {
                console.log('Attempting to resume playback in background');
                video.play().catch(error => {
                    console.error('Background resume failed:', error);
                });
            }
        });

        // Page visibility handling
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && !video.paused) {
                console.log('Page hidden, keeping video playing');
            } else if (!document.hidden && video.paused) {
                console.log('Page visible, resuming video');
                video.play().catch(error => {
                    console.error('Resume failed:', error);
                });
            }
        });
    });

    function increaseVolume() {
        console.log('Starting volume increase');
        let volume = 0;
        const duration = 1000; 
        const startTime = performance.now();

        function updateVolume() {
            const elapsed = performance.now() - startTime;
            volume = Math.min(elapsed / duration, 1);
            video.volume = volume;
            console.log('Volume set to:', volume);
            if (volume < 1) {
                requestAnimationFrame(updateVolume);
            } else {
                console.log('Volume reached 100%');
            }
        }
        requestAnimationFrame(updateVolume);
    }
});
