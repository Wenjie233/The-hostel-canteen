'use strict';
$(document).ready(function () {
	$('#productConfirm').on('click', function(){
		var fd = new FormData(document.getElementById('addProduct'));
		fd.append("CustomField", "This is some extra data");
		console.log(fd);
		$.ajax({
			type: 'POST',
			url: '../product/',
			data: fd,
			enctype: 'multipart/form-data',
			processData: false,  // 告诉jQuery不要去处理发送的数据
  			contentType: false,   // 告诉jQuery不要去设置Content-Type请求头
			success: function(data){
				alert('添加成功！');
				$('#addPruduct').modal('hide');
			}
		})
	})

	$('.delProduct').on('click', function(){
		var $thisTr = $(this).parent().parent();
		var id = $thisTr.data('id');
		$.ajax({
			type: 'DELETE',
			url: '../product/'+id,
			success: function(data){
				alert('删除成功');
				$thisTr.remove();
			}
		})
	});


	var nowTrId;
	$('.updateModal').on('click', function(){
		var $thisTr = $(this).parent().parent();
		nowTrId = $thisTr.data('id');
		var $td = $thisTr.find('tr');
		$('#updateProductForm').find(':text').each(function(i){
			var thisValue = $thisTr.find("td[name=\'"+ this.name +"\']").html();
			$(this).val(thisValue);
		})
	});

	$('#updateProductConfirm').on('click', function(){
		$.ajax({
			type: 'PUT',
			data: $('#updateProductForm').serialize(),
			url: '../product/' + nowTrId,
			success: function(data){
				alert('更新成功');
				$('#updatePruduct').modal('hide');
			}
		})
	});
})