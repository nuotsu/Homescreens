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
        var digits = ''
            if ( $('.homescreens span').length < 9999 &&
                 $('.homescreens span').length >= 999) digits = ''
            if ( $('.homescreens span').length < 999 &&
                 $('.homescreens span').length >= 99) digits = '0'
            if ( $('.homescreens span').length < 99 &&
                 $('.homescreens span').length >= 9) digits = '00'
            if ( $('.homescreens span').length < 9 ) digits = '000'
        firebase.database().ref(
            'hs_' + digits + ($('.homescreens span').length + 1)
        ).set({
            name: $('#name').val(),
            homescreen: $('#upload').css('background-image')
        })
    }

// Loading...
    $('body').on('DOMNodeInserted', '.homescreens span', function() {
        $('.loading').fadeOut()
    })

// Uploader
    $('#close_uploader').click(function() {
        $('#uploader').fadeOut()
        removeBlurBG()
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
                removeBlurBG()

            // Thank you message
                $('#upload-success').fadeIn()
                setTimeout(function() {
                    $('#upload-success').fadeOut()
                }, 1000*3)
        } else {
            $('.error').fadeIn()
        }
    })
    // Remove Blur
        function removeBlurBG() {
            $('.blur-bg.blur').css({
                '-webkit-backdrop-filter': 'blur(0px) saturate(1)',
                '-moz-backdrop-filter': 'blur(0px) saturate(1)',
                'backdrop-filter': 'blur(0px) saturate(1)',
                'background': 'none'
            })
            setTimeout(function() {
                $('.blur-bg.blur').remove()
            }, 1000*0.6)
        }

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
            $('.homescreens').prepend(`<span class="hs_${i}"></span>`)
            $(`.homescreens .hs_${i}`).css({
                'background-image': snapshot.val()[Object.keys(snapshot.val())[i]].homescreen,
                'background-position': 'center',
                'background-size': 'cover',
                'background-repeat': 'no-repeat'
            })
        }
    })
