export class Message {
    public clothId: string;
    public userName: string;
    public message: string;

    constructor(clothId:string, userName:string, message:string) {
        this.clothId = clothId;
        this.userName = userName;
        this.message = message;
    }
}
