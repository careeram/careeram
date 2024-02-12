$(document).ready(function() {
		 document.onkeydown = function (e) {
        e = (e || window.e);
       

        if ((e.ctrlKey && (e.keyCode === 88 || e.keyCode === 67 || e.keyCode === 86 || e.keyCode === 85 || e.keyCode === 117 || e.keyCode === 83)) || (e.keyCode == 123) || (e.keyCode == 125) || (e.keyCode == 91) || (e.keyCode == 93)) {
            return false;
        }

        if (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74)) {
            return false;
        }

        if (e.shiftKey && (e.keyCode === 51 || e.keyCode === 222) || e.keyCode === 222) {
            return false;
        }
    };
	//e.keyCode === 67 ||e.keyCode === 86 ||
    document.onkeypress = function (e) {
        e = (e || window.e);
        if ((e.ctrlKey && (e.keyCode === 88 || e.keyCode === 67 || e.keyCode === 86 || e.keyCode === 85 || e.keyCode === 117 || e.keyCode === 83)) || (e.keyCode == 123) || (e.keyCode == 125) || (e.keyCode == 91) || (e.keyCode == 93)) {
            return false;
        }

        if (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74)) {
            return false;
        }

        if (e.shiftKey && (e.keyCode === 51 || e.keyCode === 222) || e.keyCode === 222) {
            return false;
        }
    };

    //Disable full page
    $('body').bind('cut copy paste', function (e) {
        e.preventDefault();
    });

    $("body").on("contextmenu", function (e) {
        return false;
    });
	startTime();
	function startTime() {
                $('.count').html((new Date()).toString().split('+')[0]);
                setTimeout(startTime, 500);
            }
	
	 $.get("https://ipinfo.io", function(response) {
                //console.log("IP Address:", response.ip);
				//alert(JSON.stringify(response));
				$(".ip").html('Your IP:'+response.ip);
            }, "json");
        // Sample job data
		var currentDate = new Date();
		jobData = $.grep(jobData, function(item) {
		var closingDate = new Date(item.Closingdate);
		return closingDate >= currentDate;
	});
		
	jobData.sort(sortByDate);
		
	  
	// Populate the select dropdown with distinct location and categories
		populateSelect([...new Set($.map(jobData, function(obj) { return obj.location; }))],"location");
		populateSelect([...new Set($.map(jobData, function(obj) { return obj.category; }))],"category");
		
        // Number of jobs per page
        const jobsPerPage = 3;

        

        // Initialize the current page
        let currentPage = 1;

        // Function to display job cards based on the selected page
        function displayJobCards(page, jobData) {
			// Calculate the total number of pages
			const totalPages = Math.ceil(jobData.length / jobsPerPage);
            const jobListContainer = $("#job-list-container");
            jobListContainer.empty(); // Clear existing job cards

            const startIndex = (page - 1) * jobsPerPage;
            const endIndex = startIndex + jobsPerPage;

            for (let i = startIndex; i < endIndex && i < jobData.length; i++) {
                const job = jobData[i];
                const jobCard = $("<div style='padding:10px 20px;'>").addClass("w3-panel w3-card-4").html(`
                    <h4 style="padding:0;margin:0;">${job.title}</h4>
					<h5 style="padding:0;margin:0;">${job.organization}</h5>
					<b>Advt. No.</b>: ${job.advno}<br/>
					<b>Recruitment Type</b>: ${job.employmenttype}<br/>
                    <b>Location:</b> ${job.location}<br/>
                    <b>Category:</b> ${job.category}<br/>
                    <b>Closing Date:</b> ${job.Closingdate}<br/>
					<p><a href="${job.doc}" class="w3-btn w3-teal w3-small" target="_blank">View Advertisement</a>&nbsp;&nbsp;&nbsp;&nbsp;<a href="${job.link}" class="w3-btn w3-teal w3-small" target="_blank">Apply</a></p>
					
                `);
                jobListContainer.append(jobCard);
            }
        }
		
		function populateSelect(jsonObj,selID){
		
			$.each(jsonObj, function(index, value) {
				$('#'+selID).append($('<option>').text(value).attr('value', value));
			});
		}
		
		// Custom comparison function to sort by date
        function sortByDate(a, b) {
            return new Date(a.Closingdate) - new Date(b.Closingdate);
        }

		$("form").submit(function(){
			currentPage = 1;
			$("#pagination-container").html("");
			var filtercriteria= ConvertFormToJSON($(this));
			
			if(JSON.stringify(filtercriteria)!="{}"){
				  var filteredjobData = filterList(jobData , filtercriteria);
				 //alert();
				 if(JSON.stringify(filteredjobData)!="[]"){
					 displayJobCards(currentPage,filteredjobData);
					 updatePagination(filteredjobData);
					 
				 }
				 else{
					// jobData=JSON.parse(originaljobData);
					alert("No data Found, Matching selected criteria. Reseting Data..."); 
					 displayJobCards(currentPage,jobData);
				 updatePagination(jobData);
				 }
				 
				 
				 
			} else{
				
				alert("Please select atleast one parameter."); 
				 displayJobCards(currentPage,jobData);
				 updatePagination(jobData);
				return false;
			}
			
			
			return false;
		});
		
		function filterList(list, criteria) {
        return $.grep(list, function(item) {
            for (var key in criteria) {
                if (item[key] !== criteria[key]) {
                    return false;
                }
            }
            return true;
        });
    }
		
		function ConvertFormToJSON(form) {

			var array = $(form).serializeArray();
			var json = {};
			$.each(array, function () {
				json[this.name] = this.value || '';
			});

			return json;
		}

		
        // Function to update pagination links
        function updatePagination(x) {
			//
			const totalPages = Math.ceil(x.length / jobsPerPage);
            const paginationContainer = $("#pagination-container");
            paginationContainer.empty(); // Clear existing pagination links

            for (let i = 1; i <= totalPages; i++) {
                const pageLink = $("<a>").attr("href", "#").text(i);
                pageLink.click(function() {
                    currentPage = i;
                    displayJobCards(currentPage,x);
                    updatePagination(x);
                });

                if (i === currentPage) {
                    pageLink.addClass("active");
                }

                paginationContainer.append(pageLink);
            }
        }

        // Initial display of job cards and pagination links
        displayJobCards(currentPage,jobData);
        updatePagination(jobData);
    });
