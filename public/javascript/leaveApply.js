var i=1;
var table_len;
function addRow(){
	var table=document.getElementById("data_table");
	table_len=(table.rows.length);
	document.getElementById("val").innerHTML = table_len;
	var num = document.getElementById("facnum");
	num.setAttribute("value",table_len);
    i=table_len;
 	console.log(table_len);
 	var row = table.insertRow(table_len).outerHTML="<tr><td><input type='text' name='row"+table_len+"uid' placeholder='ID'></td><td><input type='Time' name='row"+table_len+"timefrom'></td><td><input type='Time' name='row"+table_len+"timeto'></td><td><input type='Date' name='row"+table_len+"date'></td></tr>";
}
//addRow();
module.exports=table_len;