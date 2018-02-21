$(function() {
    var size = ['all', 'iS', 'iM', 'iL', 'iX', 'a']

    $('article.switch').each(function() {
        for (var i in size)
            $(this).append(`
                <iframe src="${$(this).attr('art')}.html?art=${size[i]}"></iframe>
            `)
    })

    var indx = 0
    var interval = 15 // seconds
    var fade = 2 // seconds

    switchArt(0)

    setInterval(function() {
        indx++; if (indx >= size.length) indx = 0
        switchArt(indx)
    }, 1000 * interval)

    function switchArt(index) {
        $('article.switch.noFade').each(function() {
            $(this).find('iframe').hide()
            $(this).find('iframe').eq(index).show()
        })
        $('article.switch.fade').each(function() {
            $(this).find('iframe').fadeOut(1000*fade)
            $(this).find('iframe').eq(index).fadeIn(1000*fade)
        })
    }
})
