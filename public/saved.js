
postSavedHeadlines()

function postSavedHeadlines() {
  //debugger;
  $.ajax({
    method: "GET",
    url: "/headlines/saved"
  }).done(function (data) {
    $("#headlineList").empty()
    if (data.length === 0) {
      $("#headlineList").append(
        `
        <div class="card w-75">
          <div class="card-body">
            <h5 class="card-title">No Saved Headlines to Display!</h5>
            <p class="card-text">Headlines can be marked as favorite from the main page.</p>
          </div>
        </div>
        `
      )
    } else {
      for (var i = 0; i < data.length; i++) {
        $("#headlineList").append(
          `
            <div id="${data[i]._id}" class="card" style="width: 18rem;">
              <div class="card-body">
                <h5 class="card-title">${data[i].title}</h5>
                <p class="card-text">${data[i].excerpt}</p>
                <a href="#" class="card-link addNote">Notes</a>
                <a data-id="${data[i]._id}" href="#" class="card-link remFav">Remove Favorite</a>
              </div>
            </div
            `
        )
      }
    }
  })
}

$(document).on("click", ".remFav", function(){
  //update the DB
  $.ajax({
    method: "POST",
    url: "/favorite/remove/" + $(this)[0].dataset.id
  })
  //then remove the card
  $(`#${$(this)[0].dataset.id}`).remove();
})


$(document).on("click", ".addNote", function(){
  debugger;
  $("#noteText").attr("data-id", $(this).offsetParent()[0].id);
  //populate and show a modal to allow user to enter/edit note
  $.ajax({
    method: "GET",
    url: "/headline/" + $(this).offsetParent()[0].id,
  }).done(function(data){
    if(data.notes.length > 0){
      debugger;
      $("#modalTitle").text("Saved Notes: " + data.notes.length);
      ///////////////////////populate rows of notes
    }else{
      $("#modalTitle").text("Saved Notes: No saved notes yet")
    }
    $("#noteModal").modal("show");
  })





})

$("#saveNote").on("click", function(){
  debugger;
  $.ajax({
    method: "POST",
    url: "/note/" + $("#noteText").attr("data-id"),
    data: {
      body: $("#noteText").val()
    }
  })
  .then(function(data){
    console.log("Note saved: " + data);
    //////////////////////add the note to the modal and clear input box
  })
})