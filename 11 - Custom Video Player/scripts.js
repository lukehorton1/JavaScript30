/* Get our elements */
/* we can get the player element once, and then get the controls from within it by using query selector on that element since they all belong to that div */
const player = document.querySelector(".player")
const video = player.querySelector(".viewer")
const progress = player.querySelector(".progress")
const progressBar = player.querySelector(".progress__filled")
const toggle = player.querySelector(".toggle")
const skipButtons = player.querySelectorAll("[data-skip]") // notice these use querySelectorAll as there are multiple
const ranges = player.querySelectorAll(".player__slider") // we can batch the two sliders into one callback loop, and update either by getting the target value. e.g. e.target.name

let playing = false; // a flag we will toggle later.

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

/* check if video currently playing */

console.log(video.paused)

// video.addEventListener("playing", (e) => if )

console.log(toggle)
toggle.addEventListener("click", (e) => {
    if (video.paused) {
        videoPlaying()
    } else {
        videoPaused()
    }
})

console.log(ranges)

// loop through each range slider and add an event listener pointing at the same function. 
ranges.forEach(range => {
    range.addEventListener("change", (e) => {
        // adjust either playback rate or volume according to the slider value based on the name of the element passed
        if (e.target.name === "volume") {
            video.volume = e.target.value
        } else {
            video.playbackRate = e.target.value
        }
    })
})
