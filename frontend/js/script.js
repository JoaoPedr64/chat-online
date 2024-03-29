// logins
const login = document.querySelector(".login")
const loginForm = login.querySelector(".login__form")
const loginInput = login.querySelector(".login__input")

// chats
const chat = document.querySelector(".chat")
const chatForm = chat.querySelector(".chat__form")
const chatInput = chat.querySelector(".chat__input")
const chatMsg = chat.querySelector(".chat__mensagem")

const colors = [
    "cadetblue",
    "darkgoldenrod",
    "cornflowerblue",
    "darkkhaki",
    "hotpink",
    "gold",
    "slateblue",
    "firebrick",
    "forestgreen",
    "mediumorchid",
    "orangered",
    "royalblue",
    "seagreen"
];

function randomColor() {
    const indexColor = Math.floor(Math.random() * colors.length);
    return colors[indexColor];
}

const user = {
    id: "",
    name: "",
    color: ""
};

let ws;

const submitLogin = (event) => {
    event.preventDefault()

    user.id = crypto.randomUUID()
    user.name = loginInput.value
    user.color = randomColor()

    login.style.display = "none"    
    chat.style.display = "flex"

    ws = new WebSocket("wss://chat-online-i3e7.onrender.com")
    ws.onmessage = processMensage
};

const processMensage = ({ data }) => {
    const { userID, userName, userColor, mensagem} = JSON.parse(data)

    let element;

    if (userID === user.id) {
        element = selfMensage(mensagem);
    } else {
        element = otherMensage(mensagem, userName, userColor);
    }

    chatMsg.appendChild(element);
}

const selfMensage = ( conteudo ) => {
    const div = document.createElement("div")
    div.classList.add("mensagem__self")
    div.innerHTML = conteudo

    return div
}

const otherMensage = ( conteudo, user, userColor ) => {
    const div = document.createElement("div")
    const span = document.createElement("span")

    div.classList.add("mesagem__other")
    span.classList.add("mensagem__sender")
    span.style.color = userColor

    div.appendChild(span)

    span.innerHTML = user
    div.innerHTML += conteudo

    return div
}

const sendMensage = ( event ) => {
    event.preventDefault();

    const message = {
        userID: user.id,
        userName: user.name,
        userColor: user.color,
        mensagem: chatInput.value
    }

    ws.send(JSON.stringify(message))

    chatInput.value = ""
}


loginForm.addEventListener("submit", submitLogin)
chatForm.addEventListener("submit", sendMensage)