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

        if (window.location.href.indexOf('?art=') > 0 &&
            window.location.href.indexOf('?art=all') <= 0)
            $(`#homescreens .hs:not([size="${window.location.href.split('?art=')[1]}"])`).remove()
        if (window.location.href.indexOf('?art=iX') > 00)
            $('#homescreens').addClass('iX')

        $('#homescreens .hs').shuffle()

        if($('#homescreens').hasClass('unite') == true) unite()
        if($('#homescreens').hasClass('divide') == true) divide()
        if($('#homescreens').hasClass('one') == true) one()
    })

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

    function divide() {
        var top = 0;
        $('.divide .hs').each(function() {
            var url = $(this).attr('imgur').slice(0, 27)
            var ext = $(this).attr('imgur').slice(27)
            var res = 'l'
            $(this).css({
                'top': top,
                'height': $('.divide').height() / $('#homescreens .hs').length,
                'background-image': `url('${url}${res}${ext}')`,
                'background-position': `50% -${top}px`
            })
            top += $('.divide').height() / $('#homescreens .hs').length
        })
    }

    function one() {
        $('#homescreens .hs').each(function() {
            var url = $(this).attr('imgur').slice(0, 27)
            var ext = $(this).attr('imgur').slice(27)
            var res = 'l'
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
        }, 75)
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
