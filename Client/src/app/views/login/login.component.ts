import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/app/services';
import { first } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error = '';
  tip = '';
  userNotFoundError = '';
  invalidPasswordError = '';
  userNotFoundErrorTip = '';
  invalidPasswordErrorTip = '';

  constructor(
      private formBuilder: FormBuilder,
      private route: ActivatedRoute,
      private router: Router,
      private authenticationService: AuthenticationService,
      public translate: TranslateService
  ) { 
      // redirect to home if already logged in
      if (this.authenticationService.currentUserValue) { 
          this.router.navigate(['/']);
      }
  }

  ngOnInit() {
      this.loginForm = this.formBuilder.group({
          username: ['', Validators.required],
          password: ['', Validators.required]
      });
      //get translations
      this.translate.get('loginDialogs.userNotFound').subscribe(res => {
        this.userNotFoundError  = res;
      });
      this.translate.get('loginDialogs.userNotFoundTip').subscribe(res => {
        this.userNotFoundErrorTip  = res;
      });
      this.translate.get('loginDialogs.invalidPassword').subscribe(res => {
        this.invalidPasswordError  = res;
      });
      this.translate.get('loginDialogs.invalidPasswordTip').subscribe(res => {
        this.invalidPasswordErrorTip  = res;
      });

      // get return url from route parameters or default to '/'
      this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  onSubmit() {
      this.submitted = true;

      // stop here if form is invalid
      if (this.loginForm.invalid) {
          return;
      }

      this.loading = true;
      this.authenticationService.login(this.f.username.value, this.f.password.value)
          .pipe(first())
          .subscribe(
              data => {
                  if(data.ok){
                    this.router.navigate([this.returnUrl]);
                  }
                  else{
                    if(data.err.message === "Username Not found."){
                        this.f.password.setValue("");
                        this.error = this.userNotFoundError;
                        this.tip = this.userNotFoundErrorTip
                    }
                    else if(data.err.message === "Invalid Password!"){
                        this.f.password.setValue("");
                        this.error = this.invalidPasswordError;
                        this.tip = this.invalidPasswordErrorTip
                    }
                  }
              },
              error => {
                  this.error = error;
                  this.loading = false;
              });
  }

}
