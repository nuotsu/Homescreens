// Load Homescreens
    if (window.location.href.indexOf('?art=indv') > 0) {
        $('#hs3d-art').html(`
            <tr>
                <td>Individual:</td>
                <td><select id="hs-list"></select></td>
                <td><button id="randomize">Random</button></td>
            </tr><tr>
                <td>Artwork:</td>
                <td><a href="do3d.html?art=hs-art">Homescreen Art</a></td>
            </tr>
        `)
        $('#hs-3d-box').html(`
            <img id="left">
            <img id="middle">
            <img id="right">
        `)

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
                    $('#hs-3d-box #middle').attr({
                        'src': $('#hs-list').val()
                    })
                    $('#hs-3d-box #left').attr({
                        'src': $('#hs-list option:checked').prev().attr('value')
                    })
                    $('#hs-3d-box #right').attr({
                        'src': $('#hs-list option:checked').next().attr('value')
                    })
                }

                $('#randomize').click(function() {
                    randHS = Math.floor(Math.random() * $('#hs-list option').length)
                    $('#hs-list option').eq(randHS).prop('selected', true)
                    changeHS3D()
                })
        })
    }
    if (window.location.href.indexOf('?art=hs-art') > 0) {
        $('#hs3d-art').html(`
            <tr>
                <td>Individual:</td>
                <td><a href="do3d.html?art=indv">Individual</a></td>
            </tr>
        `)
        $('#hs-3d-box').html(`
            <iframe id="left" src="divide_h.html"></iframe>
            <iframe id="middle" src="unite.html"></iframe>
            <iframe id="right" src="divide_v.html"></iframe>
        `)
        $('#hs-3d-box iframe').contents().find('body').css({
            'background-color': 'none'
        })
    }

// DeviceOrientation / 3D
    xAdjust = 35
    window.addEventListener('deviceorientation', function(e) {
        $('#x code').html(`${Math.round(e.beta-xAdjust)}°`)     // X --> e.beta
        $('#y code').html(`${Math.round(e.gamma)}°`)            // Y --> e.gamma
        $('#z code').html(`${Math.round(e.alpha)}°`)            // Z --> e.alpha

        document.getElementById('hs-3d-box').style.webkitTransform =
        document.getElementById('hs-3d-box').style.transform =
            `rotateX(${360 - (e.beta-xAdjust)}deg)
            rotateY(${e.gamma}deg)`;
    })
