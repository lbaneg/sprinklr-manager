
class Campaign{
    
    constructor(){//lineNumber,dateAdded,facebbookPage,headline,description,bodyBLURB,liveURL,faceookImage
        this.lineNumber = arguments[0];
        this.dateAdded = arguments[1];
        this.facebookPage=arguments[2];
        this.headline= arguments[3];
        this.description=arguments[4];
        this.bodyBLURB=arguments[5];
        this.liveURL = arguments[6];
        this.facebookImage = arguments[7];
    }
}

export default Campaign;