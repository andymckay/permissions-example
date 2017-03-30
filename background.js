"use strict";

chrome.browserAction.onClicked.addListener(() => {
  chrome.tabs.create({url: chrome.runtime.getURL("page.html")});
});

chrome.permissions.getAll(perms => {
  console.log(perms);
});
