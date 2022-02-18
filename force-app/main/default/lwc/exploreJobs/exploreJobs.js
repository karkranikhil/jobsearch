import { LightningElement } from "lwc";

export default class ExploreJobs extends LightningElement {
    handleViewMore(event) {
        window.open("/s/job-search", "_self");
    }

    handleCategory2(event) {
        window.open(
            "/s/job-search?title=Bill%20and%20Account%20Collectors",
            "_self"
        );
    }

    handleCategory1(event) {
        window.open("/s/job-search?title=Finance%20Service", "_self");
    }
    handleCategory3(event) {
        window.open(
            "/s/job-search?title=Bookkeeping%2C%20Accounting%2C%20and%20Auditing%20Clerks",
            "_self"
        );
    }

    handleCategory4(event) {
        window.open(
            "/s/job-search?title=Accountants%20and%20Auditors",
            "_self"
        );
    }
    handleCategory5(event) {
        window.open("/s/job-search?title=New%20Accounts%20Clerks", "_self");
    }
    handleCategory6(event) {
        window.open(
            "/s/job-search?title=Media%20Programming%20Directors",
            "_self"
        );
    }
    handleCategory7(event) {
        window.open("/s/job-search?title=Tellers", "_self");
    }
    handleCategory8(event) {
        window.open("/s/job-search?title=Cashiers", "_self");
    }
}