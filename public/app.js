//add functions to create the list of headlines and add use comments

//grab all headlines if available when you load the page
postHeadlines();

//Grab fresh headlines when button is clicked
$("#butRefresh").click(function(){
  $.ajax({
    method: "GET",
    url: "/scrape"
  }).done(function(data){
    // window.location.reload(true);
    postHeadlines();
  });
})

$(document).on("click", ".saveFav", function(){
  $.ajax({
    method: "POST",
    url: "/favorite/" + $(this)[0].dataset.id
  })
})

function postHeadlines(){
  //debugger;
  $.ajax({
    method: "GET",
    url: "/headlines"
  }).done(function(data){
    console.log("Data: "+ data);
    $("#headlineList").empty()
    if(data.length === 0){
      $("#headlineList").append(
      `
      <div class="card w-75">
        <div class="card-body">
          <h5 class="card-title">No Articles to Display!</h5>
          <p class="card-text">Click the Refresh Headlines button above to load new headlines.</p>
        </div>
      </div>
      `
      )
    }else{
      for (var i = 0; i < data.length; i++) {
        $("#headlineList").append(
          `
          <div class="card" style="width: 18rem;">
            <div class="card-body">
              <h5 class="card-title">${data[i].title}</h5>
              <p class="card-text">${data[i].excerpt}</p>
              <a target="_blank" href="${data[i].url}" class="card-link">Go to Details</a>
              <a data-id="${data[i]._id}" href="#" class="card-link saveFav">Save as Favorite</a>
            </div>
          </div
          `
        )
      }
    }
  })
}