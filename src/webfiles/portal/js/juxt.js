var scrollPosition, pjax;
var updateCheck = setInterval(checkForUpdates, 10000);

/* global Pjax */
function initNavBar() {
    var buttons = document.querySelectorAll("li[data-pjax]");
    if (!buttons)
        return;
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener("click", function(e) {
            var el = e.currentTarget;
            for(var i = 0; i < buttons.length; i++) {
                if(buttons[i].classList.contains('selected'))
                    buttons[i].classList.remove('selected');
                if(buttons[i].getAttribute('data-pjax') === el.getAttribute("data-pjax"))
                    buttons[i].classList.add('selected');
            }
            wiiuSound.playSoundByName("SE_WAVE_MENU", 1);
            wiiuBrowser.showLoadingIcon(!0)
            pjax.loadUrl(el.getAttribute("data-pjax"));
        });
    }
}
function initCommunities() {
    var buttons = document.querySelectorAll("div[data-pjax]");
    if (!buttons)
        return;
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener("click", function(e) {
            var el = e.currentTarget;
            wiiuSound.playSoundByName("SE_WAVE_MENU", 1);
            wiiuBrowser.showLoadingIcon(!0)
            pjax.loadUrl(el.getAttribute("data-pjax"));
        });
    }
}
function initNotifications() {
    var buttons = document.querySelectorAll("tr[data-pjax]");
    if (!buttons)
        return;
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener("click", function(e) {
            var el = e.currentTarget;
            wiiuSound.playSoundByName("SE_WAVE_MENU", 1);
            wiiuBrowser.showLoadingIcon(!0)
            pjax.loadUrl(el.getAttribute("data-pjax"));
        });
    }
}
function initCommunityUsers() {
    var users = document.querySelectorAll("img[data-pjax], span[data-pjax], h2[data-pjax]");
    if (!users)
        return;
    for (var i = 0; i < users.length; i++) {
        users[i].addEventListener("click", function(e) {
            var el = e.currentTarget;
            wiiuSound.playSoundByName("SE_WAVE_MENU", 1);
            wiiuBrowser.showLoadingIcon(!0)
            pjax.loadUrl(el.getAttribute("data-pjax"));
        });
    }
}

console.log("Document initialized:", window.location.href);
document.addEventListener("pjax:send", function() {
    console.log("Event: pjax:send", arguments);
});
document.addEventListener("pjax:complete", function() {
    console.log("Event: pjax:complete", arguments);
    if(wiiuBrowser.canHistoryBack()) {
        document.getElementById('nav-bar-back').style.display = 'list-item';
        document.getElementById('nav-bar-exit').style.display = 'none';
    }
    else {
        document.getElementById('nav-bar-back').style.display = 'none';
        document.getElementById('nav-bar-exit').style.display = 'list-item';
    }
});
document.addEventListener("pjax:error", function() {
    wiiuErrorViewer.openByCodeAndMessage(5984000, 'Error: Unable to load element. \nPlease send the error code and what you were doing in');
});
document.addEventListener("pjax:success", function() {
    console.log("Event: pjax:success", arguments);
    // Init page content
    initNavBar();
    initCommunities();
    initNotifications();
    initCommunityUsers();
});
document.addEventListener("DOMContentLoaded", function() {
    // Init Pjax instance
    pjax = new Pjax({
        elements: [".js-Pjax"],
        selectors: ["#main", "#nav-bar", "title"],
        cacheBust: false
    });
    console.log("Pjax initialized.", pjax);

    // Init page content
    initNavBar();
    initCommunities();
    initNotifications();
    initCommunityUsers();
});

function stopLoading() {
    if (typeof wiiuBrowser !== 'undefined'
        && typeof wiiuBrowser.endStartUp !== 'undefined') {
        wiiuBrowser.endStartUp();
        wiiuSound.playSoundByName('BGM_OLV_MAIN', 3);
        setTimeout(function() {
            wiiuSound.playSoundByName('BGM_OLV_MAIN_LOOP_NOWAIT', 3);
        },90000);
    }
}
function exit() {
    wiiu.gamepad.update()
    if(wiiu.gamepad.hold === 8192 || wiiu.gamepad.hold === 40960)
        alert('Debug Menu');
    else {
        wiiuSound.playSoundByName("SE_WAVE_EXIT", 1);
        wiiuBrowser.closeApplication();
    }
}
function back() {
    wiiuSound.playSoundByName('SE_WAVE_MENU', 1);
    wiiuBrowser.showLoadingIcon(!0);
    document.getElementById('nav-bar-back').classList.add('selected')
    if(wiiuBrowser.canHistoryBack()) {
        window.history.back();
    }
    else {
        document.getElementById('nav-bar-back').style.display = 'none';
        document.getElementById('nav-bar-exit').style.display = 'initial';
    }
}
function toggleOverlay() {
    var element = document.getElementById('windowOverlay');
    if(element.style.display === 'block') {
        wiiuSound.playSoundByName('SE_OLV_CANCEL', 1)
        wiiuSound.playSoundByName('BGM_OLV_MAIN_LOOP_NOWAIT', 3);

        element.style.display = 'none';
        document.getElementById('overlay-filter').style.display = '';
        document.getElementById('main').style.marginLeft = '190px';
        document.getElementById('nav-bar').style.display = '';
    }
    else {
        wiiuSound.playSoundByName('SE_OLV_OK', 1)
        wiiuSound.playSoundByName('BGM_OLV_SETTING', 3)

        element.style.display = 'block';
        document.getElementById('overlay-filter').style.display = 'none';
        document.getElementById('main').style.marginLeft = '110px';
        document.getElementById('nav-bar').style.display = 'none';
    }
}

