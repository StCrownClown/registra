<?php

require_once('ripcord-master/ripcord.php');

$url = "http://localhost:8069";
$db ="odoo8";
$username = "admin";
$password = "admin";
$common = ripcord::client("$url/xmlrpc/2/common");
$models = ripcord::client("$url/xmlrpc/2/object");

$uid = $common->authenticate($db, $username, $password, array());

// GET EMPLOYEE, EVENT, PERSON DATA
$get_employee = $models->execute_kw($db, $uid, $password,
	'nstdamas.employee', 'search_read',
		array(),array('fields'=>array('emp_id','emp_fname','emp_lname','emp_org_id','emp_dpm_id','emp_dvs_id')));

$get_event = $models->execute_kw($db, $uid, $password,
    'nstda.rev.event', 'search_read',
    	array(),array('fields'=>array('event_name')));

$get_person = $models->execute_kw($db, $uid, $password,
	'nstda.rev.registration', 'search_read',
		array(),array('fields'=>array('register_code','register_fullname','register_org','register_department','register_division','event_name_id')));

// ENCODE DATA
$employee_str = "";
$get_employee_re = '/}{/';
$person_str = "";
$get_person_re = '/}{/';

foreach ($get_employee as $key => $value) {
	$value['emp_org_id'] = $value['emp_org_id'][1];
	$value['emp_dpm_id'] = $value['emp_dpm_id'][1];
	$value['emp_dvs_id'] = $value['emp_dvs_id'][1];
	$employee_str .= json_encode(array($value['emp_id'] => (object)$value));
	$employee_str = preg_replace($get_employee_re, ",", $employee_str);
}

foreach ($get_person as $key => $value) {
	$value['event_name_id'] = $value['event_name_id'][1];
	$person_str .= json_encode(array($value['register_code'] => (object)$value));
	$person_str = preg_replace($get_person_re, ",", $person_str);
}

$result_employee = json_decode($employee_str);
$result_person =  json_decode($person_str);

$data_array = array($get_event,$result_person,$result_employee);
$data_encode = json_encode($data_array);

$data_result = preg_replace_callback('/\\\\u([0-9a-fA-F]{4})/',
		function ($match) {
			return mb_convert_encoding(pack('H*', $match[1]), 'UTF-8', 'UCS-2BE');
		}, $data_encode);

echo $data_result;

?>
