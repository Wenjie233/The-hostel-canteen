'use strict';

$(document).ready(function(){
	$('.del').on('click', function(){
		var $thisTr = $(this).parent().parent();
		$.ajax({
			type: 'DELETE',
			url: '../order/'+$thisTr.data('id'),
			success: function(data){
				alert('删除成功');
				$thisTr.remove();
			}
		})
	});
});