function loadScreenShotData() {
    document.getElementById('post-top-screen-preview').src = 'data:image/png;base64,' + wiiuMainApplication.getScreenShot(true);
    document.getElementById('post-bottom-screen-preview').src = 'data:image/png;base64,' + wiiuMainApplication.getScreenShot(false);
}

function showNewPostScreen() {
    toggleOverlay();
    loadScreenShotData();
}

function yeah(postNode, postID) {
    wiiuBrowser.lockUserOperation(true);
    var yeahCountElement = document.getElementById('yeah-' + postID);
    var postElement = document.getElementById(postID);
    var yeahcount = yeahCountElement.innerHTML.substr(0, yeahCountElement.innerHTML.indexOf(' '));
    if (postNode.classList.contains("selected")) {
        postNode.classList.remove("selected");
        yeahCountElement.classList.remove("selected");
        postElement.classList.remove("selected");
        var params = "postID=" + postID + "&type=down";
        var xhr = new XMLHttpRequest();
        xhr.open("POST", '/posts/empathy', true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send(params);
        if(yeahcount > 0) {
            yeahCountElement.innerHTML = --yeahcount + yeahCountElement.innerHTML.substr(yeahCountElement.innerHTML.indexOf(' '));
            wiiuSound.playSoundByName('SE_OLV_MII_CANCEL', 1);
            wiiuBrowser.lockUserOperation(false);
        }

    }
    else {
        postNode.classList.add("selected");
        yeahCountElement.classList.add("selected");
        postElement.classList.add("selected");
        var params = "postID=" + postID + "&type=up";
        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", '/posts/empathy', true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

        xhttp.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                yeahCountElement.innerHTML = ++yeahcount + yeahCountElement.innerHTML.substr(yeahCountElement.innerHTML.indexOf(' '));
                wiiuSound.playSoundByName('SE_WAVE_MII_ADD', 1);
                wiiuBrowser.lockUserOperation(false);
            }
            if (this.readyState === 4 && this.status === 423) {
                yeahCountElement.innerHTML = ++yeahcount + yeahCountElement.innerHTML.substr(yeahCountElement.innerHTML.indexOf(' '));
                wiiuSound.playSoundByName('SE_WAVE_MII_ADD', 1);
                wiiuBrowser.lockUserOperation(false);
            }
        }
        xhttp.send(params);
    }
}
function followCommunity() {
    var community = document.getElementsByClassName('community-page-follow-button-wrapper')[0];
    var followers = document.getElementsByClassName('community-page-follow-button-text')[0];
    var text = followers.innerText.substring(0, followers.innerText.indexOf(' '));
    var localText = followers.innerText.substring(followers.innerText.indexOf(' '));
    if (community.classList.contains("selected")) {
        community.classList.remove("selected");
        var params = "communityID=" + followers.id + "&type=false";
        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", '/communities/follow', true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send(params);
        followers.innerHTML = --text + localText;
        wiiuSound.playSoundByName('SE_OLV_MII_CANCEL', 1);
    }
    else {
        var params = "communityID=" + followers.id + "&type=true";
        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", '/communities/follow', true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

        xhttp.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                community.classList.add("selected");
                followers.innerHTML = ++text + localText;
                wiiuSound.playSoundByName('SE_WAVE_MII_ADD', 1);
            }
            if (this.readyState === 4 && this.status === 423) {
                wiiuErrorViewer.openByCodeAndMessage(5980002, "An error has occurred.\n\nPlease try again later.\n\nIf the problem persists, please make a note of the error code and visit invite.gg/pretendo")
                wiiuSound.playSoundByName('SE_WAVE_MII_ADD', 1);
            }
        }
        xhttp.send(params);
    }
}
function followUser(user) {
    var followersElement = document.getElementById('user-page-followers-tab');
    var followers = followersElement.innerHTML.trim().substr(0, followersElement.innerHTML.indexOf(' ') + 1);
    if (user.classList.contains("selected")) {
        user.classList.remove("selected");
        var params = "userID=" + user.id + "&type=false";
        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", '/users/follow', true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send(params);

        followersElement.innerText = --followers + followersElement.innerHTML.trim().substr(followersElement.innerHTML.indexOf(' '));
        wiiuSound.playSoundByName('SE_OLV_MII_CANCEL', 1);
    }
    else {
        user.classList.add("selected");

        var params = "userID=" + user.id + "&type=true";
        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", '/users/follow', true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

        xhttp.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                followersElement.innerText = ++followers + followersElement.innerHTML.trim().substr(followersElement.innerHTML.indexOf(' '));
                wiiuSound.playSoundByName('SE_WAVE_MII_ADD', 1);
            }
            if (this.readyState === 4 && (this.status === 423 || this.status === 404)) {
                user.classList.remove("selected");
                wiiuSound.playSoundByName('SE_WAVE_MII_ADD', 1);
            }
        }
        xhttp.send(params);
    }
}

