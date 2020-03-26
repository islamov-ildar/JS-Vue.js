class textHandler {
    constructor(idRawText, idFinishedText){
        this.idRaw = idRawText;
        this.idFinished = idFinishedText;
    }
    handler(){
        let text = document.getElementById(this.idRaw).textContent;

        let replacedText = text.replace(/\B'/g, '"');
        document.getElementById(this.idFinished).innerText = replacedText;
    }
}