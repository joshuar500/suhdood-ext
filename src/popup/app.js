(function () {

    'use strict'

    var loaded = true;

    let sharedWithMe = ['https://tvtropes.org', 'http://starwars.com']

    let sharedUrls = {
        josh: [],
        cayla: []
    }

    function initialize() {
        console.log('hey guys')
        var gettingAllStorageItems = browser.storage.local.get(null)
        gettingAllStorageItems.then((results) => {
            let shareKeys = Object.keys(results)
            for (let shareKey of shareKeys) {
                var currValue = results[shareKey]
                sharedWithMe.push(currValue)
            }
            console.log(sharedWithMe)
        }, onError('Could not initialize'))
        browser.browserAction.setBadgeBackgroundColor({ color: '#ED2939' })
        browser.browserAction.setBadgeText({ text: "10" })
    }

    function updateIcon() {
        let urlLength = sharedWithMe.length
        
        browser.browserAction.setIcon({
            path: urlLength ? {
                '32': '/icons/beasts-shr-32.png'
            } : {
                '32': '/icons/beasts-32.png'
                }
        })
    }

    // TODO: Move this to a new class
    function onUpdated(tab) {
        console.log(`Updated tab: ${tab.id}`)
    }

    function onError(error) {
        console.log(error)
    }

    // share url with friend
    function foundUrl(tabInfo) {
        var storingShare = browser.storage.local.set({ [tabInfo[0].title] : tabInfo[0].url })
        storingShare.then(null, onError('Couldnt add to the local db'))
        updateIcon()
    }

    function goToSharedUrl() {
        updateIcon()
        let tempUrl = sharedWithMe
        sharedWithMe.shift()
        var updating = browser.tabs.update({ url: tempUrl })
        updating.then(onUpdated, onError)
    }

    function getTabUrl() {
        var gettingCurrent = browser.tabs.query({ currentWindow: true, active: true })
        gettingCurrent.then(foundUrl, onError)
    }

    function close() {
         document.getElementById('mySidenav').style.width = '0'
    }

    // Get the url from the sender
    function getOptionFunction(chosenOption) {
        switch (chosenOption) {
            case 'Next':
                goToSharedUrl()
                return
            case 'Share':
                getTabUrl()
                return
            default:
                return
        }
    }

    // listen to tab URL changes
    browser.tabs.onUpdated.addListener(initialize)

    // listen to tab switching
    browser.tabs.onActivated.addListener(initialize)

    // update when the extension loads initially
    initialize()

    // Listen for clicks in the popup
    document.addEventListener('click', (e) => {
        if (e.target.id === ('Next')) {
            var chosenOption = e.target.textContent
            getOptionFunction(chosenOption)
        } else if (e.target.id === ('Share')) {
            var chosenOption = e.target.textContent
            getOptionFunction(chosenOption)
        } else if (e.target.id === ('Login')) {
            document.getElementById('mySidenav').style.width = '100%'
        } else if (e.target.id === ('Signup')) {
            var xmlhttp = new XMLHttpRequest()
            var url = 'https://www.google.com'
            xmlhttp.onreadystatechange = function () {
                if (readyState === 4 && status === 200) {
                    console.log(status)
                }
            }
            xmlhttp.open('GET', url, true)
            xmlhttp.send()
        } else if (e.target.id === ('Close')) {
            document.getElementById('mySidenav').style.width = '0'
        }
    })

}) ()