function scrollToBottom() {
    var scrollHeight = document.body.scrollHeight;
    var interval = setInterval(function () {
        if(document.body.scrollHeight !== scrollHeight) {
            window.scroll(0, document.body.scrollHeight);
            clearInterval(interval);
        }
    }, 100);
}
function createNewMessage(pid) {
    pjax.loadUrl('/messages/new/' + pid);
    wiiuBrowser.showLoadingIcon(!0)
    wiiuSound.playSoundByName('SE_OLV_OK', 1);
    scrollToBottom();
}
function showMessage(messageID) {
    pjax.loadUrl('/messages/' + messageID);
    wiiuBrowser.showLoadingIcon(!0);
    wiiuSound.playSoundByName('SE_OLV_OK', 1);
    scrollToBottom();
}
function sendMessage(conversationID, pid) {
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date +' '+time;
    var messageContents = document.getElementById("message-viewer-input").value;
    if(messageContents.length === 0)
        return;
    if(wiiuFilter.checkWord(messageContents) === -2) { messageContents.value = ''; alert('Message cannot contain explicit language.');}
    var currentThread = document.getElementById('message-viewer-content').innerHTML;
    var newMessage =
        '<div class="message-viewer-bubble-sent"><p class="message-viewer-bubble-sent-text">' + messageContents + '</p></div><div class="message-viewer-bubble-sent-timestamp"><p>' + dateTime + '</p></div>';
    var params = "conversationID=" + conversationID + "&message_to_pid=" + pid + "&body=" + messageContents;
    var xhr = new XMLHttpRequest();
    xhr.open("POST", '/messages/new', true);
    xhr.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            var scrollHeight = document.body.scrollHeight;
            document.getElementById("message-viewer-input").value = '';
            document.getElementById('message-viewer-content').innerHTML = currentThread + newMessage
            var interval = setInterval(function () {
                if(document.body.scrollHeight > scrollHeight) {
                    window.scroll(0, document.body.scrollHeight);
                    clearInterval(interval);
                }
            }, 100);
        }
        if (this.readyState === 4 && (this.status === 423 || this.status === 404)) {
            wiiuErrorViewer.openByCodeAndMessage(5986000 + this.status, 'Error: "' + this.statusText + '"\nPlease send the error code and what you were doing in');
        }
    }
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send(params);

}
function sendPainting(conversationID, pid) {
    wiiuMemo.open(false);
    var drawing = wiiuMemo.getImage(false);
    var rawDrawing = wiiuMemo.getImage(true);
    if(drawing) {
        if(confirm("Send the Drawing?")) {
            var today = new Date();
            var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
            var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            var dateTime = date +' '+time;
            var currentThread = document.getElementById('message-viewer-content').innerHTML;
            var newMessage =
                '\n<div class="message-viewer-bubble-sent">\n' +
                '            <img class="message-viewer-bubble-sent-memo" src="data:image/bmp;base64,' + drawing + '" >\n' +
                '        </div>\n' +
                '<div class="message-viewer-bubble-sent-timestamp"><p>' + dateTime + '</p></div>\n';
            var scrollHeight = document.body.scrollHeight;
            document.getElementById('message-viewer-content').innerHTML = currentThread + newMessage;
            wiiuMemo.reset();
            var params = "conversationID=" + conversationID + "&message_to_pid=" + pid + "&raw=" + rawDrawing + "&&drawing=" + drawing;
            var xhr = new XMLHttpRequest();
            xhr.open("POST", '/messages/new', true);
            xhr.onreadystatechange = function() {
                if (this.readyState === 4 && this.status === 200) {
                    document.getElementById("message-viewer-input").value = '';
                    document.getElementById('message-viewer-content').innerHTML = currentThread + newMessage
                    var interval = setInterval(function () {
                        if(document.body.scrollHeight > scrollHeight) {
                            window.scroll(0, document.body.scrollHeight);
                            clearInterval(interval);
                        }
                    }, 100);
                }
                if (this.readyState === 4 && (this.status === 423 || this.status === 404)) {
                    wiiuErrorViewer.openByCodeAndMessage(5986000 + this.status, 'Error: "' + this.statusText + '"\nPlease send the error code and what you were doing in');
                }
            }
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhr.send(params);
        }
        else
            alert('Canceled');
    }
}
function storeScrollPosition() {
    scrollPosition = document.body.scrollTop;
}
function restoreLastScrollPosition() {
    window.scrollTo(0, scrollPosition);
}
function loadPosts(type) {
    wiiuBrowser.showLoadingIcon(true);
    document.getElementById('recent-tab').classList.remove('active');
    document.getElementById('popular-tab').classList.remove('active');
    document.getElementById('verified-tab').classList.remove('active');
    //0 recent : 1 popular : 2 verified
    switch (type) {
        case 0:
            document.getElementById("recent-tab").classList.add('active');
            type = 'new';
            break;
        case 1:
            document.getElementById("popular-tab").classList.add('active');
            type = 'popular';
            break;
        case 2:
            document.getElementById("verified-tab").classList.add('active');
            type = 'verified';
            break;
    }
    var id = document.getElementsByClassName('community-page-follow-button-text')[0].id
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            document.getElementById('wrapper').innerHTML = this.responseText;
            wiiuBrowser.showLoadingIcon(false);
            initCommunityUsers();
        }
        else if(this.readyState === 4 && this.status === 204)
        {
            document.getElementById('wrapper').innerHTML = '<p class="no-posts-text">No Posts</p>';
            wiiuBrowser.showLoadingIcon(false);
        }
        else if (this.readyState === 4){
            wiiuBrowser.showLoadingIcon(false);
            wiiuErrorViewer.openByCodeAndMessage(5983000 + this.status, 'Error: "' + this.statusText + '"\nPlease send the error code and what you were doing in');
        }
    };
    xhttp.open("GET", '/communities/' + id + '/' + type + '/loadposts', true);
    xhttp.send();

    wiiuSound.playSoundByName("SE_WAVE_MENU", 1);
    wiiuBrowser.showLoadingIcon(!1);

    wiiuSound.playSoundByName("SE_WAVE_MENU", 1);
}
function loadUserPosts(element, pid) {
    wiiuBrowser.showLoadingIcon(!0);
    var offset = Number(element.getAttribute('data-offset'));
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            document.getElementsByClassName('community-page-post-box')[0].innerHTML += this.responseText;
        }
        else if(this.readyState === 4 && this.status === 204)
        {
            document.getElementById('load-more-posts-button').style.display = 'none';
        }
        else if (this.readyState === 4){
            wiiuErrorViewer.openByCodeAndMessage(5983000 + this.status, 'Error: "' + this.statusText + '"\nPlease send the error code and what you were doing in');
        }
    };
    xhttp.open("GET", "/users/loadPosts" + '?offset=' + offset + '&pid=' + pid, true);
    xhttp.send();

    element.dataset.offset = offset + 10;
    wiiuSound.playSoundByName("SE_WAVE_MENU", 1);
    wiiuBrowser.showLoadingIcon(!1);
}
function loadCommunityPosts(element, typeCheck) {
    wiiuBrowser.showLoadingIcon(!0);
    var offset = Number(element.getAttribute('data-offset'));
    var id = document.getElementsByClassName('community-page-follow-button-text')[0].id
    var xhttp = new XMLHttpRequest();
    var type = 'new';
    if(!typeCheck) {
        if(document.getElementById('popular-tab').classList.contains('active'))
            type = 'popular';
        else if(document.getElementById('verified-tab').classList.contains('active'))
            type = 'verified';
    }
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            document.getElementsByClassName('community-page-post-box')[0].innerHTML += this.responseText;
            initCommunityUsers();
        }
        else if(this.readyState === 4 && this.status === 204)
        {
            document.getElementById('load-more-posts-button').style.display = 'none';
        }
        else if (this.readyState === 4){
            wiiuErrorViewer.openByCodeAndMessage(5983000 + this.status, 'Error: "' + this.statusText + '"\nPlease send the error code and what you were doing in');
        }
    };
    xhttp.open("GET", '/communities/' + id + '/' + type + '/loadposts?offset=' + offset, true);
    xhttp.send();

    element.dataset.offset = offset + 10;
    wiiuSound.playSoundByName("SE_WAVE_MENU", 1);
    wiiuBrowser.showLoadingIcon(!1);
}
function loadFeedPosts(element) {
    var offset = Number(element.getAttribute('data-offset'));
    wiiuBrowser.showLoadingIcon(!0);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            document.getElementById('wrapper').innerHTML += this.responseText;
        }
        else if(this.readyState === 4 && this.status === 204)
        {
            document.getElementById('load-more-posts-button').style.display = 'none';
        }
        else if (this.readyState === 4){
            wiiuErrorViewer.openByCodeAndMessage(5983000 + this.status, 'Error: "' + this.statusText + '"\nPlease send the error code and what you were doing in');
        }
    };
    xhttp.open("GET", '/activity-feed/loadposts?offset=' + offset, true);
    xhttp.send();

    element.dataset.offset = offset + 10;
    wiiuSound.playSoundByName("SE_WAVE_MENU", 1);
    wiiuBrowser.showLoadingIcon(!1);
}
function switchUserPageTabs(type, id) {
    var typeDomain = '';
    document.getElementById('user-page-posts-tab').classList.remove('active');
    document.getElementById('user-page-friends-tab').classList.remove('active');
    document.getElementById('user-page-following-tab').classList.remove('active');
    document.getElementById('user-page-followers-tab').classList.remove('active');

    switch (type) {
        case 0:
            document.getElementById("user-page-posts-tab").classList.add('active');
            typeDomain = 'loadPosts';
            break;
        case 1:
            document.getElementById("user-page-friends-tab").classList.add('active');
            typeDomain = 'friends';
            break;
        case 2:
            document.getElementById("user-page-following-tab").classList.add('active');
            typeDomain = 'following';
            break;
        case 3:
            document.getElementById("user-page-followers-tab").classList.add('active');
            typeDomain = 'followers';
            break;

    }
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            document.getElementsByClassName('community-page-post-box')[0].innerHTML = this.responseText;
        }
        else if (this.readyState === 4){
            wiiuErrorViewer.openByCodeAndMessage(5983000 + this.status, 'Error: "' + this.statusText + '"\nPlease send the error code and what you were doing in #bug-reports');
        }
    };
    xhttp.open("GET", "/users/" + typeDomain + '?pid=' + id, true);
    xhttp.send();
    wiiuSound.playSoundByName("SE_OLV_OK", 1);
}
function swapPostType(type) {
    document.getElementsByClassName("post-type-button-text")[0].classList.remove('selected');
    document.getElementsByClassName("post-type-button-painting")[0].classList.remove('selected');

    switch (type) {
        case 0:
            document.getElementsByClassName("post-type-button-text")[0].classList.add('selected');
            document.getElementById('post-text-input').style.display = '';
            document.getElementById('post-painting-input').style.display = 'none';
            break;
        case 1:
            document.getElementsByClassName("post-type-button-painting")[0].classList.add('selected');
            document.getElementById('post-text-input').style.display = 'none';
            document.getElementById('post-painting-input').style.display = '';
            break;

    }
    wiiuSound.playSoundByName("SE_OLV_OK", 1);
}
function newPainting(reset) {
    wiiuMemo.open(reset);
    setTimeout(function () {
        if(wiiuMemo.isFinish()) {
            console.log('running!')
            document.getElementById('memo').src = 'data:image/png;base64,' + wiiuMemo.getImage(false);
            document.getElementById('memo').style.display = '';
            document.getElementById('memo-value').value = wiiuMemo.getImage(true);
        }
        }, 1000);
}
function loadScreenshots() {
    var dropdown = document.getElementsByClassName('post-screenshot-picker-dropdown')[0];
    if(dropdown.style.display === 'block')
        dropdown.style.display = 'none';
    else
        dropdown.style.display = 'block';
}
function selectScreenshot(select) {
    var screenshot;
    switch (select) {
        case 1:
            screenshot = wiiuMainApplication.getScreenShot(true);
            document.getElementById('screenshot-value').value = screenshot
            document.getElementsByClassName('post-screenshot-picker-icon')[0].style.backgroundImage = "url('data:image/png;base64," + screenshot + "')";
            document.getElementsByClassName('post-screenshot-picker-icon')[0].style.backgroundSize = '90%';
            break;
        case 2:
            screenshot = wiiuMainApplication.getScreenShot(false);
            document.getElementById('screenshot-value').value = screenshot;
            document.getElementsByClassName('post-screenshot-picker-icon')[0].style.backgroundImage = "url('data:image/png;base64," + screenshot + "')";
            document.getElementsByClassName('post-screenshot-picker-icon')[0].style.backgroundSize = '90%';
            break;
        default:
            document.getElementById('screenshot-value').value = '';
            document.getElementsByClassName('post-screenshot-picker-icon')[0].style.backgroundImage = '';
            document.getElementsByClassName('post-screenshot-picker-icon')[0].style.backgroundSize = '';
            break;
    }
}
function searchCommunities() {
    var input, filter, table, tr, td, i, j, txtValue;
    input = document.getElementById("search-bar");
    filter = input.value.toUpperCase();
    table = document.getElementById("community-list");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        for(j = 0; j < tr[i].getElementsByTagName("td").length; j++) {
            td = tr[i].getElementsByTagName("td")[j].children[0].children[1];
            if (td) {
                txtValue = td.textContent || td.innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    tr[i].getElementsByTagName("td")[j].style.display = "";
                } else {
                    tr[i].getElementsByTagName("td")[j].style.display = "none";
                }
            }
        }
    }
}
function changeMiiImageReaction(element) {
    if(element.checked) {
        var pfp = document.getElementsByClassName('post-user-icon')[0];
        var newPfp;
        switch (element.value) {
            case '1':
                newPfp = 'smile_open_mouth.png'
                break;
            case '2':
                newPfp = 'wink_left.png'
                break;
            case '3':
                newPfp = 'surprise_open_mouth.png'
                break;
            case '4':
                newPfp = 'frustrated.png'
                break;
            case '5':
                newPfp = 'sorrow.png'
                break;
            default:
                newPfp = 'normal_face.png'
                break;
        }
        pfp.src = pfp.src.substring(0, pfp.src.lastIndexOf('/') + 1) + newPfp;
    }


}

