<?php

function find($table, $list_values)
{
    require('config.php');// Include config file
    $query = "SELECT * FROM ".$table." WHERE ";// Create query
    $n = 0;
    foreach ($list_values as $key => $value) {
        $value = addslashes($value);
        if ($n == 0)
        {
            $n = 1;
        }
        else
        {
            $query = $query." AND ";
        }
        $query = $query.$key."='".$value."'";
    }
    //echo $query;
    $result = mysqli_query($conn,$query);// Execute query to database
    if (!$result)// Process result / error
    {
        return null;
    }
    $list = array();
    while($row = mysqli_fetch_array($result))
    {
        foreach ($row as $key => $value){
            $value = stripslashes($value);
        }
        array_push($list, $row);
    }
    return $list;
}

function update($table, $list_values_to_update, $list_values)
{
    require('config.php');// Include config file
    $query = "UPDATE ".$table." SET ";// Create query
    $n = 0;
    foreach ($list_values_to_update as $key => $value) {
        $value = addslashes($value);
        if ($n == 0)
        {
            $n = 1;
        }
        else
        {
            $query = $query.",";
        }
        $query = $query.$key."='".$value."'";
    }
    $query = $query." WHERE ";
    $n = 0;
    foreach ($list_values as $key => $value) {
        $value = addslashes($value);
        if ($n == 0)
        {
            $n = 1;
        }
        else
        {
            $query = $query." AND ";
        }
        $query = $query.$key."='".$value."'";
    }
    //echo $query;
    $result = mysqli_query($conn, $query);
    return $result;
}

function create($table, $list_values)
{
    require('config.php');// Include config file
    $query = "INSERT into ".$table;// Create query
    $args = $values = "";
    foreach ($list_values as $key => $value) {

        $value = addslashes(strip_tags($value));
        if ($args != "")
        {
            $args = $args.",";
            $values = $values.",";
        }
        $args = $args.$key;
        $values = $values."'".$value."'";
    }
    $query = $query." (".$args.") VALUES (".$values.")";
    //echo $query;
    $result = mysqli_query($conn, $query);
    return $result;
}

