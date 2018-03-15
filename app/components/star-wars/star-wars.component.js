'use strict';
//The controller initiated as a class
class StarWarsCtrl {
  constructor($http, $filter) {
    this.hello = 'Hello world';
    this.age = 27;
    this.$http = $http;
    this.$filter = $filter;
    this.results = [];
    this.years = [];
    this.ageResult = '';
  }
  //This method is to target the birth_year and alter the data so that
  //it could be sorted
  sortBirth() {
    this.years = this.results
      // .map(item => {
      //   return item.birth_year;
      // })
      .filter(item => {
        return item.birth_year != 'unknown';
      });
    this.years.forEach(
      item => (item.birth_year = item.birth_year.slice(0, -3))
    );

    this.years = this.years.sort((a, b) => {
      return a.birth_year - b.birth_year;
    });

    console.log(this.years);
  }

  //This method gathers the birth_year data and helps carry out the expression.
  ageInfo() {
    this.ageResult = `${this.years[0].name} is the youngest and the oldest is ${
      this.years[this.years.length - 1].name
    }
      the difference in age is ${this.years[this.years.length - 1].birth_year -
        this.years[0].birth_year}
    `;
  }

  //This method calls the recursiveGet function which will keep calling itself until
  //all the data has been collected from the api get call (repeated get calls targeting the next obj
  //which links to a url of the next page).
  getInfo() {
    // this.$http.get("https://swapi.co/api/people?callback=foo").then(function(response) {
    //         console.log(response.data)
    //   });

    this.recursiveGet('https://swapi.co/api/people?callback=foo');
    // console.log('Final results: ', this.results);
  }

  //The recursive function that is called repeatedly.
  recursiveGet(url) {
    this.$http.get(url).then(response => {
      //I used the spread operator to fill results with its content + response.data.results
      this.results = [...this.results, ...response.data.results];

      //if response.data.next is tru then the function will call itself again untill all pages
      //have been collected (data).
      response.data.next
        ? this.recursiveGet(response.data.next)
        : console.log(this.results);
      // : console.log(this.$filter('orderBy')(this.results, 'birth_year'));
    });
  }
  // getInfo() {
  //   new Promise((resolve, reject) =>
  //     this.recursiveGet('https://swapi.co/api/people?callback=foo', resolve)
  //   ).then(() => console.log('Final results: ', this.results));
  //
  //   // this.$http.get("https://swapi.co/api/people?callback=foo").then(function(response) {
  //   //         console.log(response.data)
  //   //   });
  // }
  //
  // recursiveGet(url, resolve) {
  //   this.$http.get(url).then(response => {
  //     this.results = [...this.results, ...response.data.results];
  //     response.data.next
  //       ? this.recursiveGet(response.data.next, resolve)
  //       : resolve();
  //     // : console.log(this.$filter('orderBy')(this.results, 'birth_year'));
  //   });
  // }
}

//This is how services are injected into a controller.
StarWarsCtrl.$inject = ['$http', '$filter'];
angular.module('starWars').component('starWars', {
  //The template (partial)
  templateUrl: 'components/star-wars/star-wars.template.html',
  //Controller name, by default you refer to the controller with $ctrl
  controller: StarWarsCtrl
});
