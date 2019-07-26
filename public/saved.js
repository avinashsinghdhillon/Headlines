
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
                <a href="#" class="card-link addNote">Add Note</a>
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