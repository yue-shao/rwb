//
// Global state
//
// map     - the map object
// usermark- marks the user's position on the map
// markers - list of markers on the current map (not including the user position)
// 
//

//
// First time run: request current location, with callback to Start
//

$("document").ready(function() {
  // Set variables for the different IDs
  // IDs set by perl script writting in html
  var committees = document.getElementById("committees");
  var individuals = document.getElementById("individuals");
  var candidates = document.getElementById("candidates");
  var opinions = document.getElementById("opinions");
  //var submit_data = document.getElementByName("selections");
  var Cycles = document.getElementById("cycles");
  //Cycles.options[1].selected = true;
  Cycles.options[1].selected = true;
  //Cycles.options[6].selected = true;

});

if (navigator.geolocation)  {
    navigator.geolocation.getCurrentPosition(Start);
}


UpdateMapById = function(id, tag) {
  // Demarked different params (commttee, individuals, etc.) as differnt colored pins
   //there are two different ways to grab data from entities. 
   //distribute id for each entity, and grab them by ids. then we operate id. 
  // 1.example: var target = document.getElementById(id);
  //          target.checked;target.split();target.innerHTML and ...
  // 2.example: target = $("#id")
  //            target.css;target.split;target.html() and ...
  var target = document.getElementById(id);
  if (target) {
    var data = target.innerHTML;// innerHTML and html() are almost the same. html() supports more structures and sometiems slower
    var rows  = data.split("\n");
   
    for (var i=0; i<rows.length; i++) {
    	var cols = rows[i].split("\t");
    	var lat = cols[0];
    	var long = cols[1];
 
    	markers.push(new google.maps.Marker({ map:map,
					    position: new google.maps.LatLng(lat,long),
					    title: tag+"\n"+cols.join("\n")}));
    }
  }
}
UpdateCommittee = function(){
  var target = document.getElementById("committee_aggr");
  var data = target.innerHTML;
  if (target) {
    var demSum=0;
    var repSum=0;
    var unkSum=0;
    var rows = data.split("\n");

    for (var i=0; i<rows.length; i++) {
      var cols = rows[i].split("\t");
      var party = cols[0];
      var amnt = parseInt(cols[1]);
      //var amnt = cols[1];
      if (party==="DEM") {
        demSum += amnt;
      } else if (party==="REP") {
        repSum += amnt;
      } else if (party==="UNK"){unkSum += amnt;}
    }
    var aggr = document.getElementById("commaggrPrint");
    aggr.innerHTML="Donate Amount of Committees: $"+(demSum+repSum)+" Democrat: $"+(demSum)+" Republican: $"+repSum+" Unknown: $"+unkSum;
    var aggr_color = $("#commaggrPrint");
    if (demSum > repSum) {
      aggr_color.css("background-color", "blue")
    } else if (repSum > demSum) {
      aggr_color.css("background-color", "red")
    } else {
      aggr_color.css("background-color", "yellow")
    }
  } //else {
    //aggr.innerHTML="Donate Amount of Committees is: 0";
  //}
}
ClearCommSum = function(){
  var aggr = document.getElementById("commaggrPrint");  
  if(aggr){
    aggr.innerHTML="Committees Unchosen";
    aggr.style.backgroundColor='white';
  } 
}


UpdateIndividual = function(){
  var target = document.getElementById("individual_aggr");
  var aggr = document.getElementById("indvaggrPrint");  
  //set color
  var aggr_color = $("#indvaggrPrint");
  aggr_color.css("background-color", "white");
  
  var amount = target.innerHTML;
  if(target){
    aggr.innerHTML="Donate Amount of Individuals: $" + amount;
  }else{
    aggr.innerHTML="Donate Amount of Individuals: $0";
  }  
}
ClearIndvSum = function(){
  var aggr = document.getElementById("indvaggrPrint");  
  if(aggr){
    aggr.innerHTML="Individuals Unchosen";
  } 
}
UpdateOpinions = function(){
  var target = document.getElementById("opinion_aggr");//the opinion aggr table
  var aggr = document.getElementById("opinaggrPrint");//the opinion print area
  var data = target.innerHTML;
  if (target) {
    var rows = data.split("\n");
    var cols = rows[0].split("\t");//get the first row
    var avg = cols[0];//get the 1st col of 1st row
    var dev = cols[1];//get the 2st col of 1st row
    aggr.innerHTML="opinion of this region is as the background color(yellow is a tie)\n"+"the average is "+ avg + " the dev is "+ dev;
    var aggr_color = $("#opinaggrPrint");
    if (avg > 0) {
      aggr_color.css("background-color", "blue")
    } else if (avg<0) {
      aggr_color.css("background-color", "red")
    } else {
      aggr_color.css("background-color", "yellow")
    }
  } else {
    aggr.innerHTML="tie";
  }
}

ClearOpinSum = function(){
  var aggr = document.getElementById("opinaggrPrint");  
  if(aggr){
    aggr.innerHTML="Opinions Unchosen";
  } 
}

ClearMarkers = function()
{
    // clear the markers
    while (markers.length>0) { 
	  markers.pop().setMap(null);
    }
}


