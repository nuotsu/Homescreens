// Initialize Firebase
    var config = {
        apiKey: "AIzaSyBGCtanYNoDYfp0by5ny5-MmAIpRNCySko",
        authDomain: "homescreens-nuotsu.firebaseapp.com",
        databaseURL: "https://homescreens-nuotsu.firebaseio.com",
        projectId: "homescreens-nuotsu",
        storageBucket: "",
        messagingSenderId: "530912246125"
    }
    firebase.initializeApp(config)

// Homescreens
    firebase.database().ref().on('value', function(snapshot) {
        $('.homescreens').html('<div class="container"></div>')
        var nHS = snapshot.numChildren()
            hsNum = 0
        for (var i = nHS-1; i >= 0; i--) {
            $('.homescreens .container').append(`<span class="hs_${i}"></span>`)
            $(`.homescreens .container .hs_${i}`)
                .attr('data-size', snapshot.val()[Object.keys(snapshot.val())[i]].size)
                .css({
                    'background-image': snapshot.val()[Object.keys(snapshot.val())[i]].homescreen,
                    'background-size': 'cover',
                    'background-repeat': 'no-repeat'
                })
            hsNum++
        }

        hsDivide()
    })

// hsDivide()
    function hsDivide() {
        $('.homescreens .container span').shuffle()

        // Sizes
            if (window.location.href.indexOf('all.html') < 0) {
                var size = window.location.href.split('divide/')[1].replace('.html', '')
                $(`.homescreens .container span[data-size=${size}]`)
                    .addClass('showSize')
                $('.homescreens .container span:not(.showSize)').remove()
                var hsLen = $('.container span').length
                    containerSize = $('.container').height() / hsLen
                for (var i = 0; i < hsLen; i++)
                    $(`.homescreens .container span`).eq(i).css({
                        'height': containerSize,
                        'background-position': `50% ${-i * containerSize}px`
                    })
            } else {
                var hsLen = $('.container span').length
                    containerSize = $('.container').height() / hsLen
                for (var i = 0; i < hsLen; i++)
                    $(`.homescreens .container span`).eq(i).css({
                        'height': containerSize,
                        'background-position': `50% ${-i * containerSize}px`
                    })
            }
    }

// Shuffle
    $.fn.shuffle = function() {
        var allElems = this.get()
            getRandom = function(max) {
                return Math.floor(Math.random() * max)
            }
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
    $('.homescreens').click(hsDivide)
    //setInterval(hsDivide)
