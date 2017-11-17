(function () {

    'use strict'

    var loaded = true;

    let sharedWithMe = ['https://tvtropes.org', 'http://starwars.com']

    let sharedUrls = {
        josh: [],
        cayla: []
    }

    // TODO: Move this to a new class
    function onUpdated(tab) {
        console.log(`Updated tab: ${tab.id}`)
    }

    function onError(error) {
        console.error(`Error: ${error}`);
    }

    function initialize() {
        console.log('hey guys')
        const token = getToken();
        var gettingAllStorageItems = browser.storage.local.get(null)
        gettingAllStorageItems.then((results) => {
            let shareKeys = Object.keys(results)
            console.log('shareKeys', shareKeys);
            for (let shareKey of shareKeys) {
                var currValue = results[shareKey]
                sharedWithMe.push(currValue)
            }
            console.log('retrieved shares: ', sharedWithMe);
        }, onError('Could not get storage items'))
        browser.browserAction.setBadgeBackgroundColor({ color: '#ED2939' })
        browser.browserAction.setBadgeText({ text: "10" })
    }

    function makeRequest (opts) {
        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open(opts.method, opts.url);
            xhr.onload = function () {
                if (this.status >= 200 && this.status < 300) {
                    resolve(xhr.response);
                } else {
                    reject({
                    status: this.status,
                    statusText: xhr.statusText
                    });
                }
            };
            xhr.onerror = function () {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            };
            if (opts.headers) {
                Object.keys(opts.headers).forEach(function (key) {
                    xhr.setRequestHeader(key, opts.headers[key]);
                });
            }
            var params = JSON.stringify(opts.params);
            // We'll need to stringify if we've been given an object
            // If we have a string, this is skipped.
            // if (params && typeof params === 'object') {
            //     params = Object.keys(params).map(function (key) {
            //         return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
            //     }).join('&');
            //     }
            xhr.send(params);
        });
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
        updating.then(onUpdated, onError('shits fucked'));
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

    function processLogin(form) {
        var email = document.getElementById('email').value
        var password = document.getElementById('password').value
        makeRequest({
            method: 'POST',
            url: 'http://localhost:5050/login/',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            params: {
                email: email, 
                password: password
            }
        })
        .then(function (data) {
            console.log(data)
            const response = JSON.parse(data);
            // save token to local storage
            console.log('bout to store this shit', response.token);
            storeToken(response.token);
        })
        .catch(function (err) {
            console.log(err)
        })
    }

    function storeToken(token) {
        var storingShare = browser.storage.local.set({ 'tkn' : token });
        storingShare.then(null, onError('Couldnt add to the local db'));
    }

    function getToken() {
        var storingShare = browser.storage.local.get(['tkn']);
        storingShare.then(result => { console.log('result', result); return result; }).catch(error => onError(error));
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
        } else if (e.target.id === ('SubmitLogin')) {
            var form = document.getElementById('LoginForm')
            console.log('hey buddyyy 2222')
            processLogin(form)
        }  else if (e.target.id === ('Signup')) {
            var xmlhttp = new XMLHttpRequest()
            var url = 'http://localhost:5050/shares'
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                    console.log(xmlhttp.responseText)
                }
            }
            xmlhttp.open('GET', url, true)
            xmlhttp.setRequestHeader('Accept', 'application/json')
            xmlhttp.send()
        } else if (e.target.id === ('Close')) {
            document.getElementById('mySidenav').style.width = '0'
        }
    })

    // document.addEventListener('submit', (e) => {
    //     if (e.target.id === ('SubmitLogin')) {
    //         form = document.getElementById('LoginForm')
    //         console.log('hey buddyyy')
    //         processLogin(form)
    //     }
    // })

}) ()