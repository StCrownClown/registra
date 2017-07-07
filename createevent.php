<?php
require_once('ripcord-master/ripcord.php');

$url = "http://localhost:8069";
$db ="odoo8";
$username = "admin";
$password = "admin";
$common = ripcord::client("$url/xmlrpc/2/common");
$models = ripcord::client("$url/xmlrpc/2/object");

$uid = $common->authenticate($db, $username, $password, array());

// GET CREATE EVENT
$Name =  $_POST["Name"];
$Date =  $_POST["Date"];
$Type =  $_POST["Type"];

// CREATE EVENT
$models->execute_kw($db, $uid, $password,
    'nstda.rev.event', 'create',
    array(array('event_name'=>$Name,'event_date'=>$Date)));

header('Location: index.html');
?>


