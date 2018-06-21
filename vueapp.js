
Vue.config.keyCodes = {
    del: 46,
    up: 38,
    down: 40
};

Vue.config.devtools = true;

Vue.config.performance = true;

var motorcade = new Vue({

    el: '#motorcade',

    data: {

        appName: 'Motorcade',
        showContextMenu: false,
        carData: null,
        toolTypeData: null,
        top: '0px',
        left: '0px',
        editing: false,
        modelSearch: '',
        makeSearch: '',
        yearSearch: '',
        codeSearch: '',
        toolTypeSearch: '',

        id : '',
        make: '',
        model: '',
        year: '',
        toolTypeId: 0,
        manufacturerCode: '',
        isJ2534Compatible: false,

        get vehicleMMY() {
            return this.year + ' ' + this.make + ' ' + this.model;
        },

        get appStatus() {
            return this.isOnline ? "Online" : "Offline";
        }

    },

    methods: {

        submitForm: function (token, event) {
            console.log(token);
            console.log(event);

            if (this.make !== '' && this.model !== '' && typeof this.year === 'number' && this.manufacturerCode !== '') {

                axios({
                    method: 'post',
                    url: 'http://localhost:65308/api/Motorcade',
                    contentType: 'application/json; charset=utf-8',
                    data: {
                        'make': this.make,
                        'model': this.model,
                        'year': this.year,
                        'manufacturerCode': this.manufacturerCode,
                        'description': this.make + " " + this.model + " description",
                        'toolTypeId': this.toolTypeId,
                        'isJ2534Compatible': this.isJ2534Compatible
                    }
                }).then(function (response) {
                    window.location.reload();
                })

            } else {
                console.log("Failure, failure.");
                alert("Please provide a year, make, model, and manufacturer code.")
            }
        },

        submitEditForm: function () {
            
            if (this.make !== '' && this.model !== '' && typeof this.year === 'number' && this.manufacturerCode !== '') {
                axios({
                    method: 'put',
                    url: 'http://localhost:65308/api/Motorcade/' + this.id,
                    contentType: 'application/json; charset=utf-8',
                    data: {
                        'id' : this.id,
                        'make': this.make,
                        'model': this.model,
                        'year': this.year,
                        'manufacturerCode': this.manufacturerCode,
                        'description': this.make + " " + this.model + " description",
                        'toolTypeId': this.toolTypeId,
                        'isJ2534Compatible': this.isJ2534Compatible
                    }
                }).then(function (response) {
                    window.location.reload();
                })

            } else {
                console.log("Failure, failure.");
                alert("Please provide a year, make, model, and manufacturer code.")
            }
        },

        submitDeleteForm: function () {

            if (this.make !== '' && this.model !== '' && typeof this.year === 'number' && this.manufacturerCode !== '') {

                var dec = confirm("Are you sure you want to delete this entry?");

                if(dec == false) {
                    return;
                }

                axios({
                    method: 'delete',
                    url: 'http://localhost:65308/api/Motorcade/' + this.id,
                    contentType: 'application/json; charset=utf-8'
                }).then(function (response) {
                    window.location.reload();
                })

            } else {
                console.log("Failure, failure.");
                alert("Please provide a year, make, model, and manufacturer code.")
            }
        },

        editEntry: function(id) {

            $('html').stop().animate({
                scrollTop: 0
              }, 'slow', 'swing');

            this.editing = true;
            this.id = id;

            var car = this.carData.find(function (obj) { return obj.id === id; });

            this.make = car.vehicleMMMY.make;
            this.model = car.vehicleMMMY.model;
            this.year = car.vehicleMMMY.year;
            this.manufacturerCode = car.manufacturerCode;
            this.isJ2534Compatible = car.isJ2534Compatible;
            this.toolTypeId = car.toolType.id;

        },

        contextMenu: function (e) {
            this.showContextMenu = true;
            this.top = e.y + 'px';
            this.left = e.x + 'px';
        },

        closeContextMenu: function () {
            this.showContextMenu = false;
        },

        clearForm: function () {
            this.make = "";
            this.model = "";
            this.year = "";
            this.editing = false;
            this.manufacturerCode = "";
            this.toolTypeId = "0"
            this.isJ2534Compatible = false;
        },

        clearSearch: function() {
            this.modelSearch = '';
            this.makeSearch = '';
            this.codeSearch = '';
            this.toolTypeSearch = '';
            this.yearSearch = '';
        }
    },

    mounted() {
        axios
            .get('http://localhost:65308/api/Motorcade')
            .then(response => (this.carData = response.data)),

            axios
                .get('http://localhost:65308/api/ToolType')
                .then(response => (this.toolTypeData = response.data))

    }
});

