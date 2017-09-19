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

    function updateFirebase() {
        firebase.database().ref(
            'hs_' + ($('.homescreens img').length + 1)
        ).set({
            name: $('#name').val(),
            homescreen: $('#upload').css('background-image')
        })
    }

// Uploader
    $('#close_uploader').click(function() {
        $('#uploader').fadeOut()
    })

// Upload Image
    $('#upload').click(function() {
        $('#fileReader').click()
    })
    $('#fileReader').change(function() {
        var file = this.files[0]
            rdr = new FileReader()
        rdr.onload = function() {
            $('#upload').css({
                'background-image': `url('${rdr.result}')`,
                'background-position': 'center',
                'background-size': 'cover',
                'background-repeat': 'no-repeat'
            })
        }
        if (file) rdr.readAsDataURL(file)
    })

// Submit
    $('#submit').click(function() {
        if ($('#terms-accept').prop('checked') == true &&
            $('#upload').css('background-image') != 'none') {
            updateFirebase()

            // Reset Uploader
                $('#fileReader')
                    .attr('type', 'text')
                    .attr('type', 'file')
                $('#upload').css({
                    'background-image': `none`,
                    'background-position': 'center',
                    'background-size': 'cover',
                    'background-repeat': 'no-repeat'
                })
                $('label[for=terms-accept]').click()
                $('#uploader, .terms').fadeOut()

            // Thank you message
                $('#upload-success').fadeIn()
                setTimeout(function() {
                    $('#upload-success').fadeOut()
                }, 1000*3)

        } else {
            $('.error').fadeIn()
        }
    })

// Terms
    $('#terms').click(function() {
        $('.terms').fadeIn()
    })
    $('#close_terms').click(function() {
        $('.terms').fadeOut()
    })

// Homescreens
    firebase.database().ref().on('value', function(snapshot) {
        $('.homescreens').html('')
        for (var i = 0; i < snapshot.numChildren(); i++) {
            $('.homescreens').prepend(`
                <img src="${snapshot.val()[Object.keys(snapshot.val())[i]].homescreen.replace('url(', '').replace(')', '')}">
            `)
        }
    })
