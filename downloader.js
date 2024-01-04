/*
 Author: liamgen.js
 downloader.js (c) 2024
 Description: Partie qui va chercher les images vu par l'utilisateur
 Created:  2024-01-04T21:26:27.345Z 
*/

/* Aller chercher les images au lencement et au scroll */
lookForImages()
document.addEventListener("scroll", lookForImages);

/* Vérifier si un élément est visible par l'utilisateur */
function isVisible(elem) {
    if (!(elem instanceof Element)) throw Error('DomUtil: elem is not an element.');
    const style = getComputedStyle(elem);
    if (style.display === 'none') return false;
    if (style.visibility !== 'visible') return false;
    if (style.opacity < 0.1) return false;
    if (elem.offsetWidth + elem.offsetHeight + elem.getBoundingClientRect().height +
        elem.getBoundingClientRect().width === 0) {
        return false;
    }
    const elemCenter   = {
        x: elem.getBoundingClientRect().left + elem.offsetWidth / 2,
        y: elem.getBoundingClientRect().top + elem.offsetHeight / 2
    };
    if (elemCenter.x < 0) return false;
    if (elemCenter.x > (document.documentElement.clientWidth || window.innerWidth)) return false;
    if (elemCenter.y < 0) return false;
    if (elemCenter.y > (document.documentElement.clientHeight || window.innerHeight)) return false;
    let pointContainer = document.elementFromPoint(elemCenter.x, elemCenter.y);
    do {
        if (pointContainer === elem) return true;
    } while (pointContainer = pointContainer.parentNode);
    return false;
}

function lookForImages(){
    /* Obtenir toutes les images */
    let images = document.querySelectorAll("img");
    images.forEach((image) => {
        /* Si une image est visible, qu'elle n'a pas déjà été téléchargée et qu'elle à une source */
        if(isVisible(image) && !image.getAttribute("downloaded-by-ext") && image.src){
            var filename = image.src.substring(image.src.lastIndexOf('/')+1);
            /* On envoit le message au back de télécharger l'image */
            chrome.runtime.sendMessage({url: image.src, filename: filename});
            /* On définis l'image en tant que "déjà téléchargée" */
            image.setAttribute("downloaded-by-ext", "true");
        }
    })
}