checkForUpdates();
function checkForUpdates() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            var notificationObj = JSON.parse(this.responseText);
            /**/
            if(notificationObj.message_count > 0  && notificationObj.message_count < 99) {
                document.getElementById("messages-badge").innerHTML = notificationObj.message_count;
                document.getElementById("messages-badge").style.display = "block";
            }
            else if(notificationObj.message_count >= 99) {
                document.getElementById("messages-badge").innerHTML = "99+";
                document.getElementById("messages-badge").style.display = "block";
            }
            else {
                document.getElementById("messages-badge").innerHTML = "";
                document.getElementById("messages-badge").style.display = "none";
            }
            /*Check for Notifications*/
            if(notificationObj.notification_count > 0  && notificationObj.notification_count < 99) {
                document.getElementById("news-badge").innerHTML = notificationObj.notification_count;
                document.getElementById("news-badge").style.display = "block";
            }
            else if(notificationObj.notification_count >= 99) {
                document.getElementById("news-badge").innerHTML = "99+";
                document.getElementById("news-badge").style.display = "block";
            }
            else {
                document.getElementById("news-badge").innerHTML = "";
                document.getElementById("news-badge").style.display = "none";
            }
        }
    };
    xhttp.open("GET", "/notifications.json", true);
    xhttp.send();
}
var bButtonCheck = setInterval(function() {
    wiiu.gamepad.update()
    if(wiiu.gamepad.hold === 16384 && wiiuBrowser.canHistoryBack()) {
        wiiuSound.playSoundByName("SE_WAVE_MENU", 1);
        window.history.back()
    }

}, 250);

