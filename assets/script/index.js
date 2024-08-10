import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyCChmxrMMiTncdIOt2QpsRKYnzKvL1Bw4k";
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
const voices = [];
speechSynthesis.onvoiceschanged = (e) => {
    voices.push(...speechSynthesis.getVoices());
}

const SHOW_MODAL = (text) => {
    document.querySelector(".modal-bg").style.display = "block";
    document.querySelector(".modal-bg").animate({
        opacity: [0, 1]
    }, {
        duration: 500,
        iterations: 1
    });

    document.querySelector(".modal").animate({
        bottom: ["-100dvh", "0"]
    }, {
        duration: 500,
        iterations: 1
    })

    document.querySelector(".modal").innerHTML = text;

    window.onclick = (ev) => {
        if (ev.target === document.querySelector(".modal-bg")) {
            ev.target.animate({
                opacity: [1, 0]
            }, {
                duration: 500,
                iterations: 1
            })

            document.querySelector(".modal").animate({
                bottom: ["0", "-100dvh"]
            }, {
                duration: 500,
                iterations: 1
            });

            setTimeout(() => {
                document.querySelector(".modal-bg").style.display = "none";
            }, 400);
        }
    }
}

const CHECK_MIC_PERMISSION = () => {
    return navigator.permissions.query({name: "microphone"});
}

document.querySelector(".speak-btn-wrap button").onclick = (ev) => {
    CHECK_MIC_PERMISSION().then(res => {
        if (res.state === "granted") {
            if ('webkitSpeechRecognition' in window) {
                try {
                    ev.target.setAttribute("class", "fa-solid fa-microphone-lines fa-shake");
                var recognition = new webkitSpeechRecognition();
                let transcript = "";
                let prompt = "";
                recognition.continuous = false;
                recognition.interimResults = false;
                recognition.lang = "en-US";
            
                recognition.onstart = () => {
                    console.log('Speech recognition started');
                };
            
                recognition.onerror = async (event) => {
                    let error = await event.error;
                    alert('Speech recognition error: An error occured', error);
                };

                recognition.onnomatch = () => {
                    alert("Please try again. I did not catch that.")
                };
            
                recognition.onend = () => {
                    console.log('Speech recognition ended');
                    ev.target.setAttribute("class", "fa-solid fa-microphone-lines"); 
                };
            
                recognition.onresult = async (event) => {
                    transcript = event.results[0][0].transcript;
                    prompt = `${transcript}`;
                    console.log(prompt);
                    const result = await model.generateContent(prompt);
                    const response = await result.response;
                    const text = response.text();
                    var speak = new SpeechSynthesisUtterance(text.replaceAll("*", "").replaceAll("#", ""));
        
                    speak.lang = "en-US";
                    speak.voice = voices[2];
                    speechSynthesis.speak(speak);
                    speak.onstart = () => {
                        ev.target.setAttribute("class", "fa-solid fa-bullseye fa-beat");
                    }
        
                    speak.onend = () => {
                        ev.target.setAttribute("class", "fa-solid fa-microphone-lines");
                    }
                    
                    console.log(text);
                };
            
                recognition.start();
                } catch (error) {
                    console.error(error);
                }
            } else {
                alert('Speech recognition not supported in this browser.');
            }
        } else {
            alert("Allow this site to access microphone in your site settings.")
        }
    })
}

document.querySelector(".settings-btn").onclick = () => {
    SHOW_MODAL(`
        <h3>Settings</h3>

    `)
}