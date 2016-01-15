class IFrame {
	constructor (options) {
		this.options = Object.assign({
			server: 'impequid.dodekeract.report'
		}, options);
	}
	createFrame (options) {
		options = Object.assign({
			attach: false
		}, options);
		var element = document.createElement('iframe')
		element.src = 'https://' + this.options.server + '/api/iframe';
		element.style.position = 'fixed';
		element.style.top = '-1337px';
		element.style.left = '-1337px';
		element.style.height = '0';
		element.style.width = '0';
		element.display = 'none';
		element.setAttribute('hidden', 'hidden');
		if (options.attach) {
			document.body.appendChild(element);
			return element.contentWindow;
		} else {
			return element;
		}
	}
}

class API {
	constructor (options) {
		this.options = Object.assign({
			origin: 'https://impequid.dodekeract.report',
			timeout: 20000
		}, options);
		window.addEventListener('message', receive, false);
	}
	send (api, data, callback) {
		var r = this.options.reference;

		// register callback
		var id = generateID();
		this.callbacks[id] = callback;
		setTimeout(function () {
			this.callbacks[id] = null;
		}, this.timeout);

		// send the message
		r.postMessage({
			id: id,
			api: api,
			data: data
		});
	}
	receive (event) {
		var origin = event.origin || event.originalEvent.origin;
		var response = event.data;
		if (origin === this.options.origin) {
			if (this.callbacks[response.id]) {
				var callback = this.callbacks[response.id];
				this.callbacks[response.id] = null;
				callback(response.data, response.error);
			} else {
				console.error('Could not resolve callback', event);
			}
		}
	}
	generateID () {
		return (this.callbackIndex++).toString(36);
	}
}

window.onload = function () {
	var test = new IFrame();
	var impequid = test.createFrame({attach: true});
}
