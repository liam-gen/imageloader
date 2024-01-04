/*
Author: liamgen.js
background.js (c) 2024
Description: Fichier permettant de gérer la partie arrière de l'extension
Created:  2024-01-04T21:24:00.913Z
*/

/* Lorqune page charge on insert le script qui check les images */
chrome.tabs.onUpdated.addListener(function(tab) {
    chrome.tabs.get(tab).then(data => {
        /* Si c'est un vrai site */
        if(data.url){
            chrome.scripting.executeScript({
                target: {tabId: tab},
                files: ['downloader.js']
            });
        }
    })
    
});

/* Quand on clique sur l'icon */
chrome.action.onClicked.addListener(async function(tab){

    /* On va chercher le texte sur le badge */
    chrome.action.getBadgeText({}).then(text => {
        /* On va chercher si le paramètre est dans la DB */
        chrome.storage.local.get(["isON"]).then((result) => {
            /* Si c'est off on met on */
            if(text == "OFF" || !result.isON){
                chrome.storage.local.set({ isON: true }).then(() => {
                    console.log("Value is set to on");
                    chrome.action.setBadgeText({text: "ON"})
                    chrome.action.setBadgeBackgroundColor({ color: 'green' });
                });
            }
            else{
                chrome.storage.local.set({isON: false }).then(() => {
                    console.log("Value is set to OFF");
                    chrome.action.setBadgeText({text: "OFF"})
                    chrome.action.setBadgeBackgroundColor({ color: 'red' });
                });
            }
        });
    });
})

/* On met sur OFF lorsqu'on installe */
chrome.runtime.onInstalled.addListener(function(){
    chrome.storage.local.set({isON: false }).then(() => {
        console.log("Value is set to OFF");
        chrome.action.setBadgeText({text: "OFF"})
        chrome.action.setBadgeBackgroundColor({ color: 'red' });
    });
})

/* On charge lorsque chrome démare */
chrome.runtime.onStartup.addListener(function() {
    chrome.action.getBadgeText({}).then(text => {
        chrome.storage.local.get(["isON"]).then((result) => {
            if(text == "OFF" || !result.isON){
                chrome.action.setBadgeText({text: "OFF"})
                chrome.action.setBadgeBackgroundColor({ color: 'red' });
            }
            else{
                chrome.action.setBadgeText({text: "ON"})
                chrome.action.setBadgeBackgroundColor({ color: 'green' });
            }
        });
        
    });
})

/* Télécharger si activé et image reçue */
chrome.runtime.onMessage.addListener(function(message, callback) {
    chrome.action.getBadgeText({}).then(text => {
        chrome.storage.local.get(["isON"]).then((result) => {
            console.log(text)
            console.log(result.isON)
            if(text == "ON" || result.isON){
                chrome.downloads.download({
                    url: message.url,
                    filename: "Images Téléchargées/"+message.filename
                });
            }
        });
        
    });
});