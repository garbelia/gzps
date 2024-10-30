// ==UserScript==
// @name         gzps
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  Garbelia's Zombification Prevention Suite
// @author       Garbelia
// @match        *://*.nationstates.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nationstates.net
// @include      */zday_sheet.html
// @require      https://craig.global.ssl.fastly.net/js/mousetrap/mousetrap.min.js?a4098
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        window.close
// ==/UserScript==

// CHANGE
var turbo = true // Very limited turbo mode for regions
var cureid = "" // Insert the HTML pointing to the cure button - I can't get it outside of the event so you have to do it yourself
 
// DON'T CHANGE
var focus = 0
var links = 6

function inHref(str) {
    return window.location.href.includes(str);
}

function onNationPage() {
    return inHref("nation=");
}

function onSheet() {
    return inHref("zday_sheet.html");
}

function nname() {
    return document.body.attributes[1].value;
}

function moveFocus() {
    document.querySelectorAll('a')[focus].style.color = "black";

    if (focus < document.querySelectorAll('a').length - links - 2) {
        focus += links;
    }
    document.querySelectorAll('a')[focus].style.color = "red";
    document.querySelectorAll('a')[focus + 1].scrollIntoView();
}

function numberFromIndicator(indicator) {
    return document.querySelector(indicator).innerText.split("\n")[0]
}

(function () {
    'use strict';
    if (onSheet()) {
        document.querySelectorAll('a')[focus].style.color = "red";
    } else if (turbo) {
        if (inHref("change_region")) {
            window.close()
        }
    }

     if (inHref("nation=")) {
        let lastactive = document.querySelector(".newsbox > p > time").textContent;
        if (lastactive.includes("minutes") && lastactive.match(/(\d+)/) && parseInt(lastactive.match(/(\d+)/)[0], 10) < 60 || lastactive.includes("seconds")){
            console.log("check")
            var bar = document.querySelector('.newsloganbox')
            var div = document.createElement('div')
            var message = document.createElement('p')
            message.innerText = "This nation was active in the last hour! Cure somebody else - at least check if they are using missiles."
            div.style.backgroundColor= "red"
            message.style.fontSize = "30px"
            message.style.margin = "5px"
            div.style.padding = "5px"
            div.appendChild(message)
            var fineprint = document.createElement('i')
            fineprint.innerText = "This message has been inserted by Garbelia's Zombification Prevention Suite"
            div.appendChild(fineprint)
            bar.insertAdjacentElement('afterend', div)
        }
       
    }

    Mousetrap.bind(
        ['w'],
        function (ev) {
            if (onSheet()) {
                document.querySelectorAll('a')[focus].click();
                moveFocus()
            }
        }
    )

    Mousetrap.bind(
        ['e'],
        function (ev) {
            if (onSheet()) {
                moveFocus()
            }
        }
    )

    Mousetrap.bind(
        ['q'],
        function (ev) {
            document.querySelectorAll('a')[focus].style.color = "black";
            if (focus >= links) {
                focus -= links;
            }
            document.querySelectorAll('a')[focus].style.color = "red";
            if (focus > 1) { document.querySelectorAll('a')[focus - 1].scrollIntoView(); }
        }
    )

    Mousetrap.bind(['b'], 
        function(ev) {
            window.history.back();
        }
    )

    Mousetrap.bind(['x'],
        function(ev) {
            window.close();
        }
    )

    Mousetrap.bind(['r'],
        function (ev) {
            window.location.reload();
        })

    Mousetrap.bind(['z'],
        function (ev) {
            if (inHref("page=zombie_control")) {
                document.querySelector('.button[name="zact-research"]').click();
            } else if (onSheet()) {
                document.querySelectorAll('a')[focus + 1].click();
                moveFocus()
            } else { window.location.href = "https://www.nationstates.net/page=zombie_control" }
        })
    

    Mousetrap.bind(['t'],
        function (ev) {
            if (onSheet()) {
                document.querySelectorAll('a')[focus + 3].click();
                moveFocus()
            }
            else if (inHref("nation=")) {
                document.querySelectorAll(cureid).click();
            }
        })

    Mousetrap.bind(['j'],
        function (ev) {
            if (onSheet()) {
                document.querySelectorAll('a')[focus+5].click();
                moveFocus()
            }
            else if (inHref("region=")) { 
                const joinb = document.querySelectorAll('.button[name="move_region"]')
                
                if (joinb.length > 0) {
                    joinb[0].click();
                }
            } else { window.location.href = "https://www.nationstates.net/region=forest"; }
        })

})();