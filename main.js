const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const axios = require('axios');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  mainWindow.loadURL('http://localhost:5173'); // React app URL
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

async function checkReactApp() {
  try {
    await axios.get('http://localhost:5173');
    return true;
  } catch {
    return false;
  }
}

app.on('ready', () => {
  // Start the server
  const serverProcess = spawn('npm', ['start'], { cwd: path.join(__dirname, 'server'), shell: true });

  serverProcess.stdout.on('data', (data) => {
    console.log(`Server: ${data}`);
  });

  serverProcess.stderr.on('data', (data) => {
    console.error(`Server Error: ${data}`);
  });

  // Start the React app
  const reactAppProcess = spawn('npm', ['run', 'dev'], { cwd: path.join(__dirname, 'client'), shell: true });

  reactAppProcess.stdout.on('data', (data) => {
    console.log(`React App: ${data}`);
  });

  reactAppProcess.stderr.on('data', (data) => {
    console.error(`React App Error: ${data}`);
  });

  // Check if the React app is running before creating the window
  const interval = setInterval(async () => {
    const isReady = await checkReactApp();
    if (isReady) {
      clearInterval(interval);
      createWindow();
    }
  }, 1000); // Check every second

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
});
