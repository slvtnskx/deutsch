export function updateProgressBar(step){
    let startValue = progress.value;
    let targetValue = Math.min(startValue + step, progress.max); 
    let duration = 300; 
    let startTime = performance.now();

    function animateProgress(currentTime) {
        let elapsedTime = currentTime - startTime;
        let progression = Math.min(elapsedTime / duration, 1); 
        progress.value = startValue + progression * (targetValue - startValue);

        if (progression < 1) {
            requestAnimationFrame(animateProgress);
        }
    }

    requestAnimationFrame(animateProgress);
}
