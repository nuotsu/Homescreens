// HS Types
    hs_types = [
        ['all', 'All'],
        ['iS', 'iPhone (S)', '5 / 5s / SE'],
        ['iM', 'iPhone (M)', '6 / 6s / 7 / 8'],
        ['iL', 'iPhone (L)', '6+ / 6s+ / 7+ / 8+'],
        ['iX', 'iPhone X',  'X'],
        ['a', 'Android', 'Android']
    ]

// Generated Artwork
    $('#gen-art table td select').each(function() {
        for (i in hs_types)
            $(this).append(`<option value="${hs_types[i][0]}">${hs_types[i][1]}</option>`)
    })

    $('#gen-art select').change(function() {
        window.location.href = `art/${$(this).attr('id').split('art-')[1]}.html?art=${$(this).val()}`
    })

// Information
    for (i in hs_types)
        $('#info table').append(`
            <tr>
                <td>${hs_types[i][1]}</td>
                <td>→</td>
                <td id="stat_${hs_types[i][0]}">0</td>
            </tr>
        `)

// Uploader
    for (i = 1; i < hs_types.length-1; i++)
        $('#uploader #size [label="iPhone"]').append(
            `<option value="${hs_types[i][0]}">${hs_types[i][2]}</option>`
        )
    for (i = hs_types.length-1; i < hs_types.length; i++)
        $('#uploader #size [label="non-iPhone"]').append(`<option value="${hs_types[i][0]}">${hs_types[i][2]}</option>`)

    var newHS
    $('#uploader #upload img').click(() => $('#uploader #upload input').click())
    $('#uploader #upload input').change(function() {
        setTimeout(() => {
            $('#uploader #notice').fadeIn('show')
            adjustDetailsHeights()
        }, 1000)

        var formData = new FormData()
            formData.append('image', $('#uploader #upload input')[0].files[0])

        $.ajax({
            url: 'https://api.imgur.com/3/image',
            type: 'POST',
            datatype: 'json',
            headers: {
                    'Authorization': 'Client-ID 1f37facd924fbb3'
                },
            data: formData,
            processData: false,
            contentType: false,
            cache: false,
            success: function(response) {
                url = response.data.link.slice(0, 27)
                ext = response.data.link.slice(27)
                res = 's'
                $('#uploader #upload img').css({
                    'background-image': `url(${url+res+ext})`
                })
                return newHS = response.data.link
            }
        })
    })

    $('#uploader #submit').click(function() {
        if ($('#uploader #terms').prop('checked') == true &&
            newHS != undefined &&
            $('#uploader #size').val() != null) {
                // Submit New HS
                    var id = ''
                        if (totalHS < 9999 && totalHS >= 999) id = `hs_${totalHS + 1}`
                        if (totalHS < 999 && totalHS >= 99) id = `hs_0${totalHS + 1}`
                        if (totalHS < 99 && totalHS >= 9) id = `hs_00${totalHS + 1}`
                        if (totalHS < 9 ) id = `hs_000${totalHS + 1}`
                    var data = {
                        name: $('#uploader #name').val(),
                        homescreen: newHS,
                        size: $('#uploader #size').val()
                    }
                    firebase.database().ref(id).set(data)

                // Clear Form
                    $('#uploader #name').val('')
                    $('#uploader #upload img').css('background-image', 'none')
                    $('#uploader #size option[disabled]').prop('selected', true)
                    $('#uploader #terms').prop('checked', false)
                    $('#uploader #notice, #uploader #error').hide()
            } else $('#error').fadeIn()
    })

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
        $('#hs-bg').html('')
        for (i in snapshot.val())
            $('#hs-bg').prepend(`
                <hs-img
                    hsID="${i}"
                    hsName="${snapshot.val()[i].name}"
                    hsSize="${snapshot.val()[i].size}"
                    hsImg="${snapshot.val()[i].homescreen}"
                ></hs-img>
            `)
        totalHS = snapshot.numChildren()
        $('#hs-bg hs-img').each(function() {
            imgURL = $(this).imgurRes('hsImg', 's')
            $(this).css({
                'background-image': `url('${imgURL}')`
            })
        })

        for (i in hs_types)
            $(`#info table #stat_${hs_types[i][0]}`).html($(`#hs-bg hs-img[hsSize="${hs_types[i][0]}"]`).length)
        $('#info table #stat_all').html(totalHS)

        // Preview Homescreen
            $('#hs-bg hs-img').click(function() {
                $('details[lv="1"], #preview').prop('open', true)
                $('#preview table').show()

                imgURL = $(this).imgurRes('hsImg', 'm')
                $('#preview #prev_img').attr({
                    'href': `${$(this).attr('hsImg')}`,
                    'target': '_blank'
                })
                $('#preview #prev_img img').attr({
                    'src': imgURL
                })
                $('#preview #prev_info').html(`
                    <i>${$(this).attr('hsID')}_${$(this).attr('hsSize')}</i>
                    <b>${$(this).attr('hsName')}</b>
                `)

                adjustDetailsHeights()
            })

        return totalHS
    })

// Imgur Resolution
    $.fn.imgurRes = function(attr, resolution) {
        url = this.attr(attr).slice(0, 27)
        ext = this.attr(attr).slice(27)
        res = resolution
        return url + res + ext
    }

// URL Parameters
    if (window.location.href.indexOf('?upload') > 0) {
        $('details[lv="2"]').prop('open', false)
        $('details[lv="1"], #uploader').prop('open', true)
    }

// Desktop <Details>
    openDetailsOrNot()
    function openDetailsOrNot() {
        $('details[lv="2"]').each(function() {
            if ($(this).css('display') == 'inline-block')
                $(this).prop('open', true)
            else
                $('#uploader, #preview').prop('open', false)
        })
    }

    setTimeout(() => adjustDetailsHeights(), 100)
    $(window).resize(adjustDetailsHeights)
    $('details, #uploader #submit').click(function() {
        setTimeout(() => adjustDetailsHeights())
    })
    function adjustDetailsHeights() {
        var detailsHeights = []
        $('details[lv="2"]').each(function() {
            detailsHeights.push($(this).height())
            $('details[lv="2"]').css({
                'min-height': Math.max.apply(Math, detailsHeights)
            })
        })
        if ($(window).width() <= 1000)
            $('details[lv="2"]').css('min-height', 'auto')
    }
