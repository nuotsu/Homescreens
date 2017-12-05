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

// Load Homescreeens
    firebase.database().ref().on('value', function(snapshot) {
        $('#homescreens').html('')
        for (var i in snapshot.val())
            $('#homescreens').prepend(`
                <span
                    class="hs"
                    imgur="${snapshot.val()[i].homescreen}"
                    size="${snapshot.val()[i].size}"
                ></span>
            `)
        $('#homescreens .hs').each(function() {
            var url = $(this).attr('imgur').slice(0, 27)
            var ext = $(this).attr('imgur').slice(27)
            var res = 's'
            $(this).css({
                'background-image': `url('${url}${res}${ext}')`
            })
        })

        return totalHS = snapshot.numChildren()
    })

// Totals
    firebase.database().ref().on('value', function(snapshot) {
        $('#total_iS').html($('#homescreens .hs[size="iS"]').length)
        $('#total_iM').html($('#homescreens .hs[size="iM"]').length)
        $('#total_iL').html($('#homescreens .hs[size="iL"]').length)
        $('#total_iX').html($('#homescreens .hs[size="iX"]').length)
        $('#total_a').html($('#homescreens .hs[size="a"]').length)
        $('#total_HS').html(totalHS)
    })

// Art
    $('#art select').change(function() {
        window.location.href = `${$(this).attr('id')}.html?art=${$(this).val()}`
    })

// Uploader
    var newHS
    $('#upload').click(() => $('#formReader').click())
    $('#formReader').change(function() {
        var formData = new FormData()
            formData.append('image', $('#formReader')[0].files[0])

        $.ajax({
            url: "https://api.imgur.com/3/image",
            type: "POST",
            datatype: "json",
            headers: {
              "Authorization": "Client-ID 1f37facd924fbb3"
            },
            data: formData,
            success: function(response) {
                var url = response.data.link.slice(0, 27)
                var ext = response.data.link.slice(27)
                var res = 's'
                $('#upload').css({
                    'background-image': `url('${url}${res}${ext}')`
                })
                return newHS = response.data.link
            },
            cache: false,
            contentType: false,
            processData: false
        })
    })
    $('#submit').click(function() {
        if ($('#terms').prop('checked') == true &&
            newHS != undefined &&
            $('select#size').val() != null) {
            // Submit new HS
                var id = ''
                    if (totalHS < 9999 && totalHS >= 999) id = `hs_${totalHS + 1}`
                    if (totalHS < 999 && totalHS >= 99) id = `hs_0${totalHS + 1}`
                    if (totalHS < 99 && totalHS >= 9) id = `hs_00${totalHS + 1}`
                    if (totalHS < 9 ) id = `hs_000${totalHS + 1}`
                var data = {
                    name: $('#name').val(),
                    homescreen: newHS,
                    size: $('select#size').val()
                }
                firebase.database().ref(id).set(data)
            // Clear Form
                $('#name').val('')
                $('#upload').css('background-image', 'none')
                $('select#size option[disabled]').prop('selected', true)
                $('#terms').prop('checked', false)
                $('#error').hide()
        } else {
            $('#error').fadeIn()
        }
    })
