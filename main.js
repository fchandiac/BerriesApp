const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const url = require('url')
const port = 3001
var serialNumber = require('serial-number')

//
//C1MNPBLRDTY3
//FVFGC8MQQ6L5 - berries1234




//// --------> CONFIG JSON APP <-------/////////
const fs = require('fs')
const filePathConfig = path.join(__dirname, './config.json')
const rawDataConfig = fs.readFileSync(filePathConfig)
const config = JSON.parse(rawDataConfig)

///// --------> NODE ENV <-------/////////
const env = process.env.NODE_ENV
//const env = 'build'
///// --------------------------/////////



///// --------> EXPRESS CONFIG <-------/////////
const cors = require('cors')
const express = require('express');
const exp = express()
exp.set('json spaces', 2); // Permite la generacion de Json como res de express... eso creo
exp.use(express.json())
exp.use(express.urlencoded({ extended: false }))
exp.use(cors({ origin: '*' })) // permite acceso de otros clientes dentro de la red
exp.use(express.static(path.join(__dirname, './out')))
exp.use(require('./routes/producers'))
exp.use(require('./routes/varieties'))
exp.use(require('./routes/trays'))
exp.use(require('./routes/receptions'))
exp.use(require('./routes/pays'))
exp.use(require('./routes/print'))

exp.get('/', (req, res) => {
	res.send('Server Work')
})

exp.listen(port, () => {
	console.log('app  http://localhost:' + port)
})




/////// --------> ELECTRON CONFIG <-------/////////
const createWindow = () => {
	var win = new BrowserWindow({
		width: 1920,
		height: 1080,
		minWidth: 800,
		minHeight: 600,
		webPreferences: {
			contextIsolation: false,
			nodeIntegration: true,
			enableRemoteModule: true,
			webSecurity: false
		},
	})
	var splash = new BrowserWindow({
		width: 500,
		height: 375,
		frame: false,
		alwaysOnTop: true
	})
	win.hide()
	splash.center()
	splash.hide()
	if (env == 'build') {
		splash.center()
		win.loadURL('http://localhost:' + port)
		splash.loadURL(url.format({
			pathname: path.join(__dirname, './splash/splash.html'),
			protocol: 'file',
			slashes: true
		}))
		setTimeout(function () {
			splash.show()
			setTimeout(function () {
				splash.close();
				win.maximize()
				win.show();
			}, 6000);
		}, 2000)
	} else {
		ejecuteNext(win, splash)
	}
}

app.on('ready', createWindow);
app.on('window-all-closed', () => {
	app.quit()
})

function ejecuteNext(win, splash) {
	/////// --------> NEXT SERVER <-------/////////
	const { createServer } = require('http');
	const next = require('next');
	const dev = env !== 'production';
	const nextApp = next({ dev });
	const handler = nextApp.getRequestHandler();
	win.hide()
	splash.hide()
	splash.center()

	nextApp
		.prepare()
		.then(() => {
			const server = createServer((req, res) => {
				if (req.headers['user-agent'].indexOf('Electron') === -1) {
					res.writeHead(404);
					res.end()
					return
				}
				return handler(req, res);
			});
			server.listen(3000, (error) => {
				if (error) throw error
			})
			if (dev) {
				win.webContents.openDevTools();
			}
			win.loadURL('http://localhost:3000')

			win.on('close', () => {
				win = null;
				server.close();
			});
			splash.loadURL(url.format({
				pathname: path.join(__dirname, './splash/splash.html'),
				protocol: 'file',
				slashes: true
			}))
			setTimeout(function () {
				splash.show()
				setTimeout(function () {
					splash.close();
					win.maximize()
					win.show();
				}, 6000);
			}, 2000)
		})
}


/////// --------> IPC COMMUNICATION <-------/////////



ipcMain.on('read-config', (e, arg) => {
	e.returnValue = config
})

ipcMain.on('read-serial', (e, arg) => {
	serialNumber(function (err, value) {
		e.returnValue = value
	})
})


ipcMain.on('write-config', (e, arg) => {
	config.db_name = config.db_name
	config.db_user = config.db_user
	config.db_host = config.db_host
	config.db_password = config.db_password
	config.port_app = config.port_app
	config.app_pass = arg
	config.server_url = config.server_url


	data = JSON.stringify(config)
	fs.writeFileSync(filePathConfig, data)
})

// serialNumber(function (err, value) {
// 	if (value != 'C1MNPBLRDTY3') {
// 		console.log('SERIAL NUMBER ERROR::::');
// 		console.log('SERIAL NUMBER: ' + value)
// 	} else {
// 		console.log('SERIAL NUMBER OK::::');
// 		console.log('SERIAL NUMBER: ' + value)
// 	}

// })
