import { surveyID as surveyID, jsonURL as jsonURL} from './private.js';



// JAVASCRIPT VARIABLES
let facilities, filtered_facilities;
let filtered = false;



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


const clear_data = async () => {
    list_div.innerHTML = '';
    return;
};


// DATA PROCESSING
const filter_data = (data, input) => {
    const d = data.filter(d => {
        return new RegExp('^' + input.replace(/\*/g, '.*') + '$').test(d.properties.requesting_facility)
        // return d.features.properties.vehicle_number == `${input}*`
    });
    filtered_facilities = d;
    filtered = true;
    return d
};


const get_survey_data = async () => {
    console.log('fetch');
    const response = await fetch(survey123Url);
    console.log(response);

    const json = await response.json();
    console.log(json);

    let data = json.features;
    console.log('get_survey_data', data);
    facilities = data;
    return data;
}


const render = async (d) => {
    // DATA
    list_div.innerHTML = "<p class='i'>Data is loading...</p>";
    const response = await fetch(survey123Url);
    const json = await response.json();
    const data = json.features;

    const sorted_data = d.sort(function (a, b) {
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

const searching = async (value) => {
    filtered = true;

    list_div.innerHTML = 'Data is loading...';
    clear_data();
    let fv = filter_data(facilities, `${value}*`);
    console.log(fv);
    render(await fv);
    return;
};


const clickEvent = (event) => {
    event.preventDefault();
    const iframe_exists = document.getElementById('iframe');
    const iframe = event.target.closest('#iframe');
    const search = event.target.closest('#search');
    const search_bar = document.getElementById('search-bar').value;

    if(!iframe && iframe_exists){
        console.log('iframe present')
        iframe.parentNode.removeChild(iframe);
        return;

    
    // SEARCH CLICK!!!
    }else if(search){
        console.log('search')
        if(search_bar != ''){
            console.log('search 1', search_bar)
            searching(search_bar);
        }else if(search_bar == '' && filtered){
            console.log('search 2')
            render(vehicles)
            return;
        }
    // CLICK LIST ELEMENT AND OPEN IFRAME!!!
    }else if(!event.target.closest('.openpop')){
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

        // to place before another page element
        var el = document.getElementById('marker');
        main.parentNode.insertBefore(ifrm, el);

    }
}


get_survey_data().then(data =>{
    render(facilities);
});
window.addEventListener("click", clickEvent, false)