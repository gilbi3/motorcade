Vue.config.devtools = true;

Vue.config.performance = true;

var motorcade = new Vue({
  el: "#motorcade",

  data: {
    // App states
    appName: "Cover",
    showContextMenu: false,
    carData: null,
    toolTypeData: null,
    top: "0px",
    left: "0px",
    editing: false,
    dataView: false,
    noMatchesFound: false,
    // Data transfer fields
    id: "",
    make: "",
    model: "",
    year: "",
    toolTypeId: 0,
    manufacturerCode: "",
    engineType: "",
    collisionCoverage: 0,
    mechanicalCoverage: 0,
    calibrationCoverage: 0,
    isJ2534Compatible: false,

    get vehicleMMY() {
      return this.year + " " + this.make + " " + this.model + " " + this.engineType;
    }
  },

  methods: {
    submitForm: function () {

      if (!this.noMatchesFound) {
        alert("Matching records found.");
        this.dataView = true;
        return;
      }

      if (
        this.make !== "" &&
        this.model !== "" &&
        this.year !== ""
      ) {
        axios({
          method: "post",
          url: "http://localhost:65308/api/Motorcade",
          contentType: "application/json; charset=utf-8",
          data: {
            make: this.make,
            model: this.model,
            year: this.year,
            manufacturerCode: this.manufacturerCode,
            engineType: this.engineType,
            description: this.make + " " + this.model + " " + this.engineType,
            toolTypeId: this.toolTypeId == 0 ? 4 : this.toolTypeId,
            scanType: this.scanType,
            collisionCoverage:
              this.collisionCoverage == 0 ? 4 : this.collisionCoverage,
            mechanicalCoverage:
              this.mechanicalCoverage == 0 ? 4 : this.mechanicalCoverage,
            calibrationCoverage:
              this.calibrationCoverage == 0 ? 4 : this.calibrationCoverage,
            isJ2534Compatible: this.isJ2534Compatible
          }
        }).then(function (response) {
          alert("Saved!");
          window.location.reload();
        });
      } else {
        console.log("Failure, failure.");
        alert("Please provide a year, make, and model.");
      }
    },

    submitEditForm: function () {
      if (
        this.make !== "" &&
        this.model !== "" &&
        typeof this.year === "number" &&
        this.manufacturerCode !== ""
      ) {
        axios({
          method: "put",
          url: "http://localhost:65308/api/Motorcade/" + this.id,
          contentType: "application/json; charset=utf-8",
          data: {
            id: this.id,
            make: this.make,
            model: this.model,
            year: this.year,
            manufacturerCode: this.manufacturerCode,
            engineType: this.engineType,
            description: this.make + " " + this.model + " " + this.engineType,
            toolTypeId: this.toolTypeId,
            scanType: this.scanType,
            collisionCoverage: this.collisionCoverage,
            mechanicalCoverage: this.mechanicalCoverage,
            calibrationCoverage: this.calibrationCoverage,
            isJ2534Compatible: this.isJ2534Compatible
          }
        }).then(function (response) {
          window.location.reload();
        });
      } else {
        console.log("Failure, failure.");
        alert("Please provide a year, make, model, and manufacturer code.");
      }
    },

    submitDeleteForm: function () {
     
        var dec = confirm("Are you sure you want to delete this entry?");

        if (dec == false) {
          return;
        }

        axios({
          method: "delete",
          url: "http://localhost:65308/api/Motorcade/" + this.id,
          contentType: "application/json; charset=utf-8"
        }).then(function (response) {
          window.location.reload();
        }); 
    },

    checkMatches: function() {

      var list = $('tr#searchResults');
      for(var i = 0; i < list.length; i++) {
        var item = $(list[i]);
        if(item.css('display') !== 'none') {
          this.noMatchesFound = false;
          return;
        }
      }
      this.noMatchesFound = true;
    },

    editEntry: function (id) {
      $("html").stop().animate({ scrollTop: 0 }, "slow", "swing");

      this.editing = true;
      this.id = id;
      this.viewForm();

      var car = this.carData.find(function (obj) {
        return obj.vehicleAttr.id === id;
      });

      console.log(car);

      this.make = car.vehicleAttr.vehicleMMY.make;
      this.model = car.vehicleAttr.vehicleMMY.model;
      this.year = car.vehicleAttr.vehicleMMY.year;
      this.engineType = car.vehicleAttr.engineType;
      this.manufacturerCode = car.vehicleAttr.manufacturerCode;
      this.isJ2534Compatible = car.vehicleAttr.isJ2534Compatible;
      this.collisionCoverage = car.collisionCoverage.status;
      this.mechanicalCoverage = car.mechanicalCoverage.status;
      this.calibrationCoverage = car.calibrationCoverage.status;
      this.toolTypeId = car.vehicleAttr.toolType.id;
    },

    contextMenu: function (e) {
      this.showContextMenu = true;
      this.top = e.y + "px";
      this.left = e.x + "px";
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
      this.toolTypeId = "0";
      this.engineType = "";
      this.collisionCoverage = 0;
      this.mechanicalCoverage = 0;
      this.calibrationCoverage = 0;
      this.isJ2534Compatible = false;
      $('#noMatchesFoundh3').css('display', 'none');
    },

    viewForm: function () {
      this.dataView = false;
      this.clearForm();
    },

    viewFormWithFields: function() {
      this.dataView = false;
    },

    viewData: function () {
      this.dataView = true;
      this.clearForm();
    }
  },

  mounted() {

    axios
      .get("http://localhost:65308/api/Motorcade")
      .then(response => (this.carData = response.data));

    axios
      .get("http://localhost:65308/api/ToolType")
      .then(response => (this.toolTypeData = response.data));
  }
});
