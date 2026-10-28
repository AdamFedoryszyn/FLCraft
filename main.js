const { app, BrowserWindow, Menu, session } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1500,
    height: 950,
    backgroundColor: '#1a1a1a',
    minWidth: 900,
    minHeight: 600,
    title: 'FL Clone',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
      webSecurity: true,
      backgroundThrottling: false
    }
  });

  // ── CRASH-DIAGNOSE ───────────────────────────────────────
  win.webContents.on('render-process-gone', (event, details) => {
    console.error('\n===============================================');
    console.error('  RENDERER PROCESS GONE');
    console.error('  Reason:    ', details.reason);
    console.error('  Exit Code: ', details.exitCode);
    console.error('===============================================\n');
  });

  win.webContents.on('crashed', () => {
    console.error('!!! RENDERER CRASHED (legacy event) !!!');
  });

  win.webContents.on('unresponsive', () => {
    console.warn('!!! RENDERER UNRESPONSIVE !!!');
  });

  // Alle Konsolen-Ausgaben des Renderers ins Terminal spiegeln
  win.webContents.on('console-message', (event, level, message, line, sourceId) => {
    const file = (sourceId || '').split('/').pop();
    console.log(`[renderer] ${message}   (${file}:${line})`);
  });
  // ─────────────────────────────────────────────────────────

    // ── DevTools-Shortcuts manuell verdrahten ──
  win.webContents.on('before-input-event', (event, input) => {
    const isToggle =
      input.key === 'F12' ||
      (input.control && input.shift && input.key.toLowerCase() === 'i') ||
      (input.meta && input.alt && input.key.toLowerCase() === 'i');
    if(isToggle && input.type === 'keyDown'){
      if(win.webContents.isDevToolsOpened()){
        win.webContents.closeDevTools();
      } else {
        win.webContents.openDevTools({ mode: 'detach' });
      }
      event.preventDefault();
    }
  });

  win.loadFile(path.join(__dirname, 'index.html'));
  win.setMenuBarVisibility(false);
}

app.whenReady().then(async () => {
  const appSession = session.defaultSession;
  appSession.setPermissionRequestHandler((webContents, permission, callback, details) => {
    let appOwned = false;
    try { appOwned = !!webContents && webContents.getURL().startsWith('file://'); } catch (e) {}
    const mediaTypes = details && Array.isArray(details.mediaTypes) ? details.mediaTypes : null;
    const audioOnly = !mediaTypes || (mediaTypes.includes('audio') && !mediaTypes.includes('video'));
    callback(appOwned && permission === 'media' && audioOnly);
  });
  appSession.setPermissionCheckHandler((webContents, permission, requestingOrigin, details) => {
    let appOwned = false;
    try { appOwned = !!webContents && webContents.getURL().startsWith('file://'); } catch (e) {}
    const mediaTypes = details && Array.isArray(details.mediaTypes) ? details.mediaTypes : null;
    const audioOnly = !mediaTypes || (mediaTypes.includes('audio') && !mediaTypes.includes('video'));
    return appOwned && permission === 'media' && audioOnly;
  });

  Menu.setApplicationMenu(null);
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});