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
        $('#hs-list').html('')
        for (i in snapshot.val())
            $('#hs-list').append(`
                <option
                    value="${snapshot.val()[i].homescreen}"
                    hsID="${i}"
                    hsName="${snapshot.val()[i].name}"
                    hsSize="${snapshot.val()[i].size}"
                ></option>
            `)
        $('#hs-list option').each(function() {
            if ($(this).attr('hsName') != '')
                $(this).html(`${$(this).attr('hsID')}_${$(this).attr('hsSize')} (${$(this).attr('hsName')})`)
            else
                $(this).html(`${$(this).attr('hsID')}_${$(this).attr('hsSize')}`)
        })

        // Change #hs-3d
            randHS = Math.floor(Math.random() * $('#hs-list option').length)
            $('#hs-list option').eq(randHS).prop('selected', true)
            changeHS3D()
            $('#hs-list').change(changeHS3D)
            function changeHS3D() {
                $('#hs3d-middle').attr({
                    'src': $('#hs-list').val()
                })
                $('#hs3d-left').attr({
                    'src': $('#hs-list option:checked').prev().attr('value')
                })
                $('#hs3d-right').attr({
                    'src': $('#hs-list option:checked').next().attr('value')
                })
            }
    })

// DeviceOrientation / 3D
    window.addEventListener('deviceorientation', function(e) {
        // X --> e.beta
        // Y --> e.gamma
        // Z --> e.alpha

        $('#x code').html(Math.round(e.beta + 45))
        $('#y code').html(Math.round(e.gamma))
        $('#z code').html(Math.round(e.alpha))

        document.getElementById('hs3d-middle').style.webkitTransform =
        document.getElementById('hs3d-middle').style.transform =
        document.getElementById('hs3d-left').style.webkitTransform =
        document.getElementById('hs3d-left').style.transform =
        document.getElementById('hs3d-right').style.webkitTransform =
        document.getElementById('hs3d-right').style.transform =
            `rotateX(${e.beta + 45}deg)
            rotateY(${e.gamma}deg)
            rotateZ(${e.alpha}deg)`;
    })
