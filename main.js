const url = 'https://images-api.nasa.gov/search?q=';
const inputField = document.querySelector('#inquiry');
const dateField = document.querySelector('#yearStart');
const button = document.getElementById('submit');
var currentYear=new Date().getFullYear();
// Dynamically populates select elements with valid years
for (var i = 1940; i<=currentYear; i++){
  var opt = document.createElement('option');
  opt.value = i;
  opt.innerHTML = i;
  dateField.appendChild(opt);
}
let results = [];
let rows = [];
let table = document.querySelector('table');
button.addEventListener("click", search);
function search() {
  const query = inputField.value;
  const yearStart = dateField.options[dateField.selectedIndex].text;
  const endpoint = url + query + '&media_type=image&year_start='+yearStart;

  const xhr = new XMLHttpRequest();
  xhr.responseType = 'json';
  xhr.onreadystatechange=()=>{
    if(xhr.readyState === XMLHttpRequest.DONE){
      results = xhr.response.collection.items;
      rows = [];
      for (var i = 0; i < results.length; i++) {
        if(results[i].links){
          // Child elements for the row
          let newRow = document.createElement("tr");
          let imageCell = document.createElement("td");
          let textCell = document.createElement("td");
          let imageLink = document.createElement("a");
          let newImage = document.createElement("img");

          imageLink.href = results[i].links[0]['href'];
          newImage.src = results[i].links[0]['href'];
          newImage.width = 300;
          // newImage.height = 168;
          // Title of image
          title = results[i].data[0].title;
          // Description of image
          desc = results[i].data[0].description;
          // Date media was created
          date = 'Created on: '+results[i].data[0].date_created;
          // Nasa center that published the media
          center = 'Published by: '+results[i].data[0].center;
          // Description will not be presented if undefined or same as title
          if(!desc || desc === title){
            desc = '';
          }
          textCell.innerHTML = title + '<br>'+ desc + '<br>' + date + "<br>"
          + center;
          imageLink.appendChild(newImage);
          imageCell.appendChild(imageLink);
          newRow.appendChild(imageCell);
          newRow.appendChild(textCell);
          rows.push(newRow);
        }
      }
      // Show the first 10 images of the search
      showNext(0, 10);

    }
  }
  xhr.open('GET', endpoint);
  xhr.send();
}
function showNext(start, end){
  table.innerHTML = '';
  for (var i = start; i < end && i < rows.length; i++) {
    table.appendChild(rows[i]);
  }
}
