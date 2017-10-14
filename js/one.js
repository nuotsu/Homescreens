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
        for (var i = 0; i < nHS; i++) {
            $('.homescreens').prepend(`<span class="hs_${i}"></span>`)
            $(`.homescreens .hs_${i}`).css({
                'background-image': snapshot.val()[Object.keys(snapshot.val())[i]].homescreen,
                'background-position': 'center',
                'background-size': 'cover',
                'background-repeat': 'no-repeat',
                'opacity': 1 / nHS
            })
        }

        // ONE
            $('.homescreens span').css('opacity', 0)
            setInterval(function() {
                var rHS = Math.floor(Math.random() * nHS)
                $('.homescreens.one span').css('opacity', 0)
                $('.homescreens.one span').eq(rHS).css('opacity', 1)
            }, 1000 * 0.25)
    })

    $('.homescreens').hide().fadeIn(3000)
