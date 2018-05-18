// Initialize apps.json
var apps = []
$.ajax({
    url: 'js/apps.json',
    dataType: 'json',
    async: false,
    success: function(appsJSON) {
        apps = appsJSON
    }
})
for (i in apps) {
    $(`#${apps[i].location}`).append(`
        <figure
            app="${i}"
            app-label="${apps[i].label}"
            app-icon="${apps[i].icon}"
            app-link="${apps[i].link}"
        ></figure>
    `)
}

$('main figure').each(function() {
    $(this).append(`
        <a
            href="${$(this).attr('app-link')}"
            class="icon"
            style="
                background-image: url('img/${$(this).attr('app-icon')}');
            "
        ></a>
        <p class="label">${$(this).attr('app-label')}</p>
    `)
    if ($('a', this).attr('href').indexOf('https://') != -1)
        $('a', this).attr('target', '_blank')
})
$('figure[app="numbers"] a').append('<em></em>')

// Content
function loadContent() {
    hash = location.hash.substr(1)
    if (hash != '') {
        $('article').addClass('opened')
        $('#content')
            .attr('class', hash)
            .load(`content/${hash}.html`)
    }

    $(document)
        .ajaxStart(() => {
            $('#content').hide()
            $('#loading').fadeIn()
        })
        .ajaxStop(() => {
            $('#loading').fadeOut()
            $('#content').fadeIn()
        })
}
loadContent()
$('main figure a').click(() => { setTimeout(loadContent) })

$('#close').click(() => {
    window.history.pushState('', '', '/')
    $('article').removeClass('opened')
    $('#content').html('')
})
$(document).keydown(function(e) {
	if (e.which == 27) $('#close').click();	// esc
});

// Initialize Firebase
var config = {
    apiKey: "AIzaSyBGCtanYNoDYfp0by5ny5-MmAIpRNCySko",
    authDomain: "homescreens-nuotsu.firebaseapp.com",
    databaseURL: "https://homescreens-nuotsu.firebaseio.com",
    projectId: "homescreens-nuotsu",
    storageBucket: "homescreens-nuotsu.appspot.com",
    messagingSenderId: "530912246125"
};
firebase.initializeApp(config);

sizes = {
    'all': ['All'],
    'iS': ['iPhone (S)', '5 / 5s / SE'],
    'iM': ['iPhone (M)', '6 / 6s / 7 / 8'],
    'iL': ['iPhone (L)', '6+ / 6s+ / 7+ / 8+'],
    'iX': ['iPhone X',  'X'],
    'a': ['Android', 'Android']
}

firebase.database().ref().on('value', (hs) => {
    for (i in hs.val())
        $('#homescreens').prepend(`
            <span
                hs_id="${i}"
                hs_name="${hs.val()[i].name}"
                hs_size="${hs.val()[i].size}"
                hs_date="${hs.val()[i].date}"
                hs_link="${hs.val()[i].homescreen}"
                style="background-image: url('${imgurRes(hs.val()[i].homescreen, 's')}');"
            ></span>
        `)

    cIndex = 0
    hsList = []
    for (i in hs.val()) {
        hsList.push(hs.val()[i].homescreen)
    }

    rand = Math.floor(Math.random() * $('aside#homescreens span').length)
    randHS = $('aside#homescreens span').eq(rand)
    function previewHS(r) {
        $('figure[app="preview"] a')
            .attr('hs_link', r)
            .css({
                'background-image': `url('${imgurRes(r.attr('hs_link'), 's')}')`
            })

        hs_id = r.attr('hs_id')
        hs_name = r.attr('hs_name')
            if (hs_name == '') hs_name = '--'
        hs_size = sizes[r.attr('hs_size')][0]
        hs_date = r.attr('hs_date')
            if (hs_date == 'undefined') hs_date = '--'
        hs_link = r.attr('hs_link')
    }
    previewHS(randHS)

    $('aside#homescreens span').each(function() {
        $(this).click(() => {
            previewHS($(this))
            loadPreviewHS()
        })
    })

    $('figure[app="numbers"] a em').html(hs.numChildren())
})

// Load PreviewHS into Preview Table
function loadPreviewHS() {
    $('#prvw_id').html(hs_id)
    $('#prvw_name').html(hs_name)
    $('#prvw_size').html(hs_size)
    $('#prvw_date').html(hs_date)
    $('#prvw_link a')
        .attr({ 'href': hs_link, 'target': '_blank' })
        .html(hs_link.split('https://')[1])
    $('#previewHS')
        .attr({ 'href': hs_link, 'target': '_blank' })
        .find('img').attr('src', hs_link)
}

// Imgur Resolution
function imgurRes(r, resolution) {
    url = r.slice(0, 27)
    ext = r.slice(27)
    res = resolution
    return url + res + ext
}

// Shuffle Array
function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1))
        temp = a[i]
        a[i] = a[j]
        a[j] = temp
    }
}
