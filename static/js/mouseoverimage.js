$(document).ready(function(){
    $(".img-inactive").mouseover(function(){
        var newSrc = $(this).attr("src");
        $(".img-active").attr("src", newSrc);
        $(".img-inactive").removeClass("selected-img");
        $(this).addClass("selected-img");
    });
});