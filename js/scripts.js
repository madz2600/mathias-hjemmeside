// On page load
$(document).ready(function(){
	// React to clicks on anchors
	window.onhashchange = hashChanged;
	// React to directly type urls
	hashChanged();
});
// Ignore hash if it's not empty, else go to index
function hashrefresh() {
	if(window.location.hash!=''){
		return;
	}
	else {
		window.location.hash='home';
	}
};
// When the URL hash (#something) changes
function hashChanged() {
	pageTop();
	// hide all panels
	$('.page').hide();
	// get the current hasj minus '#'
	var panelId = window.location.hash.substr(1);
	// show only the appropriate panel
	$('#' + panelId).show();
	// Navigation selector
	$(function(){
	  if(document.location.hash.search('home') !== -1){
		$(".navigation ul li a").removeClass("active");
		$(".navigation ul li.nav-home a").addClass("active");
	  }
	  else if(document.location.hash.search('about') !== -1){
		$(".navigation ul li a").removeClass("active");
		$(".navigation ul li.nav-about a").addClass("active");
	  }
	  else if(document.location.hash.search('contact') !== -1){
		$(".navigation ul li a").removeClass("active");
		$(".navigation ul li.nav-contact a").addClass("active");
	  }
	});
};
// Scroll to top of the page
function pageTop() {
	window.scrollTo(0,1080);
};
// Remove white screen when page is loaded and get categories
$(window).on('load', function() {
	$("#cover").fadeOut(1000);
	// Load categories
	function loadcategories() {
		var folder = "./images/";
		$.ajax({
			url:folder,
			success: function (data) {
				$(data).find("a").attr("href",function(i, val){
					var lastChar = val.substr(-1);
					if (lastChar == '/' && val !== ''){
					   $("#categories").append("<input type='radio' name='portfolio' id='" + val.slice(0, -1) + "' value='" + val.slice(0, -1) + "' onclick='document.getElementById(\"chosencategory\").value = this.value;changedcategory();selectimg(this);' data-img-src='" + folder + val.slice(0, -1) + "/cover.jpg'><label for='" + val.slice(0, -1) + "' style='background-image:url(\"" + folder + val + "cover.jpg\");'><span class='album-title'>" + val.slice(0, -1) + "</span></label>");
					}
				});
			},
			complete: function (data) {
//	Disabled		$("body").children().each(function(){
//	Disabled			$(this).html($(this).html().replace(/%c3%a6|%c3%86/g,"æ"));
//	Disabled			$(this).html($(this).html().replace(/%c3%b8|%c3%98/g,"ø"));
//	Disabled			$(this).html($(this).html().replace(/%c3%a5|%c3%85/g,"å"));
//	Disabled		});
				$('#categories').children('input:first').remove();
				$('#categories').children('label:first').remove();
			}
		});
	};
	$(window).resize(function () {
		adjustimage();
	});
	loadcategories();
	hideImg();
});
// Select image for larger display
function selectimg(img) {
	$("#cover-img-container #img img").attr("src",$(img).attr("data-img-src"));
	$("#cover-img-container").show();
	adjustimage();
	$("#cover-bg").fadeIn(500, function() {
		$('#cover-img-container').css('top',($(window).scrollTop() + 50) + 'px');
	});
	// Image description
	$("#img-description-container").remove();
	$("#img-description").append("<div id='img-description-container'></div>");
	function loaddescription() {
		var text = "./images/" + document.getElementById('chosencategory').value + "/info.txt";
		$('#img-description-container').load(text + '?id=' + Date.now());
	};
	loaddescription();
	adjustimage();
};
// Close larger display function
function hideImg() {
	$('#cover-img-container').css('top','-' + $('html').height() + 'px');
	$("#cover-img-container").fadeOut(500)
	$("#cover-bg").fadeOut(500, function() {
		clearcategory();
	});
};
// Close larger display when pressing ESC
$(document).keyup(function(e) {
	 if (e.keyCode == 27) {
		hideImg();
	}
});
// Function when clearing chosen category
function clearcategory() {
	document.getElementById('chosencategory').value = '0';
	$('input[name=portfolio]').attr('checked',false);
	$('#img-related-container').remove();
};
// Load corresponding images to chosen category as related
function changedcategory() {
	$("#img-related").append("<div id='img-related-container'></div>");
	var category = document.getElementById('chosencategory').value;
	var folder = "./images/" + category + "/";
	$.ajax({
		url : folder,
		success: function (data) {
			$(data).find("a").attr("href", function (i, imgval) {
				if( imgval.match(/\.(jpe?g|png|gif|jpg|JPE?G|PNG|GIF|JPG)$/) ) { 
					$("#img-related-container").append("<div class='related-img' onclick='selectimg(this);' data-img-src='"+ folder + imgval +"' style='background-image:url("+ folder + imgval +");'></div>");
				}
			});
		}
	});
};
// Adjust image thing
function adjustimage() {
	var h = window.innerHeight;
	var w = window.innerWidth;
	$('#cover-img-container #img img').css('min-height',(h - '250') + 'px');
	$('#cover-img-container #img img').css('max-height',(h - '250') + 'px');
	$('#cover-img-container').css('margin-left','-' + ($('#cover-img-container').width() / 2) + 'px');
}

