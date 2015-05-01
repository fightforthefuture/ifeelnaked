var trackOptimizely = function(ev) {
    window['optimizely'] = window['optimizely'] || [];
    window.optimizely.push(["trackEvent", ev]);
}
var action_bar_visible = false;

$(function() { /////////////////////////////////////////////////////////////////


$(window).scroll(function(e) {
    if (action_bar_visible)
        return;
    if ($(window).scrollTop() > 500) {
        $( ".action_bar" ).addClass('visible');
        $( "a.post" ).addClass('visible');
        action_bar_visible = true;
    }
});

var STATIC_PHOTO_DENSITY = 10;

var processed = 0;
var staticIndex = 0;
staticImages = document.querySelectorAll('#static_images > div');

var container = $('#photos').isotope({
    itemSelector: '.element-item',
    layoutMode: 'masonry',
    masonry: {
        columnWidth: 160
    },
    transitionDuration: 0
});

var addItem = function(item) {

    if (document.getElementById(item.username+'_'+item._id))
        return;

    var img = new Image();
    img.onload = function() {
        var div = document.createElement('div');
        if (item.priority > 0)
            div.className = 'element-item black_and_white big';
        else
            div.className = 'element-item black_and_white';
        div.id = item.username+'_'+item._id;
        div.style.backgroundImage = 'url('+item.photo_url_s3.replace('http:', 'https:')+')';
        div.style.backgroundSize = 'auto 100%';
        div.style.backgroundRepeat = 'no-repeat';
        div.style.backgroundPosition = 'center center';
        div.style.backgroundColor = '#333';

        var caption = document.createElement('div');
        caption.className = 'label';
        label = document.createElement('p');
        label.textContent = '#ifeelnaked';
        caption.appendChild(label);
        div.appendChild(caption);

        div.addEventListener('click', function(e) {
            showModal(item);
        }, false);

        if (processed % STATIC_PHOTO_DENSITY == 0)
            addStatic();

        $('#photos').isotope( 'insert', div );

        



        processed++;
    }
    img.src = item.photo_url_s3.replace('http:', 'https:');
}

var addItems = function(items) {
    for (var i=0; i < items.length; i++) {
        addItem(items[i]);
    }
}

var showModal = function(item) {
    var overlay = document.createElement('div');
    overlay.className = 'overlay invisible';

    var gutter = document.createElement('div');
    gutter.className = 'gutter';

    var modal = document.createElement('div');
    modal.className = 'modal photo';
    
    var img = document.createElement('div');
    img.className = 'photo';
    img.style.background = 'white url('+item.photo_url_s3.replace('http:', 'https:')+') center center no-repeat';
    img.style.backgroundSize = 'auto 100%';
    modal.appendChild(img);

    var tweet = document.createElement('div');
    tweet.className = 'tweet';

    var avatar = document.createElement('a');
    avatar.className = 'avatar';
    avatar.href = item.original_url;
    avatar.target = '_blank';
    var avimg = document.createElement('img');
    avimg.src = item.user_avatar_s3;
    avatar.appendChild(avimg);
    tweet.appendChild(avatar);

    var username = document.createElement('a');
    username.href = item.original_url;
    username.target = "_blank";
    username.textContent = item.username + ":";
    tweet.appendChild(username);

    if (item.caption.length <= 140)
        var caption = item.caption;
    else
        var caption = item.caption.substr(0, 140) + '…';

    var text = document.createElement('span');
    text.src = item.user_avatar_s3;
    text.textContent = ' ' + caption;
    tweet.appendChild(text);

    var close = document.createElement('a');
    close.href = '#';
    close.className = 'close';
    close.addEventListener('click', function(e) {
        e.preventDefault();
        close_modal();
    }, false);
    modal.appendChild(close);


    modal.appendChild(tweet);
    
    gutter.appendChild(modal);
    overlay.appendChild(gutter);
    document.body.appendChild(overlay);

    var close_modal = function() {
        overlay.className = 'overlay invisible';
        setTimeout(function() {
            document.body.removeChild(overlay);
        }, 400);
    }

    gutter.addEventListener('click', function(e) {
        if (e.target == gutter)
            close_modal();
    }, false);

    overlay.style.display = 'block';
    setTimeout(function() { overlay.className = 'overlay'; }, 50);
}

$.ajax('https://ifeelnaked-api.herokuapp.com/random/60', {
    success: function(data) {
        addItems(data)
    }
});

var addStatic = function() {
    console.log('adding static: ', processed);
  

    if (staticIndex == staticImages.length)
        return false;

    var img = staticImages[staticIndex];
    var bgImg = img.querySelector('img');
    var p = img.querySelector('p');
    var a = img.querySelector('a');

    var div = document.createElement('div');
    div.className = 'element-item big '+img.className;
    div.id = 'static_'+staticIndex;
    div.style.backgroundImage = 'url('+bgImg.src+')';
    div.style.backgroundSize = '100% 100%';

    var caption = document.createElement('div');
    caption.className = 'caption';
    caption.innerHTML = p.innerHTML;
    div.appendChild(caption);
        
    div.addEventListener('click', function(e) {
        window.open(a.href);
    }, false);


    $('#photos').isotope( 'insert', div );

    staticIndex++;
}

var show_modal = function(el) {
    var overlay = document.getElementById(el);
    overlay.style.display = 'block';
    setTimeout(function() { overlay.className = 'overlay'; }, 30);
}

var hide_modal = function(el) {
    var overlay = document.getElementById(el);
    overlay.className = 'overlay invisible';
    setTimeout(function() { overlay.style.display = 'none'; }, 400);
}

document.querySelector('.close.lite').addEventListener('click', function(e) {
    e.preventDefault();
    hide_modal("participate_modal");
}, false);

document.querySelector('#participate_modal button').addEventListener('click', function(e) {
    e.preventDefault();
    hide_modal("participate_modal");
}, false);

document.querySelector('a.post').addEventListener('click', function(e) {
    e.preventDefault();
    show_modal("participate_modal");
});

document.querySelector('a.participate').addEventListener('click', function(e) {
    e.preventDefault();
    show_modal("participate_modal");
});
if (window.location.href.indexOf('participate=1') != -1)
    show_modal("participate_modal");

var dn = document.querySelectorAll('a.donate');
for (var i = 0; i < dn.length; i++) {
    dn[i].addEventListener('click', function(e) {
        e.preventDefault();
        trackOptimizely('donate');
        window.open('https://donate.fightforthefuture.org/?tag='+DONATE_TAG);
    }, false);
}

var fb = document.querySelectorAll('a.facebook');
for (var i = 0; i < fb.length; i++) {
    fb[i].addEventListener('click', function(e) {
        e.preventDefault();
        trackOptimizely('share');
        window.open('https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fwww.ifeelnaked.org%2F');
    }, false);
}

var tws = document.querySelectorAll('a.twitter');
for (var i = 0; i < tws.length; i++) {
    tws[i].addEventListener('click', function(e) {
        e.preventDefault();
        trackOptimizely('share');
        window.open('https://twitter.com/intent/tweet?text='+encodeURIComponent(TWEET_TEXT));
    }, false);
}

}); ////////////////////////////////////////////////////////////////////////////
