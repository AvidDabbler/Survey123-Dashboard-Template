import { surveyID as surveyID, jsonURL as jsonURL} from './private.js';

//STATIC URLS
const survey123Url = jsonURL();

//HTML SECTION SELECTORS
const list_div = document.getElementById('list');
const item = document.querySelector('button_popup');
const main = document.querySelector('#main');

//POLYFILLS
if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}if (!Element.prototype.closest) {
    Element.prototype.closest = function(s) {
      var el = this;
      do {
        if (el.matches(s)) return el;
        el = el.parentElement || el.parentNode;
      } while (el !== null && el.nodeType === 1);
      return null;
}};

const render = async () => {
    // DATA
    list_div.innerHTML = "<p class='i'>Data is loading...</p>";
    const response = await fetch(survey123Url);
    const json = await response.json();
    const data = json.features;

    const sorted_data = data.sort(function (a, b) {
        if (a.properties.new_requesting_facility <b.properties.new_requesting_facility) {
            return -1;
        }
        if (b.properties.new_requesting_facility <a.properties.new_requesting_facility) {
            return 1;
        }
        return 0;
    });

    list_div.innerHTML = '';
    sorted_data.forEach(element => {
        // FIELDS
        const new_requesting_facility = element.properties.new_requesting_facility;
        const requesting_facility = element.properties.requesting_facility;
        const surveyI = surveyID();

        // IMPORT SURVEY123 URL PARAMETERS FUNCTION
        const confirmationURL  = `https://survey123.arcgis.com/share/${surveyI}?field:requesting_facility=${new_requesting_facility}`

        list_div.innerHTML += 
            `<div id='${new_requesting_facility}' class='button_popup fl w-100 '> 
                <a class='openpop center fl w-100 link dim br2 ph3 pv2 mb2 dib white bg-blue' data-url="${confirmationURL}">
                    <h2 class='f3 helvetica fl w-100'>${new_requesting_facility}</h2>
                </a>
            </div>`
    
    });

};


const clickEvent = (event) => {
    event.preventDefault();
    const iframe = document.getElementById('ifrm');


    if(!event.target.closest('#iframe') && iframe){
        console.log('iframe present')
        iframe.parentNode.removeChild(iframe);
        return
    }else if(!event.target.closest('.openpop') && !iframe){
        console.log('Not list_div');
        return;
    }else{        
        console.log('list element click')

        let item = event.target.closest('.openpop');
        let url = item.getAttribute('data-url');
        console.log(`url: ${url}`)

        var ifrm = document.createElement('iframe');
        ifrm.setAttribute('id', 'ifrm'); // assign an id
        ifrm.setAttribute(`src`, url);

        //document.body.appendChild(ifrm); // to place at end of document

        // // to place before another page element
        var el = document.getElementById('marker');
        main.parentNode.insertBefore(ifrm, el);

        // // assign url
        // ifrm.setAttribute('src', 'demo.html');

    }
}


render();
window.addEventListener("click", clickEvent, false)