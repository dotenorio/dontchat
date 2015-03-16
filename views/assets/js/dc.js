Array.prototype.getUnique = function() {
	var u = {}, a = [];
	for(var i = 0, l = this.length; i < l; ++i){
		if(u.hasOwnProperty(this[i])) {
			continue;
		}
		a.push(this[i]);
		u[this[i]] = 1;
	}
	return a;
}

Array.prototype.removeItem = function(item) { 
	for(var i = 0, l = this.length; i < l; ++i){
		index = this.indexOf(item);
		if (index > -1) {
			this.splice(index, 1);
		}
	}
	return this;
}

$(function(){

	$("#m").focus();
	$('#feedbackModal').on('shown.bs.modal', function () {
    $('#feedback-text').focus().val('');
    $('#feedbackModal button.btn-success').on('click', function() {
    	$('#feedbackModal #form-feedback').submit();
    });
  	$('#feedbackModal #form-feedback').on('submit', function() {
  		$.post("/feedback", { 
  			feedback: $('#feedback-text').val() 
  		}, function(data) {
  			$('#feedbackModal').modal('hide');
  			$('#alertMessages span.message').html(data);
  			$('#alertMessages').fadeIn();
  			setTimeout("$('#alertMessages').fadeOut()", 3000);
  			$("#m").focus();
  		});
  		return false;
  	});
  })

});