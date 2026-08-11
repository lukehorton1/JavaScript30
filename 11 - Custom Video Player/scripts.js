/* Get our elements */
/* we can get the player element once, and then get the controls from within it by using query selector on that element since they all belong to that div */
const player = document.querySelector(".player")
const video = player.querySelector(".viewer")
const progress = player.querySelector(".progress")
const progressBar = player.querySelector(".progress__filled")
const toggle = player.querySelector(".toggle")
const skipButtons = player.querySelectorAll("[data-skip]") // notice these use querySelectorAll as there are multiple
const ranges = player.querySelectorAll(".player__slider") // we can batch the two sliders into one callback loop, and update either by getting the target value. e.g. e.target.name

let r = document.querySelector(":root") // get the root element
let playing = false; // a flag we will toggle later.
let timeElapsed = 0
let elapsedPercent

//console.log(video)
console.dir(video) /* see what we can do with the element (scroll down and expand 'proto type' for the methods*/


/* Build out functions */
function videoPlaying() {
    video.play() // play video first and foremost using .play() method
    // actions to perform when video is playing...
    toggle.innerText = "❚❚" // change to pause button
    console.log(video.currentTime) // we can get the current time, we could use this to update the progress bar, but likely in a diffferent function. 

}

function videoPaused() {
    video.pause() // call pause method
    toggle.innerText = "►"
}


/* Hook up the even listeners */

// check play status and pause/resume 
toggle.addEventListener("click", (e) => {
    if (video.paused) {
        videoPlaying()
    } else {
        videoPaused()
    }
})

// also make it so you can click the video to pause. 
video.addEventListener("click", () => {
    if (video.paused) {
        videoPlaying();
    } else {
        videoPaused();
    }
});

 // use timeupdate event to update progress bar and time elapsed. More events here; https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/video#events
video.addEventListener("timeupdate", (e) => {
    console.log(video.currentTime)
    // update css variables to update progress bar
    timeElapsed = video.currentTime
    elapsedPercent = (timeElapsed/video.duration)*100
    r.style.setProperty("--elapsed-percent", elapsedPercent+"%")
    console.log(elapsedPercent)
    
})

skipButtons.forEach(skipButton => {
    skipButton.addEventListener("click", (e) => {
        let skipTime = parseFloat(e.target.dataset.skip) // before this parseFloat() it was being returned as a string. Causing the time to return [duration]25. E.g. 60s video becomes 60 + "25" = 6025
        video.currentTime = video.currentTime + parseFloat(skipTime) // skip forward/backward by updating currentTime. 
    })
})


// loop through each range slider and add an event listener pointing at the same function. 
ranges.forEach(range => {
    range.addEventListener("input", (e) => {
        // adjust either playback rate or volume according to the slider value based on the name of the element passed
        if (e.target.name === "volume") {
            video.volume = e.target.value
        } else {
            video.playbackRate = e.target.value
        }
    })
})
