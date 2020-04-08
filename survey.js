// const survey = () => {
    const searching = async (value, bool) => {
        bool = true
        list_div.innerHTML = 'Data is loading...';
        clear_div(list_div);
        let fv = filter_data(facilities, `${value}*`);
        render(await fv);
        return;
    };

    const facility_render = async (d, div, surveyI) => {
        // DATA
        div.innerHTML = "<p class='i'>Data is loading...</p>";

        const sorted_data = d.sort(function (a, b) {
            if (a.properties.new_requesting_facility <b.properties.new_requesting_facility) {
                return -1;
            }
            if (b.properties.new_requesting_facility <a.properties.new_requesting_facility) {
                return 1;
            }
            return 0;
        });

        div.innerHTML = '';
        sorted_data.forEach(element => {
            // FIELDS
            const new_requesting_facility = element.properties.new_requesting_facility;
            const requesting_facility = element.properties.requesting_facility;

            // IMPORT SURVEY123 URL PARAMETERS FUNCTION
            const confirmationURL  = `https://survey123.arcgis.com/share/${surveyI}?field:requesting_facility=${new_requesting_facility}`

            div.innerHTML += 
                `<div id='${new_requesting_facility}' class='button_popup fl w-100 '> 
                    <a class='openpop center fl w-100 link dim br2 ph3 pv2 mb2 dib white bg-blue' data-url="${confirmationURL}">
                        <h2 class='f3 helvetica fl w-100'>${new_requesting_facility}</h2>
                    </a>
                </div>`
        
        });
    };


    const get_survey_data = async (url, facilities) => {
        const response = await fetch(url);
        const json = await response.json();

        let data = json.features;
        facilities = data;
        return data;
    };

    const filter_data = (data, input) => {
        const d = data.filter(d => {
            return new RegExp('^' + input.replace(/\*/g, '.*') + '$').test(d.properties.requesting_facility)
        });
        filtered_facilities = d;
        filtered = true;
        return d
    };
    

//     return {
//         searching: searching, 
//         facility_render: facility_render,
//         get_survey_data: get_survey_data,
//         filter_data: filter_data,
//     };
// };

export { searching, facility_render, get_survey_data, filter_data }