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
            homescreen: $('#upload').css('background-image'),
            size: $('select#size').val()
        })
    }

// Loading...
    $('body').on('DOMNodeInserted', '.homescreens span', function() {
        $('.loading').fadeOut()
        $('#total span').html( $('.homescreens span').length )
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
        var formData = new FormData()
            formData.append('image', $('#fileReader')[0].files[0])

        $.ajax({
            url: "https://api.imgur.com/3/image",
            type: "POST",
            datatype: "json",
            headers: {
              "Authorization": "Client-ID 1f37facd924fbb3"
            },
            data: formData,
            success: function(response) {
                $('#upload').css({
                    'background-image': `url(${response.data.link})`,
                    'background-position': 'center',
                    'background-size': 'cover',
                    'background-repeat': 'no-repeat'
                })
            },
            cache: false,
            contentType: false,
            processData: false
        })
    })

// Submit
    $('#submit').click(function() {
        if ($('#terms-accept').prop('checked') == true &&
            $('#upload').css('background-image') != 'none' &&
            $('select#size').val() != null) {
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

    // Copy Link
        $('#copyLink').click(function() {
            $(this).append(`<input id="googl" type="text">`)
            $('#googl').val('https://goo.gl/kFZFtz').select()
            document.execCommand('copy')
            $('#googl').remove()
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
