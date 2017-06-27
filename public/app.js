$(document).ready(function() {
    $("#noteSection").hide();
    $(".savetheNote").hide();
});

var id = "";
var titleofNote = "";

$(document).on("click", "#scrape", function() {
    // alert("10 articles added");
    location.href = "/scrape";
    // $.getJSON("/articles", function(data) {
    //     console.log(data);  
    // }); 
});

$(document).on("click", "#save", function() {
    id = $(this).attr("data-id");
    console.log("---------------------------");
    console.log(id);
    console.log("---------------------------");

    $.ajax({
        method: "POST",
        url: "/articles/" + id,
        data: {
            savedNews: true            
        }
    });
});

$(document).on("click", "#deleteFromSaved", function() {
    id = $(this).attr("data-id");
    console.log("---------------------------");
    console.log(id);
    console.log("---------------------------");

    $.ajax({
        method: "POST",
        url: "/articles/" + id,
        data: {
            savedNews: false           
        }
    });
    location.href = "/saved";
});



$(document).on("click", "#addNote", function() {
    titleofNote = $(this).attr("title-id").trim();
    id = $(this).attr("data-id");
    $("#noteSection").show();
    $("#saveNote").show();
    $(".saveOrDelete").hide();
    $("#title").html(titleofNote);
});

$(document).on("click", "#saveNote", function() {
    var body = $("#noteTextArea").val().trim();
    console.log("=-=-=-=-=-=-=-=-=-=-=-=-=-=-=");
    console.log("id is " + id);
    console.log("title is " + titleofNote);
    console.log("body is " + body);
    console.log("=-=-=-=-=-=-=-=-=-=-=-=-=-=-=");
    $("#noteSection").hide();
    $("#saveNote").hide();
    $(".saveOrDelete").show();

    $.ajax({
        method: "POST",
        url: "/articles/" + id,
        data: {
            body: body
        }
    });
});