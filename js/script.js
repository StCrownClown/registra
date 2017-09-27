// var registra_obj = $.getJSON("./json/registra_dict.json", function(registra_dict) {});

var registra_new = [];
var uid,eid,result,elist;
var json_data,event_select,person_data,employee_data;

var warn_c = 0;
var correct = new Audio('sound/correct.mp3');
var beep = new Audio('sound/beep.mp3')

	if(localStorage.getItem('registra_local')) {
		registra_local = JSON.parse(localStorage.getItem('registra_local'));
	}
	else {
		registra_local = registra_obj;
	}
	
	if(localStorage.getItem('registra_new')) {
		registra_new = JSON.parse(localStorage.getItem('registra_new'));
	}
	
//	if (localStorage.getItem('employee_data')) {
//		event_select = localStorage.getItem('event_select');
//		person_data = JSON.parse(localStorage.getItem('person_data'));
//		employee_data = JSON.parse(localStorage.getItem('employee_data'));
//		event_option();
//	}
//	else {
//		get_data();
//	}

create_table();

$(function(){
	$("#export").click(function(){
		  $("#regist_tbl").table2excel({
		    exclude: ".noExl",
			fileext: ".xls",
		    name: "registration",
		    filename: "registration"
		  }); 
		});
});

$(function() {
			$('#ddstatus').text("");
			$('#q').focus();
			$('#q').keyup(function(event) {
				var q = $('#q').val();
				if(q.length>=6){
					dosearch();
				}
			});
			$('#bt_regist').hide();
			$('#sessions').hide();
 });

function get_data() {
	$.ajax({
		url: "getevent.php",
		type: "POST",
		data: json_data,
		success: function(data) {
			json_data = JSON.parse(data);
			person_data = json_data[1];
			employee_data = json_data[2];
			event_select = "";
			for(x=0;x<json_data[0].length;x++) {
				event_id = json_data[0][x].id;
				event_name = json_data[0][x].event_name;
				event_select += '<option value="'+event_id+'">'+event_name+'</option>';
			}
			$("#elist").append(event_select);
			localStorage.setItem('event_select', event_select);
			localStorage.setItem('person_data', JSON.stringify(person_data));
			localStorage.setItem('employee_data', JSON.stringify(employee_data));
		}
	});
}

function event_option() {
	$(function(){
		$("#elist").append(event_select);
	});
}

function do_select() {
	elist = $('#elist').find('option:selected').val();
}

function create_table() {
	if (registra_new) {
		$("#regist_tbl tbody").remove();
		result="";
		$(function(){
			$.each(registra_new, function(key,val){
				if(val.checkregist!=null) {
					var emp_id;
					emp_id = '="'+val.employeeid+'"';
					result+="<tr><td>"+val.checkregist+"</td><td style='display:none;'>"+emp_id+"</td><td>"+val.fnameth+" "+val.lnameth+
							"</td><td style='display:none;'>"+val.bu2+"</td><td style='display:none;'>"+val.bu3+"</td><td style='display:none;'>"+val.bu4+"</td></tr>";
				}
			});
			$('#regist_tbl').append('<tbody></tbody>');
			$('#regist_tbl tbody').append(result);
		});
	}
}
	
function dosearch(q) {
//	elist = $('#elist').find('option:selected').val();
// 	if(elist==-1){
// 		alert('กรุณาเลือก Event ก่อนค้นหา');
// 		$('#elist').focus();
// 		return;
// 	}

	$('#dname').html("");
	$('#bu3').html("");
	$('#bu2').html("");
	$('#uid').html("");
	$('#ddstatus').html("");
	$('#bt_regist').hide();
	$('#sessions').hide();

	var q = $('#q').val();
			$('#q').focus();
					
		if(registra_obj[q]) {
			var n = registra_obj[q];
			uid = n.employeeid;
			$('#dname').html(n.fnameth+" "+n.lnameth);
			$('#bu3').html(n.bu3);
			$('#bu2').html(n.bu2);
			$('#uid').html(uid);
			$('#sessions').show();
				
				if(registra_local[q].checkregist) {
					$('#bt_regist').hide();
					$('#ddstatus').text("ลงทะเบียนแล้ว");
					document.getElementById('q').value = "";
				}
				else {
					document.getElementById('bt_regist').disabled = false;
					$('#bt_regist').show();
					$('#ddstatus').text("");
				}
				
		}

		else if(registra_obj[q]==null) {
			$.each(registra_local, function(key,val){
				if(val.employeeid==q) {
					$('#q').val(key);
					q = key;
					$('#dname').html(val.fnameth+" "+val.lnameth);
					$('#bu3').html(val.bu3);
					$('#bu2').html(val.bu2);
					$('#uid').html(val.employeeid);
					$('#sessions').show();
						
					if(registra_local[q].checkregist) {
						$('#bt_regist').hide();
						$('#ddstatus').text("ลงทะเบียนแล้ว");
						document.getElementById('q').value = "";
					}
					else {
						document.getElementById('bt_regist').disabled = false;
						$('#bt_regist').show();
						$('#ddstatus').text("");
					}
				}
				else return;
			});
		}
			
		else {
			result="";
			$('#sessions').hide();
	}
	auto_mode();
}

function doregist() {
	var q = $('#q').val();
			$('#q').focus();

	if(registra_local[q]!=null) {
		var num = registra_new.length;
		var date = new Date();
		var registime = date.toLocaleString();
		
		registra_local[q].checkregist = registime;
		
		registra_new[num] = registra_local[q];
		registra_new[num].idcard = q;
		
		document.getElementById('bt_regist').disabled = "{opacity: 0.5;cursor: not-allowed;}";
		
		$('#ddstatus').html("การยืนยันสำเร็จแล้ว");
			
		localStorage.setItem('registra_new', JSON.stringify(registra_new));
		localStorage.setItem('registra_local', JSON.stringify(registra_local));
		
		document.getElementById('q').value = "";
		
		create_table();
	}
}

function auto_mode() {
	if($('#auto_mode').is(":checked")) {
		document.getElementById("bt_regist").click();
	}
}

function clear_local() {
    var confirm_clear = prompt('ต้องการเคลียร์ข้อมูล ? พิมพ์ "CLEAR" เพื่อยืนยัน', "");
    
    if (confirm_clear == "CLEAR") {
    	localStorage.clear();
    	result="";
    	registra_new=[];
    	registra_local={};
    	$("#regist_tbl tbody").remove();
    	$('#regist_tbl').append('<tbody></tbody>');
    	$('#regist_tbl tbody').append(result);
    	alert("ข้อมูลถูกลบแล้ว !")
    }
}

function tg_alert(unfocus) {
	if(unfocus==1) {
		if($('#bt_regist').css('display')=="none"||document.getElementById('bt_regist').disabled) {
			$('#tg_alert').show();
			$('#tg_alert').html("กรุณาคลิกที่ช่อง id / code .. เพื่อสแกนต่อ");
			$('#q').css({"background-color":"red","opacity":"0.75"});
		}
	}
	else {
		$('#tg_alert').hide();
		$('#q').css({"background-color":"white","opacity":"1"});
	}
}

$(document).keypress(function(e){
    var checkWebkitandIE=(e);
    var checkMoz=(e);
	warn_c++;
	
	if(document.activeElement.id!="q") {
		if (warn_c >= 6) {
			if (checkWebkitandIE || checkMoz) {
				beep.play();
				warn_c=0;
			}
		}
	}
});