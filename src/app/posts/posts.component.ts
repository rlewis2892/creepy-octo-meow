import {Component, OnInit} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {switchMap, mergeMap} from "rxjs/operators";
import {forkJoin} from "rxjs/observable/forkJoin";

//import classes
import {Status} from "../shared/classes/status";
import {Post} from "../shared/classes/post";

//import services
import {AuthService} from "../shared/services/auth-service";
import {PostService} from "../shared/services/post.service";
import {ProfileService} from "../shared/services/profile.service";
import {Profile} from "../shared/classes/profile";
import {Observable} from "rxjs/Observable";

//enable jquery $ alias
declare const $: any;

@Component({
	template: require("./posts.html")
})

export class PostsComponent implements OnInit {

	createPostForm: FormGroup;
	posts: Post[] = [];
	status: Status = null;
	id: any = null;

	profile$: Observable<Profile>;
	//posts$: Observable<Post>;

	//postUsernames: string = [];
	//getPostUsername$: Observable<Profile[]>;

	//profile: Profile = new Profile(null,null,null,null,null,null);
	//profiles: Profile[] = [];

	constructor(
		private formBuilder: FormBuilder,
		private authService: AuthService,
		private postService: PostService,
		private profileService: ProfileService
	){}

	ngOnInit() : void {
		//this.postService.getAllPosts().switchMap((id: string) => this.getPostProfileUsername(id));

		this.listPosts();
		//this.listProfiles();
		//this.getPostProfileUsernames(this.posts);

		this.createPostForm = this.formBuilder.group({
			postTitle: ["", [Validators.maxLength(64), Validators.required]],
			postContent: ["", [Validators.maxLength(2000), Validators.required]]
		});
		//this.applyFormChanges();
	}

	listPosts() : any {
		//this.postService.getAllPosts().subscribe(posts => this.posts = posts);
		//////////////////////////////////////////////////////////////////////////

		let getPosts$ = this.postService.getAllPosts()
			.subscribe(posts => this.posts = posts);


		//const results = getPosts$.switchMap(posts => {
		// console.log(posts);
		//	return
		// });

		// return this.postService.getAllPosts()
		// 	.switchMap(posts =>
		// 		this.profileService.getProfile(post.postProfileId),
		// 		(post, username) => [post, username]);
	}

	getPostProfileUsername(id: string) : any {
		return this.profileService.getProfile(id);
	}

	/*applyFormChanges() : void {
		this.createPostForm.valueChanges.subscribe(values => {
			for(let field in values) {
				this.post[field] = values[field];
			}
		});
	}*/

	getJwtProfileId() : any {
		if(this.authService.decodeJwt()) {
			return this.authService.decodeJwt().auth.profileId;
		} else {
			return false
		}
	}

	createPost() : any {

		//if no JWT profileId, return false (if u not logged in, u can't post!)
		if(!this.getJwtProfileId()) {
			return false
		}

		//grab profileId off of JWT
		let newPostProfileId = this.getJwtProfileId();

		//create new post
		let post = new Post(null, newPostProfileId, this.createPostForm.value.postContent, null, this.createPostForm.value.postTitle);

		this.postService.createPost(post)
			.subscribe(status => {
				this.status = status;
				if(status.status === 200) {
					this.createPostForm.reset();
					this.listPosts();
				}else{
					console.log('Not logged in!');
				}
			});
	}

	// this causes an infinite loop of calls
	// {{ getPostProfileUsername(post.postProfileId) }}
	/*getPostProfileUsername(id: string) : any {
		this.profileService.getProfile(id)
			.subscribe(profile => this.profile = profile);
		return this.profile.profileUsername;
	}*/

	/*getPostProfileUsername(posts: Post[]) : any {
		this.profileService.getProfile(post.postProfileId)
			.subscribe(profile => this.profile = profile);
		return this.profile.profileUsername;
	}*/

	/*listProfiles() : void {
		this.profileService.getAllProfiles()
			.subscribe(profiles => this.profiles = profiles);
	}*/

	/*postNewPost(newPost: Post) : void {

		this.postService.createPost(newPost)
			.subscribe(status => {
				this.status = status;
				if(this.status.status === 200) {
					this.listPosts();
					console.log("post created ok " + status.message + " " + status.status);
					//this.postReply.emit(status);
				} else {
					console.log("post not meowed " + status.message + " " + status.status);
				}
			});
	}*/

	/*getPostProfileUsernames(posts: Post[]) : Observable<Profile> {
		/!*return this.listPosts$()
			.switchMap(posts => this.profileService.getProfile(posts.postProfileId),
				(posts, usernames) => [posts, usernames]);*!/

		//console.log(posts);
		for(let post in posts) {
			this.profileService.getProfile(post.postProfileId)
				.subscribe(profiles => this.profiles = profiles);
			this.postUsernames.push(this.profile.profileUsername);
		}

		//console.log(this.postUsernames);
		return this.postUsernames;
	}
*/

	//{{ getPostProfileUsername(post.postProfileId) | async }}
}
