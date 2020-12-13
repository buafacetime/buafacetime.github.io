
const name = prompt('Enter room name').trim();
console.log(name);
const exampSocket = new WebSocket('ws://localhost:8080', 'echo-protocol');

exampSocket.onopen = (e) => {
	exampSocket.send(JSON.stringify({
		type:"enter_room",
		name: "jive"
	})); //room name
};

exampSocket.onmessage = (e) => {
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

	e.data.startsWith('{') && e.data.endsWith('}') ? clientMsg(data.data) : serverMessage(data);
};

const id = crypto.getRandomValues(new Uint16Array(1))[0];
console.log('random id ', id);

const sendBtn = document.querySelector('#send'),
	closeBtn = document.querySelector('#close');

sendBtn.onclick = sendText;
closeBtn.onclick = closeChat;

function sendText(e) {
	console.log('send');
	const msg = {
		type: 'message',
		text: document.getElementById('text').value,
		id,
		date: date(),
		time: time(),
		name: "jive" //room name
	};

	exampSocket.send(JSON.stringify(msg));
	document.getElementById('text').value = '';
}

function date() {
	return new Date(Date.now()).toDateString();
}

function time() {
	return new Date(Date.now()).toLocaleTimeString();
}

function closeChat(e) {
	exampSocket.close(3000,`${id}, left the chat room`);
}
