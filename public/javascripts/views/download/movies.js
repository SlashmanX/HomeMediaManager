$(document).on('click', '.send-to-transmission', function(e) {
	e.preventDefault();
	var href = $(e.target).attr('href');

	$.post('/download/movies/add',{url: href}, function(data) {
			alert('Added to Transmission');
		}
	);
})
$(document).ready(function() {
	$('li.active').removeClass('active');
	$('a[href="/download/movies"]').parent('li').addClass('active').parent('ul').parent('li').addClass('active');
})