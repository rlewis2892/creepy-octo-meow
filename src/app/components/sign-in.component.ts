import {Component, ViewChild, EventEmitter, Output, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {Observable} from "rxjs/Observable";
import {Status} from "../classes/status";
import {FormBuilder, FormGroup, Validators} from "@angular/forms"

import {SessionService} from "../services/session.service";
import {SignInService} from "../services/sign-in.service";
import {SignIn} from "../classes/sign-in";

@Component({
	templateUrl: "./templates/sign-in.html",
	selector: "sign-in"
})

export class SignInComponent implements OnInit {

	@ViewChild("signInForm") signInForm : FormGroup;

	signin: SignIn = new SignIn(null, null);
	status: Status = null;

	constructor(private sessionService: SessionService, private formBuilder: FormBuilder, private signInService: SignInService, private router: Router) {}

	isSignedIn = false;

	ngOnInit() : void {
		this.signInForm = this.formBuilder.group({
			profileEmail: ["", [Validators.maxLength(64), Validators.required]],
			profilePassword: ["", [Validators.maxLength(255), Validators.required]]
		});
	}

	ngOnChanges() : void {
		this.isSignedIn = this.signInService.isSignedIn;
	}

	signIn() : void {
		this.signInService.postSignIn(this.signin)
			.subscribe(status => {
				this.status = status;
				if(status.status === 200) {
					this.sessionService.setSession();
					this.isSignedIn = true;
					this.signInForm.reset();
					this.signInService.isSignedIn = true;
					this.router.navigate(["posts"]);
				} else {
					console.log("failed login");
				}
			});
	}
}
