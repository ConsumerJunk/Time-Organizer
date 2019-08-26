var debug_json;

function display(jsonIn) {

	debug_json = jsonIn;

	for(var x = 1; x < jsonIn["values"].length; x++) {
		var title = jsonIn["values"][x][0];
		var color = jsonIn["values"][x][4];
		var status = jsonIn["values"][x][5];
		var content = jsonIn["values"][x][6];
		var template = `<div class=\"task open_task\" task_color=\"${color}\"><div class=\"task_header\"><h1 class=\"task_title\">${title}</h1><div class=\"task_status green\"></div><h1 class=\"task_timer\">1 Day</h1><h1 class=\"task_minimize\">▼</h1><p>${content}</p></div></div>`;
		$("#tasks").append(template);
	}

	var tasks = $(".task[task_color]");

	for(var x = 0; x < tasks.length; x++) {
		console.log($(tasks[x]).css("border-left-color", tasks[x].getAttribute("task_color")));
	}

	$(".task_minimize").click(function(e) {
		//▼▲
		if($(e.target).text() == "▼") {
			console.log("Open");
			$(e.target).text("▲");
			$(e.target).parent().parent().removeClass("open_task");
			$(e.target).parent().parent().addClass("closed_task");
		} else {
			console.log("Close");
			$(e.target).text("▼");
			$(e.target).parent().parent().removeClass("closed_task");
			$(e.target).parent().parent().addClass("open_task");
		}
		
		console.log($(e.target).parent().parent());
	});

}