UpdateMap = function()
{
    //var color = document.getElementById("color");
    var color = $("#color");
    
    color.css("background-color", "white").html("<b><blink>Updating Display...</blink></b>");
    //color.style.backgroundColor='white';
    //color.innerHTML="<b><blink>Updating Display...</blink></b>";
    

    ClearMarkers();
    if(committees.checked){
      UpdateMapById("committee_data","COMMITTEE");
      UpdateCommittee();
    }else{
      UpdateMapById("committee_data","COMMITTEE");
      ClearCommSum();
    }
     if(candidates.checked){
       UpdateMapById("candidate_data","CANDIDATE");
     }
     if(individuals.checked){
       UpdateMapById("individual_data","INDIVIDUAL");
       UpdateIndividual();
     }else{
       UpdateMapById("individual_data","INDIVIDUAL");
       ClearIndvSum();
     }
     if(opinions.checked){
       UpdateMapById("opinion_data","OPINION");
       UpdateOpinions();
     }else{
       UpdateMapById("opinion_data","OPINION");
       ClearOpinSum();
     }
    
    
    //color.innerHTML="Ready";
    color.html("Ready");
    if (Math.random()>0.5) { 
	     //color.style.backgroundColor='blue';
       color.css("background-color", "blue");
    } else {
	   color.css("background-color", "red");
     //color.style.backgroundColor='red';
    }
}

NewData = function(data)
{
  $("#data").html(data);
  //var target = document.getElementById("data");
  
  //target.innerHTML = data;

  UpdateMap();
}

ViewShift = function()
{
    var bounds = map.getBounds();

    var ne = bounds.getNorthEast();
    var sw = bounds.getSouthWest();
// Now we need to update our data based on those bounds
// first step is to mark the color division as white and to say "Querying"
	$("#color").css("background-color","white")
		.html("<b><blink>Querying...("+ne.lat()+","+ne.lng()+") to ("+sw.lat()+","+sw.lng()+")</blink></b>");

    var Cycles = document.getElementById("cycles");
  	var x = 0;
  	var arr = [];
  	for (x=0;x<Cycles.options.length;x++) {
	    if (Cycles.options[x].selected == true) {
	    arr.push(Cycles.options[x].value);
	     }
  	}
    //sCycles = arr;
    //sCycles = SelectedCycles();
    var passString = "";
    var cycleString = arr.toString();
    //Check to see if checkboxes checked
    if((committees.checked && individuals.checked && candidates.checked && opinions.checked) 
      || (!committees.checked && !individuals.checked && !candidates.checked && !opinions.checked)){
      passString = "all";
	   $.get("rwb.pl",
		{
			act:	"near",
			latne:	ne.lat(),
			longne:	ne.lng(),
			latsw:	sw.lat(),
			longsw:	sw.lng(),
			format:	"raw",
			what:	passString,//define a whatlist and push strings in if string is checked
			cycle: cycleString,
		}, NewData);
    }else{
      var pushData = "";
      var pushArray = [];
      //Check which checkboxes are checked
      if(committees.checked){
        pushArray.push("committees");
      }
      if(candidates.checked){
        pushArray.push("candidates");
      }
      if(individuals.checked){
        pushArray.push("individuals");
      }
      if(opinions.checked){
        pushArray.push("opinions");
      }

      pushData = pushArray.join(',');

      passString += pushData;
     $.get("rwb.pl",
		{
			act:	"near",
			latne:	ne.lat(),
			longne:	ne.lng(),
			latsw:	sw.lat(),
			longsw:	sw.lng(),
			format:	"raw",
			what:	passString,//define a whatlist and push strings in if string is checked
			cycle: cycleString,
		}, NewData);
    }

}


Reposition = function(pos)
{
    var lat=pos.coords.latitude;
    var long=pos.coords.longitude;

    map.setCenter(new google.maps.LatLng(lat,long));
    usermark.setPosition(new google.maps.LatLng(lat,long));
    document.cookie = "lat=" + lat;
    document.cookie = "long=" + long;
}


function Start(location) 
{
  var lat = location.coords.latitude;
  var long = location.coords.longitude;
  var acc = location.coords.accuracy;
  
  var mapc = $( "#map");

  map = new google.maps.Map(mapc[0], 
			    { zoom:16, 
				center:new google.maps.LatLng(lat,long),
				mapTypeId: google.maps.MapTypeId.HYBRID
				} );
  usermark = new google.maps.Marker({ map:map,
					    position: new google.maps.LatLng(lat,long),
					    title: "You are here"});

  markers = new Array;


  document.cookie = "lat=" + lat;
  document.cookie = "long=" + long;

  var color = document.getElementById("color");
  color.style.backgroundColor='white';
  color.innerHTML="<b><blink>Waiting for first position</blink></b>";

  google.maps.event.addListener(map,"bounds_changed",ViewShift);
  google.maps.event.addListener(map,"center_changed",ViewShift);
  google.maps.event.addListener(map,"zoom_changed",ViewShift);

  navigator.geolocation.watchPosition(Reposition);
}