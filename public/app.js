$(document).on("click", "#scrape", function() {
    // alert("10 articles added");
    location.href = "/scrape";
    // $.getJSON("/articles", function(data) {
    //     console.log(data);  
    // });
    
});



$(document).on("click", "#save", function() {
    var thisId = $(this).attr("data-id");
    console.log("=================");
    console.log(thisId);
    console.log("=================");

    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
            savedNews: true            
        },

        function(data) {
        console.log(data);  
        }
    });
    // alert("Saved");
})

// $(document).on("click", "#deleteFromSaved", function() {
//     var thisId = $(this).attr("data-id");

//     $.ajax({
//         url: '/articles/' + thisId,
//         type: 'DELETE',
//         // success: function(result) {
//         // // Do something with the result
//         // }
//     });
// });



$(document).on("click", "#addNote", function() {
    alert("Add a Note (TBD)");
});