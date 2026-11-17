(() => {
  const root = document.querySelector('[data-invitation]');
  if (!root) return;
  const message = root.querySelector('textarea');
  const status = root.querySelector('[role="status"]');
  const copy = root.querySelector('[data-copy-invite]');
  const share = root.querySelector('[data-share-invite]');
  const manualCopy = () => {
    root.querySelector('details').open = true;
    message.focus();
    message.select();
    message.setSelectionRange(0, message.value.length);
    status.textContent = root.dataset.copyFallback;
  };
  copy.hidden = false;
  copy.addEventListener('click', async () => {
    status.textContent = '';
    try {
      await navigator.clipboard.writeText(message.value);
      status.textContent = root.dataset.copied;
    } catch {
      manualCopy();
    }
  });
  if (typeof navigator.share === 'function') {
    share.hidden = false;
    share.addEventListener('click', async () => {
      status.textContent = '';
      try {
        await navigator.share({title: 'Kebsik Mini', text: message.value});
      } catch (error) {
        if (error.name === 'AbortError') {
          status.textContent = root.dataset.shareCancelled;
        } else {
          manualCopy();
          status.textContent = root.dataset.shareFailed;
        }
      }
    });
  }
})();
