chrome.runtime.onMessage.addListener(
  async function(request, sender, sendResponse) {
    if (request.message === "executeScriptOnUserPage") {
      applySmoothScroll();
      const times = 2; //To times to ensure that it loads all
      for(const i = 0; i < times; i++) {
        await executeScriptOnUserPage();
      }
    }
  }
);


async function executeScriptOnUserPage() {
  await loadJobsInThePage();
  const jobsOportunitiesContainer = document.querySelector("ul.scaffold-layout__list-container");

  const jobs = jobsOportunitiesContainer.querySelectorAll("li.jobs-search-results__list-item .job-card-list");
  await validateJobs(jobs)
}


async function loadJobsInThePage() {
  const container = document.querySelector(".jobs-search-results-list");
  container.scrollTo({ top: 0, behavior: "smooth" });

  await sleep(2000);
  container.scrollTo({ top: 100000, behavior: "smooth" });

  await sleep(3000);
  container.scrollTo({ top: 0, behavior: "smooth" });

  await sleep(3000);
}


async function validateJobs(jobs) {  
  for(const job of jobs) {
    job.click(); //Will open the job
    await sleep(500);

    saveJobIfItIsAnOportunity();
    scrollToTheNextJob(job);
  }
}


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


function scrollToTheNextJob(job) {
  const container = document.querySelector(".jobs-search-results-list");
  const pixelsToScroll = job.offsetHeight;

  container.scrollBy({
    top: pixelsToScroll,
    behavior: "smooth"
  });
}


function saveJobIfItIsAnOportunity() {
  try {
    const job = document.querySelector("div.jobs-search__job-details--wrapper");
    if(jobDoesntAcceptYourLocation(job)) return;

    if(mustHaveDegree(job)) return;
    saveJob();
  }
  catch(err) {
    console.log(err);
    return;
  }
}


function jobDoesntAcceptYourLocation(job) {
  const notAcceptLocationTitleFound = document.querySelector("div.jobs-search__job-details--wrapper .job-details-module__content h2");
  return notAcceptLocationTitleFound !== null;
}


function mustHaveDegree(job) {
  const jobData = job.querySelector(".job-details-module__content");
  if(!jobData) return false;

  const jobText = jobData.textContent.toLocaleLowerCase()
  const mustHaveDegree = jobText.includes("degree");
  
  const mustHaveBachelor = jobText.includes("bachelor")
  return mustHaveDegree || mustHaveBachelor;
}


function saveJob() {
  const saveButton = document.querySelector(".jobs-details__main-content .job-details-jobs-unified-top-card__container--two-pane .jobs-save-button.artdeco-button--secondary");
  if(!saveButton) return;
  
  const buttonText = document.querySelector(".jobs-details__main-content .job-details-jobs-unified-top-card__container--two-pane .jobs-save-button.artdeco-button--secondary > span:first-child");
  const canItSaveTheOportunity = buttonText.textContent.toLowerCase().includes("salvar");
  
  if(canItSaveTheOportunity) saveButton.click();
}


function applySmoothScroll() {
  const style = document.createElement("style");
  
  style.textContent = "* { scroll-behavior: smooth !important; }";
  
  document.head.appendChild(style);
}