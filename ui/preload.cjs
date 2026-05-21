// Preload script for Electron main window
// Runs in sandbox but has access to selected APIs if needed
window.addEventListener('DOMContentLoaded', () => {
  // Expose version details to client if needed
  console.log('[CORTEX-PRIME] Native Desktop wrapper loaded successfully.');
});
