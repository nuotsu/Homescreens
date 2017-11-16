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
    var hs = []
        hs_shuffle = []
        columns = 10
    firebase.database().ref().on('value', function(snapshot) {
        $('.homescreens').html('<tr></tr>')
        var nHS = snapshot.numChildren()
            for (var i = 0; i < nHS; i++) {
                hs.push(
                    snapshot.val()[Object.keys(snapshot.val())[i]].homescreen
                        .replace('url(', '')
                        .replace(')', '')
                )
            }
            for (var i = 0; i < columns; i++) {
                $('.homescreens tr').append('<td></td>')
            }
            $('.homescreens td').css('width', `calc(100% / ${columns})`)
        hsAll()
    })

    hsAll = () => {
        $('.homescreens td').html('')

        hs_shuffle = shuffle(hs)
        col = 0
        for (var i = 0; i < hs.length; i++) {
            col++
                if (col > columns) col = 0
            $('.homescreens td').eq(col).append(`
                <img src=${hs_shuffle[i]}>
            `)
        }
    }

    $('.homescreens').click(hsAll)

// Scrolling & Animation
    var scroll = 0
    setInterval(() => {
        scroll += 0.3
        if (scroll > $(document).height() - 500) location.reload()
        $(document).scrollTop(scroll)
    })

// Randomize without repetition
    function shuffle(arr) {
        for (var j, x, i = arr.length; i; j = parseInt(Math.random()*i), x = arr[--i], arr[i] = arr[j], arr[j] = x);
        return arr;
    }
