//add functions to create the list of headlines and add use comments

//grab all headlines
$.getJSON("/headlines", function(data){
  if(data.length === 0){

  }else{
    for (var i = 0; i < data.length; i++) {
      $("#headlineList").append(
        `
        <div class="card" style="width: 18rem;">
          <div class="card-body">
            <h5 class="card-title">${data[i].title}</h5>
            <p data-id="${data[i]._id}" class="card-text">${data[i].excerpt}</p>
            <a href="${data[i].url}" class="card-link">Go to Details</a>
            <a id="saveFav" href="#" class="card-link">Save as Favorite</a>
          </div>
        </div
        `
      )
      //$("#headlineList").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].url + "</p>");
    }
  }
})