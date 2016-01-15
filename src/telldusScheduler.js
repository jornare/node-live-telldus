'use strict';
let constants = require('./constants.js'),
    TelldusJob = require('./telldusJob.js'),
    telldus = require('./telldusLive.js').getInstance();

class TelldusScheduler {
  constructor(data) {
    data = data || {};
    this.jobs = [];
  }
  
  getJobs() {
    return telldus.invoke('GET', '/scheduler/jobList').then( result =>
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
    return telldus.invoke('GET', '/scheduler/removeJob?id=' + job.id).then( result =>
        {
          this.jobs.splice(this.jobs.indexOf(job), 1);
        }
      );
  }
}

module.exports = TelldusScheduler;