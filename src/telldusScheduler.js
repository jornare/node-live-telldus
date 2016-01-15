'use strict';
let constants = require('./constants.js'),
    TelldusJob = require('./telldusJob.js');

class TelldusScheduler {
  constructor(telldus, data) {
    data = data || {};
    this.telldus = telldus;
    this.jobs = [];
  }
  
  getJobs() {
    return this.invoke('GET', '/scheduler/jobList').then( result =>
        {
          this.jobs = []; //todo: update jobs, not replace
          result.job.forEach(j => {
            let job = new TelldusJob(this, j);
            this.jobs.push(job);
          });
          return this.jobs;
        }
      );
  }
  
  removeJob(job) {
    return this.invoke('GET', '/scheduler/removeJob?id=' + job.id).then( result =>
        {
          this.jobs.splice(this.jobs.indexOf(job), 1);
        }
      );
  }
}

module.exports = TelldusScheduler;