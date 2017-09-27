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
        for (var i = 0; i < snapshot.numChildren(); i++) {
            $('.homescreens').prepend(`<span class="hs_${i}"></span>`)
            $(`.homescreens .hs_${i}`).css({
                'background-image': snapshot.val()[Object.keys(snapshot.val())[i]].homescreen,
                'background-position': 'center',
                'background-size': 'cover',
                'background-repeat': 'no-repeat',
                'opacity': 1 / snapshot.numChildren()
            })
        }
    })
