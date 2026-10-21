"use strict";

// Verified in Google Groups and Play Console > Alpha > Testers on 2026-10-21.
// SAHİP: If either URL changes, verify both before enabling the actions again.
// Never substitute a guessed group slug. All language pages share this file.
const GROUP_LINK = "https://groups.google.com/g/kebsik-closed-testing-2026/about";
const PLAY_JOIN_LINK = "https://play.google.com/apps/testing/com.kebsik.game";
const LINKS_VERIFIED = true;

function validTestLink(value, host, path) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === host &&
      !url.username && !url.password && !url.port && !url.search && !url.hash &&
      path.test(url.pathname);
  } catch {
    return false;
  }
}

const linksReady = LINKS_VERIFIED &&
  validTestLink(GROUP_LINK, "groups.google.com", /^\/g\/[a-z0-9][a-z0-9-]*\/about\/?$/) &&
  validTestLink(PLAY_JOIN_LINK, "play.google.com", /^\/apps\/testing\/[a-zA-Z0-9_.]+\/?$/);

if (linksReady) {
  for (const button of document.querySelectorAll("[data-test-link]")) {
    button.href = button.dataset.testLink === "group" ? GROUP_LINK : PLAY_JOIN_LINK;
    button.rel = "noreferrer";
    button.hidden = false;
  }
  document.querySelector("[data-links-pending]").hidden = true;
}
