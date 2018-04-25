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

// Load Homescreens
firebase.database().ref().on('value', function(snapshot) {
    $('#homescreens').html('')
    for (var i in snapshot.val())
        $('#homescreens').prepend(`
            <span
                class="hs"
                imgur="${snapshot.val()[i].homescreen}"
                size="${snapshot.val()[i].size}"
            ></span>
        `)

    var artSize = window.location.href.split('?art=')[1]
    if (window.location.href.indexOf('?art=') > 0 &&
        window.location.href.indexOf('?art=all') <= 0)
        $(`#homescreens .hs:not([size="${artSize}"])`).remove()
    if (window.location.href.indexOf('?art=iX') > 00)
        $('#homescreens').addClass('iX')

    $('#homescreens .hs').shuffle()

    if ($('#homescreens').hasClass('unite') == true) unite()
    if ($('#homescreens').hasClass('divide_h') == true) divide_h()
    if ($('#homescreens').hasClass('divide_v') == true) divide_v()
    if ($('#homescreens').hasClass('one') == true) one()
    if ($('#homescreens').hasClass('all') == true) all()
})

setTimeout(function() {
    $('#homescreens').on('DOMNodeInserted', function() {
        location.reload()
    })
}, 1000 * 3)

// Art
function unite() {
    $('.unite .hs').each(function() {
        var url = $(this).attr('imgur').slice(0, 27)
        var ext = $(this).attr('imgur').slice(27)
        var res = 'l'
        $(this).css({
            'opacity': 1 / $('#homescreens .hs').length,
            'background-image': `url('${url}${res}${ext}')`
        })
    })
}

function divide_h() {
    var top = 0;
    $('.divide_h .hs').each(function() {
        var url = $(this).attr('imgur').slice(0, 27)
        var ext = $(this).attr('imgur').slice(27)
        var res = 'l'
        $(this).css({
            'top': top,
            'height': $('.divide_h').height() / $('#homescreens .hs').length,
            'background-image': `url('${url}${res}${ext}')`,
            'background-position': `50% -${top}px`,
            'background-repeat': 'no-repeat'
        })
        top += $('.divide_h').height() / $('#homescreens .hs').length
    })
}

function divide_v() {
    var left = 0
    $('.divide_v .hs').each(function() {
        var url = $(this).attr('imgur').slice(0, 27)
        var ext = $(this).attr('imgur').slice(27)
        var res = 'l'
        $(this).css({
            'left': left,
            'width': $('.divide_v').width() / $('#homescreens .hs').length,
            'background-image': `url('${url}${res}${ext}')`,
            'background-position': `-${left}px 50%`
        })
        left += $('.divide_v').width() / $('#homescreens .hs').length
    })
}

function one() {
    var seconds = 1
    $('#homescreens .hs').each(function() {
        var url = $(this).attr('imgur').slice(0, 27)
        var ext = $(this).attr('imgur').slice(27)
        var res = ''
        $(this)
            .html(`<img src="${url}${res}${ext}">`)
            .css('opacity', 0)
    })
    setInterval(function() {
        var rng = Math.floor(Math.random() * $('#homescreens .hs').length)
        $('#homescreens .hs')
            .css({
                'opacity': 0,
                'z-index': 1
            })
            .eq(rng).css({
                'opacity': 1,
                'z-index': $('#homescreens .hs').length
            })
    }, 1000 * seconds)
}

function all() {
    // Create Columns
    var columns = 10
    for (var i = 0; i < columns; i++)
        $('#homescreens').prepend(`<article class="col"></article>`)
    $('#homescreens .col').width(`calc(100% / ${columns})`)
    // Insert <img> into Columns
    var col = 0
    $('#homescreens .hs').each(function() {
        if (col >= columns) col = 0
        var url = $(this).attr('imgur').slice(0, 27)
        var ext = $(this).attr('imgur').slice(27)
        var res = 'l'
        $('#homescreens .col').eq(col).append(`<img src="${url}${res}${ext}">`)
        col++
    })
    // Scroll columns
    var seconds = 75

    setTimeout(function() {
        var oddCol = $('#homescreens .col:odd')
        var oddColHeight = []
        for (var i = 0; i < oddCol.length; i++) {
            oddColHeight[i] = 0
            for (var j = 0; j < oddCol.eq(i).find('img').length; j++)
                oddColHeight[i] += oddCol.eq(i).find('img').eq(j).height()
            oddCol.eq(i)
                .animate({
                    scrollTop: oddColHeight[i]
                }, 0)
                .animate({
                    scrollTop: 0
                }, 1000 * seconds, 'linear')
        }

        var evenCol = $('#homescreens .col:even')
        var evenColHeight = []
        for (var i = 0; i < evenCol.length; i++) {
            evenColHeight[i] = 0
            for (var j = 0; j < evenCol.eq(i).find('img').length; j++)
                evenColHeight[i] += evenCol.eq(i).find('img').eq(j).height()
            evenCol.eq(i).animate({
                scrollTop: evenColHeight[i] * 2.55 / 3.5
            }, 1000 * seconds, 'linear')
        }
        setTimeout(function() {
            location.reload()
        }, 1000 * seconds)
    }, 1000 * 1)
}

// Shuffle
$.fn.shuffle = function() {
    var allElems = this.get(),
        getRandom = (max) => Math.floor(Math.random() * max),
        shuffled = $.map(allElems, function() {
            var random = getRandom(allElems.length)
                randEl = $(allElems[random]).clone(true)[0]
            allElems.splice(random, 1)
            return randEl
       })

    this.each(function(i) {
        $(this).replaceWith($(shuffled[i]))
    })

    return $(shuffled)
}
