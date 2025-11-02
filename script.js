function goToHomepage() {
    window.location.href = 'homepage.html'; 
}

function goToVetAI() {
    window.location.href = 'vetAI.html'; 
}

function goToMessages() {
    window.location.href = 'messages.html'; 
}

function goToProfile() {
    window.location.href = 'profilepage.html'; 
}

function sendMsg(message) {
    const input = document.getElementById('messageInput');
    const chat = document.getElementById('chatMessages');
    const msg = document.createElement('div');

    msg.className = 'message sent';
    msg.textContent = message;

    chat.appendChild(msg);
    input.value = '';
    chat.scrollTop = chat.scrollHeight;
}

function receiveMsg(message) {
    const chat = document.getElementById('chatMessages');
    const msg = document.createElement('div');

    msg.className = 'message received';
    msg.textContent = message;

    chat.appendChild(msg);
    chat.scrollTop = chat.scrollHeight;
}


const sendBtn = document.getElementById('sendButton');
const input = document.getElementById('messageInput');
const chat = document.getElementById('chatMessages');

//Asking 1st question
sendBtn.addEventListener('click', () => {
const text = input.value.trim();

    if (text) {
        sendMsg(text);
        botReply(text);
    }
});

input.addEventListener('keypress', e => {
    if (e.key === 'Enter') sendBtn.click();
});


const initialPage =  document.getElementById('initial-page');
const aiChat = document.getElementById('ai-chat');
var inputBox = document.getElementById("input-box");

//Asking subsequent questions
inputBox.addEventListener("keydown", function(event) {
// Check if the pressed key is the Enter key
    if (event.key === "Enter") {
        initialPage.classList.add('hidden');
        aiChat.classList.remove('hidden');

        const text = inputBox.value.trim();
        if (text) {
            sendMsg(text);
            botReply(text);
        }
    }
});


//Get AI response and output it in message box
async function botReply(userMessage) {
    const API_KEY = "AIzaSyB-ym9pfEueRx4JpNVvFjM1TGzbL82xoNs";
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

    const chat = document.getElementById('chatMessages');

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [{ text: userMessage }],
                    },
                ],
            }),
        });

        const data = await response.json();
        console.log(data);

        if(!data.candidates || !data.candidates.length) {
            throw new Error("No response from Gemini API");
        }

        const botMessage = data.candidates[0].content.parts[0].text;
        receiveMsg(botMessage);
    }
    catch (error) {
        console.error("Error:", error)

        receiveMsg("Please input another question.");
    }
}

