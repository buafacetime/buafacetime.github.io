const sendBtn = document.querySelector('#send'),
	closeBtn = document.querySelector('#close');

const roomName = prompt('Enter room name').trim();

const id = crypto.getRandomValues(new Uint16Array(1))[0],
	exampSocket = new WebSocket('ws://buafacetime.herokuapp.com', 'echo-protocol');

sendBtn.onclick = sendText;
closeBtn.onclick = closeChat;
exampSocket.onopen = openHandler;
exampSocket.onmessage = messageHandler;

const date = () => new Date(Date.now()).toDateString();
const time = () => new Date(Date.now()).toLocaleTimeString();

function closeChat(e) {
	console.log("leaving chat.")
	exampSocket.close(
		3000,
		JSON.stringify({
			message: `${id}, left the chat room`,
			roomName,
		})
	);
}

function openHandler(e) {
	exampSocket.send(
		JSON.stringify({
			type: 'EnterRoom',
			roomName,
		})
	);
}

function messageHandler(e) {
	{
		console.log('you got message....');

		const data = JSON.parse(e.data);

		console.log(data);
		const clientMsg = (data) => {
			let msg = document.createElement('div');
			msg.textContent = `from :: ${data.id} \n ${data.text}`;
			document.querySelector('#msgs').appendChild(msg);
			return;
		};

		const serverMessage = (text) => {
			const msg = document.createElement('div');
			msg.textContent = `from server:: ${text}`;
			document.querySelector('#msgs').appendChild(msg);
			return;
		};

		e.data.startsWith('{') && e.data.endsWith('}') ? clientMsg(data) : serverMessage(data);
	}
}

function sendText(e) {
	const msg = {
		id,
		roomName,
		date: date(),
		time: time(),
		type: 'message',
		text: document.getElementById('text').value,
	};

	exampSocket.send(JSON.stringify(msg));
	document.getElementById('text').value = '';
}
