import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import { contentHeaders } from 'app/components/shared/common';

@Component({
  selector: 'signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class Signup {
  constructor(public router: Router, public http: Http) {
  }

  public signup(event, username, password) {
    event.preventDefault();
    let body = JSON.stringify({ username, password });
    this.http.post('http://localhost:3001/users', body, { headers: contentHeaders })
      .subscribe(
        response => {
          this.router.navigate(['/bibliothek']);
        },
        error => {
          alert(error.text());
          console.log(error.text());
        }
      );
  }

  public login(event) {
    event.preventDefault();
    this.router.navigate(['/logon']);
  }

}
