seconds = 10
setInterval(function() {
    $('.wall.left iframe').eq(1).fadeOut(1000)
    $('.wall.right iframe').eq(1).fadeOut(1000)
    $('.wall.left iframe').eq(0).fadeIn(1000)
    $('.wall.right iframe').eq(0).fadeIn(1000)
}, 1000 * seconds)
setTimeout(function() {
    setInterval(function() {
        $('.wall.left iframe').eq(0).fadeOut(1000)
        $('.wall.right iframe').eq(0).fadeOut(1000)
        $('.wall.left iframe').eq(1).fadeIn(1000)
        $('.wall.right iframe').eq(1).fadeIn(1000)
    }, 1000 * seconds)
}, 1000 * seconds / 2)
