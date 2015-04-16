$(function() { /////////////////////////////////////////////////////////////////

$('a.post').smoothScroll();

var container = $('#photos').isotope({
    itemSelector: '.element-item',
    layoutMode: 'masonry',
    masonry: {
        columnWidth: 160
    },
});

var addItem = function(item) {
    var img = new Image();
    img.onload = function() {
        var div = document.createElement('div');
        if (item.priority > 1)
            div.className = 'element-item big';
        else
            div.className = 'element-item';
        div.style.backgroundImage = 'url('+item.photo_url_s3+')';
        div.style.backgroundSize = '100% 100%';

        $('#photos').isotope( 'insert', div );
    }
    img.src = item.photo_url_s3;
}

var addItems = function(items) {
    
    for (var i=0; i<items.length; i++) {
        addItem(items[i]);
    }
}

addItems([
    {
        photo_url_s3: 'https://images.ifeelnaked.org/photos/954574647314666545_13219660.jpg',
        caption: 'This is just a test',
        username: 'loltato',
        priority: 2
    },
    {
        photo_url_s3: 'https://images.ifeelnaked.org/photos/955372211936237689_303238909.jpg',
        caption: 'This is just a test',
        username: 'loltato',
        priority: 1
    },
    {
        photo_url_s3: 'https://images.ifeelnaked.org/photos/958147601587503545_1430630255.jpg',
        caption: 'This is just a test',
        username: 'loltato',
        priority: 1
    },
    {
        photo_url_s3: 'https://images.ifeelnaked.org/photos/958894484136404709_485150520.jpg',
        caption: 'This is just a test',
        username: 'loltato',
        priority: 1
    },
    {
        photo_url_s3: 'https://images.ifeelnaked.org/photos/953092322161580908_228371525.jpg',
        caption: 'This is just a test',
        username: 'loltato',
        priority: 2
    },
    {
        photo_url_s3: 'https://images.ifeelnaked.org/photos/960060237039365566_40923418.jpg',
        caption: 'This is just a test',
        username: 'loltato',
        priority: 1
    },
    {
        photo_url_s3: 'https://images.ifeelnaked.org/photos/960060237039365566_40923418.jpg',
        caption: 'This is just a test',
        username: 'loltato',
        priority: 1
    },
    {
        photo_url_s3: 'https://images.ifeelnaked.org/photos/962151816393552098_174382203.jpg',
        caption: 'This is just a test',
        username: 'loltato',
        priority: 1
    },
    {
        photo_url_s3: 'https://images.ifeelnaked.org/photos/956153676076045895_201753220.jpg',
        caption: 'This is just a test',
        username: 'loltato',
        priority: 1
    },
    {
        photo_url_s3: 'https://images.ifeelnaked.org/photos/957436741827235671_1664660322.jpg',
        caption: 'This is just a test',
        username: 'loltato',
        priority: 1
    },
    {
        photo_url_s3: 'https://images.ifeelnaked.org/photos/960326517520223097_202557961.jpg',
        caption: 'This is just a test',
        username: 'loltato',
        priority: 1
    },
    {
        photo_url_s3: 'https://images.ifeelnaked.org/photos/958068899319359197_37324584.jpg',
        caption: 'This is just a test',
        username: 'loltato',
        priority: 2
    },
    {
        photo_url_s3: 'https://images.ifeelnaked.org/photos/952295304024885152_274272880.jpg',
        caption: 'This is just a test',
        username: 'loltato',
        priority: 1
    },
    {
        photo_url_s3: 'https://images.ifeelnaked.org/photos/955419311190991164_12501431.jpg',
        caption: 'This is just a test',
        username: 'loltato',
        priority: 1
    },
    {
        photo_url_s3: 'https://images.ifeelnaked.org/photos/953739778147214963_45667040.jpg',
        caption: 'This is just a test',
        username: 'loltato',
        priority: 1
    },
]);

//var $newItems = $('<div class="element-item" /><div class="element-item" /><div class="element-item" />');
//$('#photos').isotope( 'insert', $newItems );

}); ////////////////////////////////////////////////////////////////////////////