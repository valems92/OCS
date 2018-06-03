export class Banner {
    public description: string;
    public imagePath: string;
    public title: string;

    constructor(description: string, imagePath: string, title: string) {
        this.description = description;
        this.imagePath = imagePath;
        this.title = title;
    }
}
