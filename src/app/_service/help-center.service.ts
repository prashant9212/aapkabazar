import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class HelpCenterService {

  constructor(private http: HttpClient) { }

  raiseComplain(issueDetails:any) {
    return this.http.post(environment.apiUrl + 'report/issue', issueDetails);
  }

  raiseOtherIssue(issueDetails:any) {
    return this.http.post(environment.apiUrl + 'other/issue', issueDetails)
  }

  getInfoPage(id:any) {
    return this.http.get(environment.apiUrl + 'infopage/'+id)
  }

}
