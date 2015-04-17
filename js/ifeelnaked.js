$(function() { /////////////////////////////////////////////////////////////////

$('a.post').smoothScroll();
$('a.participate').smoothScroll();

var container = $('#photos').isotope({
    itemSelector: '.element-item',
    layoutMode: 'masonry',
    masonry: {
        columnWidth: 160
    },
});

var addItem = function(item) {

    if (document.getElementById(item.username+'_'+item._id))
        return;

    var img = new Image();
    img.onload = function() {
        var div = document.createElement('div');
        if (item.priority > 0)
            div.className = 'element-item big';
        else
            div.className = 'element-item';
        div.id = item.username+'_'+item._id;
        div.style.backgroundImage = 'url('+item.photo_url_s3+')';
        div.style.backgroundSize = '100% 100%';

        div.addEventListener('click', function() {
            showModal(item);
        }, false);

        var caption = document.createElement('div');
        caption.textContent = '#ifeelnaked';
        div.appendChild(caption);

        $('#photos').isotope( 'insert', div );
    }
    img.src = item.photo_url_s3;
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
    img.style.background = 'url('+item.photo_url_s3+') center center no-repeat';
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

$.ajax('http://ifeelnaked-api.herokuapp.com/random/30', {
    success: function(data) {
        addItems(data)
    }
});

}); ////////////////////////////////////////////////////////////////////////////
