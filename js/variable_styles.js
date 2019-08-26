$("document").ready(function() {
	check();
	$(window).resize(check);
});

var check = function(){
	var width = $(window).width();
	if(width <= 640) {
		$("html").removeClass();
		$("html").addClass("small");
	}
	if(width > 640 && width < 1300) {
		$("html").removeClass();
		$("html").addClass("medium");
	}
	if(width >= 1300) {
		$("html").removeClass();
		$("html").addClass("large");
	}
}