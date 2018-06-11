export class User {
    public email:string;
    public fullName: string;
    public city: string;
    public address: string;
    public role:string;

    constructor(email:string, fullName:string, city:string, address: string, role:string) {
        this.email = email;
        this.fullName = fullName;
        this.city = city;
        this.address = address;
        this.role = role;
    }
}