//window.onscroll = function() {scrollFunction()};

function scrollFunction() {
    var scrollPrompt = document.getElementById("scroll-prompt");
    if (document.body.scrollTop > 450 || document.documentElement.scrollTop > 450) {
        scrollPrompt.style.display = "block";
    } else {
        scrollPrompt.style.display = "none";
    }
}

function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

/*Debugging*/
if (typeof wiiu === 'undefined') {
    window.wiiu = {
        gamepad: {
            update: function () {
                return true;
            },
            hold: 0
        }
    };
}
// ローカル開発用に 各独自 API をエミュレート
// Emulate each proprietary API for local development
if (typeof wiiuBrowser === 'undefined') {
    window.wiiuBrowser = {
        closeApplication: function () {
            alert('アプリケーションは終了しました');
        },
        showLoadingIcon: function (show) {
            console.log((show ? 'Show' : 'Hide') + ' loading icon');
        },
        endStartUp: function () {
            console.log('endStartUp');
        },
        lockUserOperation: function (lock) {
            console.log((lock ? 'Lock' : 'Unlock') + ' user operations');
        },
        lockHomeButtonMenu: function (lock) {
            console.log((lock ? 'Lock' : 'Unlock') + ' home button menu');
        },
        canHistoryBack: function () {
            // とりあえずトップページなら履歴を戻れないということにしておく。
            return location.pathname !== '/';
        },
        setSwkbdDictionary: function (jsonString) {
            console.log('Set SWKBD dictionary', JSON.parse(jsonString));
            return (Math.random() < 0.5)
                ? {} : { error: { code: 111222, message: 'Test Error Message' } };
        },
        openTvAreaSetting: function () {
            alert('Tv側の安全フレーム設定画面を開きました');
        },
        jumpToBrowser: function (url) {
            console.log(url);
        },
        jumpToEshop: function (query) {
            console.log(query);
        },
        jumpToApplication: function(titleId, flags, communityId, appData, postId) {
            console.log(titleId);
        }
    };
}
if (typeof wiiuDialog === 'undefined') {
    window.wiiuDialog = {
        alert: function (msg, btnStr) {
            alert(msg + "\n\n[ " + btnStr + " ]");
        },
        confirm: function (msg, lBtnStr, rBtnStr) {
            return confirm(msg + "\n\n[ " + lBtnStr + " (Cancel) ]  [ " + rBtnStr + " (OK) ]");
        }
    };
}
if (typeof wiiuSound === 'undefined') {
    window.wiiuSound = {
        playSound: function (soundId, device) {
            this.playSoundByName('id ' + soundId, device);
        },
        playSoundByName: function (name, device) {
            console.log('Play sound ' + name);
        }
    };
}
if (typeof wiiuDevice === 'undefined') {
    window.wiiuDevice = {
        isDrc: function () {
            return true;
        },
        getSKU: function () {
            return Math.random() < 7 / 8
                ? { amount: 31205621760 }
                : { error: { code: 1112222, message: "Test Error Message" } };
        },
        existsTitle: function () {
            return Math.random() < 1 / 2;
        }
    };
}
if (typeof wiiuSystemSetting === 'undefined') {
    window.wiiuSystemSetting = {
        checkParentalPinCode: function (code) {
            console.log(code);
            return Math.random() < 0.5 ? {result: true} :{
                error : {
                    code : 1112222,
                    message : "Test Error Message"
                }
            };
        },
        getRegion: function () {
            return Math.random() < 0.5 ? {
                code: 'JPN'
            } : {
                error: {
                    code : 1112222,
                    message : "Test Error Message"
                }
            };
        },
        getCountry: function () {
            return Math.random() < 0.5 ? {
                code: 'JP'
            } : {
                error: {
                    code : 1112222,
                    message : "Test Error Message"
                }
            };
        },
        getLanguage: function () {
            return Math.random() < 0.5 ? {
                code: 'ja'
            } : {
                error: {
                    code : 1112222,
                    message : "Test Error Message"
                }
            };
        },
        getSpotPassUploadConsoleInfoState: function () {
            return { enable: Math.random() < 0.5 };
        },
    };
}
if (typeof wiiuBOSS === 'undefined') {
    window.wiiuBOSS = {
        isRegisteredBossTask: function () {
            console.log('wiiuBOSS.isRegisteredBossTask');
            var result = {
                "isRegistered" : true
            };
            return result;
        },
        registerBossTask: function (languageCode) {
            console.log('wiiuBOSS.registerBossTask');
            //return { "error" : { "code" : 1112222, "message" : "Test Error Message"} };
            return {};
        },
        unregisterBossTask: function () {
            console.log('wiiuBOSS.unregisterBossTask');
            //return { "error" : { "code" : 1112222, "message" : "Test Error Message"} };
            return {};
        },
        isRegisteredDirectMessageTask: function () {
            console.log('wiiuBOSS.isRegisteredDirectMessageTask');
            var result = {
                "isRegistered" : true
            };
            return result;
        },
        registerDirectMessageTask: function (languageCode) {
            console.log('wiiuBOSS.registerDirectMessageTask');
            //return { "error" : { "code" : 1112222, "message" : "Test Error Message"} };
            return {};
        },
        registerDirectMessageTaskEx: function (lifeTime, interval) {
            console.log('wiiuBOSS.registerDirectMessageTaskEx');
            //return { "error" : { "code" : 1112222, "message" : "Test Error Message"} };
            return {};
        },
        unregisterDirectMessageTask: function () {
            console.log('wiiuBOSS.unregisterDirectMessageTask');
            //return { "error" : { "code" : 1112222, "message" : "Test Error Message"} };
            return {};
        },
    };
}
if (typeof wiiuMainApplication === 'undefined') {
    window.wiiuMainApplication = {
        _images: [
            // JPEG, 850x450, 暖色 warm color
            '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',
            // JPEG, 850x450, 寒色 cool
            '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',
            null
        ],
        _getImage: function () {
            var images = this._images;
            var index = Math.floor(Math.random() * images.length);

            // テスト等でスクショの有無を固定したい場合にクッキーで指定できるようにする, 実機ではこの挙動は存在しない
            // If you want to fix the presence or absence of screenshots in tests, etc., make it possible to specify with cookies, this behavior does not exist on the actual device
            var force = Olv.Cookie.get('force_screenshot_for_test');
            if (force === 'true')  index = 0;
            if (force === 'false') index = 2;

            return images[index];
        },
        getScreenShot:         function (isTv) { return this._getImage(); },
        getAppData:            function () { return null; },
        getExternalImageData:  function () { return this._getImage(); },
        getExternalBinaryData: function () { return null; }
    };
}
if (typeof wiiuMemo === "undefined") {
    window.wiiuMemo = {
        _isFinish: true,
        open: function(reset) {
            console.log('wiiuMemo.open(reset = ' + reset + ')');
            this._isFinish = false;
            var self = this;
            setTimeout(function () { self._isFinish = true; }, 100);
        },
        isFinish: function() {
            console.log('wiiuMemo.isFinish()')
            console.log(this._isFinish);
            return this._isFinish;
        },
        reset: function () {
            console.log('wiiuMemo.reset()');
        },
        getImage: function (isTga) {
            console.log('wiiuMemo.getImage(isTga = ' + isTga + ')');
            if (isTga) {
                return 'eJzt3FuO0zAUBuDCE8tgKSyL3YNGqFJpk9aX41v8fdK8MHXiy/HvZCR6u32/3f369vv288cfAAAAAAAAAAAAAAAAAAAAAABgK7fbbXQXALr7yr77D8BO5B+wI9kH7Ej2ATuSfcBuHnNP9gE7eM492QekOsqPFXJkxT4D83iXfTPm4ox9AtZVmoEtc2iFLAauLTobZ8tZgFwyD+CVnAMAAAAAAAAAAAAAAAAAAAAAACCH758CduQ7+ICdrZyBq/YbmMOq+ec7pIEIq+aH7AMAAAAAAAAAAAAAAAAAAAAAgFjP32929gPUs6/GS808awVx7KuxSnPPGvFFfdQzb308z21O3Vojno0+J69Uh/ZXW0dzmzrfznaOjHxfKLnu7HVrn7VxNKc12Wdd0qz6bpjSv5SxlIw7Zb5Ks2+VuV+tXmaSegZ/mt+azNxZ7jPR6LksfSdI/WzqWEvm7Yr5dzdTrdT2oVe/c2slp8ZGr8HsSvfvqHmN6lPq+ZpzFreYt1Xrd3StjDh3Sta8tE5KapT/ldRIZF1H3TsiW1plWU0fW9Zur/0wKgdr79m6lt7do2ZP1I5jFy3yq6ZtzjqenW8lfUnpQ23WlrZtVbsj9kTvDIys7dzPl/y8u04N+fcqek4i8yDlTEy5Vu0Yju7TYrwpbaKN3BM75F/q51LruYb8e9ViTqL29dF1ctvUjCt3DKXjftemdc322BMlZ1yr+/doX3Mefvp9rzHsoNdzRUpW5VwrN4+ixpFzz5Sxn7XPuXet6HukZl2v7HvuU6/2OeMrOdNzxyL/Xo04+0vuv3r+lTwHrJINR9eZKfue+9azfUnN5l6zpB1956P2+ab0LO2Vf2efi8jAHiLzYdQYUvv36ffRmX3Wtua6Jf2baT1mMOL54uh+NfkS8dnIa0XvmV5q5mu2rDuTcj61ysDce0Vf82z8O2s9Hzlrm9KXmhyqEXU2zywq/2b2Lg9aZ99RH6LrRAbmia752rV997mSGmlRVyVtVqi16H09o3c1W9q+ti8tfdqjuyudi5bn5Fnb0mtGn9lX1er5Yybq4J+rjKNW1PNf6+f453+PuObZM+antlcW+VwzaxZG1fzKrjKOWqPeDXOvG/3OkZvb6iVfq7Mxsl8j2o82yzqMtsocjMjAd23I0/I9obY/I9qPNHruZ7LSHLRat9TrrjRXM5shA3fOvy+r9z/KivOw6p7hlec/RltxLVfcM8wjMv/Uw9qs42fm6Foi1lM9XIO9ncb8XIea504tsBPvrjxSC+xGvfNIBgK7kn/AzmQgR9QDu/C3YR6pBXYjA7lTC+zI/5HmTh2wKzmItWdno7+rg/GsN7uTgcDu5CCwOxkI7MyzILA7GQjsTAYCO5N9AAAAAAAAAAAAAAAAAAAAAAAAAKzoL3j1Foo=';
            } else {
                return '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';
            }
        }
    };
}
if (typeof wiiuPDM === "undefined") {
    window.wiiuPDM = {
        getTotalPlayTime: function(titleID) {
            console.log('wiiuPDM.getTotalPlayTime(' + titleID + ')');
            return { minutes : 0 };
        },
        getTitlesFilteredByPlayTime: function(minutes) {
            console.log('wiiuPDM.getTitlesFilteredByPlayTime(' + minutes + ')');
            return { IDs : [] };
        }
    }
}
if (typeof wiiuErrorViewer === 'undefined') {
    window.wiiuErrorViewer = {
        openByCode: function (errorCode) {
            var message = 'Message for error code ' + errorCode;
            this.openByCodeAndMessage(errorCode, message);
        },
        openByCodeAndMessage: function (errorCode, errorMessage) {
            alert(errorCode + '\n\n' + errorMessage);
        }
    };
}
if (typeof wiiuFilter === 'undefined') {
    window.wiiuFilter = {
        checkWord: function (message) {
            console.log('Check words for message: ' + message);
            if (/[0-9]{6}/.test(message)) return -1;
            if (/ng word/i.test(message)) return -2;
            return 0;
        },
    };
}
if (typeof wiiuSessionStorage === 'undefined') {
    window.wiiuSessionStorage = {
        getItem: function (key) {
            return sessionStorage.getItem(key);
        },
        setItem: function (key, value) {
            sessionStorage.setItem(key, value);
            return true;
        },
        removeItem: function (key) {
            sessionStorage.removeItem(key);
        },
        clear: function () {
            sessionStorage.clear();
        },
        key: function (index) {
            return sessionStorage.key(index);
        },
        length: function () {
            return sessionStorage.length;
        },
    };
}
if (typeof wiiuLocalStorage === 'undefined') {
    window.wiiuLocalStorage = {
        getItem: function (key) {
            return localStorage.getItem(key);
        },
        setItem: function (key, value) {
            localStorage.setItem(key, value);
            return true;
        },
        removeItem: function (key) {
            localStorage.removeItem(key);
        },
        clear: function () {
            localStorage.clear();
        },
        key: function (index) {
            return localStorage.key(index);
        },
        length: function () {
            return localStorage.length;
        },
        write: function () {},
    };
}
