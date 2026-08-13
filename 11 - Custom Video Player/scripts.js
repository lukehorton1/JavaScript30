/* Get our elements */
/* we can get the player element once, and then get the controls from within it by using query selector on that element since they all belong to that div */
const player = document.querySelector(".player")
const video = player.querySelector(".viewer")
const progress = player.querySelector(".progress")
const progressBar = player.querySelector(".progress__filled")
const toggle = player.querySelector(".toggle")
const skipButtons = player.querySelectorAll("[data-skip]") // notice these use querySelectorAll as there are multiple
const ranges = player.querySelectorAll(".player__slider") // we can batch the two sliders into one callback loop, and update either by getting the target value. e.g. e.target.name
const playerTime = player.querySelector(".player__time")

let r = document.querySelector(":root") // get the root element
let playing = false; // a flag we will toggle later.
let timeElapsed = 0
let elapsedPercent

//console.log(video)
// console.dir(video) /* see what we can do with the element (scroll down and expand 'proto type' for the methods*/


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
    let mins = Math.floor(timeElapsed / 60) // divides seconds by 60 to get minutes and floor always rounds down
    let seconds = Math.round(timeElapsed % 60) // % is the mod operator and always gets the remainder after the division. So gives us seconds in this case
    // tidy mins and seconds to show leading zeroes ('01' instead of '1'), and round 60 to 0 for seconds
    // these are ternary if statments (condition ? exprIfTrue : exprIfFalse)
    mins = parseInt(mins) < 10 ? "0"+mins : mins
    seconds = parseInt(seconds) < 10 ? "0"+seconds : seconds
    seconds = parseInt(seconds) === 60 ? "00" : seconds

    // You could also use padStart, to pad anything with less than 2 digits with a zero at the start
    // mins = String(mins).padStart(2, '0');
    // seconds = String(seconds).padStart(2, '0');

    playerTime.innerText = mins + " : " + seconds
    console.log(playerTime)
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

// use a helper flag if mouse clicked down. So we can only scrub the video if mouse clicked
let mousedown = false;

progress.addEventListener("mousedown", (e) => mousedown = true)
progress.addEventListener("mouseup", (e) => mousedown = false)

// add event listener for progress bar so we can get the mouse coordintaes
progress.addEventListener("mousemove", (e) => {
    // console.dir(progress) // we can use console.dir to get the prototype and find out we can use this to get the width
    // use the offset x divided by the total x to get how far the mouse is along the bar
    let scrub = (e.offsetX / progress.offsetWidth) // how far into the video we should scrub between 0-1, e.g. 0.7 for 70%
    if (mousedown === true) {
        video.currentTime = video.duration * scrub
    }
})

// the above uses mousemove so will only work on click+drag. Add a click event listener to scrub on click
progress.addEventListener("click", (e) => {
    let scrub = (e.offsetX / progress.offsetWidth) // how far into the video we should scrub between 0-1, e.g. 0.7 for 70%
    video.currentTime = video.duration * scrub
})