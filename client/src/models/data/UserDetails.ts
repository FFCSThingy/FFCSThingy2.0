export default interface UserDetails {
	google_id: string;
	display_name: string;
	picture: string;
	email: string;
	vtopSignedIn: boolean;
}

export interface CompletedCourses {
	[key: string]: string;
}
