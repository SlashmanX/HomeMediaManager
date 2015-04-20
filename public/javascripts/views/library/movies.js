$(document).ready(function() {
	$('li.active').removeClass('active');
	$('a[href="/library/movies"]').parent('li').addClass('active').parent('ul').parent('li').addClass('active');
});
$(function() {
    $("img.lazy").lazyload();
});