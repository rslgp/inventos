/* eslint-disable @typescript-eslint/no-unused-vars */
const { GoogleSpreadsheet } = require('google-spreadsheet');

// Google Sheets Document ID -- PROD
const doc = new GoogleSpreadsheet(process.env.REACT_APP_GOOGLESHEETID);

const varGLOBAL = {
    cards:undefined,
    sendRating: (name, newValue) =>{
        (async function main(self) {
            try{
                await doc.useServiceAccountAuth({
                client_email: process.env.REACT_APP_GOOGLE_SERVICE_ACCOUNT_EMAIL,
                private_key: process.env.REACT_APP_GOOGLE_PRIVATE_KEY,
                });
            
                await doc.loadInfo(); 
            
                const sheet = doc.sheetsByIndex[0];
                let rows = await sheet.getRows();

                let rowEncontrada = rows.filter( (x) => {return JSON.parse(x.Dados).name === name})
                
                let t = JSON.parse(rowEncontrada[0].Dados);
                t.Avaliacao[newValue]++;
                t.votos = varGLOBAL.getAvaliacao(t.Avaliacao);
                rowEncontrada[0].Dados = JSON.stringify(t);
                await rowEncontrada[0].save();
            }catch(e){
                console.log("sendRating");
                console.log(e); 
            }
            
            })(this);
    },
    getAvaliacao: (jsonAvaliacao) => {
        //jsonAvaliacao "Avaliacao":{"1":0,"2":0,"3":0,"4":0,"5":0}
        let AvaliacaoData = {nota:0, totalClicks:0};
        if(jsonAvaliacao){
            AvaliacaoData.totalClicks = (jsonAvaliacao["5"]+jsonAvaliacao["4"]+jsonAvaliacao["3"]+jsonAvaliacao["2"]+jsonAvaliacao["1"]);
            if( AvaliacaoData.totalClicks === 0 ){
                AvaliacaoData.nota = 0;
            }else{
                AvaliacaoData.nota = (jsonAvaliacao["5"]*5 +
                jsonAvaliacao["4"]*4 +
                jsonAvaliacao["3"]*3 +
                jsonAvaliacao["2"]*2 +
                jsonAvaliacao["1"]*1)
                /            
                (AvaliacaoData.totalClicks);

                AvaliacaoData.nota = Math.round(AvaliacaoData.nota * 100)/100;
            }
        }
        
        return AvaliacaoData.nota;
    }
}

export default varGLOBAL;