$(document).ready(function() {
	$('li.active').removeClass('active');
	$('a[href="/football"]').parent('li').addClass('active');
})