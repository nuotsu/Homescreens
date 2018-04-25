// 3D: Individual (indv)
if (window.location.href.split('?art=')[1] == 'indv') {
    $('#hs3d-art').html(`
        <tr>
            <td>Individual:</td>
            <td><select id="hs-list"></select></td>
            <td><button id="randomize">Random</button></td>
        </tr><tr>
            <td colspan="3">
                <a href="do3d.html?art=hs-art">Homescreen Art</a>
            </td>
        </tr><tr>
            <td colspan="3">
                <a href="do3d.html?art=world">Homescreen World</a>
            </td>
        </tr>
    `)
    $('#hs-3d-box').html(`
        <img id="left">
        <img id="middle">
        <img id="right">
    `)

    firebase.database().ref().on('value', function(snapshot) {
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
        changeHS3D()
        $('#hs-list').change(changeHS3D)

        $('#randomize').click(function() {
            randHS = Math.floor(Math.random() * $('#hs-list option').length)
            $('#hs-list option').eq(randHS).prop('selected', true)
            changeHS3D()
        })
    })
}

// 3D: Homescreen Art (hs-art)
if (window.location.href.split('?art=')[1] == 'hs-art') {
    $('#hs3d-art').html(`
        <tr>
            <td><a href="do3d.html?art=indv">Individual</a></td>
        </tr><tr>
            <td><a href="do3d.html?art=world">Homescreen World</a></td>
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

// 3D: Homescreen World (hs-world)
if (window.location.href.split('?art=')[1] == 'world') {
    $('#hs3d-art').html(`
        <tr>
            <td><a href="do3d.html?art=indv">Individual</a></td>
        </tr><tr>
            <td><a href="do3d.html?art=hs-art">Homescreen Art</a></td>
        </tr>
    `)
    $('#hs-3d-box').addClass('world')

    function createDimension(length) {
        columns = Math.ceil(Math.sqrt(length))
        rows = length / columns
        for (i = columns; length % i > 0; i++) {
            columns = i+1
            rows = length / columns
        }
        return [columns, rows]
    }

    firebase.database().ref().on('value', function(snapshot) {
        hs = snapshot.val()
        hsLength = 24
        hsLength = snapshot.numChildren()
        for (i = 0; i < hsLength; i++) {
            $('#hs-3d-box').prepend(`
                <span hs="${snapshot.val()[Object.keys(hs)[i]].homescreen}"></span>
            `)
        }
        $('#hs-3d-box span').shuffle()

        rowNum = -1
        colNum = 0
        $('#hs-3d-box span').each(function() {
            $(this).css({
                'background-image': `url('${$(this).imgurRes('hs', 'm')}')`
            })
            if (colNum % createDimension(hsLength)[0] == 0) {
                colNum = 0
                rowNum++
            }
            $(this).attr({
                'rowNum': rowNum,
                'colNum': colNum
            })
            colNum++
        })

        dimensionRatio = 1
            if ($(window).height() > $(window).width())
                dimensionRatio = $(window).height() / $(window).width()
            else
                dimensionRatio = $(window).width() / $(window).height()
        xMax = createDimension(hsLength)[0]
        yMax = createDimension(hsLength)[1]
        for (x = 0; x < xMax; x++)
        for (y = 0; y < yMax; y++) {

            xMove = (x - ((xMax-1) / 2)) * 100 * dimensionRatio
            yMove = (y - ((yMax-1) / 2)) * 100 * dimensionRatio
            zVal = ((Math.abs(xMove) / 1.5) + (Math.abs(yMove) * 1.5))
            zMove = 200 - (zVal * zVal / 20000)
            xRotate = (x - ((xMax-1) / 2)) * (180 / xMax)
            yRotate = (y - ((yMax-1) / 2)) * (-180 / yMax)
            scale = 1.6
            console.log(scale)
            $(`[colNum="${x}"][rowNum="${y}"]`).css({
                'transform': `
                    translateZ(${zMove}px)
                    translateX(${xMove}%)
                    translateY(${yMove}%)
                    rotateY(${xRotate}deg)
                    rotateX(${(yRotate)}deg)
                    scale(${scale})
                `
            })
        }

        // Resize Sphere on window.resize
        resizeSphere()
        $(window).resize(resizeSphere)
        function resizeSphere() {
            if ($(document).width() > $(document).height())
                $('#hs-3d-box').css({
                    'width': `calc(100vh / ${xMax})`,
                    'height': `calc(100vh / ${yMax})`
                })
            else
                $('#hs-3d-box').css({
                    'width': `calc(100vw / ${xMax})`,
                    'height': `calc(100vw / ${yMax})`
                })
        }
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

// Shuffle
$.fn.shuffle = function() {
    var allElems = this.get(),
        getRandom = (max) => Math.floor(Math.random() * max),
        shuffled = $.map(allElems, function() {
            var random = getRandom(allElems.length)
                randEl = $(allElems[random]).clone(true)[0]
            allElems.splice(random, 1)
            return randEl
       })

    this.each(function(i) {
        $(this).replaceWith($(shuffled[i]))
    })

    return $(shuffled)
}
