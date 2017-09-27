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
        var spin = 0
        for (var i = 0; i < snapshot.numChildren(); i++) {
            $('.homescreens').prepend(`<span class="hs_${i}"></span>`)
            $(`.homescreens .hs_${i}`).css({
                'background-image': snapshot.val()[Object.keys(snapshot.val())[i]].homescreen,
                'background-position': 'left',
                'background-size': 'contain',
                'background-repeat': 'no-repeat',
                'transform': `translate(-50%, -50%) rotate(${spin}deg)`,
                'opacity': 1
            })
            spin += 360 / snapshot.numChildren()
        }
    })
