<script >
</script>

<h1>no se que estoy haciendo app</h1>

<br>

<div>
  <label for="name" class="labels">Name: </label>
  <input type="text" id="name" class="textinput" placeholder="Enter name (required)">
  <span style="margin-left: 20px;"></span>
  <label for="quantity" class="labels">Quantity: </label>
  <input type="number" id="quantity" class="textinput" placeholder="Enter quantity (required)">
</div>

<br>

<div id="table-wrapper">
  <table id="data-table">
    <thead>
      <tr>
        <th>Name</th>
        <th class="t-qty">Quantity</th>
        <th class="t-radio">Select</th>
      </tr>
    </thead>
    <tbody></tbody>
  </table>
</div>

<br><br>

<div>
  <button type="button" class="buttons" onclick="addData()" title="Add new row from the text inputs">Add</button>
  <button type="button" class="buttons" onclick="updateData()" title="Update selected row">Update</button>
  <button type="button" class="buttons" onclick="deleteData()" title="Delete selected row">Delete</button>
  <span style="margin-left: 10px;"></span>
  <button type="button" class="buttons" onclick="clearData()" title="Clear selection">Clear</button>
  <button type="button" class="buttons" onclick="selectFirstOrLastRow(1)" title="Select first row of table">First</button>
  <button type="button" class="buttons" onclick="selectFirstOrLastRow()" title="Select last row of table">Last</button>
</div>

<br><br>

<div id="status-wrapper">
  <span class="labels">Status: </span>
  <span id="status"></span>
</div>


<style>
  body {
  color: $text-color;
  background-color: $background-color;
}


body {
	font-family: Helevetica, sans-serif;
	text-align: center;
	color: var(--dark);
	font-size: 14px;
}

h1 {
	background-color: var(--light);
	font-family: Georgia, serif;
	width: 60%;
	margin-left: 20%;
	padding: 10px 1px;
}

/* Table styling */

#table-wrapper {
	height: 220px;
	width: 50%;
	margin-left: 25%;
	border-bottom: 6px solid lightgrey;
	padding-bottom: 10px;
	overflow-y: auto;
}

table {
	width: 100%;
}

th {
	position: sticky;
	top: 0;
	padding: 10px;
	background: var(--light);;
}

td {
	padding: 7px;
}

.t-name {
	text-align: left;
}

.t-qty {
	width: 20%;
}

.t-radio {
	width: 15%;
}

.r-select { 
	color: blue; 
	font-weight: bolder; 
	font-size: 16px;
}

.r-unselect { 
	color: var(--dark); 
	font-weight: normal; 
	font-size: 14px;
}

/* Inputs and labels styling */

.buttons {
	padding: 8px 14px;
	font-weight: bold;
	color: var(--dark);
	background-color: var(--light);;
	border-radius: 4px;
	border-style: none;
	cursor: pointer;
}

.textinput {
	padding: 5px;
	color: var(--dark);
	border: 1px solid lightgrey;
}

.labels {
	font-size: 16px;
	font-weight: bold;
	margin-right: 5px;
}

#status-wrapper {
	margin-left: 25%;
	text-align: left;
}
</style>