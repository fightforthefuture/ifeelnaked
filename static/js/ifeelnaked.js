var trackOptimizely = function(ev) {
    window['optimizely'] = window['optimizely'] || [];
    window.optimizely.push(["trackEvent", ev]);
}
var action_bar_visible = false;
var loading_more = false;
var photos_initially_loaded = false;
var photo_data_base64 = null;
var streamRef = null;

$(function() { /////////////////////////////////////////////////////////////////

var isScrolledIntoView = function(elem)
{
    var $elem = $(elem);
    var $window = $(window);

    var docViewTop = $window.scrollTop();
    var docViewBottom = docViewTop + $window.height();

    var elemTop = $elem.offset().top;
    var elemBottom = elemTop + $elem.height();

    return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
}
var doLoadMore = function() {
    if (loading_more || photos_initially_loaded == false)
        return;

    console.log('loading more!');
    loading_more = true;
    doLoad();

}

$(window).scroll(function(e) {
    if ($(window).scrollTop() > 500 && !action_bar_visible) {
        $( ".action_bar" ).addClass('visible');
        $( "a.post" ).addClass('visible');
        action_bar_visible = true;
    }
    if (isScrolledIntoView('#load_more')) {
        doLoadMore();
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
        if (document.getElementById(item.username+'_'+item._id))
            return;

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
    if (!item.share) {
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
    } else {
        tweet.className = 'tweet share';
        var shareLink = SITE_URL+'/photo/'+item.permalink_slug;

        var span = document.createElement('span');
        span.textContent = 'Now, share your photo and @tag your friends to add theirs!';
        tweet.appendChild(span);

        var fb = document.createElement('a');
        fb.className = 'share fb';
        fb.href = '#';
        fb.textContent = 'Share';
        fb.addEventListener('click', function(e) {
            e.preventDefault();
            trackOptimizely('share');
            window.open('https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(shareLink));
        }, false);
        tweet.appendChild(fb);

        var tw = document.createElement('a');
        tw.className = 'share tw';
        tw.href = '#';
        tw.textContent = 'Tweet';
        tw.addEventListener('click', function(e) {
            e.preventDefault();
            trackOptimizely('share');
            window.open('https://twitter.com/intent/tweet?text='+encodeURIComponent(TWEET_TEXT+' '+TWEET_URL+' '+(item.photo_display_url ? item.photo_display_url : item.photo_url_s3)));
        }, false);
        tweet.appendChild(tw);
    }

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

var doLoad = function() {
    $.ajax('https://ifeelnaked-api.herokuapp.com/random/60', {
        success: function(data) {
            setTimeout(function(){ loading_more = false; }, 500); // not so fast
            photos_initially_loaded = true;
            addItems(data)
        }
    });
}
doLoad();

var addStatic = function() {
    console.log('adding static 2: ', processed);


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

var show_loader = function() {
    var loader = document.getElementById('loader');
    loader.style.display = 'block';
    setTimeout(function() { loader.className = ''; }, 30);
}

var hide_loader = function() {
    var loader = document.getElementById('loader');
    loader.className = 'invisible';
    setTimeout(function() { loader.style.display = 'none'; }, 400);
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

var bind_hide = function(el) {
    document.querySelector('#'+el+' .close.lite').addEventListener(
        'click', function(e) {
            e.preventDefault();
            hide_modal(el);
        }, false
    );
}

var close_modals = ['participate_modal', 'webcam_modal', 'manual_modal'];

for (var i=0; i<close_modals.length; i++)
    bind_hide(close_modals[i]);

var open_webcam_modal = function() {
    show_modal("webcam_modal");
    setTimeout(function() {
        initialize_webcam();
    }, 300);
};

var initialize_webcam = function() {
    // The width and height of the captured photo. We will set the
    // width to the value defined here, but the height will be
    // calculated based on the aspect ratio of the input stream.

    var width = 640;    // We will scale the photo width to this
    var height = 0;     // This will be computed based on the input stream

    // |streaming| indicates whether or not we're currently streaming
    // video from the camera. Obviously, we start at false.

    var streaming = false;

    // The various HTML elements we need to configure or control. These
    // will be set by the startup() function.

    var video = null;
    var canvas = null;
    var startbutton = null;
    var photoData = null;

    var startup = function() {
        video = document.getElementById('video');
        canvas = document.getElementById('canvas');
        startbutton = document.getElementById('startbutton');
        reset_photo_elements();

        navigator.getMedia = ( navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia);

        navigator.getMedia(
            {
                video: true,
                audio: false
            },
            function(stream) {
                streamRef = stream;
                if (navigator.mozGetUserMedia) {
                    video.mozSrcObject = stream;
                } else {
                    var vendorURL = window.URL || window.webkitURL;
                    video.src = vendorURL.createObjectURL(stream);
                }
                video.play();
            },
            function(err) {
                console.log("An error occured! " + err);
            }
        );

        video.addEventListener('canplay', function(ev){
            if (!streaming) {
                height = video.videoHeight / (video.videoWidth/width);

                // Firefox currently has a bug where the height can't be read from
                // the video, so we will make assumptions if this happens.

                if (isNaN(height)) {
                    height = width / (4/3);
                }

                video.setAttribute('width', width);
                video.setAttribute('height', height);
                canvas.setAttribute('width', width);
                canvas.setAttribute('height', height);
                streaming = true;

                document.querySelector('#webcam_modal .close.lite').addEventListener(
                    'click',
                    function(e) {
                        clearphoto();
                        if (streamRef) {
                            streamRef.stop();
                            streamRef = null;
                        }
                    },
                    false
                );
            }
        }, false);

        startbutton.addEventListener('click', function(ev){
            takepicture();
            ev.preventDefault();
        }, false);

        clearphoto();
    }

    // Fill the photo with an indication that none has been
    // captured.

    var clearphoto = function() {
        var context = canvas.getContext('2d');
        context.fillStyle = "#AAA";
        context.fillRect(0, 0, canvas.width, canvas.height);

        var data = canvas.toDataURL('image/png');
        photo.setAttribute('src', data);
    }

    // Capture a photo by fetching the current contents of the video
    // and drawing it into a canvas, then converting that to a PNG
    // format data URL. By drawing it on an offscreen canvas and then
    // drawing that to the screen, we can change its size and/or apply
    // other changes before drawing it.

    var takepicture = function() {
        if (!streaming)
            return startup();

        var context = canvas.getContext('2d');
        if (width && height) {
            canvas.width = width;
            canvas.height = height;
            context.drawImage(video, 0, 0, width, height);

            if (BLACK_AND_WHITE) {
                var imgPixels = context.getImageData(0, 0, width, height);
                for(var y = 0; y < imgPixels.height; y++){
                    for(var x = 0; x < imgPixels.width; x++){
                        var i = (y * 4) * imgPixels.width + x * 4;
                        var avg = (imgPixels.data[i] + imgPixels.data[i + 1] + imgPixels.data[i + 2]) / 3;
                        imgPixels.data[i] = avg;
                        imgPixels.data[i + 1] = avg;
                        imgPixels.data[i + 2] = avg;
                    }
                }
                context.putImageData(imgPixels, 0, 0, 0, 0, imgPixels.width, imgPixels.height);
            }

            document.getElementById('shutter').play();
            document.getElementById('flash').style.display = 'block';
            setTimeout(function() {
                document.getElementById('flash').style.display = 'none';
            }, 2500);

            photoData = canvas.toDataURL('image/png');
            photo_data_base64 = photoData.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
            photo.setAttribute('src', photoData);

            video.style.display = 'none';
            photo.style.display = 'block';

            setTimeout(function() {
                document.getElementById('startbutton').style.display = 'none';
                document.getElementById('use').style.display = 'inline-block';
                document.getElementById('retake').style.display = 'inline-block';
            }, 125);
        } else {
            clearphoto();
        }
    }

    startup();
};
var reset_photo_elements = function() {
    document.getElementById('startbutton').style.display = 'inline-block';
    document.getElementById('use').style.display = 'none';
    document.getElementById('retake').style.display = 'none';
    document.getElementById('video').style.display = 'block';
    document.getElementById('photo').style.display = 'none';
}
var submit_photo_data = function(modal) {
    $.ajax({
        type: 'POST',
        url: '/base64',
        data: { 'img_data': photo_data_base64 },
        success: function(data){
            hide_loader();

            data = JSON.parse(data);
            if (!data || data.error)
                return alert('Could not save that photo. Please try again!');

            hide_modal(modal);

            console.log('return json: ', data);
            data.share = true;
            showModal(data);
        },
        error: function() {
            hide_loader();
            alert('Could not save that photo. Please try again!');
        }
    });
}


document.querySelector('#manual_modal button').addEventListener('click', function(e) {
    e.preventDefault();
    hide_modal("manual_modal");
}, false);

document.querySelector('a.post').addEventListener('click', function(e) {
    e.preventDefault();
    show_modal("participate_modal");
}, false);

document.querySelector('#manual').addEventListener('click', function(e) {
    e.preventDefault();
    hide_modal("participate_modal");
    show_modal("manual_modal");
}, false);

document.querySelector('.manual').addEventListener('click', function(e) {
    e.preventDefault();
    hide_modal("participate_modal");
    show_modal("manual_modal");
}, false);

document.querySelector('a.participate').addEventListener('click', function(e) {
    e.preventDefault();
    show_modal("participate_modal");
}, false);
if (window.location.href.indexOf('participate=1') != -1)
    show_modal("participate_modal");

document.querySelector('#use_webcam').addEventListener('click', function(e) {
    e.preventDefault();
    hide_modal("participate_modal");
    open_webcam_modal();
}, false);
if (window.location.href.indexOf('webcam=1') != -1)
    open_webcam_modal();

document.querySelector('#choose_file').addEventListener('click', function(e) {
    e.preventDefault();
    // hide_modal("participate_modal");
    document.getElementById('file').click();
}, false);

document.querySelector('#file').addEventListener('change', function(e) {
    var file = document.querySelector('#file').files[0];
    console.log('file: ', file);
    var reader = new FileReader();
    reader.onload = function(e) {
        photo_data_base64 = e.target.result.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
        show_loader();
        submit_photo_data('participate_modal');
    }
    reader.readAsDataURL(file);
}, false);

document.getElementById('retake').addEventListener('click', function(e) {
    e.preventDefault();
    reset_photo_elements();
}, false);

document.getElementById('use').addEventListener('click', function(e) {
    e.preventDefault();
    show_loader();
    if (streamRef) {
        streamRef.stop();
        streamRef = null;
    }
    submit_photo_data('webcam_modal');
}, false);

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
        window.open('https://twitter.com/intent/tweet?text='+encodeURIComponent(TWEET_TEXT+' '+TWEET_URL));
    }, false);
}

if (LOAD_PHOTO) {
    /*
    $.ajax('/photo/'+LOAD_PHOTO+'?return=json', {
        success: function(data) {
            data = JSON.parse(data);
            if (!data || data.error)
                return;

            console.log('return json: ', data);
            data.share = true;
            showModal(data);
        }
    });
    */
}

if (!navigator.getUserMedia && !navigator.webkitGetUserMedia &&
    !navigator.mozGetUserMedia && !navigator.msGetUserMedia)
    document.getElementById('use_webcam').style.display = 'none'

}); ////////////////////////////////////////////////////////////////////////////
