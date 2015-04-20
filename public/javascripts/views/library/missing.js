$(document).on('click', '.download-one', function(e) {
	e.preventDefault();
	var show = $(e.target).attr('data-show');
	var season = $(e.target).attr('data-season');
	var episode = $(e.target).attr('data-episode');

	var info = {
		name: show,
		season: season,
		episode: episode
	};

	console.log(info);

	$.post('/library/shows/missing/download',info, function(data) {
			alert('Added to Transmission');
		}
	);
});
$(document).on('click', '.download-all', function(e) {
	e.preventDefault();
	$('.download-one').click();
});
$(document).ready(function() {
	$('li.active').removeClass('active');
	$('a[href="/library/shows"]').parent('li').addClass('active').parent('ul').parent('li').addClass('active');
})