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
        $('.homescreens').html('')
        var nHS = snapshot.numChildren()
            hsNum = 0
        for (var i = 0; i < nHS; i++) {
            $('.homescreens').prepend(`<span class="hs_${i}"></span>`)
            $(`.homescreens .hs_${i}`)
                .attr('data-size', snapshot.val()[Object.keys(snapshot.val())[i]].size)
                .css({
                    'background-image': snapshot.val()[Object.keys(snapshot.val())[i]].homescreen,
                    'background-position': 'center',
                    'background-size': 'cover',
                    'background-repeat': 'no-repeat'
                })
            hsNum++
        }
        $('.homescreens span').css('opacity', 1 / hsNum)

        // Sizes
            if (window.location.href.indexOf('all.html') < 0) {
                var size = window.location.href.split('all/')[1].replace('.html', '')
                $(`.homescreens span[data-size=${size}]`)
                    .addClass('showSize')
                    .css('opacity', 1 / $(`.homescreens span[data-size=${size}]`).length)
                $('.homescreens span:not(.showSize)').remove()
            }
    })

    $('.homescreens.one').hide().fadeIn(3000)
