$(document).ready(function(){
	$.ajax({
		type: "GET",
		url: 'http://103.69.126.98/serverdate.php?image=1',
		success: function(data){
			console.log(data);
		}	
	});
		
	var thisWeek;
	var thisYear;
	var masterJson;
	
	window.ewars = {};
	window.ewars.data = [];
	
	var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sept','Oct','Nov','Dec'];
	var alertDiseases = ['Malaria Falciparum','Kala azar','Dengue','Cholera'];
	alertDiseases.sort();
	var diseaseArray = ['AGE','SARI','Malaria Vivax','Malaria Falciparum','Kala azar','Dengue','Cholera'];
	diseaseArray.sort();
	
	$('.datepicker').each(function(){
		$(this).datepicker({
			changeMonth: true,
			changeYear: true,
			dateFormat: 'yy-mm-dd'
		});
	});
	
	var App = {};
	// Load Manifest
	$.ajax({
		url : 'manifest.webapp',
		contentType:'application/json; charset=utf-8',
		dataType:'json',
		async:false
	}).done(function(data){
		App.manifest = data;
		App.baseUrl = App.manifest.activities.dhis.href;
	});
	
	function getData(startDate,endDate,ouid){
		var output;
		// API Url for event analytics
		var qryUrl = "../../../api/analytics/events/query/uoCswKjfyiM.json?stage=uTJBFFVYXqA";
		qryUrl += "&startDate="+startDate;
		qryUrl += "&endDate="+endDate;
		qryUrl += "&dimension=ou:"+ouid;
		qryUrl += "&dimension=pC8BBR3B0XX";
		qryUrl += "&dimension=eHZ62Y25h0e";
		qryUrl += "&dimension=caMyqMax9y7";
		qryUrl += "&dimension=cKzz4abGMmu";
		qryUrl += "&dimension=wwT2BLUXNS3";
		qryUrl += "&dimension=FELaEBjk7li";
		qryUrl += "&displayProperty=NAME";
		
		jQuery.getJSON(qryUrl, function(data){
			processJson(data.rows);
		});
	}
	
	function processJson(jsonData){
		var json = [];
		var dataArray = [];
		$.each(jsonData,function(index,value){
			var ageGroup;
			if(value[10] < 1){
				ageGroup = "0 - 1 Years";
			}else if(value[10] >= 1 && value[10] < 5 ){
				ageGroup = "01 - 04 Years";
			}else if(value[10] >= 5 && value[10] < 15){
				ageGroup = "05 - 14 Years";
			}else if(value[10] >= 15){
				ageGroup = "15+ Years";
			}
			
			var disease;
			if($.inArray(value[9], diseaseArray) == -1){
				disease = "Other";
			}else{
				disease = value[9];
			}
			
			var m = value[2].substr(5,2);
			if(m<10){
				m = m.substr(1,1);
			}
			
			var j = {
				//date: value[2].substr(0,10),
				Site: value[5],
				District: value[8].toUpperCase(),
				Disease: disease,
				Age:ageGroup,
				Outcome: value[11],
				Sex: value[12],
				Diagnosis: value[13],
				Year: getEpiYear(value[2].substr(0,10)),
				Month: months[m-1],
				//Week: getEpiYear(value[2].substr(0,10))+getWeekNumber(value[2].substr(0,10)),
				Week: getWeekNumber(value[2].substr(0,10)),
			};
			var k = [
			value[0],
			value[5],
			value[8].toUpperCase(),
			disease,
			ageGroup,
			value[11],
			value[12],
			value[13],
			getEpiYear(value[2].substr(0,10)),
			months[m-1],
			//getEpiYear(value[2].substr(0,10))+getWeekNumber(value[2].substr(0,10)),
			getWeekNumber(value[2].substr(0,10))];
			
			json.push(j);
			//dataArray.push(k);
		});
		//window.ewars.data = dataArray;
		$('#fetchstatus').text("Done");
		// Config for Pivot table
		/*var config = {
			dataSource: window.ewars.data,
			canMoveFields: true,
			dataHeadersLocation: 'columns',
			theme: 'green',
			toolbar: {visible: false},
			fields: [{
                name: '0',
                caption: 'EventId',
                dataSettings: {
					aggregateFunc: 'count',
					formatFunc: function(value) {
						return value ? Number(value).toFixed(0) : '';
					}
				}
			},{
                name: '1',
                caption: 'Health Facility',
				dataSettings: {
					aggregateFunc: 'count',
					formatFunc: function(value) {
						return value ? Number(value).toFixed(0) : '';
					}
				}
			},{
                name: '2',
                caption: 'District',
				dataSettings: {
					aggregateFunc: 'count',
					formatFunc: function(value) {
						return value ? Number(value).toFixed(0) : '';
					}
				}
			},{
                name: '3',
                caption: 'Disease',
				dataSettings: {
					aggregateFunc: 'count',
					formatFunc: function(value) {
						return value ? Number(value).toFixed(0) : '';
					}
				}
			},{
                name: '4',
                caption: 'Age',
				dataSettings: {
					aggregateFunc: 'count',
					formatFunc: function(value) {
						return value ? Number(value).toFixed(0) : '';
					}
				}
			},{
                name: '5',
                caption: 'Outcome',
				dataSettings: {
					aggregateFunc: 'count',
					formatFunc: function(value) {
						return value ? Number(value).toFixed(0) : '';
					}
				}
			},{
                name: '6',
                caption: 'Sex',
				dataSettings: {
					aggregateFunc: 'count',
					formatFunc: function(value) {
						return value ? Number(value).toFixed(0) : '';
					}
				}
			},{
                name: '7',
                caption: 'Diagnosis',
				dataSettings: {
					aggregateFunc: 'count',
					formatFunc: function(value) {
						return value ? Number(value).toFixed(0) : '';
					}
				}
			},{
                name: '8',
                caption: 'Year',
				dataSettings: {
					aggregateFunc: 'count',
					formatFunc: function(value) {
						return value ? Number(value).toFixed(0) : '';
					}
				}
			},{
                name: '9',
                caption: 'Month',
				dataSettings: {
					aggregateFunc: 'count',
					formatFunc: function(value) {
						return value ? Number(value).toFixed(0) : '';
					}
				}
			},{
                name: '10',
                caption: 'Week',
				dataSettings: {
					aggregateFunc: 'count',
					formatFunc: function(value) {
						return value ? Number(value).toFixed(0) : '';
					}
				}
			}],
			data: ['EventId'],
		}; // End of config
				*/	
		//var elem = document.getElementById('rr')
		//var pgridwidget = new orb.pgridwidget(config);
		//pgridwidget.render(elem);
		//pgridwidget.refreshData(window.ewars.data);
					
		//$("#refreshpivot").click(function(e){
		//	pgridwidget.refreshData(window.ewars.data);
		//});
					
		// Configuration for Pivot and Chart pivot2	
			
		var renderers = $.extend($.pivotUtilities.renderers,$.pivotUtilities.gchart_renderers);
		$("#output").pivotUI(json, {
			renderers: renderers
        });
	}
	
	$("#fetch").click(function(e){
		$(fetchstatus).text("requesting...");
		getData($("#startDate").val(),$("#endDate").val(),'cCTQiGkKcTk');
		//pgridwidget.refreshData(window.ewars.data);
	});
	
	function generateReportTables(d){
		var jsonTw = d.filter(function(row){if(row["year"] == year && row["week"] == 'W'+week) return true;});
		var jsonTd = d.filter(function(row){if(row["year"] == year) return true;});		// For cumulative values
		
		$( "#table1" ).html(prepareAgeSexDistributionTable(jsonTw,diseaseArray));
		fillCumulativeCaseDeath(jsonTd,diseaseArray);	
		
		//$("#hfcasedeath").html(prepareHfWiseTable(jsonTw,diseaseArray));
		$("#districtwise").html(prepareDistrictWiseTable(jsonTw,diseaseArray));
	}
	
	function getWeekNumber(date){
		var thisDate = new Date(date.substr(0,10));
		var year = thisDate.getFullYear();
		var stdt = getFirstEpiWeekDate(year);
		var week = 0;
		
		if(thisDate < stdt){
			year -= 1;
			var stdt = getFirstEpiWeekDate(year);
		}

		for (var d = stdt; d <= thisDate; d.setDate(d.getDate()+7)) {
			week++;
		}
		if(week < 10){
			week = '0'+week;
		}
		return "W"+week;
	}
	
	function getEpiYear(date){
		var thisDate = new Date(date.substr(0,10));
		var year = thisDate.getFullYear();
		var stdt = getFirstEpiWeekDate(year);
		if(thisDate < stdt){
			year -= 1;
			var stdt = getFirstEpiWeekDate(year);
			//alert(thisDate+" --- "+stdt);
		}
		return stdt.getFullYear();
	}
	
	// Returns the Start date of first epidemiological week of the year 
	function getFirstEpiWeekDate(epiYear){
		var startDate = new Date(epiYear, 0, 01);
		var day = startDate.getDay();
		if(day == 0){

		}else if(day > 0 && day <= 3 ){
			startDate.setDate(startDate.getDate()-day); 
		}else{
			startDate.setDate(startDate.getDate()+(7-day));  
		}
		return startDate;
	}

	function formatDate(date){
		var month = date.getMonth()+1;
		if(month <10) month = "0"+month;
		
		var day = date.getDate();
		if(day < 10){
			day = "0"+day;
		}
		return date.getFullYear()+"-"+month+"-"+day;
	}
	
	function weekStartDates(epiYear){
		var datesArray = [];
		startDate = getFirstEpiWeekDate(epiYear);
		datesArray.push(startDate);
		
		for(i = startYear; i <= endYear;i++){
			var startDate = new Date(epiYear, 0, 01);
			var day = startDate.getDay();
			if(day > 0 && day <= 6 ){
				startDate.setDate(startDate.getDate()+6-(day-1)); 
			}
			
			var incrementVal = 7;
			for(j = 0; j < 53; j++){
				var week = j+1;
				
				var endDate = new Date(startDate);
				endDate.setDate(startDate.getDate()+6);
				
				var startMonth = startDate.getMonth()+1;
				var endMonth = endDate.getMonth()+1
				var sd = startDate.getFullYear()+"-"+startMonth+"-"+startDate.getDate();
				var ed = endDate.getFullYear()+"-"+endMonth+"-"+endDate.getDate();
				
				if(week == 53 && startDate.getFullYear()== i+1){
					
				}else{
					epiWeeks.push(i+"W"+week);//+" ["+sd+" to "+ed+"]");
				}
				startDate.setDate(startDate.getDate()+7);
			}
		}
		
		return epiWeeks;	
	}
	
	function generateEpiWeeks(){
		var epiWeeks = [];
		var startYear = 2012;
		var endYear = new Date().getFullYear();
		//var week = 1;
		
		for(i = startYear; i <= endYear;i++){
			var startDate = new Date(i, 0, 01);
			var day = startDate.getDay();
			if(day > 0 && day <= 6 ){
				startDate.setDate(startDate.getDate()+6-(day-1)); 
			}
			
			var incrementVal = 7;
			for(j = 0; j < 53; j++){
				var week = j+1;
				
				var endDate = new Date(startDate);
				endDate.setDate(startDate.getDate()+6);
				
				var startMonth = startDate.getMonth()+1;
				var endMonth = endDate.getMonth()+1
				var sd = startDate.getFullYear()+"-"+startMonth+"-"+startDate.getDate();
				var ed = endDate.getFullYear()+"-"+endMonth+"-"+endDate.getDate();
				
				if(week == 53 && startDate.getFullYear()== i+1){
					
				}else{
					epiWeeks.push(i+"W"+week);//+" ["+sd+" to "+ed+"]");
				}
				startDate.setDate(startDate.getDate()+7);
			}
		}
		
		return epiWeeks;	
	}
	 
	function dateBand(year, weekNumber){
		var dates = [];
		var startDate = new Date(year, 0, 01);
		var day = startDate.getDay();
		
		if(day == 0){

		}else if(day > 0 && day <= 3 ){
			startDate.setDate(startDate.getDate()-day); 
		}else{
			startDate.setDate(startDate.getDate()+(7-day));  
		}
		
		if(weekNumber != 1){
			for(i=1;i<weekNumber;i++){
				startDate.setDate(startDate.getDate()+7)
			}
			if(startDate.getFullYear()!= year){
				alert('Invalid period');
				return false;
			}
		}
		
		var endDate = new Date(startDate);
		endDate.setDate(startDate.getDate()+6);
		
		var startMonth = startDate.getMonth()+1;
		if(startMonth <10) startMonth = "0"+startMonth;
		var endMonth = endDate.getMonth()+1
		if(endMonth < 10) endMonth = "0"+endMonth;
		
		var startDay = startDate.getDate();
		if(startDay < 10){
			startDay = "0"+startDay;
		}
		var endDay = endDate.getDate();
		if(endDay < 10){
			endDay = "0"+endDay;
		}
		
		dates.push(startDate.getFullYear()+"-"+startMonth+"-"+startDay);
		dates.push(endDate.getFullYear()+"-"+endMonth+"-"+endDay);
		
		return dates;
	}
	
	function dataForChart(json,diseaseName){
		var weeksArray = [];
		$.each(json,function(key,jsonObj){
			if($.inArray(jsonObj.week, weeksArray) == -1){
				weeksArray.push(jsonObj.week);
			}
		});
		weeksArray.sort();
		
		var outputJson = [];
		var series = [{
			ty:year,
			ly:year-1
		}];
		var data = [];
		$.each(weeksArray,function(key,week){
			var thisYear = 0;
			var prevYear = 0;
			$.each(json,function(i,jsonObj){
				if(jsonObj.disease == diseaseName && jsonObj.week == week){
					if(jsonObj.year == year){
						thisYear++;
					}else{
						prevYear++;
					}
				}
			});
			
			var j = {
					week: week,
					[year]: thisYear,
					[year-1]: prevYear
			};
			data.push(j);
		});
		outputJson = {
			series:series,
			data:data
		};
		return outputJson;
	}
	
	function loadChartImage(svg){
		svg.toImage();
	}

	function prepareAgeSexDistributionTable(json,diseaseArray){
		if(json.length > 0){
			var ageGroupArray = [];
			var genderArray = ["Male", "Female"];
			
			$.each(json,function(key,jsonObj){
				var ageGroup = jsonObj.ageGroup;
				if($.inArray(ageGroup, ageGroupArray) == -1){
					ageGroupArray.push(ageGroup);
				}
			});
			ageGroupArray.sort();
			
			var html = "<table class='listTable gridTable'><thead><tr><th rowspan='3'>Disease</th>";
			$.each(ageGroupArray,function(index,value){
				html += "<th colspan='4'>"+value+"</th>";
			});
			html += "<th colspan='4'>Total</th>";
			html += "<th colspan='2'>Total Cases</th><th colspan='2'>Total Deaths</th></tr>";
			html += "<tr><th colspan='2'>Cases</th><th colspan='2'>Deaths</th><th colspan='2'>Cases</th><th colspan='2'>Deaths</th><th colspan='2'>Cases</th><th colspan='2'>Deaths</th><th colspan='2'>Cases</th><th colspan='2'>Deaths</th><th colspan='2'>Cases</th><th colspan='2'>Deaths</th><th rowspan='2'>This Week</th><th rowspan='2'>Cumulative</th><th rowspan='2'>This Week</th><th rowspan='2'>Cumulative</th></tr>";
			html += "<tr><th>M</th><th>F</th><th>M</th><th>F</th><th>M</th><th>F</th><th>M</th><th>F</th><th>M</th><th>F</th><th>M</th><th>F</th><th>M</th><th>F</th><th>M</th><th>F</th><th>M</th><th>F</th><th>M</th><th>F</th></tr></thead><tbody>";
			$.each(diseaseArray,function(index,disease){
				var clessThanOneMaleTotal = 0;
				var clessThanOneFemaleTotal = 0;
				var coneToFourMaleTotal = 0;
				var coneToFourFemaleTotal = 0;
				var cfiveToFourteenMaleTotal = 0;
				var cfiveToFourteenFemaleTotal = 0;
				var cfifteenPlusMaleTotal = 0;
				var cfifteenPlusFemaleTotal = 0;
				var cmaleTotal = 0;
				var cfemaleTotal = 0;
				var dlessThanOneMaleTotal = 0;
				var dlessThanOneFemaleTotal = 0;
				var doneToFourMaleTotal = 0;
				var doneToFourFemaleTotal = 0;
				var dfiveToFourteenMaleTotal = 0;
				var dfiveToFourteenFemaleTotal = 0;
				var dfifteenPlusMaleTotal = 0;
				var dfifteenPlusFemaleTotal = 0;
				var dmaleTotal = 0;
				var dfemaleTotal = 0;
				var caseTotal = 0;
				var deathTotal = 0;
				
				$.each(json,function(key,jsonObj){
					var diseaseName = jsonObj.disease;
					var ageGroup = jsonObj.ageGroup;
					var sex = jsonObj.sex;
					var outcome = jsonObj.outcome;
					if(diseaseName == disease && outcome != ""){
						if(ageGroup == "0 - 1 Years" && sex == "Male"){
							clessThanOneMaleTotal++;
						}
						if(ageGroup == "0 - 1 Years" && sex == "Female"){
							clessThanOneFemaleTotal++;
						}
						if(ageGroup == "01 - 04 Years" && sex=="Male"){
							coneToFourMaleTotal++;
						}
						if(ageGroup == "01 - 04 Years" && sex=="Female"){
							coneToFourFemaleTotal++;
						}
						
						if(ageGroup == "05 - 14 Years" && sex=="Male"){
							cfiveToFourteenMaleTotal++;
						}
						
						if(ageGroup == "05 - 14 Years" && sex == "Female"){
							cfiveToFourteenFemaleTotal++;
						}
						
						if(ageGroup == "15+ Years" && sex == "Male"){
							cfifteenPlusMaleTotal++;
						}
						
						if(ageGroup == "15+ Years" && sex=="Female"){
							cfifteenPlusFemaleTotal++;
						}
						cmaleTotal = clessThanOneMaleTotal+coneToFourMaleTotal+cfiveToFourteenMaleTotal+cfifteenPlusMaleTotal;
						cfemaleTotal = clessThanOneFemaleTotal+coneToFourFemaleTotal+cfiveToFourteenFemaleTotal+cfifteenPlusFemaleTotal;
						caseTotal = cmaleTotal+cfemaleTotal;
					}
					if(diseaseName == disease && outcome == "Death"){
						if(ageGroup  == "0 - 1 Years" && sex=="Male"){
							dlessThanOneMaleTotal++;
						}
						if(ageGroup == "0 - 1 Years" && sex=="Female"){
							dlessThanOneFemaleTotal++;
						}
						
						if(ageGroup  == "01 - 04 Years"  && sex=="Male"){
							doneToFourMaleTotal++;
						}
						
						if(ageGroup  == "01 - 04 Years"  && sex=="Female"){
							doneToFourFemaleTotal++;
						}
						
						if(ageGroup == "05 - 14 Years" && sex=="Male"){
							dfiveToFourteenMaleTotal++;
						}
						
						if(ageGroup == "05 - 14 Years" && sex=="Female"){
							dfiveToFourteenFemaleTotal++;
						}
						
						if(ageGroup == "15+ Years" && sex=="Male"){
							dfifteenPlusMaleTotal++;
						}
						
						if(ageGroup == "15+ Years" && sex=="Female"){
							dfifteenPlusFemaleTotal++;
						}
						dmaleTotal = dlessThanOneMaleTotal+doneToFourMaleTotal+dfiveToFourteenMaleTotal+dfifteenPlusMaleTotal;
						dfemaleTotal = dlessThanOneFemaleTotal+doneToFourFemaleTotal+dfiveToFourteenFemaleTotal+dfifteenPlusFemaleTotal;
						deathTotal = dmaleTotal+dfemaleTotal;
					}
				});
				var caseCumulative = 0;
				var deathCumulative = 0;
				html += "<tr><td>"+disease+"</td>";
				html += "<td>"+clessThanOneMaleTotal+"</td><td>"+clessThanOneFemaleTotal+"</td>"+"<td>"+dlessThanOneMaleTotal+"</td><td>"+dlessThanOneFemaleTotal+"</td>";
				html += "<td>"+coneToFourMaleTotal+"</td><td>"+coneToFourFemaleTotal+"</td>"+"<td>"+doneToFourMaleTotal+"</td><td>"+doneToFourFemaleTotal+"</td>";
				html += "<td>"+cfiveToFourteenMaleTotal+"</td><td>"+cfiveToFourteenFemaleTotal+"</td>"+"<td>"+dfiveToFourteenMaleTotal+"</td><td>"+dfiveToFourteenFemaleTotal+"</td>";;
				html += "<td>"+cfifteenPlusMaleTotal+"</td><td>"+cfifteenPlusFemaleTotal+"</td>"+"<td>"+dfifteenPlusMaleTotal+"</td><td>"+dfifteenPlusFemaleTotal+"</td>";
				html += "<td>"+cmaleTotal+"</td><td>"+cfemaleTotal+"</td>"+"<td>"+dmaleTotal+"</td><td>"+dfemaleTotal+"</td>";;
				html += "<td>"+caseTotal+"</td><td><span id='"+disease.replace(" ","-").toLowerCase()+"-case-cumulative'>"+caseCumulative+"</span></td><td>"+deathTotal+"</td><td><span id='"+disease.replace(" ","-").toLowerCase()+"-death-cumulative'>"+deathCumulative+"</span></td>";
				html += "</tr>";
			});
			html += "</tbody></table>";
		}else{
			html = "No cases reported";
		}
		return html;
	}

	function prepareHfWiseTable(json,diseaseArray){
		if(json.length > 0){
			var hfArray = [];
			var html = "<table class = 'listTable gridTable' cellpadding='4' style='border-radius:5px;'><thead><tr>";

			$.each(json, function(i, jsonObj ) {
				var hf = jsonObj.hf;
				var diseaseName =  jsonObj.disease;
				var outcome =  jsonObj.outcome;
				if($.inArray(hf, hfArray) == -1){
					hfArray.push(hf);
				}
			});
			
			// create the first row of header
			html += "<th rowspan='2' style='text-align:center;'>Sentinel Site</th>";
			$.each(diseaseArray, function(i, disease){
				html += "<th colspan='2' style='text-align:center;'>"+disease+"</th>";
			});
			html += "<tr>";
			$.each(diseaseArray, function(i, disease){
				html += "<th  style='text-align:center;'>Cases</th><th  style='text-align:center;'>Deaths</th>";
			});
			html += "</tr></thead><tbody>";
			
			// create the data rows
			var totals = [];
			var caseTotal = [];
			var deathTotal = [];
			var caseCount = 0;
			var deathCount = 0;
			$.each(hfArray, function(i, hf ) {
				var dataRow = "";
				var rowWithDeath = false;
				$.each(diseaseArray, function(j, disease ) {
					caseCount = 0;
					deathCount = 0;
					$.each(json, function(k, jsonObj ) {
						if(jsonObj.hf == hf && jsonObj.disease == disease){
							caseCount++;
							if(jsonObj.outcome == "Death"){
								deathCount++;
							}
							caseTotal[disease] += caseCount;
							deathTotal[disease] += deathCount;
						}
					});
					if(deathCount > 0){
						rowWithDeath = true;
						dataRow += "<td>"+caseCount+"</td><td style='font-weight:bold;color:red'>"+deathCount+"</td>";
					}else{
						dataRow += "<td>"+caseCount+"</td><td>"+deathCount+"</td>";
					}
				});
				
				if(rowWithDeath){
					html += "<tr class='listAlternateRow rowWithDeath'><td>"+hf+"</td>"+dataRow;
				}else{
					if((i % 2)>0){
						html += "<tr class='listAlternateRow'><td>"+hf+"</td>"+dataRow;
					}else{
						html += "<tr><td>"+hf+"</td>"+dataRow;
					}
				}
				html += "</tr>";
			});
			html += "</table>";
		}else{
			html = "There are no cases/deaths reported.";
		}
		return html;
	}

	function prepareDistrictWiseTable(json,diseaseArray){
		if(json.length > 0){
			var districtArray = [];
			var html = "<table class ='listTable gridTable' cellpadding='4' style='border-radius:5px;'><thead><tr>";

			$.each(json, function(i, jsonObj ) {
				var district = jsonObj.district;
				//var diseaseName =  jsonObj.disease;
				//var outcome =  jsonObj.outcome;
				if($.inArray(district, districtArray) == -1){
					districtArray.push(district);
				}
			});
			
			// create the first row of header
			html += "<th rowspan='2' style='text-align:center;'>Sentinel Site</th>";
			$.each(diseaseArray, function(i, disease){
				html += "<th colspan='2' style='text-align:center;'>"+disease+"</th>";
			});
			html += "<tr>";
			$.each(diseaseArray, function(i, disease){
				html += "<th  style='text-align:center;'>Cases</th><th  style='text-align:center;'>Deaths</th>";
			});
			html += "</tr></thead><tbody>";
			
			// create the data rows
			var totals = [];
			var caseTotal = [];
			var deathTotal = [];
			var caseCount = 0;
			var deathCount = 0;
			$.each(districtArray, function(i, district ) {
				var dataRow = "";
				var rowWithDeath = false;
				$.each(diseaseArray, function(j, disease ) {
					caseCount = 0;
					deathCount = 0;
					$.each(json, function(k, jsonObj ) {
						if(jsonObj.district == district && jsonObj.disease == disease){
							caseCount++;
							if(jsonObj.outcome == "Death"){
								deathCount++;
							}
							caseTotal[disease] += caseCount;
							deathTotal[disease] += deathCount;
						}
					});
					if(deathCount > 0){
						rowWithDeath = true;
						dataRow += "<td>"+caseCount+"</td><td style='font-weight:bold;color:red'>"+deathCount+"</td>";
					}else{
						dataRow += "<td>"+caseCount+"</td><td>"+deathCount+"</td>";
					}
				});
				
				if(rowWithDeath){
					html += "<tr class='listAlternateRow rowWithDeath'><td>"+district+"</td>"+dataRow;
				}else{
					if((i % 2)>0){
						html += "<tr class='listAlternateRow'><td>"+district+"</td>"+dataRow;
					}else{
						html += "<tr><td>"+district+"</td>"+dataRow;
					}
				}
				html += "</tr>";
			});
			html += "</table>";
		}else{
			html = "There are no cases/deaths reported.";
		}
		return html;
	}

	function fillCumulativeCaseDeath(json,diseaseArray){
		if(json.length > 0){
			$.each(diseaseArray,function(index,disease){
				var caseCount = 0;
				var deathCount = 0;
				$.each(json,function(key,jsonObj){
					var diseaseName = jsonObj.disease;
					var outcome = jsonObj.outcome;
					if(diseaseName == disease && outcome != ""){
						caseCount++;
					}
					if(diseaseName == disease && outcome == "Death"){
						deathCount++;
					}
					$("#"+disease.replace(" ","-").toLowerCase()+"-case-cumulative").html(caseCount);
					$("#"+disease.replace(" ","-").toLowerCase()+"-death-cumulative").html(deathCount);
				});		
			});
		}
	}

	function reportingStatus(dates){
		var url = "../api/analytics/events/query/uoCswKjfyiM.json?stage=uTJBFFVYXqA&dimension=ou:LEVEL-5";
		url += "&dimension=eHZ62Y25h0e&startDate="+dates[0];
		url += "&endDate="+dates[1];
		url += "&displayProperty=NAME";
			
		jQuery.getJSON(url, function(data){
			var siteArray = [];
			$.each(data.rows,function(index,value){
				if($.inArray(value[5],siteArray) == -1){
					siteArray.push(value[5]);
				}
			});
			var reported = siteArray.length;	
			
			//call for level 5 orgUnits
			url = "../api/organisationUnits.json?level=5&paging=false";
			jQuery.getJSON(url, function(data){
				var expected = 0;

				$.each(data.organisationUnits,function(index,value){
					jQuery.getJSON(value.href, function(data){
						if(data.openingDate <= dates[0] && data.openingDate > "2000-01-01"){
							expected++;
						}

						var width = Math.round(reported/expected*100);
						var expectedText;
						if(width > 85){
							expectedText = "";
						}else{
							expectedText = "Expected: "+expected;
						}
						var html = '<div style="height:20px;padding-top:5px;background:lightgreen;width:'+width+'%;position:relative;float:left;text-align:center;">Reported: '+reported+' ('+width+'%)</div>'
						html += '<div style="height:20px;padding-top:5px;background:orange;width: '+(100-width)+'%;position:relative;float:right;text-align:center;">'+expectedText+'</div>';
						$( "#reportingStatus" ).html(html);
					});
				});
			});
		});
	}

	function createJqx(data,diseaseName,chartTitle,description,chartContainer){
		var d = dataForChart(data,diseaseName);
		var series = d.series;
		sampleData = d.data;        
		// prepare jqxChart settings
            var settings = {
                title: chartTitle,
                description: description,
                enableAnimations: true,
                showLegend: true,
                padding: { left: 5, top: 5, right: 5, bottom: 5 },
                titlePadding: { left: 90, top: 0, right: 0, bottom: 10 },
                source: sampleData,
                colorScheme: 'scheme02',
                borderLineColor: '',
                xAxis:{
                    dataField: 'week',
                    unitInterval: 2,
                    tickMarks: {visible: true,interval: 1,color: '#ececec'},
                    gridLines:{visible: false,interval: 1,color: '#ececec'},
                    axisSize: 'auto'
                },
                valueAxis:{
                    visible: true,
                    //unitInterval: 10,
                    //minValue: 0,
                    //maxValue: 100,
                    title: { text: 'Number of cases' },
                    tickMarks: {color: '#ececec'},
                    gridLines: {color: '#ececec'},
                    axisSize: 'auto'
                },

                seriesGroups:[{
                    type: 'splinearea',
                    series: [{
						dataField: series[0].ly,
						displayText: series[0].ly,
						symbolType: 'circle',
						opacity: 0.5,
						//labels:{visible: true,padding: { left: 5, right: 5, top: 0, bottom: 0 }}
					}]
                },{
					type: 'column',
                    columnsGapPercent: 50,
                    seriesGapPercent: 5,
					series: [{
						dataField: series[0].ty,
						displayText: series[0].ty,
						opacity: 0.7,
						//labels:{visible: true,padding: { left: 5, right: 5, top: 0, bottom: 0 }}
					}]
                }]
            };

            // setup the chart
            $('#'+chartContainer).jqxChart(settings);
	}
			
	// Convert the selected chart to image
	$("#image").click(function(){
		var target = $("#output");
		var svg = $("#output").find("svg");
		svg = svg[0]
		
		svg.setAttribute('xlink', 'http://www.w3.org/1999/xlink');
		var serializer = new XMLSerializer();
		var svgString = serializer.serializeToString(svg);
		svgString = svgString.replace(/(\w+)?:?xlink=/g, 'xmlns:xlink='); // Fix root xlink without namespace
		svgString = svgString.replace(/NS\d+:href/g, 'xlink:href'); // Safari NS namespace fix
		
		svgString2Image(svgString, 600, 600, 'png', save);
		
		function save(dataBlob, filesize){
			//return saveAs(dataBlob, 'myfile.png' );
		}
	});
	
	function svgString2Image( svgString, width, height, format, callback ) {
		var format = format ? format : 'png';
		var imgsrc = 'data:image/svg+xml;base64,'+ btoa( unescape( encodeURIComponent( svgString ) ) );
		console.log(imgsrc);
		$.ajax({
			type: "POST",
			url: 'http://103.69.126.98/serverdate.php',
			data: {img:imgsrc},
			success: function(data){
				console.log(data);
			}
			
		});
		
		var canvas = document.createElement("canvas");
		var context = canvas.getContext("2d");

		canvas.width = width;
		canvas.height = height;

		var image = new Image();
		image.onload = function() {
			context.clearRect ( 0, 0, width, height );
			context.drawImage(image, 0, 0, width, height);

			canvas.toBlob( function(blob) {
				console.log(blob);
				var filesize = Math.round( blob.length/1024 ) + ' KB';
				if ( callback ) callback( blob, filesize );
			});
		};
		image.src = imgsrc;
		$("#previewimg").attr('src',imgsrc);
	}
	
	function dataURLtoBlob(dataUrl) {
			// Decode the dataURL    
			var binary = atob(dataUrl.split(',')[1]);

			// Create 8-bit unsigned array
			var array = [];
			for (var i = 0; i < binary.length; i++) {
				array.push(binary.charCodeAt(i));
			}

			// Return our Blob object
			return new Blob([new Uint8Array(array)], {
				type: 'image/png'
			});
	}
}); // End of Document Ready