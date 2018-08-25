    let map;
    let markers = [];
    const clientId = 'HVYM5INDSDJGNJTSB5I3P14ZZBSH50OBL41WYDBI10X01OAZ';
    const clientSecret = 'SKMI4YSVPD52ZMX3FYVVSUW0UV0HJORVYU5TGMQY4S4KD3WF';

    // Init map 
    function createMap(restureants) {
        // Initialize the Map
        map = L.map('map').setView([30.4681921,  31.1787057], 14);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
    }

    // Move to marker on click 
    function moveToResturant (event){
        const selectedResturant = Restaurants.find(function(resturant){
            return resturant.lat == event.latlng.lat && resturant.lng == event.latlng.lng;
        });
        moveToExistMarker(selectedResturant);
    }
    // Add markers to map
    function addMarkersToMap(res) {
        if(!(`${res.lat},${res.lng}` in markers))
            markers[`${res.lat},${res.lng}`] = L.marker([res.lat , res.lng]).on('click', moveToResturant).addTo(map);
    }

    // Remove markers from map
    function removeMarkerFromMap(res) {
        if(`${res.lat},${res.lng}` in markers){
            map.removeLayer(markers[`${res.lat},${res.lng}`]);
            delete markers[`${res.lat},${res.lng}`];
        }
    }
    // Move to marker and get marker data from foursquare api 
    function moveToExistMarker(res) {
        const url = `https://api.foursquare.com/v2/venues/explore?client_id=${clientId}&client_secret=${clientSecret}&v=20180323&limit=1&ll=${res.lat},${res.lng}&query=${res.title}`;
        $.ajax({
        type: "GET",
        dataType: "jsonp",
        cache: false,
        url: url,
        success: function(data){
            const response = data.response.groups[0].items[0].venue;
            const formattedAddress = response.location.formattedAddress;
            const name = response.name;
            let fullAddress = '';
            if(formattedAddress){
                    formattedAddress.forEach(function(address) {
                        fullAddress += address + ', ';
                    });
            }
            const html = `
            <strong>Name : </strong> <p>${name}</p>
            <strong>Full Address : </strong> <p>${fullAddress}</p>
            `;
            L.popup({ closeButton: false }).
            setLatLng({lat: res.lat , lng:res.lng}).
            setContent(html).
            openOn(map);
        },
        error: function(){
            alert('Something went wrong');
        }});
        map.setView({lat: res.lat , lng: res.lng});
        markers[`${res.lat},${res.lng}`].bounce(2); 
    }

    // Knockout.js 

    const ResturantModel = function () {
    createMap();
    // addMarkersToMap(Restaurants);
    const self = this;
    this.query = ko.observable('');
    this.allResturants = ko.observableArray(Restaurants);

    // Filter resturants 
    this.filterResturants = ko.computed(function() { 
        const q = self.query().toLowerCase();
        return ko.utils.arrayFilter(self.allResturants(), function (res) {
            const isInFilteredList = res.title.toLowerCase().indexOf(q) >= 0;
            if(isInFilteredList){
                addMarkersToMap(res);
            } else{
                removeMarkerFromMap(res);
            }
            return isInFilteredList;
        });
    });
    // Move to marker on click to nav list 
    this.viewResturant = function (event) {
        moveToExistMarker(event);
    };
};

ko.applyBindings(new ResturantModel());
